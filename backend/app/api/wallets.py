from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from backend.app.database import get_db
from backend.app.auth.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.wallet import Wallet
from backend.app.models.transaction import Transaction
from backend.app.models.attribution import Attribution
from backend.app.models.risk import RiskAssessment
from backend.app.models.typology import TypologyDetection
from backend.app.schemas.wallet import (
    WalletAnalyzeRequest, WalletResponse, AnalysisFullResult,
    AttributionCandidateResponse, RiskAssessmentResponse, TypologyResponse
)
from backend.app.blockchain import get_blockchain_adapter, detect_blockchain
from backend.app.graph.engine import TransactionGraphEngine
from backend.app.attribution.engine import AttributionEngine
from backend.app.risk.engine import RiskEngine
from backend.app.typology.engine import TypologyEngine
from backend.app.audit.service import log_audit

router = APIRouter(prefix="/wallets", tags=["Wallet Investigation"])

@router.post("/analyze", response_model=AnalysisFullResult)
def analyze_wallet(
    req: WalletAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    clean_addr = req.wallet_address.strip()
    chain = req.blockchain.lower().strip() if req.blockchain else detect_blockchain(clean_addr)

    # 1. Validate wallet address
    try:
        adapter = get_blockchain_adapter(chain)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not adapter.validate_address(clean_addr):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid address format '{clean_addr}' for blockchain '{chain}'"
        )

    # 2. Check provider mode (LIVE or DEMO)
    is_live = adapter.is_live_available() and req.data_source != "DEMO"
    data_source_label = "LIVE DATA" if is_live else "DEMO DATA"

    # 3. Retrieve or create Wallet in DB
    wallet = db.query(Wallet).filter(Wallet.address.ilike(clean_addr)).first()
    if not wallet:
        wallet = Wallet(
            address=clean_addr.lower(),
            blockchain=chain,
            entity_type="wallet",
            label="Suspect Target Wallet",
            risk_score=50.0,
            risk_level="MEDIUM",
            total_received=0.0,
            total_sent=0.0,
            balance=adapter.get_balance(clean_addr),
            tx_count=0,
            is_monitored=True
        )
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    # 4. If live mode, fetch real transactions and ingest
    if is_live:
        live_txs = adapter.get_transactions(clean_addr, limit=50)
        for ntx in live_txs:
            existing = db.query(Transaction).filter(Transaction.transaction_hash == ntx.transaction_hash).first()
            if not existing:
                tx_row = Transaction(
                    transaction_hash=ntx.transaction_hash,
                    chain=ntx.chain,
                    from_address=ntx.from_address,
                    to_address=ntx.to_address,
                    amount=ntx.amount,
                    token=ntx.token,
                    token_symbol=ntx.token_symbol,
                    timestamp=ntx.timestamp,
                    block_number=ntx.block_number,
                    transaction_type=ntx.transaction_type,
                    gas=ntx.gas,
                    status=ntx.status,
                    source=ntx.source,
                    contract_address=ntx.contract_address,
                    token_decimals=ntx.token_decimals
                )
                db.add(tx_row)
        db.commit()

    # 5. Graph construction & traversal
    graph_engine = TransactionGraphEngine(db)
    graph_result = graph_engine.build_graph(
        target_wallet=clean_addr,
        max_hops=req.max_hops,
        blockchain=chain
    )

    # 6. Attribution Scoring
    attr_engine = AttributionEngine(db)
    attribution_candidates = attr_engine.calculate_attributions(
        wallet_address=clean_addr,
        blockchain=chain,
        max_hops=req.max_hops
    )

    # Save attributions to DB
    for c in attribution_candidates:
        existing_attr = db.query(Attribution).filter(
            Attribution.wallet_address == clean_addr.lower(),
            Attribution.vasp_id == c["vasp_id"]
        ).first()
        if existing_attr:
            existing_attr.confidence = c["confidence"]
            existing_attr.hop_distance = c["hop_distance"]
            existing_attr.score_breakdown = c["score_breakdown"]
            existing_attr.evidence_list = c["evidence"]
            existing_attr.supporting_transactions = c["supporting_transactions"]
            existing_attr.interaction_count = c["interaction_count"]
            existing_attr.total_volume = c["total_volume"]
        else:
            new_attr = Attribution(
                wallet_address=clean_addr.lower(),
                vasp_id=c["vasp_id"],
                vasp_name=c["candidate"],
                confidence=c["confidence"],
                hop_distance=c["hop_distance"],
                interaction_count=c["interaction_count"],
                total_volume=c["total_volume"],
                score_breakdown=c["score_breakdown"],
                evidence_list=c["evidence"],
                supporting_transactions=c["supporting_transactions"]
            )
            db.add(new_attr)
    db.commit()

    # 7. Risk Analysis
    risk_engine = RiskEngine(db)
    risk_result = risk_engine.assess_risk(clean_addr, blockchain=chain)

    wallet.risk_score = risk_result["risk_score"]
    wallet.risk_level = risk_result["risk_level"]
    db.commit()

    # 8. Typology Detection
    typology_engine = TypologyEngine(db)
    typology_results = typology_engine.detect_typologies(clean_addr, case_id=req.case_id)

    # 9. Build chronological timeline
    txs = db.query(Transaction).filter(
        (Transaction.from_address == clean_addr.lower()) | (Transaction.to_address == clean_addr.lower())
    ).order_by(Transaction.timestamp.desc()).all()

    timeline = [
        {
            "id": t.id,
            "hash": t.transaction_hash,
            "timestamp": t.timestamp.isoformat() if t.timestamp else None,
            "from": t.from_address,
            "to": t.to_address,
            "amount": t.amount,
            "token": t.token_symbol,
            "type": t.transaction_type,
            "chain": t.chain,
            "is_outbound": t.from_address.lower() == clean_addr.lower(),
            "status": t.status,
            "source": t.source
        }
        for t in txs
    ]

    # 10. Audit log
    log_audit(
        db=db,
        action="WALLET_ANALYZED",
        username=current_user.username,
        user_id=current_user.id,
        case_id=req.case_id,
        details={
            "wallet": clean_addr,
            "blockchain": chain,
            "max_hops": req.max_hops,
            "risk_score": risk_result["risk_score"],
            "candidates_found": len(attribution_candidates),
            "data_source": data_source_label
        }
    )

    return AnalysisFullResult(
        wallet=WalletResponse.model_validate(wallet),
        blockchain=chain,
        data_source=data_source_label,
        attributions=[AttributionCandidateResponse(**c) for c in attribution_candidates],
        risk=RiskAssessmentResponse(**risk_result),
        typologies=[TypologyResponse(**t) for t in typology_results],
        graph_metrics=graph_result["metrics"],
        timeline=timeline
    )

@router.get("/{address}", response_model=WalletResponse)
def get_wallet(
    address: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    clean = address.strip().lower()
    w = db.query(Wallet).filter(Wallet.address == clean).first()
    if not w:
        raise HTTPException(status_code=404, detail="Wallet address not found in database")
    return w

@router.get("/{address}/transactions")
def get_wallet_transactions(
    address: str,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    clean = address.strip().lower()
    txs = db.query(Transaction).filter(
        (Transaction.from_address == clean) | (Transaction.to_address == clean)
    ).order_by(Transaction.timestamp.desc()).limit(limit).all()

    return [
        {
            "id": t.id,
            "transaction_hash": t.transaction_hash,
            "chain": t.chain,
            "from_address": t.from_address,
            "to_address": t.to_address,
            "amount": t.amount,
            "token": t.token,
            "token_symbol": t.token_symbol,
            "timestamp": t.timestamp.isoformat() if t.timestamp else None,
            "block_number": t.block_number,
            "transaction_type": t.transaction_type,
            "gas": t.gas,
            "status": t.status,
            "source": t.source
        }
        for t in txs
    ]

@router.get("/{address}/graph")
def get_wallet_graph(
    address: str,
    max_hops: int = Query(default=3, ge=1, le=5),
    blockchain: str = "ethereum",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    engine = TransactionGraphEngine(db)
    return engine.build_graph(target_wallet=address, max_hops=max_hops, blockchain=blockchain)

@router.get("/{address}/attribution", response_model=List[AttributionCandidateResponse])
def get_wallet_attribution(
    address: str,
    max_hops: int = Query(default=4, ge=1, le=5),
    blockchain: str = "ethereum",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    engine = AttributionEngine(db)
    candidates = engine.calculate_attributions(wallet_address=address, blockchain=blockchain, max_hops=max_hops)
    return [AttributionCandidateResponse(**c) for c in candidates]

@router.get("/{address}/risk", response_model=RiskAssessmentResponse)
def get_wallet_risk(
    address: str,
    blockchain: str = "ethereum",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    engine = RiskEngine(db)
    result = engine.assess_risk(wallet_address=address, blockchain=blockchain)
    return RiskAssessmentResponse(**result)

@router.get("/{address}/typologies", response_model=List[TypologyResponse])
def get_wallet_typologies(
    address: str,
    case_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    engine = TypologyEngine(db)
    results = engine.detect_typologies(wallet_address=address, case_id=case_id)
    return [TypologyResponse(**t) for t in results]

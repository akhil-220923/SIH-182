from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List
from backend.app.database import get_db
from backend.app.auth.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.case import Case, CaseStatus, CasePriority
from backend.app.models.wallet import Wallet
from backend.app.models.transaction import Transaction
from backend.app.models.attribution import Attribution
from backend.app.models.report import Report
from backend.app.models.vasp import VASP

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=Dict[str, Any])
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Summary Counts
    active_cases = db.query(Case).filter(Case.status != CaseStatus.CLOSED).count()
    wallets_analyzed = db.query(Wallet).count()
    transactions_processed = db.query(Transaction).count()
    vasp_attributions = db.query(Attribution).count()
    high_risk_cases = db.query(Case).filter(Case.priority.in_([CasePriority.HIGH, CasePriority.CRITICAL])).count()
    reports_generated = db.query(Report).count()

    # 2. Recent Investigations List
    cases = db.query(Case).order_by(Case.created_at.desc()).limit(10).all()
    recent_investigations = []
    for c in cases:
        wallet_addr = c.suspect_wallets[0] if (c.suspect_wallets and len(c.suspect_wallets) > 0) else "N/A"
        # Find highest attribution if any
        top_attr = db.query(Attribution).filter(Attribution.wallet_address == wallet_addr).order_by(Attribution.confidence.desc()).first()
        target_wallet = db.query(Wallet).filter(Wallet.address == wallet_addr).first()

        recent_investigations.append({
            "case_id": c.case_id,
            "title": c.title,
            "wallet": wallet_addr,
            "blockchain": target_wallet.blockchain if target_wallet else "ethereum",
            "risk": target_wallet.risk_level if target_wallet else "MEDIUM",
            "risk_score": target_wallet.risk_score if target_wallet else 50.0,
            "vasp": top_attr.vasp_name if top_attr else "Demo Exchange Alpha",
            "confidence": top_attr.confidence if top_attr else 91.4,
            "status": c.status.value,
            "created_at": c.created_at.isoformat() if c.created_at else None
        })

    # 3. Charts: Transactions by Blockchain
    tx_by_chain_raw = db.query(Transaction.chain, func.count(Transaction.id)).group_by(Transaction.chain).all()
    tx_by_chain = [{"name": c[0].capitalize(), "count": c[1]} for c in tx_by_chain_raw]
    if not tx_by_chain:
        tx_by_chain = [
            {"name": "Ethereum", "count": 18},
            {"name": "Bitcoin", "count": 4},
            {"name": "BNB Chain", "count": 2},
            {"name": "Polygon", "count": 3}
        ]

    # 4. Charts: Investigations by Risk
    risk_raw = db.query(Wallet.risk_level, func.count(Wallet.id)).group_by(Wallet.risk_level).all()
    investigations_by_risk = [{"name": r[0], "value": r[1]} for r in risk_raw if r[0]]
    if not investigations_by_risk:
        investigations_by_risk = [
            {"name": "CRITICAL", "value": 2},
            {"name": "HIGH", "value": 3},
            {"name": "MEDIUM", "value": 4},
            {"name": "LOW", "value": 3}
        ]

    # 5. Charts: VASP Attribution Distribution
    attr_raw = db.query(Attribution.vasp_name, func.count(Attribution.id)).group_by(Attribution.vasp_name).all()
    vasp_distribution = [{"name": a[0], "attributions": a[1]} for a in attr_raw]
    if not vasp_distribution:
        vasp_distribution = [
            {"name": "Demo Exchange Alpha", "attributions": 8},
            {"name": "Demo Exchange Beta", "attributions": 4},
            {"name": "Demo Custodian Gamma", "attributions": 2}
        ]

    # 6. Recent Alerts
    recent_alerts = [
        {
            "id": 1,
            "title": "High-risk wallet detected",
            "description": "Suspect address 0x742d3... initiated rapid layering with 94.5 risk score.",
            "severity": "CRITICAL",
            "time": "10 minutes ago"
        },
        {
            "id": 2,
            "title": "Potential mixer interaction",
            "description": "5.0 ETH deposited into DemoMixer Cash smart contract.",
            "severity": "HIGH",
            "time": "25 minutes ago"
        },
        {
            "id": 3,
            "title": "Cross-chain movement",
            "description": "10.0 ETH routed through DemoBridge Protocol Gateway.",
            "severity": "MEDIUM",
            "time": "40 minutes ago"
        },
        {
            "id": 4,
            "title": "Possible VASP deposit wallet",
            "description": "31.8 ETH transferred to Demo Exchange Alpha deposit clustering.",
            "severity": "LOW",
            "time": "55 minutes ago"
        }
    ]

    return {
        "metrics": {
            "active_cases": active_cases,
            "wallets_analyzed": wallets_analyzed,
            "transactions_processed": transactions_processed,
            "vasp_attributions": vasp_attributions,
            "high_risk_cases": high_risk_cases,
            "reports_generated": reports_generated,
        },
        "recent_investigations": recent_investigations,
        "charts": {
            "transactions_by_chain": tx_by_chain,
            "investigations_by_risk": investigations_by_risk,
            "vasp_distribution": vasp_distribution
        },
        "alerts": recent_alerts
    }

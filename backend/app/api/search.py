from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from backend.app.database import get_db
from backend.app.auth.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.wallet import Wallet
from backend.app.models.case import Case
from backend.app.models.transaction import Transaction
from backend.app.models.vasp import VASP

router = APIRouter(prefix="/search", tags=["Global Search"])

@router.get("")
def global_search(
    q: str = Query(..., min_length=2),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = q.strip()
    term = f"%{query}%"

    # Search Wallets
    wallets = db.query(Wallet).filter(
        (Wallet.address.ilike(term)) | (Wallet.label.ilike(term))
    ).limit(5).all()

    # Search Cases
    cases = db.query(Case).filter(
        (Case.case_id.ilike(term)) | (Case.title.ilike(term))
    ).limit(5).all()

    # Search Transactions
    txs = db.query(Transaction).filter(
        Transaction.transaction_hash.ilike(term)
    ).limit(5).all()

    # Search VASPs
    vasps = db.query(VASP).filter(
        (VASP.name.ilike(term)) | (VASP.vasp_id.ilike(term))
    ).limit(5).all()

    return {
        "query": query,
        "results": {
            "wallets": [{"address": w.address, "label": w.label, "risk_level": w.risk_level} for w in wallets],
            "cases": [{"case_id": c.case_id, "title": c.title, "status": c.status.value} for c in cases],
            "transactions": [{"hash": t.transaction_hash, "amount": t.amount, "token": t.token_symbol} for t in txs],
            "vasps": [{"vasp_id": v.vasp_id, "name": v.name, "country": v.country} for v in vasps]
        }
    }

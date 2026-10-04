from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from backend.app.database import get_db
from backend.app.auth.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.evidence import Evidence
from backend.app.services.evidence import EvidenceService
from backend.app.audit.service import log_audit

router = APIRouter(prefix="/evidence", tags=["Evidence Management"])

@router.get("")
def list_evidence(
    case_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Evidence)
    if case_id:
        query = query.filter(Evidence.case_id == case_id)
    records = query.order_by(Evidence.created_at.desc()).all()
    return [
        {
            "id": e.id,
            "evidence_id": e.evidence_id,
            "case_id": e.case_id,
            "wallet_address": e.wallet_address,
            "transaction_hash": e.transaction_hash,
            "evidence_type": e.evidence_type,
            "source": e.source,
            "description": e.description,
            "sha256_hash": e.sha256_hash,
            "created_by": e.created_by,
            "created_at": e.created_at.isoformat() if e.created_at else None
        }
        for e in records
    ]

@router.get("/{evidence_id}")
def get_evidence(
    evidence_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    e = db.query(Evidence).filter(Evidence.evidence_id == evidence_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Evidence item not found")
    return {
        "id": e.id,
        "evidence_id": e.evidence_id,
        "case_id": e.case_id,
        "wallet_address": e.wallet_address,
        "transaction_hash": e.transaction_hash,
        "evidence_type": e.evidence_type,
        "source": e.source,
        "description": e.description,
        "data_payload": e.data_payload,
        "sha256_hash": e.sha256_hash,
        "created_by": e.created_by,
        "created_at": e.created_at.isoformat() if e.created_at else None
    }

@router.post("/verify")
def verify_evidence(
    payload: Dict[str, str],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    evidence_id = payload.get("evidence_id")
    if not evidence_id:
        raise HTTPException(status_code=400, detail="evidence_id is required")

    e = db.query(Evidence).filter(Evidence.evidence_id == evidence_id).first()
    if not e:
        raise HTTPException(status_code=404, detail=f"Evidence '{evidence_id}' not found")

    result = EvidenceService.verify_integrity(e)

    log_audit(
        db=db,
        action="EVIDENCE_VERIFIED",
        username=current_user.username,
        user_id=current_user.id,
        case_id=e.case_id,
        details={"evidence_id": evidence_id, "is_valid": result["is_valid"]}
    )

    return result

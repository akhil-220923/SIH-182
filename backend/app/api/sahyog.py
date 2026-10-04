from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from backend.app.database import get_db
from backend.app.auth.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.sahyog import SAHYOGRequest
from backend.app.schemas.sahyog import DisclosureRequestCreate, FreezeRequestCreate, SAHYOGRequestResponse
from backend.app.sahyog.adapter import sahyog_adapter
from backend.app.audit.service import log_audit

router = APIRouter(prefix="/sahyog", tags=["SAHYOG Integration"])

@router.get("/requests", response_model=List[SAHYOGRequestResponse])
def list_sahyog_requests(
    case_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(SAHYOGRequest)
    if case_id:
        query = query.filter(SAHYOGRequest.case_id == case_id)
    return query.order_by(SAHYOGRequest.created_at.desc()).all()

@router.post("/disclosure-request", response_model=SAHYOGRequestResponse, status_code=status.HTTP_201_CREATED)
def submit_disclosure_request(
    req: DisclosureRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Route to SAHYOG adapter
    mock_resp = sahyog_adapter.submit_disclosure_request(
        case_id=req.case_id,
        vasp_id=req.vasp_id,
        vasp_name=req.vasp_name,
        wallet_address=req.wallet_address,
        reason=req.reason,
        requested_info=req.requested_info,
        supporting_evidence=req.supporting_evidence,
        investigator_name=current_user.full_name,
        badge_number=current_user.badge_number or "LEA-OFFICER"
    )

    db_request = SAHYOGRequest(
        reference_number=mock_resp["reference_number"],
        case_id=req.case_id,
        vasp_id=req.vasp_id,
        vasp_name=req.vasp_name,
        wallet_address=req.wallet_address,
        request_type="DISCLOSURE_REQUEST",
        status="SUBMITTED_TO_ADAPTER",
        reason=req.reason,
        requested_info=req.requested_info,
        supporting_evidence=req.supporting_evidence,
        mock_response=mock_resp,
        created_by=current_user.username
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)

    log_audit(
        db=db,
        action="DISCLOSURE_REQUEST_CREATED",
        username=current_user.username,
        user_id=current_user.id,
        case_id=req.case_id,
        details={
            "ref": db_request.reference_number,
            "vasp": req.vasp_name,
            "target": req.wallet_address
        }
    )

    return db_request

@router.post("/freeze-request", response_model=SAHYOGRequestResponse, status_code=status.HTTP_201_CREATED)
def submit_freeze_request(
    req: FreezeRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Route to SAHYOG adapter
    mock_resp = sahyog_adapter.submit_freeze_request(
        case_id=req.case_id,
        vasp_id=req.vasp_id,
        vasp_name=req.vasp_name,
        wallet_address=req.wallet_address,
        reason=req.reason,
        asset_amount=req.asset_amount,
        token_symbol=req.token_symbol,
        supporting_evidence=req.supporting_evidence,
        investigator_name=current_user.full_name,
        badge_number=current_user.badge_number or "LEA-OFFICER"
    )

    db_request = SAHYOGRequest(
        reference_number=mock_resp["reference_number"],
        case_id=req.case_id,
        vasp_id=req.vasp_id,
        vasp_name=req.vasp_name,
        wallet_address=req.wallet_address,
        request_type="FREEZE_REQUEST",
        status="SUBMITTED_TO_ADAPTER",
        reason=req.reason,
        requested_info=[f"Restrain {req.asset_amount} {req.token_symbol}"],
        supporting_evidence=req.supporting_evidence,
        mock_response=mock_resp,
        created_by=current_user.username
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)

    log_audit(
        db=db,
        action="FREEZE_REQUEST_CREATED",
        username=current_user.username,
        user_id=current_user.id,
        case_id=req.case_id,
        details={
            "ref": db_request.reference_number,
            "vasp": req.vasp_name,
            "amount": req.asset_amount,
            "token": req.token_symbol
        }
    )

    return db_request

@router.get("/request/{id}", response_model=SAHYOGRequestResponse)
def get_sahyog_request(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(SAHYOGRequest).filter(SAHYOGRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="SAHYOG request not found")
    return req

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.auth.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.case import Case, CaseStatus, CasePriority
from backend.app.schemas.case import CaseCreate, CaseUpdate, CaseResponse
from backend.app.audit.service import log_audit

router = APIRouter(prefix="/cases", tags=["Case Management"])

@router.get("", response_model=List[CaseResponse])
def list_cases(
    status_filter: Optional[CaseStatus] = None,
    priority_filter: Optional[CasePriority] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Case)
    if status_filter:
        query = query.filter(Case.status == status_filter)
    if priority_filter:
        query = query.filter(Case.priority == priority_filter)
    return query.order_by(Case.created_at.desc()).all()

@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
def create_case(
    case_in: CaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Case).filter(Case.case_id == case_in.case_id.strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Case ID '{case_in.case_id}' already exists")

    new_case = Case(
        case_id=case_in.case_id.strip(),
        title=case_in.title,
        description=case_in.description,
        investigator_id=current_user.id,
        priority=case_in.priority,
        status=CaseStatus.OPEN,
        suspect_wallets=case_in.suspect_wallets,
        notes=case_in.notes
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    log_audit(
        db=db,
        action="CASE_CREATED",
        username=current_user.username,
        user_id=current_user.id,
        case_id=new_case.case_id,
        details={"title": new_case.title, "priority": new_case.priority.value}
    )
    return new_case

@router.get("/{case_id}", response_model=CaseResponse)
def get_case(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found")
    return case

@router.put("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: str,
    case_update: CaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found")

    update_data = case_update.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(case, field, val)

    db.commit()
    db.refresh(case)

    log_audit(
        db=db,
        action="CASE_UPDATED",
        username=current_user.username,
        user_id=current_user.id,
        case_id=case.case_id,
        details=update_data
    )
    return case

@router.post("/{case_id}/wallets", response_model=CaseResponse)
def add_wallet_to_case(
    case_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    wallet_address = payload.get("wallet_address")
    if not wallet_address:
        raise HTTPException(status_code=400, detail="wallet_address is required")

    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    wallets = list(case.suspect_wallets or [])
    if wallet_address not in wallets:
        wallets.append(wallet_address.strip())
        case.suspect_wallets = wallets
        db.commit()
        db.refresh(case)

    log_audit(
        db=db,
        action="WALLET_ADDED_TO_CASE",
        username=current_user.username,
        user_id=current_user.id,
        case_id=case_id,
        details={"wallet_address": wallet_address}
    )
    return case

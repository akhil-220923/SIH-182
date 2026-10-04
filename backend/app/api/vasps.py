from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.auth.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.vasp import VASP, VASPAddress
from backend.app.schemas.vasp import VASPResponse

router = APIRouter(prefix="/vasps", tags=["VASP Registry"])

@router.get("", response_model=List[VASPResponse])
def list_vasps(
    query: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    q = db.query(VASP)
    if query:
        term = f"%{query.strip()}%"
        q = q.filter((VASP.name.ilike(term)) | (VASP.vasp_id.ilike(term)) | (VASP.country.ilike(term)))
    return q.all()

@router.get("/{vasp_id}", response_model=VASPResponse)
def get_vasp(
    vasp_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vasp = db.query(VASP).filter(VASP.vasp_id == vasp_id).first()
    if not vasp:
        raise HTTPException(status_code=404, detail=f"VASP '{vasp_id}' not found")
    return vasp

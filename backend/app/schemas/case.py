from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from backend.app.models.case import CaseStatus, CasePriority

class CaseCreate(BaseModel):
    case_id: str
    title: str
    description: Optional[str] = None
    priority: CasePriority = CasePriority.HIGH
    suspect_wallets: List[str] = []
    notes: Optional[str] = None

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[CasePriority] = None
    status: Optional[CaseStatus] = None
    notes: Optional[str] = None
    suspect_wallets: Optional[List[str]] = None

class CaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    case_id: str
    title: str
    description: Optional[str] = None
    investigator_id: Optional[int] = None
    priority: CasePriority
    status: CaseStatus
    suspect_wallets: List[str] = []
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime

class ReportCreate(BaseModel):
    case_id: str
    wallet_address: str
    title: Optional[str] = None
    notes: Optional[str] = None

class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    report_id: str
    case_id: str
    wallet_address: str
    title: str
    file_path: Optional[str] = None
    sha256_hash: Optional[str] = None
    generated_by: str
    created_at: Optional[datetime] = None

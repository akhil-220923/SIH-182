from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class DisclosureRequestCreate(BaseModel):
    case_id: str
    vasp_id: str
    vasp_name: str
    wallet_address: str
    reason: str
    requested_info: List[str]
    supporting_evidence: List[str]

class FreezeRequestCreate(BaseModel):
    case_id: str
    vasp_id: str
    vasp_name: str
    wallet_address: str
    reason: str
    asset_amount: float
    token_symbol: str = "ETH"
    supporting_evidence: List[str]

class SAHYOGRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    reference_number: str
    case_id: str
    vasp_id: str
    vasp_name: str
    wallet_address: str
    request_type: str
    status: str
    reason: str
    requested_info: List[str]
    supporting_evidence: List[str]
    mock_response: Optional[Dict[str, Any]] = None
    created_by: str
    created_at: Optional[datetime] = None

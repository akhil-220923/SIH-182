from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from backend.app.models.vasp import AddressType, VerificationStatus

class VASPAddressResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    vasp_id: str
    blockchain: str
    address: str
    address_type: AddressType
    label_source: Optional[str] = None
    verification_status: VerificationStatus

class VASPResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    vasp_id: str
    name: str
    legal_name: Optional[str] = None
    country: str
    website: Optional[str] = None
    compliance_email: Optional[str] = None
    risk_category: str
    verification_status: VerificationStatus
    description: Optional[str] = None
    addresses: List[VASPAddressResponse] = []

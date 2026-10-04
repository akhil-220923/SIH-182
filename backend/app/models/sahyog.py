from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from backend.app.database import Base

class SAHYOGRequest(Base):
    __tablename__ = "sahyog_requests"

    id = Column(Integer, primary_key=True, index=True)
    reference_number = Column(String(100), unique=True, index=True, nullable=False) # e.g. SAHYOG-2026-DISC-0841
    case_id = Column(String(100), index=True, nullable=False)
    vasp_id = Column(String(100), index=True, nullable=False)
    vasp_name = Column(String(255), nullable=False)
    wallet_address = Column(String(255), nullable=False)
    request_type = Column(String(50), nullable=False) # DISCLOSURE_REQUEST, FREEZE_REQUEST
    status = Column(String(50), default="SUBMITTED_TO_ADAPTER") # DRAFT, SUBMITTED_TO_ADAPTER, TRANSMITTED, ACKNOWLEDGED, UNDER_REVIEW
    reason = Column(Text, nullable=False)
    requested_info = Column(JSON, default=list) # ["KYC details", "IP login logs", "Bank accounts linked"]
    supporting_evidence = Column(JSON, default=list) # List of transaction hashes, attribution scores
    mock_response = Column(JSON, nullable=True) # Realistic simulated response from the adapter
    created_by = Column(String(100), default="investigator@tracevasp.demo")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

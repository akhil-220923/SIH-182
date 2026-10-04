from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from backend.app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    username = Column(String(100), index=True, nullable=False)
    action = Column(String(100), index=True, nullable=False) # LOGIN, CASE_CREATED, WALLET_ANALYZED, ATTRIBUTION_GENERATED, REPORT_GENERATED, EVIDENCE_EXPORTED, DISCLOSURE_REQUEST_CREATED, FREEZE_REQUEST_CREATED, etc.
    case_id = Column(String(100), nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    user_agent = Column(String(255), nullable=True)
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

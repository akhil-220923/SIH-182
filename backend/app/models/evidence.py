from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from backend.app.database import Base

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. EVD-2026-001
    case_id = Column(String(100), index=True, nullable=True)
    wallet_address = Column(String(255), index=True, nullable=True)
    transaction_hash = Column(String(255), nullable=True)
    evidence_type = Column(String(50), default="TRANSACTION_FLOW") # TRANSACTION_FLOW, GRAPH_EXPORT, ATTRIBUTION_RECORD, RISK_RECORD
    source = Column(String(100), default="TraceVASP Engine")
    description = Column(Text, nullable=False)
    data_payload = Column(JSON, nullable=True) # Normalized structured record
    sha256_hash = Column(String(64), nullable=False) # SHA-256 digest for evidence integrity verification
    created_by = Column(String(100), default="investigator@tracevasp.demo")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

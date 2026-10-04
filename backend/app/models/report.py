from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from backend.app.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. RPT-DEMO-182
    case_id = Column(String(100), index=True, nullable=False)
    wallet_address = Column(String(255), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    file_path = Column(String(500), nullable=True) # Absolute or relative path to generated PDF
    sha256_hash = Column(String(64), nullable=True)
    metadata_json = Column(JSON, default=dict) # Key metadata snapshot (vasps, risk score, etc.)
    generated_by = Column(String(100), default="investigator@tracevasp.demo")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

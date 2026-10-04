from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from backend.app.database import Base

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String(255), index=True, nullable=False)
    risk_score = Column(Float, nullable=False) # 0 to 100
    risk_level = Column(String(20), nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    signals = Column(JSON, default=list) # List of identified risk flags
    details = Column(JSON, default=dict) # Signal scores breakdown
    created_at = Column(DateTime(timezone=True), server_default=func.now())

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from backend.app.database import Base

class TypologyDetection(Base):
    __tablename__ = "typology_detections"

    id = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String(255), index=True, nullable=False)
    case_id = Column(String(100), nullable=True)
    pattern_type = Column(String(100), nullable=False) # LAYERING, RAPID_MOVEMENT, FAN_OUT, FAN_IN, MIXER_INTERACTION, BRIDGE_INTERACTION, PEEL_CHAIN
    confidence = Column(Float, default=80.0) # 0 to 100
    supporting_txs = Column(JSON, default=list) # List of transaction hashes
    explanation = Column(String(1000), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from backend.app.database import Base

class Attribution(Base):
    __tablename__ = "attributions"

    id = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String(255), index=True, nullable=False)
    vasp_id = Column(String(100), index=True, nullable=False)
    vasp_name = Column(String(255), nullable=False)
    confidence = Column(Float, nullable=False) # 0.0 to 100.0%
    hop_distance = Column(Integer, nullable=False)
    interaction_count = Column(Integer, default=1)
    total_volume = Column(Float, default=0.0)
    score_breakdown = Column(JSON, default=dict) # {"address_match": 30, "interaction_strength": 25, ...}
    evidence_list = Column(JSON, default=list) # ["Known deposit address relationship", ...]
    supporting_transactions = Column(JSON, default=list) # ["0x...", ...]
    created_at = Column(DateTime(timezone=True), server_default=func.now())

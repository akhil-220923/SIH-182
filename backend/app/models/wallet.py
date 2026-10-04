from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from backend.app.database import Base

class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String(255), unique=True, index=True, nullable=False)
    blockchain = Column(String(50), default="ethereum", nullable=False) # ethereum, bitcoin, bnb, polygon, tron, solana
    entity_type = Column(String(50), default="unknown_entity") # wallet, contract, exchange, vasp, mixer, bridge, unknown_entity
    label = Column(String(255), nullable=True) # e.g. "Suspect Wallet", "Binance Hot Wallet 6"
    risk_score = Column(Float, default=0.0) # 0 to 100
    risk_level = Column(String(20), default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    first_seen = Column(DateTime(timezone=True), nullable=True)
    last_seen = Column(DateTime(timezone=True), nullable=True)
    total_received = Column(Float, default=0.0)
    total_sent = Column(Float, default=0.0)
    balance = Column(Float, default=0.0)
    tx_count = Column(Integer, default=0)
    is_monitored = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

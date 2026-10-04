from sqlalchemy import Column, Integer, String, Float, DateTime, BigInteger, Index
from sqlalchemy.sql import func
from backend.app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_hash = Column(String(255), unique=True, index=True, nullable=False)
    chain = Column(String(50), default="ethereum", nullable=False) # ethereum, bitcoin, bnb, polygon, tron, solana
    from_address = Column(String(255), index=True, nullable=False)
    to_address = Column(String(255), index=True, nullable=False)
    amount = Column(Float, nullable=False)
    token = Column(String(50), default="NATIVE") # NATIVE or token contract address
    token_symbol = Column(String(20), default="ETH")
    timestamp = Column(DateTime(timezone=True), nullable=False)
    block_number = Column(BigInteger, nullable=True)
    transaction_type = Column(String(50), default="TRANSFER") # TRANSFER, TOKEN_TRANSFER, SWAP, BRIDGE, DEPOSIT, WITHDRAWAL
    gas = Column(Float, nullable=True)
    status = Column(String(20), default="SUCCESS") # SUCCESS, FAILED
    source = Column(String(20), default="DEMO") # LIVE, DEMO, CACHED
    contract_address = Column(String(255), nullable=True)
    token_decimals = Column(Integer, default=18)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_tx_from_to", "from_address", "to_address"),
        Index("idx_tx_chain_time", "chain", "timestamp"),
    )

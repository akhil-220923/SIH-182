from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from backend.app.database import Base

class AddressType(str, enum.Enum):
    HOT_WALLET = "HOT_WALLET"
    DEPOSIT_WALLET = "DEPOSIT_WALLET"
    WITHDRAWAL_WALLET = "WITHDRAWAL_WALLET"
    CUSTODIAL_WALLET = "CUSTODIAL_WALLET"
    CONTRACT = "CONTRACT"
    OTHER = "OTHER"

class VerificationStatus(str, enum.Enum):
    VERIFIED = "VERIFIED"
    PUBLICLY_REPORTED = "PUBLICLY_REPORTED"
    UNVERIFIED = "UNVERIFIED"
    DEMO = "DEMO"

class VASP(Base):
    __tablename__ = "vasps"

    id = Column(Integer, primary_key=True, index=True)
    vasp_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. VASP-BINANCE, VASP-COINBASE
    name = Column(String(255), nullable=False)
    legal_name = Column(String(255), nullable=True)
    country = Column(String(100), default="Global")
    website = Column(String(255), nullable=True)
    compliance_email = Column(String(255), nullable=True)
    risk_category = Column(String(50), default="REGULATED_EXCHANGE") # REGULATED_EXCHANGE, P2P, HIGH_RISK_EXCHANGE, CUSTODIAN
    verification_status = Column(SQLEnum(VerificationStatus), default=VerificationStatus.VERIFIED, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    addresses = relationship("VASPAddress", back_populates="vasp", cascade="all, delete-orphan")

class VASPAddress(Base):
    __tablename__ = "vasp_addresses"

    id = Column(Integer, primary_key=True, index=True)
    vasp_id = Column(String(100), ForeignKey("vasps.vasp_id"), nullable=False, index=True)
    blockchain = Column(String(50), default="ethereum", nullable=False)
    address = Column(String(255), index=True, nullable=False)
    address_type = Column(SQLEnum(AddressType), default=AddressType.HOT_WALLET, nullable=False)
    label_source = Column(String(255), default="Public Blockchain Intelligence / Demo Registry")
    source_url = Column(String(500), nullable=True)
    verification_status = Column(SQLEnum(VerificationStatus), default=VerificationStatus.DEMO, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    vasp = relationship("VASP", back_populates="addresses")

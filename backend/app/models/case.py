from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SQLEnum, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from backend.app.database import Base

class CaseStatus(str, enum.Enum):
    OPEN = "OPEN"
    UNDER_ANALYSIS = "UNDER_ANALYSIS"
    REVIEW = "REVIEW"
    CLOSED = "CLOSED"

class CasePriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. CASE-DEMO-182
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    investigator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    priority = Column(SQLEnum(CasePriority), default=CasePriority.HIGH, nullable=False)
    status = Column(SQLEnum(CaseStatus), default=CaseStatus.OPEN, nullable=False)
    suspect_wallets = Column(JSON, default=list) # List of wallet address strings
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    investigator = relationship("User")

from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class WalletAnalyzeRequest(BaseModel):
    wallet_address: str
    blockchain: str = "ethereum"
    max_hops: int = 3
    case_id: Optional[str] = None
    data_source: str = "AUTO" # AUTO, LIVE, DEMO

class WalletResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    address: str
    blockchain: str
    entity_type: str
    label: Optional[str] = None
    risk_score: float
    risk_level: str
    total_received: float
    total_sent: float
    balance: float
    tx_count: int
    is_monitored: bool
    first_seen: Optional[datetime] = None
    last_seen: Optional[datetime] = None

class AttributionCandidateResponse(BaseModel):
    candidate: str
    vasp_id: str
    confidence: float
    hop_distance: int
    destination_address: Optional[str] = None
    interaction_count: int
    total_volume: float
    score_breakdown: Dict[str, float]
    evidence: List[str]
    supporting_transactions: List[str]

class RiskAssessmentResponse(BaseModel):
    wallet_address: str
    risk_score: float
    risk_level: str
    signals: List[str]
    details: Dict[str, float]
    disclaimer: str

class TypologyResponse(BaseModel):
    pattern_type: str
    confidence: float
    supporting_txs: List[str]
    explanation: str

class AnalysisFullResult(BaseModel):
    wallet: WalletResponse
    blockchain: str
    data_source: str # LIVE DATA or DEMO DATA
    attributions: List[AttributionCandidateResponse]
    risk: RiskAssessmentResponse
    typologies: List[TypologyResponse]
    graph_metrics: Dict[str, Any]
    timeline: List[Dict[str, Any]]

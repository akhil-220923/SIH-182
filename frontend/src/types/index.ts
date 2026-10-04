export type UserRole = 'ADMIN' | 'INVESTIGATOR' | 'SUPERVISOR';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  agency: string;
  badge_number?: string;
  role: UserRole;
  is_active: boolean;
}

export interface Case {
  id: number;
  case_id: string;
  title: string;
  description?: string;
  investigator_id?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'UNDER_ANALYSIS' | 'REVIEW' | 'CLOSED';
  suspect_wallets: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Wallet {
  id: number;
  address: string;
  blockchain: string;
  entity_type: string;
  label?: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  total_received: number;
  total_sent: number;
  balance: number;
  tx_count: number;
  is_monitored: boolean;
  first_seen?: string;
  last_seen?: string;
}

export interface Transaction {
  id: number;
  transaction_hash: string;
  chain: string;
  from_address: string;
  to_address: string;
  amount: number;
  token: string;
  token_symbol: string;
  timestamp: string;
  block_number?: number;
  transaction_type: string;
  gas?: number;
  status: string;
  source: string;
}

export interface ScoreBreakdown {
  address_cluster_match: number;
  interaction_strength: number;
  hop_distance_proximity: number;
  volume_similarity: number;
  temporal_pattern: number;
}

export interface AttributionCandidate {
  candidate: string;
  vasp_id: string;
  confidence: number;
  hop_distance: number;
  destination_address?: string;
  interaction_count: number;
  total_volume: number;
  score_breakdown: ScoreBreakdown;
  evidence: string[];
  supporting_transactions: string[];
}

export interface RiskAssessment {
  wallet_address: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  signals: string[];
  details: Record<string, number>;
  disclaimer: string;
}

export interface Typology {
  pattern_type: string;
  confidence: number;
  supporting_txs: string[];
  explanation: string;
}

export interface GraphNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: {
    id: string;
    address: string;
    label: string;
    entity_type: string;
    risk_score: number;
    risk_level: string;
    is_target?: boolean;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  animated?: boolean;
  data: {
    transaction_hash: string;
    amount: number;
    token: string;
    timestamp?: string;
    transaction_type: string;
    chain: string;
  };
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metrics: {
    total_nodes: number;
    total_edges: number;
    max_depth_reached: number;
    density: number;
    is_directed_acyclic: boolean;
  };
}

export interface AnalysisFullResult {
  wallet: Wallet;
  blockchain: string;
  data_source: 'LIVE DATA' | 'DEMO DATA';
  attributions: AttributionCandidate[];
  risk: RiskAssessment;
  typologies: Typology[];
  graph_metrics: Record<string, any>;
  timeline: Array<{
    id: number;
    hash: string;
    timestamp: string;
    from: string;
    to: string;
    amount: number;
    token: string;
    type: string;
    chain: string;
    is_outbound: boolean;
    status: string;
    source: string;
  }>;
}

export interface VASPAddress {
  id: number;
  vasp_id: string;
  blockchain: string;
  address: string;
  address_type: string;
  label_source?: string;
  verification_status: string;
}

export interface VASP {
  id: number;
  vasp_id: string;
  name: string;
  legal_name?: string;
  country: string;
  website?: string;
  compliance_email?: string;
  risk_category: string;
  verification_status: string;
  description?: string;
  addresses: VASPAddress[];
}

export interface Report {
  id: number;
  report_id: string;
  case_id: string;
  wallet_address: string;
  title: string;
  file_path?: string;
  sha256_hash?: string;
  generated_by: string;
  created_at: string;
}

export interface EvidenceItem {
  id: number;
  evidence_id: string;
  case_id?: string;
  wallet_address?: string;
  transaction_hash?: string;
  evidence_type: string;
  source: string;
  description: string;
  sha256_hash: string;
  created_by: string;
  created_at: string;
  data_payload?: any;
}

export interface SAHYOGRequest {
  id: number;
  reference_number: string;
  case_id: string;
  vasp_id: string;
  vasp_name: string;
  wallet_address: string;
  request_type: string;
  status: string;
  reason: string;
  requested_info: string[];
  supporting_evidence: string[];
  mock_response?: Record<string, any>;
  created_by: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  username: string;
  action: string;
  case_id?: string;
  ip_address: string;
  details: Record<string, any>;
  timestamp: string;
}

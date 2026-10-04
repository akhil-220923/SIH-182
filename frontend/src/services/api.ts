import axios from 'axios';
import {
  User, Case, AnalysisFullResult, GraphData, AttributionCandidate,
  RiskAssessment, Typology, VASP, Report, EvidenceItem, SAHYOGRequest, AuditLog
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tracevasp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('tracevasp_token');
      localStorage.removeItem('tracevasp_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post<{ access_token: string; token_type: string; user: User }>('/auth/login', {
      email,
      password,
    });
    localStorage.setItem('tracevasp_token', res.data.access_token);
    localStorage.setItem('tracevasp_user', JSON.stringify(res.data.user));
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('tracevasp_token');
    localStorage.removeItem('tracevasp_user');
    window.location.href = '/login';
  },
};

// Dashboard Service
export const dashboardService = {
  getMetrics: async () => {
    const res = await apiClient.get('/dashboard');
    return res.data;
  },
};

// Cases Service
export const casesService = {
  list: async (status?: string, priority?: string) => {
    const params: Record<string, string> = {};
    if (status) params.status_filter = status;
    if (priority) params.priority_filter = priority;
    const res = await apiClient.get<Case[]>('/cases', { params });
    return res.data;
  },
  get: async (caseId: string) => {
    const res = await apiClient.get<Case>(`/cases/${caseId}`);
    return res.data;
  },
  create: async (caseData: { case_id: string; title: string; description?: string; priority?: string; suspect_wallets?: string[]; notes?: string }) => {
    const res = await apiClient.post<Case>('/cases', caseData);
    return res.data;
  },
  update: async (caseId: string, caseData: Partial<Case>) => {
    const res = await apiClient.put<Case>(`/cases/${caseId}`, caseData);
    return res.data;
  },
  addWallet: async (caseId: string, walletAddress: string) => {
    const res = await apiClient.post<Case>(`/cases/${caseId}/wallets`, { wallet_address: walletAddress });
    return res.data;
  },
};

// Wallets & Investigation Service
export const walletService = {
  analyze: async (data: { wallet_address: string; blockchain?: string; max_hops?: number; case_id?: string; data_source?: string }) => {
    const res = await apiClient.post<AnalysisFullResult>('/wallets/analyze', data);
    return res.data;
  },
  get: async (address: string) => {
    const res = await apiClient.get(`/wallets/${address}`);
    return res.data;
  },
  getTransactions: async (address: string, limit = 50) => {
    const res = await apiClient.get(`/wallets/${address}/transactions`, { params: { limit } });
    return res.data;
  },
  getGraph: async (address: string, maxHops = 3, blockchain = 'ethereum') => {
    const res = await apiClient.get<GraphData>(`/wallets/${address}/graph`, { params: { max_hops: maxHops, blockchain } });
    return res.data;
  },
  getAttribution: async (address: string, maxHops = 4) => {
    const res = await apiClient.get<AttributionCandidate[]>(`/wallets/${address}/attribution`, { params: { max_hops: maxHops } });
    return res.data;
  },
  getRisk: async (address: string) => {
    const res = await apiClient.get<RiskAssessment>(`/wallets/${address}/risk`);
    return res.data;
  },
  getTypologies: async (address: string, caseId?: string) => {
    const res = await apiClient.get<Typology[]>(`/wallets/${address}/typologies`, { params: { case_id: caseId } });
    return res.data;
  },
};

// VASPs Service
export const vaspService = {
  list: async (query?: string) => {
    const res = await apiClient.get<VASP[]>('/vasps', { params: { query } });
    return res.data;
  },
  get: async (vaspId: string) => {
    const res = await apiClient.get<VASP>(`/vasps/${vaspId}`);
    return res.data;
  },
};

// Reports Service
export const reportService = {
  list: async (caseId?: string) => {
    const res = await apiClient.get<Report[]>('/reports', { params: { case_id: caseId } });
    return res.data;
  },
  generate: async (data: { case_id: string; wallet_address: string; title?: string; notes?: string }) => {
    const res = await apiClient.post<Report>('/reports', data);
    return res.data;
  },
  downloadPdfUrl: (reportId: string) => `${API_BASE}/reports/${reportId}/download`,
  downloadPackageUrl: (reportId: string) => `${API_BASE}/reports/${reportId}/package`,
};

// Evidence Service
export const evidenceService = {
  list: async (caseId?: string) => {
    const res = await apiClient.get<EvidenceItem[]>('/evidence', { params: { case_id: caseId } });
    return res.data;
  },
  verify: async (evidenceId: string) => {
    const res = await apiClient.post('/evidence/verify', { evidence_id: evidenceId });
    return res.data;
  },
};

// SAHYOG Service
export const sahyogService = {
  listRequests: async (caseId?: string) => {
    const res = await apiClient.get<SAHYOGRequest[]>('/sahyog/requests', { params: { case_id: caseId } });
    return res.data;
  },
  submitDisclosure: async (data: {
    case_id: string;
    vasp_id: string;
    vasp_name: string;
    wallet_address: string;
    reason: string;
    requested_info: string[];
    supporting_evidence: string[];
  }) => {
    const res = await apiClient.post<SAHYOGRequest>('/sahyog/disclosure-request', data);
    return res.data;
  },
  submitFreeze: async (data: {
    case_id: string;
    vasp_id: string;
    vasp_name: string;
    wallet_address: string;
    reason: string;
    asset_amount: number;
    token_symbol?: string;
    supporting_evidence: string[];
  }) => {
    const res = await apiClient.post<SAHYOGRequest>('/sahyog/freeze-request', data);
    return res.data;
  },
};

// Audit Logs Service
export const auditService = {
  list: async (action?: string, caseId?: string, limit = 50) => {
    const res = await apiClient.get<AuditLog[]>('/audit-logs', { params: { action, case_id: caseId, limit } });
    return res.data;
  },
};

// Search Service
export const searchService = {
  globalSearch: async (q: string) => {
    const res = await apiClient.get('/search', { params: { q } });
    return res.data;
  },
};

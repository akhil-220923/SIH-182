import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Search, Network, Building2, AlertTriangle, FileText,
  ArrowUpRight, ShieldAlert, Sparkles, Activity, Clock, ShieldCheck, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { dashboardService } from '../services/api';
import { BrandShield } from '../components/BrandShield';

const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#10b981',
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: dashboardService.getMetrics,
    refetchInterval: 30000,
  });

  const metrics = data?.metrics || {
    active_cases: 1,
    wallets_analyzed: 11,
    transactions_processed: 28,
    vasp_attributions: 4,
    high_risk_cases: 1,
    reports_generated: 1,
  };

  const recentInvestigations = data?.recent_investigations || [];
  const charts = data?.charts || {};
  const alerts = data?.alerts || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-[#222222] p-8 md:p-10 shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0052FF]/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#141414] border border-[#262626] text-neutral-300">
              <BrandShield className="w-3.5 h-3.5 text-[#0052FF]" />
              <span>TraceVASP Core Engine • Institutional Attribution</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Cybercrime Intelligence & Attribution Console
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Automated multi-hop fund-flow tracing attributing unhosted suspect cryptocurrency wallets to regulated Virtual Asset Service Providers (VASPs) with cryptographic proof chains.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/investigate/0x742d35cc6634c0532925a3b844bc454e4438f44e')}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-[#0052FF]" />
              <span>Load Demo Case (CASE-DEMO-182)</span>
            </button>
            <button
              onClick={() => navigate('/investigate')}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#141414] hover:bg-[#1a1a1a] text-white text-xs font-semibold border border-[#262626] hover:border-neutral-600 transition-all"
            >
              <Search className="w-4 h-4 text-neutral-400" />
              <span>New Wallet Investigation</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] hover:border-neutral-700 transition-all group">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Cases</span>
            <Briefcase className="w-4 h-4 text-[#0052FF] group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-white">{metrics.active_cases}</p>
          <span className="text-[10px] text-neutral-400 mt-1 block">Open LEA files</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] hover:border-neutral-700 transition-all group">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Wallets Analyzed</span>
            <Search className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-white">{metrics.wallets_analyzed}</p>
          <span className="text-[10px] text-neutral-400 mt-1 block">Target & intermediary</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] hover:border-neutral-700 transition-all group">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Tx Processed</span>
            <Activity className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-white">{metrics.transactions_processed}</p>
          <span className="text-[10px] text-neutral-400 mt-1 block">Normalized records</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] hover:border-neutral-700 transition-all group">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">VASP Attributions</span>
            <Building2 className="w-4 h-4 text-[#0052FF] group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-white">{metrics.vasp_attributions}</p>
          <span className="text-[10px] text-neutral-400 mt-1 block">Endpoints mapped</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] hover:border-neutral-700 transition-all group">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">High Risk</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-rose-400">{metrics.high_risk_cases}</p>
          <span className="text-[10px] text-rose-400/80 mt-1 block">Mixers / peeling detected</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] hover:border-neutral-700 transition-all group">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Reports</span>
            <FileText className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-white">{metrics.reports_generated}</p>
          <span className="text-[10px] text-neutral-400 mt-1 block">Courtroom evidence</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions by Blockchain */}
        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Transactions by Blockchain
            </h3>
            <span className="text-[10px] text-neutral-400 font-mono">Multi-chain telemetry</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.transactions_by_chain || []}>
                <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} />
                <YAxis stroke="#525252" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d0d', borderColor: '#262626', borderRadius: '12px', fontSize: '11px', color: '#ffffff' }}
                />
                <Bar dataKey="count" fill="#0052FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Investigations by Risk */}
        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Investigations by Risk Level
            </h3>
            <span className="text-[10px] text-neutral-400 font-mono">Typology breakdown</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.investigations_by_risk || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts.investigations_by_risk || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || '#0052FF'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d0d', borderColor: '#262626', borderRadius: '12px', fontSize: '11px', color: '#ffffff' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-[10px] text-neutral-300 font-mono">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* VASP Attribution Distribution */}
        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              VASP Attribution Frequency
            </h3>
            <span className="text-[10px] text-neutral-400 font-mono">Identified providers</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.vasp_distribution || []} layout="vertical">
                <XAxis type="number" stroke="#525252" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#737373" fontSize={9} width={90} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d0d', borderColor: '#262626', borderRadius: '12px', fontSize: '11px', color: '#ffffff' }}
                />
                <Bar dataKey="attributions" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Section: Recent Investigations & Live Analytical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Investigations Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Recent Investigation Workflows
              </h3>
              <p className="text-[11px] text-neutral-400">Suspect target addresses, candidate VASP nodes, and attribution confidence</p>
            </div>
            <button
              onClick={() => navigate('/cases')}
              className="text-[11px] text-[#0052FF] hover:text-[#3b82f6] font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View all cases</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1f1f1f] text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Case ID</th>
                  <th className="py-3 px-3">Suspect Wallet</th>
                  <th className="py-3 px-3">Chain</th>
                  <th className="py-3 px-3">Risk</th>
                  <th className="py-3 px-3">Attributed VASP</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171717]">
                {recentInvestigations.map((inv: any) => (
                  <tr key={inv.case_id} className="hover:bg-[#121212] transition-colors group">
                    <td className="py-3 px-3 font-mono font-semibold text-white">
                      {inv.case_id}
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-300">
                      {inv.wallet && inv.wallet.length > 12 ? `${inv.wallet.slice(0, 6)}...${inv.wallet.slice(-4)}` : inv.wallet}
                    </td>
                    <td className="py-3 px-3 uppercase text-[10px] text-neutral-400 font-mono">
                      {inv.blockchain}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          inv.risk === 'CRITICAL'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                            : inv.risk === 'HIGH'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {inv.risk}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white font-medium truncate max-w-[140px]">
                      {inv.vasp}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#0052FF]">
                      {inv.confidence.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => navigate(`/investigate/${inv.wallet}`)}
                        className="px-3 py-1 rounded-full bg-[#171717] hover:bg-white hover:text-black border border-[#2a2a2a] text-[11px] font-medium text-white transition-all"
                      >
                        Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Analytical Alerts */}
        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Live Heuristics Feed
            </h3>
            <span className="text-[10px] text-neutral-400 font-mono">Real-time</span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert: any) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl bg-[#111111] border border-[#1f1f1f] hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white">{alert.title}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        : alert.severity === 'HIGH'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{alert.description}</p>
                <span className="text-[9px] text-neutral-400 mt-2 flex items-center gap-1 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  {alert.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

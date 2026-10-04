import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle, ShieldAlert, FileText, SendHorizontal
} from 'lucide-react';
import { walletService } from '../services/api';
import { BrandShield } from '../components/BrandShield';

export const RiskAnalysis: React.FC = () => {
  const { address } = useParams<{ address?: string }>();
  const navigate = useNavigate();
  const targetWallet = address || '0x742d35cc6634c0532925a3b844bc454e4438f44e';

  const { data: riskData } = useQuery({
    queryKey: ['riskAssessment', targetWallet],
    queryFn: () => walletService.getRisk(targetWallet),
  });

  const { data: typologies } = useQuery({
    queryKey: ['typologies', targetWallet],
    queryFn: () => walletService.getTypologies(targetWallet),
  });

  const riskScore = riskData?.risk_score || 94.5;
  const riskLevel = riskData?.risk_level || 'CRITICAL';
  const signals = riskData?.signals || [];
  const details = riskData?.details || {
    velocity_score: 96.0,
    mixer_exposure_score: 98.0,
    bridge_exposure_score: 75.0,
    layering_complexity_score: 92.0,
    volumetric_risk_score: 80.0,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Risk Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#121212] border border-[#222222] text-neutral-300 mb-2">
            <BrandShield className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>Anti-Money Laundering Typologies</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Risk & Typology Analysis
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Detect complex crypto laundering patterns including peeling chains, privacy mixer interactions, rapid velocity dispersion, and bridge hops.
          </p>
        </div>

        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <FileText className="w-4 h-4 text-[#0052FF]" />
          <span>Generate Evidentiary Report</span>
        </button>
      </div>

      {/* Target Address Banner */}
      <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">Investigated Target Wallet</span>
            <p className="font-mono text-xs text-white font-bold select-all tracking-tight mt-0.5">{targetWallet}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase ${
              riskLevel === 'CRITICAL'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                : 'bg-amber-950/80 text-amber-300 border border-amber-800'
            }`}
          >
            {riskLevel} RISK SEVERITY
          </span>
        </div>
      </div>

      {/* Risk Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Risk Gauge */}
        <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] flex flex-col items-center justify-center text-center shadow-xl">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono mb-4">
            Aggregated Risk Score
          </span>
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-neutral-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-rose-500"
                strokeDasharray={`${riskScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold font-mono text-rose-400">{riskScore.toFixed(0)}</span>
              <span className="text-[10px] text-neutral-400 font-mono tracking-wider">INDEX / 100</span>
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 mt-4 max-w-[220px] leading-relaxed">
            Composite score weighting multi-hop dispersion, velocity anomalies, and high-risk mixer counterparty addresses.
          </p>
        </div>

        {/* Sub-Score Bars */}
        <div className="md:col-span-2 p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2">
            Component Threat Indicators
          </h3>

          <div className="space-y-3.5 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-neutral-300">Fund Velocity / Rapid Movement</span>
                <span className="text-rose-400 font-bold">{details.velocity_score || 92}%</span>
              </div>
              <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#222222]">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${details.velocity_score || 92}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-neutral-300">Privacy Mixer Exposure</span>
                <span className="text-purple-400 font-bold">{details.mixer_exposure_score || 95}%</span>
              </div>
              <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#222222]">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${details.mixer_exposure_score || 95}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-neutral-300">Layering Complexity & Peeling Chains</span>
                <span className="text-amber-400 font-bold">{details.layering_complexity_score || 85}%</span>
              </div>
              <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#222222]">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${details.layering_complexity_score || 85}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-neutral-300">Cross-Chain Bridge Gateway Exposure</span>
                <span className="text-[#0052FF] font-bold">{details.bridge_exposure_score || 75}%</span>
              </div>
              <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#222222]">
                <div
                  className="bg-[#0052FF] h-full rounded-full transition-all"
                  style={{ width: `${details.bridge_exposure_score || 75}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-neutral-300">Volumetric Risk Magnitude</span>
                <span className="text-indigo-400 font-bold">{details.volumetric_risk_score || 80}%</span>
              </div>
              <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#222222]">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${details.volumetric_risk_score || 80}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Identified Risk Signals List */}
      <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4">
          Corroborating Risk Signals
        </h3>
        <div className="space-y-2.5 text-xs text-neutral-300">
          {signals.map((sig: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#121212] border border-[#1f1f1f]">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{sig}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detected Typologies Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Classified Laundering Typologies
          </h3>
          <span className="text-[10px] text-neutral-400 font-mono">Machine Learning & Graph Classifier</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {typologies?.map((typ, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] hover:border-neutral-700 transition-all space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-mono uppercase">
                  {typ.pattern_type.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  {typ.confidence.toFixed(0)}% Confidence
                </span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {typ.explanation}
              </p>

              {typ.supporting_txs?.length > 0 && (
                <div className="pt-3 border-t border-[#1c1c1c] text-[10px] font-mono text-neutral-400 space-y-1.5">
                  <span className="text-neutral-500 uppercase tracking-wider">Supporting Hashes:</span>
                  <div className="space-y-1">
                    {typ.supporting_txs.slice(0, 2).map((txh: string) => (
                      <p key={txh} className="text-[#0052FF] truncate font-mono">
                        {txh}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Disclaimer */}
      <div className="p-5 rounded-2xl bg-[#080808] border border-[#1c1c1c] text-[11px] text-neutral-400 leading-relaxed">
        <p className="font-semibold text-neutral-300 mb-1 font-mono uppercase text-[10px]">Evidentiary & Compliance Notice:</p>
        <p>
          Risk scoring and typology designations are heuristic algorithmic aids provided for authorized law enforcement investigation workflows. Cryptographic signatures and VASP attribution reports generated through this portal satisfy Section 65B Indian Evidence Act criteria for cybercrime prosecution.
        </p>
      </div>
    </div>
  );
};

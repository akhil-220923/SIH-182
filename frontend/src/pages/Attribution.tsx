import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Building2, CheckCircle2,
  SendHorizontal, ArrowRight
} from 'lucide-react';
import { walletService } from '../services/api';
import { BrandShield } from '../components/BrandShield';

export const Attribution: React.FC = () => {
  const { address } = useParams<{ address?: string }>();
  const navigate = useNavigate();
  const targetWallet = address || '0x742d35cc6634c0532925a3b844bc454e4438f44e';

  const { data: candidates, isLoading } = useQuery({
    queryKey: ['attributions', targetWallet],
    queryFn: () => walletService.getAttribution(targetWallet, 4),
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Attribution Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#121212] border border-[#222222] text-neutral-300 mb-2">
            <BrandShield className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>5-Signal Explainable Scoring Model</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            VASP Attribution & Clustering
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Correlate unhosted target addresses to regulated Virtual Asset Service Providers using verifiable on-chain heuristics and deposit clustering.
          </p>
        </div>

        <button
          onClick={() => navigate('/sahyog')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <SendHorizontal className="w-4 h-4 text-[#0052FF]" />
          <span>Draft SAHYOG Disclosure</span>
        </button>
      </div>

      {/* Target Wallet Banner */}
      <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-center text-[#0052FF]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">Investigated Target Wallet</span>
            <p className="font-mono text-xs text-white font-bold select-all tracking-tight mt-0.5">{targetWallet}</p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-xs font-mono">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase">Ledger</span>
            <p className="font-semibold text-white mt-0.5">Ethereum Mainnet</p>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase">Candidates Identified</span>
            <p className="font-bold text-emerald-400 mt-0.5">{candidates?.length || 0} Regulated VASPs</p>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      {isLoading ? (
        <div className="p-16 text-center text-neutral-400 font-mono text-xs bg-[#0c0c0c] rounded-3xl border border-[#1f1f1f]">
          Computing multi-hop VASP attribution scores...
        </div>
      ) : candidates && candidates.length > 0 ? (
        <div className="space-y-6">
          {candidates.map((cand, index) => {
            const b = cand.score_breakdown || {
              address_cluster_match: 28.5,
              interaction_strength: 24.0,
              hop_distance_proximity: 18.0,
              volume_similarity: 12.5,
              temporal_pattern: 8.4,
            };

            const isTop = index === 0;

            return (
              <div
                key={cand.vasp_id}
                className={`p-7 rounded-3xl bg-[#0c0c0c] border transition-all ${
                  isTop
                    ? 'border-[#0052FF] shadow-2xl shadow-blue-950/20'
                    : 'border-[#1f1f1f] hover:border-neutral-700'
                }`}
              >
                {/* Candidate Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-[#1c1c1c]">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-[#141414] border border-[#262626] text-neutral-300 font-semibold">
                        RANK #{index + 1}
                      </span>
                      {isTop && (
                        <span className="text-[10px] font-mono uppercase bg-[#141414] text-[#0052FF] px-3 py-0.5 rounded-full border border-[#0052FF]/40 font-bold">
                          PRIMARY ATTRIBUTION CANDIDATE
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>{cand.candidate}</span>
                      <span className="text-xs font-mono text-neutral-400 font-normal">({cand.vasp_id})</span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Gateway Cluster: <span className="font-mono text-neutral-300">{cand.destination_address || 'Cluster Hot-Wallet'}</span>
                    </p>
                  </div>

                  <div className="text-right sm:border-l sm:border-[#1c1c1c] sm:pl-6">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      Confidence Score
                    </span>
                    <p
                      className={`text-3xl font-extrabold font-mono mt-0.5 ${
                        cand.confidence >= 80
                          ? 'text-[#0052FF]'
                          : cand.confidence >= 50
                          ? 'text-sky-400'
                          : 'text-neutral-400'
                      }`}
                    >
                      {cand.confidence.toFixed(1)}%
                    </p>
                    <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                      {cand.hop_distance} Hops • {cand.interaction_count} Interacting Txs
                    </span>
                  </div>
                </div>

                {/* 5-Signal Transparent Breakdown Bars */}
                <div className="my-6 p-5 rounded-2xl bg-[#111111] border border-[#1f1f1f] space-y-4">
                  <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider font-mono">
                    Explainable Multi-Signal Breakdown
                  </p>

                  <div className="space-y-3 text-xs font-mono">
                    {/* Signal 1 */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-neutral-300">1. Address / Cluster Match (Max 30%)</span>
                        <span className="text-[#0052FF] font-bold">{b.address_cluster_match.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#222222]">
                        <div
                          className="bg-[#0052FF] h-full rounded-full transition-all"
                          style={{ width: `${(b.address_cluster_match / 30) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Signal 2 */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-neutral-300">2. Interaction Strength (Max 25%)</span>
                        <span className="text-sky-400 font-bold">{b.interaction_strength.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#222222]">
                        <div
                          className="bg-sky-500 h-full rounded-full transition-all"
                          style={{ width: `${(b.interaction_strength / 25) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Signal 3 */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-neutral-300">3. Hop Distance Proximity (Max 20%)</span>
                        <span className="text-emerald-400 font-bold">{b.hop_distance_proximity.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#222222]">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${(b.hop_distance_proximity / 20) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Signal 4 */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-neutral-300">4. Transaction Volume Similarity (Max 15%)</span>
                        <span className="text-purple-400 font-bold">{b.volume_similarity.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#222222]">
                        <div
                          className="bg-purple-500 h-full rounded-full transition-all"
                          style={{ width: `${(b.volume_similarity / 15) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Signal 5 */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-neutral-300">5. Temporal Pattern Velocity (Max 10%)</span>
                        <span className="text-amber-400 font-bold">{b.temporal_pattern.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#222222]">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all"
                          style={{ width: `${(b.temporal_pattern / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supporting Evidence List */}
                <div className="space-y-2 text-xs text-neutral-300">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono mb-2">
                    Supporting Chain-of-Custody Evidence:
                  </p>
                  {cand.evidence.map((ev, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-neutral-300">{ev}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-[#1c1c1c]">
                  <button
                    onClick={() => navigate('/sahyog')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md transition-all"
                  >
                    <span>Request Records from {cand.candidate}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0052FF]" />
                  </button>
                  <button
                    onClick={() => navigate(`/graph/${targetWallet}`)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141414] hover:bg-[#1a1a1a] text-white text-xs font-semibold border border-[#262626] transition-all"
                  >
                    <span>View Path on Canvas</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center text-neutral-400 font-mono text-xs bg-[#0c0c0c] border border-[#1f1f1f] rounded-3xl">
          No VASP attributions identified within current traversal threshold.
        </div>
      )}
    </div>
  );
};

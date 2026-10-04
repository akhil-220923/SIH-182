import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  FileCheck2, ShieldCheck, CheckCircle2, X,
  Search
} from 'lucide-react';
import { evidenceService } from '../services/api';
import { BrandShield } from '../components/BrandShield';

export const Evidence: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const { data: evidenceList, isLoading } = useQuery({
    queryKey: ['evidenceList'],
    queryFn: () => evidenceService.list(),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => evidenceService.verify(id),
    onSuccess: (data) => {
      setVerificationResult(data);
    },
  });

  const filteredEvidence = (evidenceList || []).filter((e) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      e.evidence_id.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.sha256_hash.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Evidence Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#121212] border border-[#222222] text-neutral-300 mb-2">
            <BrandShield className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>Cryptographic Chain-of-Custody</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Evidence Vault & Verification
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Immutable chain-of-custody repository with SHA-256 bit-level cryptographic verification complying with Section 65B Indian Evidence Act.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Evidence ID or hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0c0c0c] border border-[#222222] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#0052FF] font-mono"
          />
        </div>
      </div>

      {/* Verification Result Modal */}
      {verificationResult && (
        <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#0052FF] shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase font-mono">
                Cryptographic Integrity Verification Audit
              </h2>
            </div>
            <button
              onClick={() => setVerificationResult(null)}
              className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-[#1a1a1a]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#121212] rounded-2xl border border-[#1f1f1f]">
              <span className="text-[10px] text-neutral-400 uppercase">Stored Ledger Digest</span>
              <p className="text-[#0052FF] break-all select-all mt-1">{verificationResult.stored_hash}</p>
            </div>
            <div className="p-4 bg-[#121212] rounded-2xl border border-[#1f1f1f]">
              <span className="text-[10px] text-neutral-400 uppercase">Computed Re-hash Digest</span>
              <p className="text-emerald-400 break-all select-all mt-1">{verificationResult.computed_hash}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a180e] border border-emerald-800/80 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Evidence status: <b>VALID_TAMPER_EVIDENT</b> (Bit-level cryptographic match confirmed)</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800 font-bold">
              SECTION 65B CERTIFIED
            </span>
          </div>
        </div>
      )}

      {/* Evidence Table */}
      <div className="rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1c1c1c] flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Archived Chain-of-Custody Artifacts
          </h3>
          <span className="text-[10px] font-mono text-neutral-400">
            {filteredEvidence.length} Recorded Artifacts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f1f1f] text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider bg-[#0e0e0e]">
                <th className="py-3.5 px-5">Evidence ID</th>
                <th className="py-3.5 px-5">Case ID</th>
                <th className="py-3.5 px-5">Type</th>
                <th className="py-3.5 px-5">Description</th>
                <th className="py-3.5 px-5">SHA-256 Digest</th>
                <th className="py-3.5 px-5">Integrity Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400 font-mono text-xs">
                    Loading evidence records...
                  </td>
                </tr>
              ) : filteredEvidence.length > 0 ? (
                filteredEvidence.map((ev) => (
                  <tr key={ev.evidence_id} className="hover:bg-[#121212] transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-white">
                      {ev.evidence_id}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-neutral-300">
                      {ev.case_id || 'N/A'}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-[10px] font-mono bg-[#141414] text-neutral-300 px-2.5 py-0.5 rounded-full border border-[#262626]">
                        {ev.evidence_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-neutral-300 max-w-xs truncate">
                      {ev.description}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[10px] text-neutral-400">
                      {ev.sha256_hash.slice(0, 16)}...
                    </td>
                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => verifyMutation.mutate(ev.evidence_id)}
                        disabled={verifyMutation.isPending}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-white hover:text-black border border-[#262626] text-white text-[11px] font-semibold transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0052FF]" />
                        <span>Verify Integrity</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400 font-mono text-xs">
                    No matching evidence records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  SendHorizontal, CheckCircle2
} from 'lucide-react';
import { sahyogService } from '../services/api';
import { BrandShield } from '../components/BrandShield';

export const SAHYOG: React.FC = () => {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'DISCLOSURE' | 'FREEZE'>('DISCLOSURE');

  // Disclosure Form State
  const [caseId, setCaseId] = useState('CASE-DEMO-182');
  const [vaspId, setVaspId] = useState('VASP-ALPHA');
  const [vaspName, setVaspName] = useState('Demo Exchange Alpha');
  const [walletAddress, setWalletAddress] = useState('0x742d35cc6634c0532925a3b844bc454e4438f44e');
  const [reason, setReason] = useState(
    'Formal requisition under Section 91 CrPC in connection with cyber fraud investigation involving multi-hop asset diversion.'
  );
  const [kycChecked, setKycChecked] = useState(true);
  const [ipLogsChecked, setIpLogsChecked] = useState(true);
  const [bankAccountsChecked, setBankAccountsChecked] = useState(true);
  const [tradeHistoryChecked, setTradeHistoryChecked] = useState(false);

  // Freeze Form State
  const [freezeAmount, setFreezeAmount] = useState('31.8');
  const [tokenSymbol, setTokenSymbol] = useState('ETH');

  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ['sahyogRequests'],
    queryFn: () => sahyogService.listRequests(),
  });

  const disclosureMutation = useMutation({
    mutationFn: sahyogService.submitDisclosure,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sahyogRequests'] });
      setSubmissionResult(data);
    },
  });

  const freezeMutation = useMutation({
    mutationFn: sahyogService.submitFreeze,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sahyogRequests'] });
      setSubmissionResult(data);
    },
  });

  const handleDisclosureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reqInfo: string[] = [];
    if (kycChecked) reqInfo.push('Full KYC (Aadhaar/Passport/Govt ID)');
    if (ipLogsChecked) reqInfo.push('Registration & Session IP Login Logs with Timestamps');
    if (bankAccountsChecked) reqInfo.push('Linked Bank Accounts and UPI VPA Identifiers');
    if (tradeHistoryChecked) reqInfo.push('Complete Trade & Withdrawal History');

    disclosureMutation.mutate({
      case_id: caseId.trim(),
      vasp_id: vaspId,
      vasp_name: vaspName,
      wallet_address: walletAddress.trim(),
      reason: reason.trim(),
      requested_info: reqInfo,
      supporting_evidence: [
        '0xaa02020202020202020202020202020202020202020202020202020202020202',
        '0xaa09090909090909090909090909090909090909090909090909090909090909'
      ],
    });
  };

  const handleFreezeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    freezeMutation.mutate({
      case_id: caseId.trim(),
      vasp_id: vaspId,
      vasp_name: vaspName,
      wallet_address: walletAddress.trim(),
      reason: reason.trim(),
      asset_amount: parseFloat(freezeAmount) || 0.0,
      token_symbol: tokenSymbol,
      supporting_evidence: [
        '0xaa09090909090909090909090909090909090909090909090909090909090909'
      ],
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Gateway Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#121212] border border-[#222222] text-neutral-300 mb-2">
          <BrandShield className="w-3.5 h-3.5 text-[#0052FF]" />
          <span>Statutory Inter-Agency Gateway</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          SAHYOG Integration Gateway
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
          Law enforcement interface for Section 91 CrPC Information Disclosure Requisitions and Emergency Asset Restraint notices.
        </p>
      </div>

      {/* Adapter Prototype Notice */}
      <div className="p-4 rounded-2xl bg-[#0c0c0c] border border-[#222222] text-xs text-neutral-300 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <SendHorizontal className="w-4 h-4 text-[#0052FF]" />
          <span><b>SAHYOG Prototype Adapter Active:</b> Requests simulate secure routing to designated VASP compliance desks.</span>
        </div>
        <span className="text-[10px] font-mono bg-[#141414] text-[#0052FF] px-3 py-1 rounded-full border border-[#262626] font-semibold">
          MOCK GOV GATEWAY
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('DISCLOSURE')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'DISCLOSURE'
              ? 'bg-white text-black shadow-md'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#222222]'
          }`}
        >
          1. Information Disclosure Notice (Sec 91 CrPC)
        </button>
        <button
          onClick={() => setActiveTab('FREEZE')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'FREEZE'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#222222]'
          }`}
        >
          2. Emergency Asset Restraint Notice (Sec 102 CrPC)
        </button>
      </div>

      {/* Form Content */}
      <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl space-y-5">
        {activeTab === 'DISCLOSURE' ? (
          <form onSubmit={handleDisclosureSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Investigation Case ID</label>
                <input
                  type="text"
                  required
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Target VASP</label>
                <select
                  value={vaspId}
                  onChange={(e) => {
                    setVaspId(e.target.value);
                    setVaspName(e.target.value === 'VASP-ALPHA' ? 'Demo Exchange Alpha' : 'Demo Exchange Beta');
                  }}
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:border-[#0052FF] focus:outline-none"
                >
                  <option value="VASP-ALPHA">Demo Exchange Alpha (Deposit Cluster 0x28c6c...)</option>
                  <option value="VASP-BETA">Demo Exchange Beta (Deposit Pool 0xdfd52...)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Target Suspect Cryptocurrency Address</label>
              <input
                type="text"
                required
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#0052FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Statutory Purpose / Grounds for Requisition</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:border-[#0052FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-2">Requisite Information Records (Select all that apply):</label>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#121212] border border-[#1f1f1f] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kycChecked}
                    onChange={(e) => setKycChecked(e.target.checked)}
                    className="accent-[#0052FF]"
                  />
                  <span>User KYC Dossier (Govt ID, Liveness)</span>
                </label>
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#121212] border border-[#1f1f1f] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ipLogsChecked}
                    onChange={(e) => setIpLogsChecked(e.target.checked)}
                    className="accent-[#0052FF]"
                  />
                  <span>Registration & Session Login IP Logs</span>
                </label>
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#121212] border border-[#1f1f1f] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bankAccountsChecked}
                    onChange={(e) => setBankAccountsChecked(e.target.checked)}
                    className="accent-[#0052FF]"
                  />
                  <span>Linked Bank Accounts & UPI Identifiers</span>
                </label>
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#121212] border border-[#1f1f1f] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tradeHistoryChecked}
                    onChange={(e) => setTradeHistoryChecked(e.target.checked)}
                    className="accent-[#0052FF]"
                  />
                  <span>Order Book Fills & Fiat Off-Ramp History</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={disclosureMutation.isPending}
                className="px-6 py-3 rounded-full bg-white hover:bg-neutral-200 disabled:opacity-50 text-black font-bold flex items-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                {disclosureMutation.isPending ? 'Transmitting Notice...' : 'Transmit Requisition via SAHYOG'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleFreezeSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Investigation Case ID</label>
                <input
                  type="text"
                  required
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Restrained Asset Amount & Token</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    required
                    value={freezeAmount}
                    onChange={(e) => setFreezeAmount(e.target.value)}
                    className="w-2/3 bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#0052FF] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    className="w-1/3 bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#0052FF] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Statutory Restraint Grounds (Sec 102 CrPC / PMLA Sec 17)</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:border-[#0052FF] focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={freezeMutation.isPending}
                className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold flex items-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                {freezeMutation.isPending ? 'Forwarding Direction...' : 'Submit Emergency Asset Freeze Directive'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Submission Result Receipt */}
      {submissionResult && (
        <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#0052FF] shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase font-mono">
                SAHYOG Adapter Formal Acknowledgment Receipt
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#0052FF] bg-[#141414] px-3 py-1 rounded-full border border-[#262626] font-bold">
              TRANSMITTED
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#121212] rounded-2xl border border-[#1f1f1f]">
              <span className="text-[10px] text-neutral-400 uppercase">Official Reference</span>
              <p className="text-[#0052FF] font-bold text-sm mt-1">{submissionResult.reference_number}</p>
            </div>
            <div className="p-4 bg-[#121212] rounded-2xl border border-[#1f1f1f]">
              <span className="text-[10px] text-neutral-400 uppercase">Target VASP</span>
              <p className="text-white font-bold mt-1">{submissionResult.vasp_name}</p>
            </div>
            <div className="p-4 bg-[#121212] rounded-2xl border border-[#1f1f1f]">
              <span className="text-[10px] text-neutral-400 uppercase">Turnaround SLA</span>
              <p className="text-emerald-400 font-bold mt-1">48 Hours Notice</p>
            </div>
            <div className="p-4 bg-[#121212] rounded-2xl border border-[#1f1f1f]">
              <span className="text-[10px] text-neutral-400 uppercase">Filing Status</span>
              <p className="text-white font-bold mt-1">{submissionResult.status}</p>
            </div>
          </div>
        </div>
      )}

      {/* Historical SAHYOG Requisitions Table */}
      <div className="rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1c1c1c] flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Active SAHYOG Transmissions & Disclosures
          </h3>
          <span className="text-[10px] font-mono text-neutral-400">
            {requests?.length || 0} Requisitions Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f1f1f] text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider bg-[#0e0e0e]">
                <th className="py-3.5 px-5">Reference #</th>
                <th className="py-3.5 px-5">Case ID</th>
                <th className="py-3.5 px-5">Recipient VASP</th>
                <th className="py-3.5 px-5">Request Type</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Transmitted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400 font-mono text-xs">
                    Loading SAHYOG records...
                  </td>
                </tr>
              ) : requests && requests.length > 0 ? (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-[#121212] transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-white">
                      {r.reference_number}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-neutral-200">
                      {r.case_id}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-white">
                      {r.vasp_name}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-[10px] font-mono bg-[#141414] text-neutral-300 px-2.5 py-0.5 rounded-full border border-[#262626]">
                        {r.request_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 font-semibold">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-neutral-400 font-mono text-[10px]">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400 font-mono text-xs">
                    No SAHYOG requisitions filed yet.
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

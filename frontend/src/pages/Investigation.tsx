import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search, Sparkles, Network, Building2, AlertTriangle,
  FileText, CheckCircle2, Loader2, ArrowRight, Database, Code2, Copy, Check
} from 'lucide-react';
import { walletService } from '../services/api';
import { AnalysisFullResult } from '../types';
import { BrandShield } from '../components/BrandShield';

const PROGRESS_STEPS = [
  "Validating wallet address format...",
  "Querying blockchain transaction records...",
  "Normalizing multi-hop ledger data...",
  "Constructing directed counterparty graph...",
  "Analyzing intermediary layering pathways...",
  "Matching candidate VASP clusters...",
  "Computing explainable attribution scores...",
  "Evaluating velocity & mixer risk indicators...",
  "Compiling cryptographic evidence manifest..."
];

export const Investigation: React.FC = () => {
  const { address } = useParams<{ address?: string }>();
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState(
    address || '0x742d35cc6634c0532925a3b844bc454e4438f44e'
  );
  const [blockchain, setBlockchain] = useState('ethereum');
  const [maxHops, setMaxHops] = useState(3);
  const [dataSource, setDataSource] = useState<'AUTO' | 'DEMO' | 'LIVE'>('AUTO');

  const [analyzing, setAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<AnalysisFullResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'python' | 'ts'>('curl');

  // If address param is present on mount, load automatically
  useEffect(() => {
    if (address) {
      setWalletAddress(address);
      handleAnalyze(address);
    }
  }, [address]);

  const handleAnalyze = async (targetAddr = walletAddress) => {
    const clean = targetAddr.trim();
    if (!clean) return;

    setAnalyzing(true);
    setError(null);
    setResult(null);
    setStepIndex(0);

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
    }, 350);

    try {
      const data = await walletService.analyze({
        wallet_address: clean,
        blockchain,
        max_hops: maxHops,
        case_id: 'CASE-DEMO-182',
        data_source: dataSource,
      });
      clearInterval(interval);
      setStepIndex(PROGRESS_STEPS.length - 1);
      setTimeout(() => {
        setResult(data);
        setAnalyzing(false);
      }, 400);
    } catch (err: any) {
      clearInterval(interval);
      setAnalyzing(false);
      setError(err.response?.data?.detail || 'Analysis request failed. Please check address format.');
    }
  };

  const handleLoadDemo = () => {
    const demo = '0x742d35cc6634c0532925a3b844bc454e4438f44e';
    setWalletAddress(demo);
    setBlockchain('ethereum');
    setMaxHops(3);
    handleAnalyze(demo);
  };

  const apiEndpointUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/wallets/analyze`
    : '/api/wallets/analyze';

  const curlSnippet = `curl -X POST "${apiEndpointUrl}" \\
  -H "Authorization: Bearer $ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "wallet_address": "${walletAddress}",
    "blockchain": "${blockchain}",
    "max_hops": ${maxHops},
    "case_id": "CASE-DEMO-182"
  }'`;

  const pythonSnippet = `import requests

url = "${apiEndpointUrl}"
headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
payload = {
    "wallet_address": "${walletAddress}",
    "blockchain": "${blockchain}",
    "max_hops": ${maxHops},
    "case_id": "CASE-DEMO-182"
}
response = requests.post(url, json=payload, headers=headers)
print(response.json()["attributions"])`;

  const tsSnippet = `import axios from 'axios';

const res = await axios.post('/api/wallets/analyze', {
  wallet_address: '${walletAddress}',
  blockchain: '${blockchain}',
  max_hops: ${maxHops},
  case_id: 'CASE-DEMO-182'
}, {
  headers: { Authorization: \`Bearer \${token}\` }
});
console.log(res.data.attributions);`;

  const copyCode = () => {
    const text = activeCodeTab === 'curl' ? curlSnippet : activeCodeTab === 'python' ? pythonSnippet : tsSnippet;
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Investigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#121212] border border-[#222222] text-neutral-300 mb-2">
            <BrandShield className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>TraceVASP Core • Wallet Attribution Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Automated Wallet Attribution
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Trace unhosted wallets across multi-hop counterparty paths and attribute them to regulated Virtual Asset Service Providers (VASPs).
          </p>
        </div>

        <button
          onClick={handleLoadDemo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[#0052FF]" />
          <span>Load Demo Case (CASE-DEMO-182)</span>
        </button>
      </div>

      {/* Investigation Input Form */}
      <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          {/* Target Address */}
          <div className="md:col-span-6">
            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider font-mono mb-2">
              Target Cryptocurrency Wallet Address
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter 0x... or Bitcoin/Tron address"
                className="w-full bg-[#121212] border border-[#262626] rounded-2xl pl-10 pr-4 py-3 text-xs text-white font-mono placeholder:text-neutral-500 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] transition-all"
              />
            </div>
          </div>

          {/* Blockchain Ledger */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider font-mono mb-2">
              Ledger
            </label>
            <select
              value={blockchain}
              onChange={(e) => setBlockchain(e.target.value)}
              className="w-full bg-[#121212] border border-[#262626] rounded-2xl px-3.5 py-3 text-xs text-white font-medium focus:outline-none focus:border-[#0052FF]"
            >
              <option value="ethereum">Ethereum (ETH)</option>
              <option value="bitcoin">Bitcoin (BTC)</option>
              <option value="bnb">BNB Chain (BSC)</option>
              <option value="polygon">Polygon (POL)</option>
              <option value="tron">TRON (TRX)</option>
              <option value="solana">Solana (SOL)</option>
            </select>
          </div>

          {/* Max Traversal Hops */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider font-mono mb-2 flex justify-between">
              <span>Depth</span>
              <span className="text-[#0052FF] font-bold">{maxHops} Hops</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={maxHops}
              onChange={(e) => setMaxHops(parseInt(e.target.value))}
              className="w-full h-2 bg-[#1c1c1c] rounded-lg appearance-none cursor-pointer accent-[#0052FF] mt-3"
            />
          </div>

          {/* Action Button */}
          <div className="md:col-span-2">
            <button
              onClick={() => handleAnalyze()}
              disabled={analyzing || !walletAddress.trim()}
              className="w-full py-3 px-5 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Tracing...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Wallet</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Data Source Mode Selection */}
        <div className="flex flex-wrap items-center gap-5 mt-5 pt-5 border-t border-[#1a1a1a] text-[11px] text-neutral-400">
          <span className="font-semibold text-neutral-300 flex items-center gap-1.5 font-mono">
            <Database className="w-3.5 h-3.5 text-[#0052FF]" />
            INTELLIGENCE SOURCE:
          </span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="source"
              checked={dataSource === 'AUTO'}
              onChange={() => setDataSource('AUTO')}
              className="accent-[#0052FF]"
            />
            <span>Auto (Live if API configured, otherwise Demo)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="source"
              checked={dataSource === 'DEMO'}
              onChange={() => setDataSource('DEMO')}
              className="accent-[#0052FF]"
            />
            <span className="text-[#0052FF] font-mono font-semibold">Deterministic Demo Dataset</span>
          </label>
        </div>
      </div>

      {/* Progress Animation State */}
      {analyzing && (
        <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#0052FF]/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-[#0052FF] font-semibold font-mono">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Step {stepIndex + 1} of {PROGRESS_STEPS.length}: {PROGRESS_STEPS[stepIndex]}</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              {Math.round(((stepIndex + 1) / PROGRESS_STEPS.length) * 100)}%
            </span>
          </div>

          <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#222222]">
            <div
              className="bg-[#0052FF] h-full transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / PROGRESS_STEPS.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-[10px] text-neutral-400 font-mono">
            <span>• Traversal depth: {maxHops} Hops</span>
            <span>• Ledger: {blockchain.toUpperCase()}</span>
            <span>• Heuristics: 5-Signal Attribution</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
          <div>
            <p className="font-semibold">Analysis Failed</p>
            <p className="text-[11px] text-rose-300/80">{error}</p>
          </div>
        </div>
      )}

      {/* Investigation Results Display */}
      {result && !analyzing && (
        <div className="space-y-6">
          {/* Target Profile Card */}
          <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-[#1c1c1c]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase bg-rose-950/80 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-800">
                    TARGET SUSPECT WALLET
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-[#141414] text-[#0052FF] px-2.5 py-0.5 rounded-full border border-[#262626]">
                    {result.data_source}
                  </span>
                </div>
                <p className="font-mono text-base text-white font-bold select-all tracking-tight">
                  {result.wallet.address}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-neutral-400 uppercase font-mono">Risk Index</p>
                  <p className="text-2xl font-extrabold font-mono text-rose-400">
                    {result.risk.risk_score.toFixed(1)} / 100
                  </p>
                </div>
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase ${
                    result.risk.risk_level === 'CRITICAL'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                  }`}
                >
                  {result.risk.risk_level}
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#1f1f1f]">
                <span className="text-[10px] text-neutral-400 uppercase">Traversal Depth</span>
                <p className="text-base font-bold text-white mt-1">
                  {result.graph_metrics.max_depth_reached} Hops
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#1f1f1f]">
                <span className="text-[10px] text-neutral-400 uppercase">Counterparty Nodes</span>
                <p className="text-base font-bold text-white mt-1">
                  {result.graph_metrics.total_nodes} Wallets / Entities
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#1f1f1f]">
                <span className="text-[10px] text-neutral-400 uppercase">Candidate VASPs</span>
                <p className="text-base font-bold text-emerald-400 mt-1">
                  {result.attributions.length} Identified
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#1f1f1f]">
                <span className="text-[10px] text-neutral-400 uppercase">AML Typologies</span>
                <p className="text-base font-bold text-amber-400 mt-1">
                  {result.typologies.length} Flagged
                </p>
              </div>
            </div>

            {/* Action Buttons to Dedicated Views */}
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-[#1c1c1c]">
              <button
                onClick={() => navigate(`/graph/${result.wallet.address}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] hover:bg-[#1f1f1f] text-white border border-[#262626] text-xs font-semibold transition-all"
              >
                <Network className="w-3.5 h-3.5 text-[#0052FF]" />
                <span>Transaction Graph</span>
              </button>
              <button
                onClick={() => navigate(`/attribution/${result.wallet.address}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] hover:bg-[#1f1f1f] text-white border border-[#262626] text-xs font-semibold transition-all"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>VASP Attribution</span>
              </button>
              <button
                onClick={() => navigate(`/risk/${result.wallet.address}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] hover:bg-[#1f1f1f] text-white border border-[#262626] text-xs font-semibold transition-all"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Risk & Typology</span>
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all ml-auto"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate PDF Report</span>
              </button>
            </div>
          </div>

          {/* Primary Attribution Candidate Card */}
          {result.attributions.length > 0 && (
            <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#0052FF]/10 blur-[90px] pointer-events-none rounded-full" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#141414] border border-[#262626] text-[#0052FF]">
                    <BrandShield className="w-3 h-3 text-[#0052FF]" />
                    <span>PRIMARY ATTRIBUTED VASP</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-2">
                    {result.attributions[0].candidate}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Hop Distance: <span className="text-white font-mono font-bold">{result.attributions[0].hop_distance} Hops</span> • Interacting Volume: <span className="text-white font-mono font-bold">{result.attributions[0].total_volume} ETH</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase font-mono">Attribution Score</span>
                  <p className="text-3xl font-extrabold font-mono text-[#0052FF]">
                    {result.attributions[0].confidence.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Supporting Evidence List */}
              <div className="space-y-2 text-xs text-neutral-300 bg-[#121212] p-4 rounded-2xl border border-[#1f1f1f] relative z-10">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider font-mono mb-1">
                  Corroborating Graph Evidence & Heuristics:
                </p>
                {result.attributions[0].evidence.map((ev, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-neutral-300">{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Developer API Preview Drawer */}
      <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#0052FF]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Developer API Integration
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Incorporate TraceVASP attribution into institutional core banking or compliance platforms using our REST APIs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#141414] border border-[#222222] rounded-full p-1">
              <button
                onClick={() => setActiveCodeTab('curl')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                  activeCodeTab === 'curl' ? 'bg-[#0052FF] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setActiveCodeTab('python')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                  activeCodeTab === 'python' ? 'bg-[#0052FF] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setActiveCodeTab('ts')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                  activeCodeTab === 'ts' ? 'bg-[#0052FF] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                TypeScript
              </button>
            </div>

            <button
              onClick={copyCode}
              className="p-2 rounded-full bg-[#141414] border border-[#222222] hover:border-neutral-600 text-neutral-300 hover:text-white transition-all"
              title="Copy snippet"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-2xl bg-[#050505] border border-[#1c1c1c] text-neutral-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
          {activeCodeTab === 'curl' ? curlSnippet : activeCodeTab === 'python' ? pythonSnippet : tsSnippet}
        </pre>
      </div>
    </div>
  );
};

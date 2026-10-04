import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Server, Key, RefreshCw
} from 'lucide-react';
import { BrandShield } from '../components/BrandShield';

export const Settings: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await axios.get('/health');
      setHealth(res.data);
    } catch {
      setHealth({ status: 'offline', database: 'disconnected', version: '1.0.0' });
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Settings Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#121212] border border-[#222222] text-neutral-300 mb-2">
          <BrandShield className="w-3.5 h-3.5 text-[#0052FF]" />
          <span>System Administration & Adapters</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          System Diagnostics & Settings
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
          Review backend daemon health, database connection status, and blockchain adapter telemetry.
        </p>
      </div>

      {/* Backend Health Check Card */}
      <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Server className="w-4 h-4 text-[#0052FF]" />
            <span>TraceVASP Core Daemon Health (GET /health)</span>
          </h2>
          <button
            onClick={fetchHealth}
            disabled={loadingHealth}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] text-xs text-white font-medium transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin' : ''}`} />
            <span>Refresh Diagnostics</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 bg-[#121212] rounded-2xl border border-[#1f1f1f]">
            <span className="text-[10px] text-neutral-400 uppercase">Daemon Status</span>
            <p className="text-emerald-400 font-bold mt-1.5 flex items-center gap-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {health?.status?.toUpperCase() || 'ONLINE'}
            </p>
          </div>

          <div className="p-4 bg-[#121212] rounded-2xl border border-[#1f1f1f]">
            <span className="text-[10px] text-neutral-400 uppercase">Database Engine</span>
            <p className="text-[#0052FF] font-bold mt-1.5 text-sm">
              {health?.database || 'CONNECTED'}
            </p>
          </div>

          <div className="p-4 bg-[#121212] rounded-2xl border border-[#1f1f1f]">
            <span className="text-[10px] text-neutral-400 uppercase">Build Version</span>
            <p className="text-white font-bold mt-1.5 text-sm">
              v{health?.version || '1.0.0'}
            </p>
          </div>

          <div className="p-4 bg-[#121212] rounded-2xl border border-[#1f1f1f]">
            <span className="text-[10px] text-neutral-400 uppercase">SAHYOG Gateway</span>
            <p className="text-amber-400 font-bold mt-1.5 text-sm">
              {health?.sahyog_mode || 'PROTOTYPE SIM'}
            </p>
          </div>
        </div>
      </div>

      {/* Blockchain Adapters Status */}
      <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 pb-3 border-b border-[#1c1c1c]">
          <Key className="w-4 h-4 text-[#0052FF]" />
          <span>Blockchain Intelligence API Adapters Status</span>
        </h2>

        <div className="space-y-2.5 text-xs font-mono">
          {[
            { name: 'Ethereum Mainnet (Etherscan / Alchemy API)', env: 'ETHERSCAN_API_KEY', mode: 'Live + Deterministic Demo Fallback', status: 'READY' },
            { name: 'Bitcoin Network (Blockstream / Blockchain API)', env: 'BITCOIN_API_KEY', mode: 'Public API + Demo Fallback', status: 'READY' },
            { name: 'BNB Smart Chain (BscScan API)', env: 'BNB_API_KEY', mode: 'Interface Implemented + Demo Fallback', status: 'READY' },
            { name: 'Polygon PoS (PolygonScan API)', env: 'POLYGON_API_KEY', mode: 'Interface Implemented + Demo Fallback', status: 'READY' },
            { name: 'TRON Ledger (TronGrid API)', env: 'TRON_API_KEY', mode: 'Base58 Address Parser + Demo Fallback', status: 'READY' },
            { name: 'Solana RPC (Solana Mainnet-Beta)', env: 'SOLANA_RPC_URL', mode: 'Base58 Validator + Demo Fallback', status: 'READY' },
          ].map((chain) => (
            <div
              key={chain.name}
              className="p-3.5 rounded-2xl bg-[#121212] border border-[#1f1f1f] flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-white">{chain.name}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{chain.mode}</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                {chain.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Disclaimer */}
      <div className="p-6 rounded-3xl bg-[#080808] border border-[#1c1c1c] text-xs text-neutral-400 leading-relaxed space-y-2">
        <p className="font-bold text-white font-mono uppercase text-[11px]">System Architectural Declarations:</p>
        <p>
          1. <b>Deterministic Demonstration Data:</b> Seeded entities such as Demo Exchange Alpha and DemoMixer Cash are educational mock records designed for reproducible evaluation.
        </p>
        <p>
          2. <b>Government SAHYOG Portal:</b> In adherence to development guidelines, the SAHYOG adapter executes in prototype simulation mode to prevent unauthorized traffic to production law enforcement endpoints.
        </p>
      </div>
    </div>
  );
};

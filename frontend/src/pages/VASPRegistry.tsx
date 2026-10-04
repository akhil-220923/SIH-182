import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search, Globe
} from 'lucide-react';
import { vaspService } from '../services/api';
import { BrandShield } from '../components/BrandShield';

export const VASPRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: vasps, isLoading } = useQuery({
    queryKey: ['vaspsList', searchTerm],
    queryFn: () => vaspService.list(searchTerm || undefined),
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Registry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#121212] border border-[#222222] text-neutral-300 mb-2">
            <BrandShield className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>Regulated Entity Directory</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            VASP Intelligence Registry
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Curated and verified database of Virtual Asset Service Providers, deposit clusters, hot wallets, and institutional custodians.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search VASP or jurisdiction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0c0c0c] border border-[#222222] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#0052FF] font-mono"
          />
        </div>
      </div>

      {/* Registry Cards Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-neutral-400 font-mono text-xs bg-[#0c0c0c] border border-[#1f1f1f] rounded-3xl">
          Loading VASP intelligence records...
        </div>
      ) : vasps && vasps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {vasps.map((vasp) => (
            <div
              key={vasp.vasp_id}
              className="p-6 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] hover:border-neutral-700 transition-all space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1c1c1c]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[10px] text-[#0052FF] bg-[#141414] px-2.5 py-0.5 rounded-full border border-[#262626]">
                      {vasp.vasp_id}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 font-semibold">
                      {vasp.verification_status}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">{vasp.name}</h2>
                  <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                    <Globe className="w-3 h-3 text-neutral-500" />
                    <span>{vasp.country}</span>
                  </p>
                </div>

                <div className="text-right text-[10px] font-mono text-neutral-400">
                  <span className="uppercase text-[9px]">Classification</span>
                  <p className="text-white font-semibold uppercase mt-0.5">{vasp.risk_category.replace('_', ' ')}</p>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {vasp.description || 'Verified cryptocurrency exchange with recorded deposit clustering.'}
              </p>

              {/* Known Address Clusters */}
              <div className="space-y-2 pt-2 border-t border-[#1c1c1c]">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                  Mapped On-Chain Clusters ({vasp.addresses?.length || 0}):
                </span>
                <div className="space-y-1.5">
                  {vasp.addresses?.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-2.5 rounded-xl bg-[#121212] border border-[#1f1f1f] text-[10px] font-mono flex items-center justify-between text-neutral-300"
                    >
                      <span className="truncate max-w-[220px] select-all text-[#0052FF]">
                        {addr.address}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#171717] border border-[#262626] text-[9px] uppercase font-semibold text-neutral-300">
                        {addr.address_type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance liaison contact */}
              {vasp.compliance_email && (
                <div className="text-[10px] text-neutral-400 font-mono flex items-center justify-between pt-2 border-t border-[#1c1c1c]">
                  <span>LEA Legal Liaison:</span>
                  <span className="text-white">{vasp.compliance_email}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center text-neutral-400 font-mono text-xs bg-[#0c0c0c] border border-[#1f1f1f] rounded-3xl">
          No VASP records matched your query.
        </div>
      )}
    </div>
  );
};

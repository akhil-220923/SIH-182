import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User as UserIcon } from 'lucide-react';
import { auditService } from '../services/api';
import { BrandShield } from '../components/BrandShield';

export const AuditLogs: React.FC = () => {
  const [actionFilter, setActionFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data: logs, isLoading } = useQuery({
    queryKey: ['auditLogs', actionFilter],
    queryFn: () => auditService.list(actionFilter || undefined),
    refetchInterval: 15000,
  });

  const filteredLogs = (logs || []).filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.username.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      (l.case_id && l.case_id.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Logs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#121212] border border-[#222222] text-neutral-300 mb-2">
            <BrandShield className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>Immutable Governance Ledger</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Chain-of-Custody Audit Logs
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Cryptographically sealed system ledger recording logins, analysis queries, VASP attribution generations, and court exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#0c0c0c] border border-[#222222] rounded-full px-4 py-2 text-xs text-neutral-200 focus:outline-none focus:border-[#0052FF] font-mono"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="WALLET_ANALYZED">WALLET ANALYZED</option>
            <option value="CASE_CREATED">CASE CREATED</option>
            <option value="REPORT_GENERATED">REPORT GENERATED</option>
            <option value="EVIDENCE_EXPORTED">EVIDENCE EXPORTED</option>
            <option value="DISCLOSURE_REQUEST_CREATED">DISCLOSURE REQUEST</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1c1c1c] flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Investigator Activity Register
          </h3>
          <span className="text-[10px] font-mono text-neutral-400">
            {filteredLogs.length} Events Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f1f1f] text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider bg-[#0e0e0e]">
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Officer / User</th>
                <th className="py-3.5 px-5">Action Event</th>
                <th className="py-3.5 px-5">Case Docket</th>
                <th className="py-3.5 px-5">Client IP</th>
                <th className="py-3.5 px-5">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717] font-mono text-[11px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#121212] transition-colors">
                    <td className="py-3.5 px-5 text-neutral-400 whitespace-nowrap">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-5 text-white font-semibold flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5 text-[#0052FF]" />
                      <span>{log.username}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-[10px] bg-[#141414] text-[#0052FF] px-2.5 py-0.5 rounded-full border border-[#262626] font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-neutral-300">
                      {log.case_id || '—'}
                    </td>
                    <td className="py-3.5 px-5 text-neutral-400">
                      {log.ip_address}
                    </td>
                    <td className="py-3.5 px-5 text-neutral-300 max-w-xs truncate text-[10px]">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400">
                    No audit records found matching filters.
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

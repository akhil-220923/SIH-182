import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase, Plus, Search, ArrowUpRight,
  X
} from 'lucide-react';
import { casesService } from '../services/api';
import { BrandShield } from '../components/BrandShield';

export const Cases: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form State
  const [newCaseId, setNewCaseId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [newWallet, setNewWallet] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const { data: cases, isLoading } = useQuery({
    queryKey: ['cases', statusFilter, priorityFilter],
    queryFn: () => casesService.list(statusFilter || undefined, priorityFilter || undefined),
  });

  const createMutation = useMutation({
    mutationFn: casesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      setShowCreateModal(false);
      setNewCaseId('');
      setNewTitle('');
      setNewDescription('');
      setNewWallet('');
      setNewNotes('');
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseId || !newTitle) return;

    createMutation.mutate({
      case_id: newCaseId.trim(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      suspect_wallets: newWallet ? [newWallet.trim()] : [],
      notes: newNotes.trim(),
    });
  };

  const filteredCases = (cases || []).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.case_id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Cases Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#121212] border border-[#222222] text-neutral-300 mb-2">
            <BrandShield className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>Digital Evidence Docket Vault</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Investigation Case Files
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Maintain encrypted digital crime dockets, tag unhosted suspect wallets, and track court-admissible VASP attribution progress.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#0052FF]" />
          <span>Register New Case</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Case ID or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121212] border border-[#262626] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#0052FF] font-mono"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#121212] border border-[#262626] rounded-full px-4 py-2 text-xs text-neutral-200 focus:outline-none focus:border-[#0052FF]"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="UNDER_ANALYSIS">UNDER ANALYSIS</option>
            <option value="REVIEW">REVIEW</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#121212] border border-[#262626] rounded-full px-4 py-2 text-xs text-neutral-200 focus:outline-none focus:border-[#0052FF]"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f1f1f] text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider bg-[#0e0e0e]">
                <th className="py-3.5 px-5">Case ID</th>
                <th className="py-3.5 px-5">Title & Docket Description</th>
                <th className="py-3.5 px-5">Suspect Wallets</th>
                <th className="py-3.5 px-5">Priority</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Registered Date</th>
                <th className="py-3.5 px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400 font-mono text-xs">
                    Loading registered cases...
                  </td>
                </tr>
              ) : filteredCases.length > 0 ? (
                filteredCases.map((c) => (
                  <tr key={c.case_id} className="hover:bg-[#121212] transition-colors group">
                    <td className="py-3.5 px-5 font-mono font-bold text-white">
                      {c.case_id}
                    </td>
                    <td className="py-3.5 px-5 max-w-sm">
                      <p className="font-semibold text-white truncate">{c.title}</p>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">{c.description || 'No description'}</p>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[11px] text-neutral-300">
                      {c.suspect_wallets && c.suspect_wallets.length > 0 ? (
                        <span
                          onClick={() => navigate(`/investigate/${c.suspect_wallets[0]}`)}
                          className="text-[#0052FF] hover:underline cursor-pointer font-semibold"
                        >
                          {c.suspect_wallets[0].slice(0, 6)}...{c.suspect_wallets[0].slice(-4)}
                          {c.suspect_wallets.length > 1 && ` (+${c.suspect_wallets.length - 1})`}
                        </span>
                      ) : (
                        <span className="text-neutral-400">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          c.priority === 'CRITICAL'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                            : c.priority === 'HIGH'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : 'bg-blue-950/80 text-blue-300 border border-blue-800'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-[10px] font-mono text-neutral-300 bg-[#141414] px-2.5 py-1 rounded-full border border-[#262626]">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-neutral-400 font-mono text-[10px]">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => navigate(`/cases/${c.case_id}`)}
                        className="px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-white hover:text-black border border-[#262626] text-[11px] font-semibold text-white transition-all flex items-center gap-1"
                      >
                        <span>Open Docket</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400 font-mono text-xs">
                    No matching cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Case Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-[#0c0c0c] border border-[#222222] rounded-3xl shadow-2xl p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0052FF]" />
                Register New Law Enforcement Case
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-[#1a1a1a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Official Case Identifier (e.g. CASE-2026-CR-001)</label>
                <input
                  type="text"
                  required
                  placeholder="CASE-2026-..."
                  value={newCaseId}
                  onChange={(e) => setNewCaseId(e.target.value)}
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Case Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Investigation into Offshore Layering Gateway"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3 py-2.5 text-white focus:border-[#0052FF] focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Primary Suspect Wallet</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={newWallet}
                    onChange={(e) => setNewWallet(e.target.value)}
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#0052FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Docket Summary & Evidence Brief</label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis of criminal complaint, stolen funds, or suspicious activity report..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Investigator Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes regarding jurisdiction, statutory sections, or VASP summons..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:border-[#0052FF] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-full bg-[#141414] border border-[#262626] text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold shadow-md transition-all"
                >
                  {createMutation.isPending ? 'Registering...' : 'Register Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

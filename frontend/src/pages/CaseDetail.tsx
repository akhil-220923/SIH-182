import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Plus, Search, Network, Building2,
  FileText, SendHorizontal, ShieldAlert, Edit3
} from 'lucide-react';
import { casesService } from '../services/api';
import { BrandShield } from '../components/BrandShield';

export const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [newWalletInput, setNewWalletInput] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesContent, setNotesContent] = useState('');

  const { data: caseItem, isLoading } = useQuery({
    queryKey: ['caseDetail', id],
    queryFn: () => casesService.get(id || 'CASE-DEMO-182'),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => casesService.update(id || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caseDetail', id] });
      setEditingNotes(false);
    },
  });

  const addWalletMutation = useMutation({
    mutationFn: (wallet: string) => casesService.addWallet(id || '', wallet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caseDetail', id] });
      setNewWalletInput('');
    },
  });

  if (isLoading) {
    return <div className="p-16 text-center text-neutral-400 font-mono text-xs">Loading case dossier...</div>;
  }

  if (!caseItem) {
    return <div className="p-16 text-center text-neutral-400 font-mono text-xs">Case not found.</div>;
  }

  const handleStatusChange = (newStatus: string) => {
    updateMutation.mutate({ status: newStatus });
  };

  const handlePriorityChange = (newPriority: string) => {
    updateMutation.mutate({ priority: newPriority });
  };

  const handleSaveNotes = () => {
    updateMutation.mutate({ notes: notesContent });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back button & Header */}
      <div>
        <button
          onClick={() => navigate('/cases')}
          className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white mb-4 transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Management</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-[#0052FF] bg-[#141414] px-3 py-1 rounded-full border border-[#262626]">
                {caseItem.case_id}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Created: {caseItem.created_at ? new Date(caseItem.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">{caseItem.title}</h1>
            <p className="text-xs text-neutral-400 mt-1">{caseItem.description}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Priority Selector */}
            <div>
              <span className="block text-[9px] font-mono text-neutral-400 uppercase mb-1">Priority</span>
              <select
                value={caseItem.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="bg-[#121212] border border-[#262626] rounded-full px-3.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-[#0052FF]"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            {/* Status Selector */}
            <div>
              <span className="block text-[9px] font-mono text-neutral-400 uppercase mb-1">Docket Status</span>
              <select
                value={caseItem.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-[#121212] border border-[#262626] rounded-full px-3.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-[#0052FF]"
              >
                <option value="OPEN">OPEN</option>
                <option value="UNDER_ANALYSIS">UNDER ANALYSIS</option>
                <option value="REVIEW">REVIEW</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Suspect Wallets Section */}
      <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1c]">
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Suspect Cryptocurrency Wallets
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">Target blockchain addresses tagged under this criminal investigation</p>
          </div>
          <span className="text-xs font-mono text-[#0052FF] font-semibold">
            {caseItem.suspect_wallets?.length || 0} Target(s)
          </span>
        </div>

        {/* Add Wallet Form */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add suspect address (e.g. 0x...)"
            value={newWalletInput}
            onChange={(e) => setNewWalletInput(e.target.value)}
            className="flex-1 bg-[#121212] border border-[#262626] rounded-full px-4 py-2.5 text-xs text-white font-mono focus:border-[#0052FF] focus:outline-none"
          />
          <button
            onClick={() => newWalletInput && addWalletMutation.mutate(newWalletInput.trim())}
            disabled={!newWalletInput.trim() || addWalletMutation.isPending}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 disabled:opacity-50 text-black text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>Add Wallet</span>
          </button>
        </div>

        {/* Wallets List */}
        <div className="space-y-2.5">
          {caseItem.suspect_wallets?.map((wallet: string) => (
            <div
              key={wallet}
              className="p-4 rounded-2xl bg-[#121212] border border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-mono text-xs text-white font-bold select-all">{wallet}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/investigate/${wallet}`)}
                  className="px-3.5 py-1.5 rounded-full bg-[#171717] hover:bg-white hover:text-black text-white border border-[#262626] text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Search className="w-3 h-3 text-[#0052FF]" />
                  <span>Analyze</span>
                </button>
                <button
                  onClick={() => navigate(`/graph/${wallet}`)}
                  className="px-3.5 py-1.5 rounded-full bg-[#171717] hover:bg-white hover:text-black text-white border border-[#262626] text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Network className="w-3 h-3 text-sky-400" />
                  <span>Graph</span>
                </button>
                <button
                  onClick={() => navigate(`/attribution/${wallet}`)}
                  className="px-3.5 py-1.5 rounded-full bg-[#171717] hover:bg-white hover:text-black text-white border border-[#262626] text-[11px] font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Building2 className="w-3 h-3 text-emerald-400" />
                  <span>Attribution</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Notes & Legal Directives */}
      <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Edit3 className="w-3.5 h-3.5 text-[#0052FF]" />
            Investigator Docket Notes
          </h2>
          {!editingNotes ? (
            <button
              onClick={() => {
                setNotesContent(caseItem.notes || '');
                setEditingNotes(true);
              }}
              className="text-xs text-[#0052FF] hover:underline font-medium font-mono"
            >
              Edit Notes
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingNotes(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="text-xs text-[#0052FF] hover:underline font-semibold font-mono"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {editingNotes ? (
          <textarea
            rows={4}
            value={notesContent}
            onChange={(e) => setNotesContent(e.target.value)}
            className="w-full bg-[#121212] border border-[#262626] rounded-2xl p-3.5 text-xs text-white focus:border-[#0052FF] focus:outline-none font-mono"
          />
        ) : (
          <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
            {caseItem.notes || 'No investigative notes recorded yet.'}
          </p>
        )}
      </div>

      {/* Fast Legal Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] text-xs">
        <span className="text-neutral-400">Formal law enforcement procedures for this case docket:</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/sahyog')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold shadow-md transition-all"
          >
            <SendHorizontal className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>File SAHYOG Notice</span>
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141414] hover:bg-[#1a1a1a] text-white border border-[#262626] font-semibold transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

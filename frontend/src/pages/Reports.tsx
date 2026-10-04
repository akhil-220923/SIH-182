import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText, Download, Archive, ShieldCheck
} from 'lucide-react';
import { reportService } from '../services/api';
import { Report } from '../types';
import { BrandShield } from '../components/BrandShield';

export const Reports: React.FC = () => {
  const queryClient = useQueryClient();

  const [selectedCaseId, setSelectedCaseId] = useState('CASE-DEMO-182');
  const [targetWallet, setTargetWallet] = useState('0x742d35cc6634c0532925a3b844bc454e4438f44e');
  const [reportTitle, setReportTitle] = useState('Operation CryptoTrace — Official LEA Attribution Report');
  const [notes, setNotes] = useState('Formal evidence dossier compiled for Section 91 CrPC summons.');

  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reportsList'],
    queryFn: () => reportService.list(),
  });

  const generateMutation = useMutation({
    mutationFn: reportService.generate,
    onSuccess: (newReport) => {
      queryClient.invalidateQueries({ queryKey: ['reportsList'] });
      setPreviewReport(newReport);
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate({
      case_id: selectedCaseId.trim(),
      wallet_address: targetWallet.trim(),
      title: reportTitle.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Reports Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#121212] border border-[#222222] text-neutral-300 mb-2">
          <BrandShield className="w-3.5 h-3.5 text-[#0052FF]" />
          <span>Section 65B Indian Evidence Act Compliant</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Courtroom Reports & Evidence Packages
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
          Generate tamper-evident PDF investigation dossiers and cryptographic ZIP packages with SHA-256 manifests.
        </p>
      </div>

      {/* Generator Form */}
      <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] shadow-xl space-y-5">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 pb-3 border-b border-[#1c1c1c]">
          <FileText className="w-4 h-4 text-[#0052FF]" />
          <span>Compile New Investigation Report</span>
        </h2>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Target Case ID</label>
              <input
                type="text"
                required
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#0052FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Suspect Wallet Address</label>
              <input
                type="text"
                required
                value={targetWallet}
                onChange={(e) => setTargetWallet(e.target.value)}
                className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#0052FF] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Official Report Title</label>
            <input
              type="text"
              required
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:border-[#0052FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-300 uppercase font-mono mb-1.5">Investigator Remarks / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:border-[#0052FF] focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={generateMutation.isPending}
              className="px-6 py-3 rounded-full bg-white hover:bg-neutral-200 disabled:opacity-50 text-black font-bold flex items-center gap-2 shadow-lg transition-all active:scale-[0.98]"
            >
              {generateMutation.isPending ? (
                <span>Generating 16-Section ReportLab PDF...</span>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-[#0052FF]" />
                  <span>Generate Report Dossier</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Report Preview Card */}
      {previewReport && (
        <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-[#0052FF] shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c1c1c]">
            <div>
              <span className="text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800 font-bold">
                REPORT COMPILED SUCCESSFULLY
              </span>
              <h3 className="text-lg font-bold text-white mt-2">{previewReport.title}</h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">Report ID: {previewReport.report_id}</p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={reportService.downloadPdfUrl(previewReport.report_id)}
                download
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md transition-all"
              >
                <Download className="w-3.5 h-3.5 text-[#0052FF]" />
                <span>Download PDF</span>
              </a>
              <a
                href={reportService.downloadPackageUrl(previewReport.report_id)}
                download
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141414] hover:bg-[#1f1f1f] text-white border border-[#262626] text-xs font-semibold shadow-md transition-all"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Export ZIP</span>
              </a>
            </div>
          </div>

          <div className="bg-[#121212] p-4 rounded-2xl border border-[#1f1f1f] text-xs space-y-2 font-mono">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="uppercase text-[10px]">SHA-256 Tamper-Evident Integrity Hash:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED CRYPTOGRAPHIC DIGEST
              </span>
            </div>
            <p className="text-[#0052FF] text-[11px] break-all select-all bg-[#0a0a0a] p-3 rounded-xl border border-[#222222]">
              {previewReport.sha256_hash}
            </p>
          </div>
        </div>
      )}

      {/* Generated Reports History Table */}
      <div className="rounded-3xl bg-[#0c0c0c] border border-[#1f1f1f] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1c1c1c] flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Generated Investigation Reports Dossier
          </h3>
          <span className="text-[10px] font-mono text-neutral-400">
            {reports?.length || 0} Reports Archived
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f1f1f] text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider bg-[#0e0e0e]">
                <th className="py-3.5 px-5">Report ID</th>
                <th className="py-3.5 px-5">Case ID</th>
                <th className="py-3.5 px-5">Target Wallet</th>
                <th className="py-3.5 px-5">Generated By</th>
                <th className="py-3.5 px-5">SHA-256 Digest</th>
                <th className="py-3.5 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400 font-mono text-xs">
                    Loading reports archive...
                  </td>
                </tr>
              ) : reports && reports.length > 0 ? (
                reports.map((r) => (
                  <tr key={r.report_id} className="hover:bg-[#121212] transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-white">
                      {r.report_id}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-neutral-200">
                      {r.case_id}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[11px] text-neutral-400">
                      {r.wallet_address ? `${r.wallet_address.slice(0, 6)}...${r.wallet_address.slice(-4)}` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-5 text-neutral-300">
                      {r.generated_by}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[10px] text-neutral-400">
                      {r.sha256_hash ? `${r.sha256_hash.slice(0, 14)}...` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <a
                          href={reportService.downloadPdfUrl(r.report_id)}
                          download
                          title="Download PDF Dossier"
                          className="p-2 rounded-full bg-[#141414] border border-[#262626] hover:bg-white hover:text-black text-neutral-300 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={reportService.downloadPackageUrl(r.report_id)}
                          download
                          title="Download Evidence Package ZIP"
                          className="p-2 rounded-full bg-[#141414] border border-[#262626] hover:bg-white hover:text-black text-neutral-300 transition-all"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400 font-mono text-xs">
                    No reports generated yet.
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

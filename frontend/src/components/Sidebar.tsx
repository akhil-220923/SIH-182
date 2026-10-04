import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Search,
  Network,
  Building2,
  AlertTriangle,
  FolderGit2,
  FileCheck2,
  FileText,
  SendHorizontal,
  History,
  Settings as SettingsIcon,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { BrandShield } from './BrandShield';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
      isActive
        ? 'bg-[#141414] text-white border border-[#2a2a2a] shadow-sm font-semibold'
        : 'text-neutral-400 hover:text-white hover:bg-[#0f0f0f]'
    }`;

  const iconClass = (isActive: boolean) =>
    `w-4 h-4 transition-colors ${isActive ? 'text-[#0052FF]' : 'text-neutral-400'}`;

  const navContent = (
    <>
      {/* Brand Header - Institutional Theme */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1c1c1c] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0c0c0c] border border-[#222222] flex items-center justify-center text-[#0052FF] shadow-inner">
            <BrandShield className="w-5 h-5 text-[#0052FF]" glow />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide text-white uppercase font-mono">TraceVASP</span>
              <span className="text-[10px] font-mono bg-[#0d0d0d] text-[#0052FF] px-2 py-0.5 rounded-full border border-[#222222] font-semibold">
                INTELLIGENCE
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 truncate tracking-tight">VASP Attribution Platform</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#141414]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
        <div>
          <NavLink to="/dashboard" className={navClass} onClick={onClose}>
            {({ isActive }) => (
              <>
                <LayoutDashboard className={iconClass(isActive)} />
                <span>Dashboard Overview</span>
              </>
            )}
          </NavLink>
        </div>

        <div>
          <p className="px-3.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-mono mb-2">
            Intelligence Engine
          </p>
          <div className="space-y-1">
            <NavLink to="/cases" className={navClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <Briefcase className={iconClass(isActive)} />
                  <span>Cases Vault</span>
                </>
              )}
            </NavLink>
            <NavLink to="/investigate" className={navClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <Search className={iconClass(isActive)} />
                  <span>Wallet Attribution</span>
                </>
              )}
            </NavLink>
            <NavLink to="/graph/0x742d35cc6634c0532925a3b844bc454e4438f44e" className={navClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <Network className={iconClass(isActive)} />
                  <span>Fund-Flow Graph</span>
                </>
              )}
            </NavLink>
            <NavLink to="/attribution/0x742d35cc6634c0532925a3b844bc454e4438f44e" className={navClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <Building2 className={iconClass(isActive)} />
                  <span>VASP Clustering</span>
                </>
              )}
            </NavLink>
            <NavLink to="/risk/0x742d35cc6634c0532925a3b844bc454e4438f44e" className={navClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <AlertTriangle className={iconClass(isActive)} />
                  <span>Risk & Typology</span>
                </>
              )}
            </NavLink>
          </div>
        </div>

        <div>
          <p className="px-3.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-mono mb-2">
            Registry & Compliance
          </p>
          <div className="space-y-1">
            <NavLink to="/vasp-registry" className={navClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <FolderGit2 className={iconClass(isActive)} />
                  <span>VASP Registry</span>
                </>
              )}
            </NavLink>
            <NavLink to="/evidence" className={navClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <FileCheck2 className={iconClass(isActive)} />
                  <span>Evidence Vault</span>
                </>
              )}
            </NavLink>
            <NavLink to="/reports" className={navClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <FileText className={iconClass(isActive)} />
                  <span>Legal Reports</span>
                </>
              )}
            </NavLink>
            <NavLink to="/sahyog" className={navClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <SendHorizontal className={iconClass(isActive)} />
                  <span>SAHYOG Integration</span>
                </>
              )}
            </NavLink>
          </div>
        </div>

        <div>
          <p className="px-3.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-mono mb-2">
            Enterprise Governance
          </p>
          <div className="space-y-1">
            <NavLink to="/audit-logs" className={navClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <History className={iconClass(isActive)} />
                  <span>Immutable Audit Trail</span>
                </>
              )}
            </NavLink>
            <NavLink to="/settings" className={navClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <SettingsIcon className={iconClass(isActive)} />
                  <span>API & Settings</span>
                </>
              )}
            </NavLink>
          </div>
        </div>
      </div>

      {/* Footer Info - Security Badge */}
      <div className="p-3.5 border-t border-[#1c1c1c] text-[11px] bg-[#080808] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-neutral-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0052FF]" />
          <span className="font-mono text-[10px]">SOC 2 TYPE II</span>
        </div>
        <span className="text-emerald-400 flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          ACTIVE
        </span>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-[#1c1c1c] bg-[#050505] flex-col h-screen shrink-0 select-none">
        {navContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <aside className="relative w-72 max-w-[85vw] border-r border-[#1c1c1c] bg-[#050505] flex flex-col h-full z-10 select-none shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};

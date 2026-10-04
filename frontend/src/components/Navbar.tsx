import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Database, Sparkles, User as UserIcon, Menu } from 'lucide-react';
import { authService, searchService } from '../services/api';
import { User } from '../types';
import { BrandShield } from './BrandShield';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Read stored user
  const storedUserJson = localStorage.getItem('tracevasp_user');
  const user: User | null = storedUserJson ? JSON.parse(storedUserJson) : null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    if (q.startsWith('0x') && q.length === 42) {
      navigate(`/investigate/${q}`);
      return;
    }

    try {
      setIsSearching(true);
      const res = await searchService.globalSearch(q);
      setSearchResults(res.results);
    } catch {
      // Direct fallback
      navigate(`/investigate/${q}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickLoadDemo = () => {
    navigate('/investigate/0x742d35cc6634c0532925a3b844bc454e4438f44e');
  };

  return (
    <header className="h-16 border-b border-[#1c1c1c] bg-[#050505]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0 z-30 gap-2">
      {/* Mobile Toggle + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-lg">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#141414] focus:outline-none shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-full max-w-[190px] xs:max-w-xs sm:max-w-sm md:max-w-md">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search wallet, tx, case..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#222222] rounded-full pl-9 pr-3 py-1.5 sm:py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] transition-all font-mono"
              />
            </div>
          </form>

          {/* Search Results Dropdown */}
          {searchResults && (
            <div className="absolute top-12 left-0 right-0 bg-[#0d0d0d] border border-[#222222] rounded-2xl shadow-2xl p-3.5 z-50 text-xs space-y-2.5 backdrop-blur-xl max-w-sm">
              <div className="flex justify-between items-center text-neutral-400 pb-2 border-b border-[#1f1f1f]">
                <span className="font-semibold text-[10px] tracking-wider uppercase font-mono text-neutral-400">Search Results</span>
                <button
                  onClick={() => setSearchResults(null)}
                  className="text-[10px] text-neutral-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
              {searchResults.wallets?.length > 0 && (
                <div>
                  <p className="text-[10px] text-[#0052FF] font-semibold mb-1 uppercase font-mono">Wallets</p>
                  {searchResults.wallets.map((w: any) => (
                    <div
                      key={w.address}
                      onClick={() => {
                        navigate(`/investigate/${w.address}`);
                        setSearchResults(null);
                      }}
                      className="cursor-pointer hover:bg-neutral-900/90 p-2 rounded-xl font-mono truncate text-neutral-200 transition-colors"
                    >
                      {w.address} ({w.label || w.risk_level})
                    </div>
                  ))}
                </div>
              )}
              {searchResults.cases?.length > 0 && (
                <div>
                  <p className="text-[10px] text-[#0052FF] font-semibold mb-1 uppercase font-mono">Cases</p>
                  {searchResults.cases.map((c: any) => (
                    <div
                      key={c.case_id}
                      onClick={() => {
                        navigate(`/cases/${c.case_id}`);
                        setSearchResults(null);
                      }}
                      className="cursor-pointer hover:bg-neutral-900/90 p-2 rounded-xl text-neutral-200 transition-colors"
                    >
                      {c.case_id} — {c.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Demo Button */}
        <button
          onClick={handleQuickLoadDemo}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all active:scale-[0.98] shrink-0"
          title="Quick load demo case CASE-DEMO-182"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0052FF]" />
          <span className="hidden sm:inline">Load Demo Case</span>
          <span className="sm:hidden text-[10px]">Demo</span>
        </button>

        {/* Data Source Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d0d0d] border border-[#222222] text-[11px] font-mono text-neutral-300 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] animate-pulse"></span>
          <span className="text-neutral-500 uppercase">MODE:</span>
          <span className="text-[#0052FF] font-bold">LIVE APIS & DEMO</span>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#1f1f1f] shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#141414] border border-[#222222] flex items-center justify-center text-neutral-300">
            <UserIcon className="w-3.5 h-3.5 text-neutral-300" />
          </div>
          <div className="text-left hidden xl:block">
            <p className="text-xs font-medium text-white leading-tight">
              {user?.full_name || 'Insp. Rajesh Kumar'}
            </p>
            <p className="text-[10px] text-neutral-400 font-mono leading-tight">
              {user?.badge_number || 'LEA-KA-5419'} • <span className="text-[#0052FF] font-semibold">{user?.role || 'INVESTIGATOR'}</span>
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={authService.logout}
          className="p-1.5 sm:p-2 text-neutral-400 hover:text-rose-400 rounded-full hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors shrink-0"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

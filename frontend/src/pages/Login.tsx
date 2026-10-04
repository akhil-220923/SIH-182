import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/api';
import { BrandShield } from '../components/BrandShield';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('investigator@tracevasp.demo');
  const [password, setPassword] = useState('Demo@12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setRoleCredentials = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError(null);
  };

  return (
    <div className="min-h-screen w-screen bg-[#000000] flex flex-col justify-center items-center px-4 relative overflow-hidden select-none font-sans text-white">
      {/* Subtle radial glow matching dark aesthetic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#0052FF]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <BrandShield className="w-12 h-12 text-[#0052FF]" glow />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-mono">
              TraceVASP
            </h1>
            <span className="text-xs font-mono bg-[#111111] text-[#0052FF] px-2.5 py-0.5 rounded-full border border-[#262626] font-semibold">
              INTELLIGENCE
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-2 max-w-xs mx-auto">
            Institutional Multi-Hop VASP Attribution & Digital Forensics Console
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0b0b0b] border border-[#222222] rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1c1c1c]">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#0052FF]" />
              Authorized Access
            </span>
            <span className="text-[10px] text-neutral-400 font-mono bg-[#121212] px-2.5 py-1 rounded-full border border-[#222222]">
              FIPS 140-2 LEVEL 3
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1.5 uppercase font-mono">
                Official Identifier / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investigator@tracevasp.demo"
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1.5 uppercase font-mono">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] transition-all font-mono"
                />
              </div>
            </div>

            {/* Signature White Pill CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-5 bg-white hover:bg-neutral-200 text-black rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Enter Enterprise Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-7 pt-5 border-t border-[#1c1c1c]">
            <p className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider mb-2.5">
              Instant Demo Access:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRoleCredentials('investigator@tracevasp.demo', 'Demo@12345')}
                className="py-2 px-2.5 rounded-full bg-[#121212] border border-[#262626] hover:border-[#0052FF] text-neutral-300 hover:text-white text-[10px] font-mono text-center transition-all"
              >
                Investigator
              </button>
              <button
                type="button"
                onClick={() => setRoleCredentials('supervisor@tracevasp.demo', 'Supervisor@12345')}
                className="py-2 px-2.5 rounded-full bg-[#121212] border border-[#262626] hover:border-[#0052FF] text-neutral-300 hover:text-white text-[10px] font-mono text-center transition-all"
              >
                Supervisor
              </button>
              <button
                type="button"
                onClick={() => setRoleCredentials('admin@tracevasp.demo', 'Admin@12345')}
                className="py-2 px-2.5 rounded-full bg-[#121212] border border-[#262626] hover:border-[#0052FF] text-neutral-300 hover:text-white text-[10px] font-mono text-center transition-all"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Security & Compliance Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-neutral-400 font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0052FF]" />
            SOC 2 Type II
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0052FF]" />
            ISO 27001
          </span>
          <span>•</span>
          <span>256-Bit HSM</span>
        </div>
      </div>
    </div>
  );
};

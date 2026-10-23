import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { subscribeNewsletter } from '../lib/supabase';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setResponseMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await subscribeNewsletter(email);
      setStatus('success');
      setResponseMsg(res.message);
      setEmail('');
    } catch {
      setStatus('error');
      setResponseMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#EDF4F0] text-slate-900 py-12 sm:py-16 border-b border-[#DDE7E1] font-sans">
      {/* Subtle warm ambient waves glow in background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#4A6B53_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#88C49A]/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Side: Icon + Headline */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4A6B53] text-white flex items-center justify-center shrink-0 shadow-md mt-1 border border-[#5C7F66]">
              <Mail className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#4A6B53]">
                STAY UPDATED
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-[#172E20] tracking-tight">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-xs sm:text-sm text-[#3E5C49]">
                Get the latest products, offers and updates directly in your inbox.
              </p>
            </div>
          </div>

          {/* Right Side: Integrated Input + Subscribe Button */}
          <div className="w-full lg:max-w-md">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#D5E3DA] text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#4A6B53] focus:ring-1 focus:ring-[#4A6B53] transition-all shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 rounded-xl bg-[#4A6B53] hover:bg-[#395642] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                {status === 'loading' ? 'Joining...' : 'Subscribe'}
              </button>
            </form>

            {status === 'success' && (
              <div className="mt-2 text-xs text-[#2D4D36] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#4A6B53]" />
                <span>{responseMsg}</span>
              </div>
            )}
            {status === 'error' && (
              <p className="mt-2 text-xs text-rose-600 font-medium">{responseMsg}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

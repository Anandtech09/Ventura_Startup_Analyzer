import React from "react";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

interface FooterProps {
  onShowTerms: () => void;
  onShowPrivacy: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowTerms, onShowPrivacy }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-black/60 backdrop-blur-2xl mt-16">
      <div className="max-w-[1280px] mx-auto px-6 py-10 md:py-12 grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 rounded-2xl px-4 py-2 bg-white/5 border border-white/10">
            <img src="/images/brand/logo.png" alt="Ventura Logo" className="h-8" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
                Ventura
              </span>
            </div>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 max-w-md leading-relaxed">
            Ventura helps you move from raw intuition to rigorously tested startup
            blueprints — combining market intelligence, competitive insight, and
            AI‑generated go‑to‑market surfaces.
          </p>
        </div>

        <div className="space-y-3 text-xs mt-4">
          <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
            Navigation
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onShowTerms}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={onShowPrivacy}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
            >
              Privacy Policy
            </button>
          </div>
          <p className="text-[11px] text-zinc-600 max-w-xs">
            By using Ventura you agree that insights are directional, not legal or
            financial advice.
          </p>
        </div>

        <div className="space-y-3 text-xs mt-4">
          <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
            Contact
          </h4>
          <div className="space-y-2 text-zinc-400">
            <div className="flex items-center gap-3">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 9400628129</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>hello@ventura.studio</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-3.5 h-3.5 mt-0.5 text-emerald-400" />
              <span>Market Street, Floor 5<br />Trivandrum, Kerala, IND</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 pb-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-700 text-[12px] font-mono font-bold uppercase tracking-widest">
            &copy; {currentYear} VENTURA INTELLIGENCE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-[12px] font-mono font-bolder text-zinc-500 uppercase tracking-widest">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            End-to-End Encrypted
          </div>
        </div>
    </footer>
  );
};

export default Footer;


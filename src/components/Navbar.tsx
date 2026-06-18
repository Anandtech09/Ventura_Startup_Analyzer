import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { View } from "../types";
import { cn } from "../utils";

interface NavbarProps {
  view: View;
  onNavClick: (nextView: View) => void;
}

export default function Navbar({ view, onNavClick }: NavbarProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavClick = (nextView: View) => {
    onNavClick(nextView);
    setIsNavOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#04080c] backdrop-blur-2xl">
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
        <button
          className="flex items-center gap-4 cursor-pointer group bg-transparent border-none text-left"
          onClick={() => handleNavClick("home")}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/images/brand/logo.png" alt="Ventura Logo" className="h-9" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-emerald-500/0 group-hover:bg-emerald-500/15 transition-colors" />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-zinc-200">
                VENTURA
              </span>
              <span className="text-[9px] font-mono tracking-[0.24em] uppercase text-zinc-500">
                Data-driven strategy
              </span>
            </div>
          </div>
        </button>
        <div className="hidden md:flex items-center gap-10">
          <button
            onClick={() => handleNavClick("home")}
            className={cn(
              "text-xs font-mono uppercase tracking-[0.2em] transition-all hover:text-emerald-400 bg-transparent border-none cursor-pointer",
              view === "home" ? "text-emerald-400" : "text-zinc-500"
            )}
          >
            Analyze
          </button>
          <button
            onClick={() => handleNavClick("history")}
            className={cn(
              "text-xs font-mono uppercase tracking-[0.2em] transition-all hover:text-emerald-400 bg-transparent border-none cursor-pointer",
              view === "history" ? "text-emerald-400" : "text-zinc-500"
            )}
          >
            Archive
          </button>
          <button
            onClick={() => handleNavClick("privacy")}
            className={cn(
              "text-xs font-mono uppercase tracking-[0.2em] transition-all hover:text-emerald-400 bg-transparent border-none cursor-pointer",
              view === "privacy" ? "text-emerald-400" : "text-zinc-500"
            )}
          >
            Privacy
          </button>
          <button
            onClick={() => handleNavClick("terms")}
            className={cn(
              "text-xs font-mono uppercase tracking-[0.2em] transition-all hover:text-emerald-400 bg-transparent border-none cursor-pointer",
              view === "terms" ? "text-emerald-400" : "text-zinc-500"
            )}
          >
            Terms
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-400 tracking-[0.2em]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SECURED ACCESS
          </div>
        </div>
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => setIsNavOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {isNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {isNavOpen && (
        <div className="md:hidden border-t border-white/5 bg-black/95">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col gap-3 text-sm">
            <button
              onClick={() => handleNavClick("home")}
              className={cn(
                "flex justify-between items-center py-2 text-[11px] font-mono uppercase tracking-[0.24em] bg-transparent border-none cursor-pointer text-left w-full",
                view === "home" ? "text-emerald-400" : "text-zinc-400"
              )}
            >
              Analyze
            </button>
            <button
              onClick={() => handleNavClick("history")}
              className={cn(
                "flex justify-between items-center py-2 text-[11px] font-mono uppercase tracking-[0.24em] bg-transparent border-none cursor-pointer text-left w-full",
                view === "history" ? "text-emerald-400" : "text-zinc-400"
              )}
            >
              Archive
            </button>
            <button
              onClick={() => handleNavClick("privacy")}
              className={cn(
                "flex justify-between items-center py-2 text-[11px] font-mono uppercase tracking-[0.24em] bg-transparent border-none cursor-pointer text-left w-full",
                view === "privacy" ? "text-emerald-400" : "text-zinc-400"
              )}
            >
              Privacy
            </button>
            <button
              onClick={() => handleNavClick("terms")}
              className={cn(
                "flex justify-between items-center py-2 text-[11px] font-mono uppercase tracking-[0.24em] bg-transparent border-none cursor-pointer text-left w-full",
                view === "terms" ? "text-emerald-400" : "text-zinc-400"
              )}
            >
              Terms
            </button>
            <div className="mt-2 flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-400 tracking-[0.2em]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SECURED ACCESS
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

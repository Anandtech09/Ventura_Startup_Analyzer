import React from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface HomeViewProps {
  name: string;
  setName: (name: string) => void;
  idea: string;
  setIdea: (idea: string) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent, isFull?: boolean) => void;
}

export default function HomeView({
  name,
  setName,
  idea,
  setIdea,
  loading,
  error,
  onSubmit,
}: HomeViewProps) {
  return (
    <motion.div 
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-24 relative">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-10 bg-gradient-to-b from-white via-white to-zinc-700 bg-clip-text text-transparent leading-[0.85] pb-2">
          Architect your <br /> 
          <span className="text-zinc-800">next legacy.</span>
        </h1>
        
        <p className="text-zinc-500 text-xl max-w-2xl mx-auto font-light leading-relaxed tracking-tight">
          Ventura transforms raw ideas into <span className="text-zinc-300">strategic blueprints</span>. 
          We don't just analyze data; we craft your path to market dominance.
        </p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest flex items-center gap-4 backdrop-blur-xl"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
          {error}
        </motion.div>
      )}

      <form onSubmit={(e) => onSubmit(e, true)} className="space-y-12">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-emerald-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
          <div className="relative bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="space-y-10 relative z-10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Module: Branding</label>
                  <span className="text-[8px] font-mono text-zinc-500 tracking-widest">ID: V-01</span>
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="PROPOSED STARTUP NAME (OPTIONAL)"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:border-emerald-500/30 transition-all text-lg placeholder:text-zinc-600 font-light tracking-tight"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Module: Strategy Core</label>
                  <span className="text-[8px] font-mono text-zinc-500 tracking-widest">ID: V-02</span>
                </div>
                <textarea 
                  required
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="INPUT VISION STATEMENT OR PROBLEM DESCRIPTION..."
                  rows={6}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:border-emerald-500/30 transition-all text-lg resize-none placeholder:text-zinc-600 leading-relaxed font-light tracking-tight"
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full h-20 bg-white text-black font-bold rounded-[2.5rem] flex items-center justify-center gap-4 hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[0_20px_60px_rgba(0,0,0,0.5)] group overflow-hidden relative cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity" />
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-mono uppercase tracking-[0.4em]">Synthesizing Analysis</span>
            </>
          ) : (
            <>
              <span className="relative z-10 text-xs font-mono uppercase tracking-[0.4em]">Initialize Strategic Synthesis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

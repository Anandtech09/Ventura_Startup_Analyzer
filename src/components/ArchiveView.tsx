import React from "react";
import { ShieldCheck, Rocket, Trash2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { StartupHistory } from "../types";

interface ArchiveViewProps {
  history: StartupHistory[];
  onSelectStartup: (item: StartupHistory) => void;
  onDeleteClick: (id: number) => void;
}

export default function ArchiveView({
  history,
  onSelectStartup,
  onDeleteClick,
}: ArchiveViewProps) {
  return (
    <motion.div 
      key="history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-white">Archive</h2>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-2">Intellectual Property Vault</p>
        </div>
        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          {history.length} ACTIVE BLUEPRINTS
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-white rounded-[3rem] bg-black">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-zinc-600">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-400 mb-2">Vault is Empty</h3>
          <p className="text-zinc-600 font-light">Initialize your first strategic synthesis to populate the archive.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              className="group relative bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl hover:bg-zinc-900/40 hover:border-emerald-500/30 transition-all duration-500 cursor-pointer shadow-2xl"
              onClick={() => onSelectStartup(item)}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-2xl font-bold text-emerald-400 relative z-10">
                    {(item.name || item.analysis?.suggestedNames?.[0] || "V").charAt(0).toUpperCase()}
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(item.id);
                  }}
                  className="p-3 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white cursor-pointer border-none"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors line-clamp-1">{item.name}</h3>
              <p className="text-zinc-500 text-xs font-light leading-relaxed mb-10 line-clamp-3 italic">"{item.idea}"</p>
              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()}</span>
                <div className="flex items-center gap-2 text-emerald-500 group-hover:translate-x-1 transition-transform">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest">ACCESS INTEL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

import React from "react";
import { 
  ChevronLeft, 
  Globe, 
  Download, 
  Palette, 
  RefreshCw, 
  Loader2, 
  History, 
  Eye 
} from "lucide-react";
import { motion } from "motion/react";
import { AnalysisData, AnalysisVersion } from "../types";
import { cn } from "../utils";

interface WebsitePreviewViewProps {
  name: string;
  websiteHtml: string;
  websiteHistory: any[];
  previewingUiId: number | null;
  fetchUiVersion: (id: number) => void;
  downloadCode: (html?: string, fileName?: string) => void;
  uiSuggestion: string;
  setUiSuggestion: (val: string) => void;
  refineUi: () => void;
  isGeneratingUi: boolean;
  analysisHistory: AnalysisVersion[];
  setAnalysis: (analysis: AnalysisData) => void;
  onBackToAnalysis: () => void;
}

export default function WebsitePreviewView({
  name,
  websiteHtml,
  websiteHistory,
  previewingUiId,
  fetchUiVersion,
  downloadCode,
  uiSuggestion,
  setUiSuggestion,
  refineUi,
  isGeneratingUi,
  analysisHistory,
  setAnalysis,
  onBackToAnalysis,
}: WebsitePreviewViewProps) {
  return (
    <motion.div 
      key="website"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToAnalysis}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Website Preview</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest pr-3 border-r border-white/10">AI-Generated Landing Page</p>
              {websiteHistory.length > 0 && (
                <div className="flex items-center gap-1.5">
                  {websiteHistory.slice().reverse().map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => fetchUiVersion(v.id)}
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center text-[8px] font-mono font-bold transition-all border cursor-pointer",
                        previewingUiId === v.id 
                          ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                          : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/30 hover:text-white"
                      )}
                    >
                      {websiteHistory.length - i}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => downloadCode(websiteHtml)}
            className="px-6 py-3 rounded-2xl bg-white text-black font-bold text-sm flex items-center gap-2 hover:bg-emerald-400 transition-all cursor-pointer border-none"
          >
            <Download className="w-4 h-4" />
            Download Code
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl h-[700px] border-[12px] border-zinc-900 relative">
            <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-900 flex items-center px-4 gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="ml-4 bg-zinc-800 rounded-md px-3 py-0.5 text-[10px] text-zinc-500 flex items-center gap-2">
                <Globe className="w-3 h-3" />
                {name.toLowerCase().replace(/\s+/g, "")}.ventura.ai
              </div>
            </div>
            <iframe 
              srcDoc={websiteHtml} 
              sandbox="allow-scripts allow-same-origin" 
              className="w-full h-full pt-8 border-none" 
              title="Website Preview" 
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] mb-4 flex items-center gap-2 text-emerald-400">
              <Palette className="w-4 h-4" />
              Refine Interface
            </h3>
            <textarea 
              value={uiSuggestion}
              onChange={(e) => setUiSuggestion(e.target.value)}
              placeholder="E.G. RESTRUCTURE HERO WITH GLOSSY GRADIENTS..."
              className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-white placeholder:text-zinc-700 h-32 focus:outline-none focus:border-emerald-500/30 transition-all resize-none mb-6"
            />
            <button 
              onClick={refineUi}
              disabled={isGeneratingUi}
              className="w-full py-4 bg-emerald-500 text-black font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border-none"
            >
              {isGeneratingUi ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Update Blueprint
            </button>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] mb-8 flex items-center gap-2 text-zinc-400">
              <History className="w-4 h-4 text-blue-400" />
              Analysis History
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {analysisHistory.map((v) => (
                <div 
                  key={v.id}
                  className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/20 transition-all cursor-pointer"
                  onClick={() => setAnalysis(v.analysis)}
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                      {v.analysis.benchmarking ? "Class-A Update" : "Core Revision"}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-700 uppercase">{new Date(v.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] mb-8 flex items-center gap-2 text-zinc-400">
              <History className="w-4 h-4 text-blue-400" />
              UI Iterations
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {websiteHistory.length > 0 ? (
                websiteHistory.map((v, i) => (
                  <div 
                    key={v.id}
                    className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/20 transition-all flex items-center justify-between cursor-pointer"
                    onClick={() => fetchUiVersion(v.id)}
                  >
                    <div className="flex flex-col gap-2 overflow-hidden">
                      <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                        V-{(websiteHistory.length - i).toString().padStart(2, "0")} Interface
                      </span>
                      <span className="text-[8px] font-mono text-zinc-700 truncate uppercase">
                        {new Date(v.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); fetchUiVersion(v.id); }} 
                        className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 cursor-pointer border-none"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); downloadCode(v.html, `version-${v.id}.html`); }} 
                        className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer border-none"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-white/5 rounded-2xl">
                  <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">No interface history.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

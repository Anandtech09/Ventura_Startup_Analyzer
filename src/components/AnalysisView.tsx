import React from "react";
import { 
  Rocket, 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Users, 
  History,
  Loader2,
  Sparkles,
  RefreshCw,
  Globe
} from "lucide-react";
import { motion } from "motion/react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Tooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { AnalysisData } from "../types";
import { cn } from "../utils";

interface AnalysisViewProps {
  name: string;
  setName: (name: string) => void;
  analysis: AnalysisData;
  currentStartupId: number | null;
  logoUrl: string | null;
  isGeneratingLogo: boolean;
  isDeepDiving: boolean;
  isGeneratingUi: boolean;
  runDeepDive: () => void;
  generateUi: () => void;
  websiteHistory: any[];
  previewingUiId: number | null;
  fetchUiVersion: (id: number) => void;
  generateLogo: (prompt: string, startupId: number, companyName?: string) => void;
}

export default function AnalysisView({
  name,
  setName,
  analysis,
  currentStartupId,
  logoUrl,
  isGeneratingLogo,
  isDeepDiving,
  isGeneratingUi,
  runDeepDive,
  generateUi,
  websiteHistory,
  previewingUiId,
  fetchUiVersion,
  generateLogo,
}: AnalysisViewProps) {
  const chartData = analysis.benchmarking ? [
    { subject: "Innovation", value: analysis.benchmarking.innovation || 0, fullMark: 10 },
    { subject: "Market Need", value: analysis.benchmarking.marketNeed || 0, fullMark: 10 },
    { subject: "Ease of Entry", value: analysis.benchmarking.easeOfEntry || 0, fullMark: 10 },
    { subject: "Scalability", value: analysis.benchmarking.scalability || 0, fullMark: 10 },
  ] : [];

  return (
    <motion.div 
      key="analysis"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-16"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 pb-12 border-b border-white/5 relative">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-all duration-500 overflow-hidden shadow-2xl relative z-10">
              {logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" /> : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-blue-500/20">
                  <span className="text-4xl font-bold text-white">{name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              {isGeneratingLogo && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                {analysis.benchmarking ? "Class-A Intelligence" : "Core Analysis"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-5xl font-bold tracking-tighter text-white">{name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <History className="w-3.5 h-3.5" />
                  Ref ID: VN-{(currentStartupId || 0).toString().padStart(4, "0")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-4">
            {analysis.competitors && (
              <button 
                onClick={runDeepDive}
                disabled={isDeepDiving}
                className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20 cursor-pointer"
              >
                {isDeepDiving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                Deep Dive
              </button>
            )}
            <button 
              onClick={generateUi}
              disabled={isGeneratingUi}
              className="px-8 py-4 rounded-2xl bg-emerald-500 text-black font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/20 cursor-pointer"
            >
              {isGeneratingUi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              Build UI
            </button>
          </div>
          {websiteHistory.length > 0 && (() => {
            const total = websiteHistory.length;
            const shown = websiteHistory.slice(0, Math.min(4, total)).reverse();
            const startNum = total - shown.length + 1;
            return (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] mr-1">UI Builds:</span>
                {shown.map((v: any, i: number) => (
                  <button
                    key={v.id}
                    onClick={() => fetchUiVersion(v.id)}
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-all border cursor-pointer",
                      previewingUiId === v.id
                        ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                        : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/30 hover:text-emerald-400 hover:bg-emerald-500/10"
                    )}
                    title={`View V${startNum + i}`}
                  >
                    {startNum + i}
                  </button>
                ))}
                {total > 4 && (
                  <button
                    onClick={() => fetchUiVersion(websiteHistory[0].id)}
                    className="px-2.5 h-7 rounded-lg flex items-center justify-center text-[9px] font-mono font-bold transition-all border bg-white/5 border-white/10 text-zinc-400 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                    title="View all versions"
                  >
                    +{total - 4} more
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Executive Summary</h3>
            </div>
            <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Sparkles className="w-32 h-32" />
              </div>
              <p className="text-zinc-400 text-lg leading-relaxed font-light">
                {analysis.summary}
              </p>
            </div>
          </section>

          {analysis.competitors && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Competitor Landscape</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysis.competitors.map((comp, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5 }}
                    className="bg-zinc-900/20 border border-white/5 rounded-3xl p-8 hover:bg-zinc-900/40 hover:border-white/10 transition-all"
                  >
                    <h4 className="font-bold text-xl mb-3">{comp.name}</h4>
                    <p className="text-sm text-zinc-500 mb-6 leading-relaxed line-clamp-2">{comp.description}</p>
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest block mb-1">Strength</span>
                        <p className="text-xs text-zinc-300 line-clamp-2">{comp.strength}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest block mb-1">Weakness</span>
                        <p className="text-xs text-zinc-300 line-clamp-2">{comp.weakness}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {analysis.deepDive && (
            <section className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
                  <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                    <PieChartIcon className="w-5 h-5 text-blue-400" />
                    Market Dominance
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analysis.deepDive.marketShare}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analysis.deepDive.marketShare.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "#ffffff", 
                            border: "none", 
                            borderRadius: "1rem",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                            padding: "1rem 1.5rem",
                            maxWidth: "300px",
                            whiteSpace: "normal"
                          }}
                          itemStyle={{ color: "#18181b", fontWeight: "bold" }}
                          labelStyle={{ display: "none" }}
                          formatter={(value: any, name: any) => [value, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 space-y-2">
                    {analysis.deepDive.marketShare.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5] }} />
                          <span className="text-zinc-400">{entry.name}</span>
                        </div>
                        <span className="font-bold text-zinc-200">{entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
                  <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    Feature Comparison
                  </h3>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {analysis.deepDive.featureMatrix.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                        <span className="text-xs font-medium truncate pr-2">{f.feature}</span>
                        <div className="flex gap-2 shrink-0">
                          {Object.entries(f.competitors).map(([name, has]) => (
                            <div 
                              key={name}
                              className={cn("w-2.5 h-2.5 rounded-full", has ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-800")}
                              title={name}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                  <ZapIcon className="w-5 h-5 text-yellow-400" />
                  Strategic Attack Angles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysis.deepDive.attackAngles.map((a, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="font-bold text-white mb-2">{a.name}</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">{a.angle}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-12">
          {analysis.benchmarking && (
            <section>
              <div className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-8 text-center">Benchmarking</h3>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#222" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 10, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar name="Idea" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          )}

          <section>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                The Edge
              </h3>
              <ul className="space-y-6">
                {analysis.uniqueSuggestions.map((s, i) => (
                  <li key={i} className="flex gap-4 group">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <span className="text-[10px] font-bold text-emerald-500">{i + 1}</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed font-light">{s}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>

      {analysis.suggestedNames && analysis.suggestedNames.length > 0 && (
        <section className="pt-12 border-t border-white/5">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <Rocket className="w-5 h-5 text-emerald-400" />
            Brand Identity Suggestions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analysis.suggestedNames.map((n, i) => (
              <div key={n} className="relative group">
                <button 
                  onClick={() => setName(n)}
                  className={cn(
                    "w-full p-6 rounded-2xl border transition-all text-center cursor-pointer",
                    name === n ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/5 hover:border-white/20 text-zinc-400"
                  )}
                >
                  <span className="text-lg font-bold block group-hover:scale-105 transition-transform">{n}</span>
                </button>
                {name === n && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateLogo(analysis.logoPrompt, currentStartupId!, n);
                    }}
                    className="absolute -top-2 -right-2 p-2 bg-emerald-500 text-black rounded-full shadow-lg hover:bg-emerald-400 transition-all z-10 cursor-pointer border-none"
                    title="Generate logo for this name"
                  >
                    <RefreshCw className={cn("w-3 h-3", isGeneratingLogo && "animate-spin")} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}

// Small helper inside this file to replicate Recharts or custom icons if they need separate name
function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

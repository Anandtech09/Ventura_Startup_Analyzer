import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";

// Types
import { View, AnalysisData, AnalysisVersion, StartupHistory } from "./types";

// Components
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import Footer from "./components/Footer.tsx";
import BackgroundEffects from "./components/BackgroundEffects";
import DeleteModal from "./components/DeleteModal";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import AnalysisView from "./components/AnalysisView";
import WebsitePreviewView from "./components/WebsitePreviewView";
import ArchiveView from "./components/ArchiveView";

export default function App() {
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [history, setHistory] = useState<StartupHistory[]>([]);
  const [view, setView] = useState<View>("home");
  const [error, setError] = useState<string | null>(null);
  const [currentStartupId, setCurrentStartupId] = useState<number | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [websiteHtml, setWebsiteHtml] = useState<string | null>(null);
  const [websiteHistory, setWebsiteHistory] = useState<any[]>([]);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisVersion[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [uiSuggestion, setUiSuggestion] = useState("");
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [isGeneratingUi, setIsGeneratingUi] = useState(false);
  const [isDeepDiving, setIsDeepDiving] = useState(false);
  const [previewingUiId, setPreviewingUiId] = useState<number | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch history", err);
      setHistory([]);
    }
  };

  const fetchWebsiteHistory = async (startupId: number) => {
    try {
      const res = await fetch(`/api/website-history/${startupId}`);
      const data = await res.json();
      setWebsiteHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch website history", err);
    }
  };

  const fetchUiVersion = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/website-version/${id}`);
      const data = await res.json();
      if (data.html) {
        setWebsiteHtml(data.html);
        setPreviewingUiId(id);
        setView("website");
      }
    } catch (err) {
      console.error("Failed to fetch UI version", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysisHistory = async (startupId: number) => {
    try {
      const res = await fetch(`/api/analysis-history/${startupId}`);
      const data = await res.json();
      setAnalysisHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch analysis history", err);
    }
  };

  const runDeepDive = async () => {
    if (!currentStartupId || !analysis?.competitors) return;
    setIsDeepDiving(true);
    try {
      const res = await fetch("/api/competitor-deep-dive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          competitors: analysis.competitors, 
          idea, 
          startupId: currentStartupId 
        }),
      });
      const data = await res.json();
      setAnalysis(prev => prev ? { ...prev, deepDive: data } : null);
      fetchAnalysisHistory(currentStartupId);
    } catch (err) {
      console.error("Deep dive failed", err);
    } finally {
      setIsDeepDiving(false);
    }
  };

  const handleDeleteHistory = async (id: number) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setHistory(prev => prev.filter(item => item.id !== id));
        setIsDeleting(null);
      } else {
        throw new Error(data.error || "Failed to delete item");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete item");
    }
  };

  const handleAnalyze = async (e: React.FormEvent, isFull: boolean = true) => {
    if (e) e.preventDefault();
    if (!idea) return;

    setLoading(true);
    setError(null);
    setLogoUrl(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, idea, full: isFull, id: currentStartupId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setAnalysis(data);
      setCurrentStartupId(data.id);
      setName(data.name);
      setView("analysis");
      fetchHistory();
      if (data.id) {
        fetchWebsiteHistory(data.id);
        fetchAnalysisHistory(data.id);
      }
      
      generateLogo(data.logoPrompt, data.id, data.name);
    } catch (err: any) {
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const generateLogo = async (prompt: string, startupId: number, companyName?: string) => {
    setIsGeneratingLogo(true);
    try {
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, startupId, name: companyName || name }),
      });
      const data = await res.json();
      setLogoUrl(data.imageUrl);
    } catch (err) {
      console.error("Logo generation failed", err);
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const generateUi = async () => {
    if (!currentStartupId || !analysis) return;
    setIsGeneratingUi(true);
    try {
      const res = await fetch("/api/generate-ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, name, startupId: currentStartupId }),
      });
      const data = await res.json();
      setWebsiteHtml(data.html);
      
      const historyRes = await fetch(`/api/website-history/${currentStartupId}`);
      const historyData = await historyRes.json();
      setWebsiteHistory(historyData);
      
      if (historyData.length > 0) {
        setPreviewingUiId(historyData[0].id);
      }
      
      setView("website");
    } catch (err) {
      console.error("UI generation failed", err);
    } finally {
      setIsGeneratingUi(false);
    }
  };

  const refineUi = async () => {
    if (!websiteHtml || !uiSuggestion) return;
    setIsGeneratingUi(true);
    try {
      const res = await fetch("/api/refine-ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentHtml: websiteHtml, suggestion: uiSuggestion, startupId: currentStartupId }),
      });
      const data = await res.json();
      setWebsiteHtml(data.html);
      
      const historyRes = await fetch(`/api/website-history/${currentStartupId}`);
      const historyData = await historyRes.json();
      setWebsiteHistory(historyData);
      
      if (historyData.length > 0) {
        setPreviewingUiId(historyData[0].id);
      }
      
      setUiSuggestion("");
    } catch (err) {
      console.error("UI refinement failed", err);
    } finally {
      setIsGeneratingUi(false);
    }
  };

  const downloadCode = (html?: string, fileName?: string) => {
    const code = html || websiteHtml;
    if (!code) return;
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || `${name.toLowerCase().replace(/\s+/g, "-")}-landing-page.html`;
    a.click();
  };

  const handleNavClick = (nextView: View) => {
    setView(nextView);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <BackgroundEffects />

      <DeleteModal
        isOpen={isDeleting !== null}
        onClose={() => setIsDeleting(null)}
        onConfirm={() => handleDeleteHistory(isDeleting!)}
      />

      <Navbar view={view} onNavClick={handleNavClick} />

      <main className="max-w-[1600px] mx-auto px-6 py-20 relative">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <HomeView
              name={name}
              setName={setName}
              idea={idea}
              setIdea={setIdea}
              loading={loading}
              error={error}
              onSubmit={handleAnalyze}
            />
          )}

          {view === "analysis" && analysis && (
            <AnalysisView
              name={name}
              setName={setName}
              analysis={analysis}
              currentStartupId={currentStartupId}
              logoUrl={logoUrl}
              isGeneratingLogo={isGeneratingLogo}
              isDeepDiving={isDeepDiving}
              isGeneratingUi={isGeneratingUi}
              runDeepDive={runDeepDive}
              generateUi={generateUi}
              websiteHistory={websiteHistory}
              previewingUiId={previewingUiId}
              fetchUiVersion={fetchUiVersion}
              generateLogo={generateLogo}
            />
          )}

          {view === "website" && websiteHtml && (
            <WebsitePreviewView
              name={name}
              websiteHtml={websiteHtml}
              websiteHistory={websiteHistory}
              previewingUiId={previewingUiId}
              fetchUiVersion={fetchUiVersion}
              downloadCode={downloadCode}
              uiSuggestion={uiSuggestion}
              setUiSuggestion={setUiSuggestion}
              refineUi={refineUi}
              isGeneratingUi={isGeneratingUi}
              analysisHistory={analysisHistory}
              setAnalysis={setAnalysis}
              onBackToAnalysis={() => {
                setView("analysis");
                setPreviewingUiId(null);
              }}
            />
          )}

          {view === "history" && (
            <ArchiveView
              history={history}
              onSelectStartup={(item) => {
                setAnalysis(item.analysis);
                setName(item.name);
                setIdea(item.idea);
                setCurrentStartupId(item.id);
                setLogoUrl(item.logo_url || null);
                setWebsiteHtml(item.website_html || null);
                fetchWebsiteHistory(item.id);
                fetchAnalysisHistory(item.id);
                setView("analysis");
              }}
              onDeleteClick={(id) => setIsDeleting(id)}
            />
          )}

          {view === "privacy" && <PrivacyPolicy />}
          {view === "terms" && <TermsOfService />}
        </AnimatePresence>
      </main>

      <Footer
        onShowTerms={() => handleNavClick("terms")}
        onShowPrivacy={() => handleNavClick("privacy")}
      />
    </div>
  );
}

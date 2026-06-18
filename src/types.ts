export interface AnalysisData {
  suggestedNames?: string[];
  summary: string;
  competitors: Array<{ name: string; description: string; strength: string; weakness: string }>;
  uniqueSuggestions: string[];
  benchmarking: {
    innovation: number;
    marketNeed: number;
    easeOfEntry: number;
    scalability: number;
  };
  reviewAnalysis: {
    commonComplaints: string[];
    praisedFeatures: string[];
  };
  strategy: {
    locations: string[];
    culture: string;
    team: string[];
  };
  pitch: {
    elevatorPitch: string;
    keyMetrics: string[];
  };
  logoPrompt: string;
  deepDive?: {
    marketShare: Array<{ name: string; value: number }>;
    featureMatrix: Array<{ feature: string; competitors: Record<string, boolean> }>;
    attackAngles: Array<{ name: string; angle: string }>;
  };
}

export interface AnalysisVersion {
  id: number;
  startup_id: number;
  analysis: AnalysisData;
  created_at: string;
}

export interface StartupHistory {
  id: number;
  name: string;
  idea: string;
  analysis: AnalysisData;
  logo_url?: string;
  website_html?: string;
  created_at: string;
}

export type View = "home" | "analysis" | "website" | "history" | "privacy" | "terms";

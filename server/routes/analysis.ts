import { Router } from "express";
import { generateWithGemini, GeminiError } from "../gemini-client.js";
import { dbRun, dbGet, dbAll } from "../db.js";

const router = Router();

router.post("/analyze", async (req, res) => {
  const { name, idea, full = false, id: existingId } = req.body;
  if (!idea) return res.status(400).json({ error: "Idea is required" });

  try {
    const prompt = full ? `
      PROVIDE FULL INTELLIGENCE ANALYSIS for the following startup idea: "${idea}" ${name ? `(Proposed Name: "${name}")` : ""}
      
      Provide a comprehensive analysis including:
      1. Competitor Analysis: Identify 3-5 existing companies or startups in this space.
      2. Unique Value Proposition (UVP): Suggest 3 unique angles or features that differentiate this idea from competitors.
      3. Benchmarking: Compare the idea against competitors on a scale of 1-10 for: Innovation, Market Need, Ease of Entry, and Scalability.
      4. Market Sentiment: Simulate an analysis of reviews for existing services in this space.
      5. Strategic Recommendations: Best geographic locations, culture, and team structure.
      6. Investor Pitch: A 30-second elevator pitch and 3 key metrics.
      7. Name Suggestions: Suggest 5 creative and professional names.
      8. Logo Prompt: Suggest a visual prompt for an AI image generator to create a professional logo for this startup.

      Return the response in JSON format:
      {
        "suggestedNames": ["string"],
        "summary": "string",
        "competitors": [{ "name": "string", "description": "string", "strength": "string", "weakness": "string" }],
        "uniqueSuggestions": ["string"],
        "benchmarking": { "innovation": number, "marketNeed": number, "easeOfEntry": number, "scalability": number },
        "reviewAnalysis": { "commonComplaints": ["string"], "praisedFeatures": ["string"] },
        "strategy": { "locations": ["string"], "culture": "string", "team": ["string"] },
        "pitch": { "elevatorPitch": "string", "keyMetrics": ["string"] },
        "logoPrompt": "string"
      }
    ` : `
      PROVIDE MINIMALIST ANALYSIS for the following startup idea: "${idea}" ${name ? `(Proposed Name: "${name}")` : ""}
      
      Provide a brief analysis including:
      1. Summary: A quick overview of the market potential.
      2. Unique Value Proposition (UVP): 2 unique angles.
      3. Name Suggestions: Suggest 5 creative names.
      4. Logo Prompt: Suggest a visual prompt for a logo.

      Return the response in JSON format:
      {
        "suggestedNames": ["string"],
        "summary": "string",
        "uniqueSuggestions": ["string"],
        "logoPrompt": "string"
      }
    `;

    const { text, model } = await generateWithGemini(prompt);
    console.log(`Analysis generated using model: ${model}`);
    
    const cleanJson = text.replace(/```json\n?|```\n?/g, "").trim();
    const analysisData = JSON.parse(cleanJson || "{}");
    
    let startupId: number;
    if (existingId) {
      // Check if startup exists
      const exists = await dbGet("SELECT id FROM startups WHERE id = ?", [existingId]);
      if (!exists) {
        // If not, fallback to creating a new one
        const info = await dbRun("INSERT INTO startups (name, idea, analysis) VALUES (?, ?, ?)", [
          name || analysisData.suggestedNames?.[0] || "Unnamed Startup", idea, JSON.stringify(analysisData)
        ]);
        startupId = info.lastInsertRowid;
      } else {
        // Update existing startup record to point to latest analysis
        await dbRun("UPDATE startups SET analysis = ?, name = ? WHERE id = ?", [
          JSON.stringify(analysisData), name || analysisData.suggestedNames?.[0] || "Unnamed Startup", existingId
        ]);
        startupId = existingId;
      }
    } else {
      // Create new startup record
      const info = await dbRun("INSERT INTO startups (name, idea, analysis) VALUES (?, ?, ?)", [
        name || analysisData.suggestedNames?.[0] || "Unnamed Startup", idea, JSON.stringify(analysisData)
      ]);
      startupId = info.lastInsertRowid;
    }

    // Always record analysis version history
    await dbRun("INSERT INTO analysis_history (startup_id, analysis) VALUES (?, ?)", [startupId, JSON.stringify(analysisData)]);

    res.json({ id: startupId, ...analysisData, name: name || analysisData.suggestedNames?.[0] });
  } catch (error: any) {
    console.error("Analysis error:", error);
    const status = error instanceof GeminiError ? error.status : 500;
    const message = error instanceof GeminiError
      ? error.message
      : "Failed to analyze startup idea";
    res.status(status).json({ error: message });
  }
});

router.get("/analysis-history/:startupId", async (req, res) => {
  const { startupId } = req.params;
  try {
    const rows = await dbAll("SELECT * FROM analysis_history WHERE startup_id = ? ORDER BY created_at DESC", [parseInt(startupId)]);
    res.json(rows.map(row => ({
      ...row,
      analysis: JSON.parse(row.analysis as string)
    })));
  } catch (error) {
    console.error("Analysis history error:", error);
    res.status(500).json({ error: "Failed to fetch analysis history" });
  }
});

router.post("/competitor-deep-dive", async (req, res) => {
  const { competitors, idea, startupId } = req.body;

  try {
    const prompt = `
      As a strategic business analyst agent, perform a deep-dive comparison for the startup idea: "${idea}"
      against these competitors: ${competitors.map((c: any) => c.name).join(", ")}.
      
      Provide:
      1. Market share estimation (simulated).
      2. Feature comparison matrix.
      3. Specific "Attack Angles" for each competitor.
      
      Return JSON format:
      {
        "marketShare": [{ "name": "string", "value": number }],
        "featureMatrix": [{ "feature": "string", "competitors": { "compName": boolean } }],
        "attackAngles": [{ "name": "string", "angle": "string" }]
      }
    `;

    const { text, model } = await generateWithGemini(prompt);
    console.log(`Deep dive generated using model: ${model}`);

    const cleanJson = text.replace(/```json\n?|```\n?/g, "").trim();
    const deepDiveData = JSON.parse(cleanJson);

    // Update the analysis in DB with this new deep dive data if startupId provided
    if (startupId) {
      const startup = await dbGet("SELECT analysis FROM startups WHERE id = ?", [startupId]);
      if (startup) {
        const analysis = JSON.parse(startup.analysis);
        analysis.deepDive = deepDiveData;
        await dbRun("UPDATE startups SET analysis = ? WHERE id = ?", [JSON.stringify(analysis), startupId]);
        await dbRun("INSERT INTO analysis_history (startup_id, analysis) VALUES (?, ?)", [startupId, JSON.stringify(analysis)]);
      }
    }

    res.json(deepDiveData);
  } catch (error: any) {
    console.error("Deep dive error:", error);
    const status = error instanceof GeminiError ? error.status : 500;
    const message = error instanceof GeminiError
      ? error.message
      : "Deep dive failed";
    res.status(status).json({ error: message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM startups ORDER BY created_at DESC");
    res.json(rows.map(row => ({
      ...row,
      analysis: JSON.parse(row.analysis as string)
    })));
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

router.delete("/history/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbRun("DELETE FROM startups WHERE id = ?", [parseInt(id)]);
    if (result.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Startup not found" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete history item" });
  }
});

export default router;

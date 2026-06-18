import { Router } from "express";
import { generateWithGemini, GeminiError } from "../gemini-client.js";
import db from "../db.js";
import fs from "fs";
import path from "path";

const router = Router();

// Ensure storage directory exists
const LOGO_STORAGE_DIR = path.join(process.cwd(), "public", "images", "logos");
if (!fs.existsSync(LOGO_STORAGE_DIR)) {
  fs.mkdirSync(LOGO_STORAGE_DIR, { recursive: true });
}

const fallbackLogo = (startupName: string) => {
  const letter = (startupName || "V").charAt(0).toUpperCase();
  const colors = [
    ["#10b981", "#3b82f6"],
    ["#f59e0b", "#ef4444"],
    ["#8b5cf6", "#d946ef"],
    ["#06b6d4", "#8b5cf6"],
    ["#f43f5e", "#fb923c"]
  ];
  const [c1, c2] = colors[Math.floor(Math.random() * colors.length)];
  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${c1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${c2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="80" fill="url(#grad)" />
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white">${letter}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

const fallbackTemplate = (startupName: string, startupIdea: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${startupName} - Coming Soon</title>
      <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-[#050505] text-white font-sans selection:bg-emerald-500/30">
      <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div class="w-24 h-24 bg-emerald-500 rounded-3xl mb-8 flex items-center justify-center text-black font-bold text-4xl shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              ${(startupName || "V").charAt(0).toUpperCase()}
          </div>
          <h1 class="text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">${startupName}</h1>
          <p class="text-zinc-400 text-xl max-w-xl mx-auto font-light mb-12">${startupIdea}</p>
          <div class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-black font-bold text-lg shadow-2xl hover:bg-emerald-400 transition-all cursor-pointer">
              Join the Waitlist
          </div>
      </div>
  </body>
  </html>
`.trim();

router.post("/generate-logo", async (req, res) => {
  const { startupId, name } = req.body;
  const imageUrl = fallbackLogo(name);
  if (startupId) {
    db.prepare("UPDATE startups SET logo_url = ? WHERE id = ?").run(imageUrl, startupId);
  }
  res.json({ imageUrl });
});

router.post("/generate-ui", async (req, res) => {
  const { idea, name, startupId } = req.body;

  try {
    const promptText = `
      You are an elite web developer and designer. Create a stunning, production-quality single-file HTML landing page.

      Startup Name: "${name}"
      Startup Idea: "${idea}"

      DESIGN SYSTEM:
      - Dark premium theme: background #050505, cards rgba(255,255,255,0.03)
      - Accent gradient: emerald (#10b981) to blue (#3b82f6)
      - Font: Inter from Google Fonts (import in <head>)
      - Glassmorphism: backdrop-blur, semi-transparent borders (border: 1px solid rgba(255,255,255,0.08))
      - Subtle glow effects on CTAs: box-shadow with colored opacity
      - Smooth transitions on all interactive elements

      TECHNICAL:
      - Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
      - Import Google Font Inter in <head>
      - Fully mobile-responsive
      - Use inline SVG icons (do NOT use external icon libraries)

      MANDATORY SECTIONS (all must be detailed and content-rich):
      1. NAVBAR: Logo text + nav links (Features, Pricing, About) + gradient CTA button
      2. HERO: Large bold gradient headline (bg-clip-text), descriptive subtitle (2-3 sentences about the startup), primary CTA button with glow, secondary outline button, hero stats row (e.g. "10K+ Users", "99.9% Uptime", "50+ Integrations")
      3. FEATURES: Grid of 4-6 feature cards, each with an inline SVG icon, title, and 2-sentence description. Cards should have glassmorphic styling.
      4. HOW IT WORKS: 3-4 numbered steps with icons and descriptions, connected visually
      5. TESTIMONIALS: 3 testimonial cards with avatar placeholder (colored circle with initial), name, role, company, and quote text
      6. PRICING: 3 pricing tiers (Free, Pro, Enterprise) with feature lists, the middle one highlighted as "Most Popular" with accent border and glow
      7. CTA SECTION: Final call-to-action with gradient background, compelling headline, email input + button
      8. FOOTER: Logo, link columns (Product, Company, Legal), social icons as SVGs, copyright

      CRITICAL RULES:
      - Return ONLY the complete HTML. No markdown, no backticks, no explanation.
      - Every section must have real, contextual content related to "${name}" and "${idea}"
      - The design must look like a real SaaS landing page, not a template placeholder
      - Minimum 300 lines of HTML
    `;

    const { text } = await generateWithGemini(promptText);
    let html = text || "";

    if (!html || html.length < 100) {
      console.warn("Gemini returned insufficient HTML, using fallback template");
      html = fallbackTemplate(name, idea);
    } else {
      // Clean up markdown code blocks if AI included them
      html = html.replace(/```html\n?|```\n?/g, "").trim();
    }

    if (startupId) {
      const id = parseInt(startupId);
      db.prepare("UPDATE startups SET website_html = ? WHERE id = ?").run(html, id);
      db.prepare("INSERT INTO website_history (startup_id, html) VALUES (?, ?)").run(id, html);
    }
    res.json({ html });

  } catch (error: any) {
    console.error("UI generation error (falling back to template):", error.message || error);
    const html = fallbackTemplate(name, idea);
    if (startupId) {
      const id = parseInt(startupId);
      db.prepare("UPDATE startups SET website_html = ? WHERE id = ?").run(html, id);
      db.prepare("INSERT INTO website_history (startup_id, html) VALUES (?, ?)").run(id, html);
    }
    res.json({ html });
  }
});

router.post("/refine-ui", async (req, res) => {
  const { currentHtml, suggestion, startupId } = req.body;

  try {
    const prompt = `
      Refine the following HTML code based on this suggestion: "${suggestion}"
      Current HTML:
      ${currentHtml}
      
      Return ONLY the updated HTML code. No markdown blocks.
    `;

    const { text } = await generateWithGemini(prompt);
    let html = text || "";
    html = html.replace(/```html\n?|```\n?/g, "").trim();

    if (startupId) {
      const id = parseInt(startupId);
      db.prepare("UPDATE startups SET website_html = ? WHERE id = ?").run(html, id);
      db.prepare("INSERT INTO website_history (startup_id, html) VALUES (?, ?)").run(id, html);
    }
    res.json({ html });
  } catch (error: any) {
    console.error("UI refinement error:", error);
    const status = error instanceof GeminiError ? error.status : 500;
    res.status(status).json({ error: error.message || "Failed to refine UI" });
  }
});

router.get("/website-history/:startupId", (req, res) => {
  const { startupId } = req.params;
  const rows = db.prepare("SELECT * FROM website_history WHERE startup_id = ? ORDER BY created_at DESC").all(startupId);
  res.json(rows);
});

router.get("/website-version/:id", (req, res) => {
  const { id } = req.params;
  const row = db.prepare("SELECT * FROM website_history WHERE id = ?").get(id) as any;
  if (!row) return res.status(404).json({ error: "Version not found" });
  res.json(row);
});

export default router;

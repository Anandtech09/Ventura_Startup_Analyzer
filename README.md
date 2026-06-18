# Ventura Startup Analyzer 🚀

Ventura is an AI-powered startup strategist and analyzer that transforms raw business ideas into rich, interactive, data-driven strategy blueprints and instant landing page prototypes.

<div align="center">
  <img width="1200" height="475" alt="Ventura Dashboard Preview" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

---

## Key Features

1. **Strategic Synthesis** — Analyzes your vision statement and provides an executive summary of market viability.
2. **Competitor Landscape** — Compiles competitor profiles detailing their major strengths and weaknesses.
3. **Deep Dive Analysis** — Displays interactive charts (using Recharts) mapping market share, cross-competitor feature support matrix, and actionable strategic attack angles.
4. **Radar Benchmarking** — Evaluates and benchmarks your startup idea on Innovation, Market Need, Ease of Entry, and Scalability.
5. **Dynamic Brand Suggestions** — Recommends name variations and creates immediate high-quality vector SVG branding logos.
6. **AI UI Builder** — Generates customized premium landing page mockups. Features a sandboxed interactive preview frame, version history rollback, styling refinement prompts, and code downloads.
7. **Blueprint Vault Archive** — Saves all synthesized startups in a local database for review, restoration, or deletion.

---

## Technology Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Framer Motion (`motion/react`)
* **Backend**: Node.js, Express, SQLite (`better-sqlite3`), Google Gemini Developer SDK (`@google/generative-ai`)

---

## Getting Started

### Prerequisites
* **Node.js** (v20+ recommended)
* **Google Gemini API Key** (Get yours from [Google AI Studio](https://aistudio.google.com/))

### Installation & Run

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables Configuration:**
   Create a `.env` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the application:**
   You will need to run the backend server and frontend client simultaneously.

   * **Terminal 1: Start Backend (Express)**
     ```bash
     npm run dev
     ```
     This launches the backend server on `http://localhost:3000` and automatically initializes/updates the SQLite database `ventura.db`.

   * **Terminal 2: Start Frontend (Vite)**
     ```bash
     npx vite
     ```
     This starts the Vite dev server on `http://localhost:5173`.

4. **Launch Ventura:**
   Open your browser and navigate to `http://localhost:5173`.

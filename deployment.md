# Deployment Guide — Ventura Startup Analyzer (All-in-One Vercel Deployment) 🚀

This guide explains how to deploy the entire Ventura Startup Analyzer (both the **Vite React Frontend** and the **Express.js Backend**) together on **Vercel** as a single project.

---

## 🛠️ Vercel Serverless Architecture

To host an Express.js backend alongside a static React frontend on Vercel, the application is structured as follows:

1. **Backend Integration**: Express is exported as a module from [server.ts](file:///d:/Telegram/ventura-startup-analyzer/server.ts) (which skips `.listen()` when running on Vercel).
2. **Serverless Entrypoint**: [api/index.ts](file:///d:/Telegram/ventura-startup-analyzer/api/index.ts) imports and exports the Express app as the default handler, which Vercel automatically deploys as a Serverless Function.
3. **Routing Rewrites**: A [vercel.json](file:///d:/Telegram/ventura-startup-analyzer/vercel.json) config file is in place at the root to rewrite `/api/*` and `/public/*` calls to the serverless function.
4. **Frontend Build**: Vite automatically compiles React assets into the `dist/` directory during deployment, which Vercel serves statically.

---

## ✅ Database: Turso (Cloud SQLite) — Integrated

The database layer uses **Turso** (cloud SQLite via `@libsql/client`) in production for persistent storage, with **`better-sqlite3`** as a local development fallback.

- **Production (Vercel)**: Automatically uses Turso when `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` env vars are set (auto-injected by Vercel's Turso integration).
- **Local Development**: Falls back to a local `ventura.db` file using `better-sqlite3`.

The database wrapper in [db.ts](file:///d:/Telegram/ventura-startup-analyzer/server/db.ts) exports async functions (`dbRun`, `dbGet`, `dbAll`, `initDb`) that work with both backends transparently.

> [!NOTE]
> The Turso integration was connected via Vercel Dashboard → Storage → Turso. Environment variables are auto-managed by Vercel — no manual setup needed.

---

## Deploying to Vercel

1. **Connect your Github Repository** to [Vercel](https://vercel.com/).
2. Import the project.
3. Vercel will automatically detect Vite. Keep the default settings:
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. **Environment Variables**:
   Under the **Environment Variables** section of your Vercel project, add:
   * `GEMINI_API_KEY`: `your_actual_gemini_api_key`
   * `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are auto-injected by the Turso integration.
5. Click **Deploy**. Both the frontend and Express serverless functions will be deployed together.

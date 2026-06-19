import express from "express";
import dotenv from "dotenv";
import { initDb } from "./server/db.js";
import analysisRoutes from "./server/routes/analysis.js";
import generationRoutes from "./server/routes/generation.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/public", express.static("public"));

// API Routes
app.use("/api", analysisRoutes);
app.use("/api", generationRoutes);

// Initialize the database tables (works for both Turso and local SQLite)
initDb().catch((err) => {
  console.error("❌ Failed to initialize database:", err);
});

if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

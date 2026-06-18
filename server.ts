import express from "express";
import dotenv from "dotenv";
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

if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

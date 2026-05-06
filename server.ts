import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Prediction (Mocking the scikit-learn logic for the preview)
  app.post("/api/predict", (req, res) => {
    const { age, bmi, sleep, stress } = req.body;

    // Simplified logic mimicking the model_train.py risk_score logic
    // risk_score = (age * 0.1) + (bmi * 0.5) - (sleep * 2) + (stress * 1.5)
    const riskScore = (age * 0.1) + (bmi * 0.5) - (sleep * 2) + (stress * 1.5);
    
    let prediction = "Low Risk";
    let confidence = 0.85 + Math.random() * 0.1; // Simulated confidence

    if (riskScore > 30) {
      prediction = "High Risk";
    } else if (riskScore > 15) {
      prediction = "Medium Risk";
    }

    // Add some "AI" jitter to make it feel real
    confidence = Math.min(0.99, confidence);

    res.json({
      prediction,
      confidence,
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

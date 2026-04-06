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

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "ClipSweep API is running" });
  });

  // Mock endpoint for video analysis
  app.post("/api/analyze", async (req, res) => {
    const { url } = req.body;
    console.log("Analyzing URL:", url);
    
    // In a real app, we'd use Gemini here to analyze the video
    // For the demo, we return mock viral segments
    setTimeout(() => {
      res.json({
        id: "vid_" + Math.random().toString(36).substr(2, 9),
        title: "How to Build an AI App",
        segments: [
          {
            id: "seg_1",
            startTime: 12,
            endTime: 45,
            score: 0.95,
            reason: "High energy intro and clear value proposition.",
            transcription: "So today we are going to talk about how you can actually build a full-stack AI application in under 10 minutes...",
            suggestedCaption: "Build AI Apps Fast! 🚀"
          },
          {
            id: "seg_2",
            startTime: 120,
            endTime: 175,
            score: 0.88,
            reason: "Technical breakdown with visual cues.",
            transcription: "The key is to use the right tools for the job. You don't need to be a senior engineer to understand this...",
            suggestedCaption: "The Secret to AI 🧠"
          }
        ]
      });
    }, 2000);
  });

  // Mock social media accounts
  let connectedAccounts = [
    { id: "acc_1", platform: "tiktok", username: "@clipsweep_official", status: "connected" },
    { id: "acc_2", platform: "instagram", username: "clipsweep_reels", status: "connected" },
    { id: "acc_3", platform: "youtube", username: "ClipSweep Shorts", status: "disconnected" }
  ];

  app.get("/api/accounts", (req, res) => {
    res.json(connectedAccounts);
  });

  app.post("/api/accounts/connect", (req, res) => {
    const { platform } = req.body;
    // Mock connection process
    setTimeout(() => {
      const account = connectedAccounts.find(a => a.platform === platform);
      if (account) {
        account.status = "connected";
        account.username = `@new_${platform}_user`;
      }
      res.json({ success: true, account });
    }, 1000);
  });

  app.post("/api/schedule", (req, res) => {
    const { segmentId, platformIds, scheduledTime, caption } = req.body;
    console.log(`Scheduling segment ${segmentId} for ${scheduledTime} on platforms: ${platformIds.join(", ")}`);
    
    setTimeout(() => {
      res.json({ 
        success: true, 
        message: "Post scheduled successfully!",
        jobId: "job_" + Math.random().toString(36).substr(2, 9)
      });
    }, 1500);
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

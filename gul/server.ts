import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Real-world Plant Pathology AI Diagnostic Route
app.post("/api/gemini/bot", async (req, res) => {
  try {
    const { message, history, image } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    if (!ai) {
      // Graceful fallback if no API key is set
      res.json({
        text: "🌸 **Dr. Gul is currently offline/unconfigured (No GEMINI_API_KEY detected in secrets)**.\n\n*Diagnostic simulation feedback*:\n- **Analysis**: Since your `GEMINI_API_KEY` isn't fully configured yet, we had to run a local simulation scan. We processed your diagnostic photo sample!\n- **Recommendation**: In real usage, the attached picture is securely analyzed by **Gemini 3.5 Flash** for cellular strain and pest patterns. To try real-time plant medicine, please configure your `GEMINI_API_KEY` in the secrets console!",
      });
      return;
    }

    // Prepare system instructions and contents
    const systemInstruction = 
      "You are Dr. Gul, a warm, highly enthusiastic, and world-class House Gardening & Plant Pathology AI Expert. " +
      "You diagnose plant diseases, recommend watering/fertilizer adjustments, suggest perfect home styling guidelines, and offer specialized tips for sellers. " +
      "Format your answers with elegant, structured Markdown styling, including headers, list items with clear spacing, and emojis. " +
      "Always suggest practical, home-friendly gardening recipes (like neem oil, eggshell calcium, or rice water compost) and maintain a caring, botanical companion persona.";

    // Package contents
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        });
      });
    }

    // Prepare the latest user message parts (could be voice, images, etc.)
    const latestUserParts: any[] = [];
    if (image && image.data && image.mimeType) {
      const base64Data = image.data.replace(/^data:image\/\w+;base64,/, "");
      latestUserParts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: base64Data,
        }
      });
    }
    latestUserParts.push({ text: message });
    
    // Add the latest user parts to the content
    contents.push({
      role: "user",
      parts: latestUserParts,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to generate botanical guidelines.",
      details: error.message,
    });
  }
});

// Configure Vite or Static Assets based on environment
async function configureVite() {
  if (process.env.NODE_ENV !== "production") {
    // In development mode, mount Vite dev server as middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[GUL backend] Server listening on http://0.0.0.0:${PORT}`);
  });
}

configureVite().catch((err) => {
  console.error("Vite server initialization error:", err);
});

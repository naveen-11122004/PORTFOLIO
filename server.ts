import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json({ limit: '10mb' }));

  // Shared lazy-loaded Gemini AI client configuration
  let aiClient: GoogleGenAI | null = null;

  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("GEMINI_API_KEY environment variable is not configured in Secrets.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // API Check Status Endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
    });
  });

  // Helper to ensure robust JSON parsing by stripping markdown fences if returned
  function cleanJsonString(str: string): string {
    let cleaned = str.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[a-zA-Z0-0]*\s*/, "");
      cleaned = cleaned.replace(/\s*```$/, "");
    }
    return cleaned.trim();
  }

  // API 1: Parse Raw Resume Text or PDF Documents into Structured Portfolio Data via Gemini
  app.post("/api/portfolio/generate", async (req, res) => {
    const { text, fileData, mimeType, defaultName } = req.body;

    if ((!text || text.trim().length === 0) && (!fileData || !mimeType)) {
      return res.status(400).json({ error: "No resume text content or file upload was provided." });
    }

    try {
      const ai = getAiClient();
      
      const promptText = `
        Analyze this resume dataset (could be provided as text and/or an uploaded file document) and extract it into a highly professional structured digital portfolio JSON dataset. 
        If some details (such as bio, github, phone, etc.) are missing, look for hints in the resume or compose a suitable, professional summary/description.
        Make sure the candidate's name is accurately captured. If the candidate's name is missing, use "${defaultName || 'Naveen Krishnamoorthi'}".
        
        Guidelines to follow:
        1. Categorize all skills into groups like "Frontend", "Backend", "AI & ML", "Operations & Tools", "Mobile Development", "Data Engineering".
        2. Assign realistic competence level values (between 40 and 100) to each skill.
        3. Break down work experience and projects into bullet highlights for details.
        4. Make the personalInfo bio and about paragraph sound professional, creative, elegant and cohesive.
        
        ${text ? `Resume text to parse:\n"""\n${text}\n"""` : "Please review and parse the attached document file."}
      `;

      const parts: any[] = [];
      if (fileData && mimeType) {
        parts.push({
          inlineData: {
            data: fileData,
            mimeType: mimeType
          }
        });
      }
      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          systemInstruction: "You are an expert ATS (Applicant Tracking System) parser and portfolio structural compiler. You parse raw text and return a perfect representation matching the requested JSON structural schema. Do not include any markdown comments or enclosing codeblock wraps in your response, strictly output JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              personalInfo: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Full name" },
                  title: { type: Type.STRING, description: "Professional title, e.g. Full-Stack Dev" },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  github: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  about: { type: Type.STRING, description: "1-2 sentence high impact summary" },
                  bio: { type: Type.STRING, description: "Longer narrative bio detailing enthusiasm and background" }
                },
                required: ["name", "title", "email", "about", "bio"]
              },
              skills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    level: { type: Type.INTEGER, description: "Number between 40 and 100 representing expertise" },
                    category: { type: Type.STRING, description: "Frontend, Backend, AI & ML, Operations & Tools, etc." }
                  },
                  required: ["name", "level", "category"]
                }
              },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING } },
                    technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["company", "role", "startDate", "endDate", "description"]
                }
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    link: { type: Type.STRING },
                    github: { type: Type.STRING },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    role: { type: Type.STRING },
                    highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["title", "description", "tags"]
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    fieldOfStudy: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    score: { type: Type.STRING }
                  },
                  required: ["institution", "degree", "startDate", "endDate"]
                }
              },
              certifications: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    issuer: { type: Type.STRING },
                    date: { type: Type.STRING }
                  },
                  required: ["name", "issuer", "date"]
                }
              }
            },
            required: ["personalInfo", "skills", "experience", "projects", "education"]
          }
        }
      });

      const jsonText = response.text || "{}";
      const cleaned = cleanJsonString(jsonText);
      const parsedData = JSON.parse(cleaned);
      res.json(parsedData);
    } catch (error: any) {
      console.error("Resume parsing error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to parse resume.",
        details: "Please verify that your Gemini API Key is configured in Settings > Secrets."
      });
    }
  });

  // API 2: Contextual Chat Agent grounded in user's profile details
  app.post("/api/portfolio/chat", async (req, res) => {
    const { messages, portfolioData } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid message history format." });
    }

    if (!portfolioData) {
      return res.status(400).json({ error: "Portfolio context data is required." });
    }

    try {
      const ai = getAiClient();
      
      const systemInstruction = `
        You are a highly professional, intelligent, and helpful AI Portfolio Assistant representing the developer, ${portfolioData.personalInfo.name}.
        Your goal is to answer questions from potential recruiters, employers, or visitors about ${portfolioData.personalInfo.name}'s professional skills, background, work experience, projects, education, and passions.
        
        Ground all your answers strictly on the following portfolio structural data:
        --------------------
        ${JSON.stringify(portfolioData, null, 2)}
        --------------------
        
        Tone guidelines:
        - Keep answers concise, highly engaging, objective, and friendly.
        - Speak inside the perspective of a smart representation (e.g. "Naveen is proficient in...", "He has worked on...", or "I am a digital agent for Naveen...").
        - If someone asks a question about skills or experience not listed: politely state that it's not explicitly covered in the resume, but highlight related adjacent skills that are found in the data.
        - You can write short, cleanly formatted markdown blocks (like lists or bold keys) to support readability. Do not output raw HTML.
      `;

      // Transform format into contents format for generateContent
      // The last message is the user query. We can pass the conversation history in contents
      const conversationParts = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: conversationParts,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Agent chat error:", error);
      res.status(500).json({ 
        error: error.message || "Chat feedback failed.",
        details: "AI service disconnected. Make sure your Gemini API Key is set in the Secrets."
      });
    }
  });

  // Configure Vite Development Server Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Full-Stack Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((e) => {
  console.error("Server startup crash:", e);
});

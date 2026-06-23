import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ProfileImage } from "./src/models/profileImage";
import { Certification } from "./src/models/certification";
import { StoredFile } from "./src/models/storedFile";
import { User } from "./src/models/user";
import { PasswordReset } from "./src/models/passwordReset";

dotenv.config();

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRE = "7d";

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// OpenRouter API constants
const OPENROUTER_API_URL = "https://openrouter.io/api/v1/chat/completions";
const OPENROUTER_DEFAULT_MODEL = "meta-llama/llama-2-70b-chat";

// Middleware to verify JWT token
const verifyToken = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
  try {
    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB");
  } catch (error) {
    console.warn("⚠ MongoDB connection failed. Running in offline mode.", error);
  }

  // Middleware for parsing JSON requests
  app.use(express.json({ limit: '10mb' }));

  // Helper function to call OpenRouter API
  async function callOpenRouterAPI(messages: Array<{ role: string; content: string }>, systemInstruction: string, responseFormat?: any) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === "sk-or-YOUR_OPENROUTER_API_KEY") {
      throw new Error("OPENROUTER_API_KEY environment variable is not configured. Get your API key from https://openrouter.io");
    }

    const model = process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL;

    const payload: any = {
      model: model,
      messages: [
        { role: "system", content: systemInstruction },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 4096,
    };

    // Add response format if specified
    if (responseFormat) {
      payload.response_format = responseFormat;
    }

    try {
      const response = await axios.post(OPENROUTER_API_URL, payload, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Portfolio",
          "Content-Type": "application/json",
        },
      });

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error("OpenRouter API error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || error.message || "OpenRouter API call failed");
    }
  }

  // Helper to ensure robust JSON parsing by stripping markdown fences if returned
  function cleanJsonString(str: string): string {
    let cleaned = str.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[a-zA-Z0-9]*\s*/, "");
      cleaned = cleaned.replace(/\s*```$/, "");
    }
    return cleaned.trim();
  }

  // API Check Status Endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasApiKey: !!process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "sk-or-YOUR_OPENROUTER_API_KEY",
      model: process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL,
      aiProvider: "OpenRouter"
    });
  });

  // ===== AUTHENTICATION ENDPOINTS =====

  // Register endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password,
        name
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      res.json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error: any) {
      console.error("Register error:", error);
      res.status(500).json({ error: error.message || "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Compare passwords
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: error.message || "Login failed" });
    }
  });

  // Forgot password endpoint
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Check if user exists
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal if user exists for security
        return res.json({ 
          success: true, 
          message: "If an account exists with this email, a password reset link has been sent" 
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Save reset token to database
      const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
      await PasswordReset.create({
        email: user.email,
        token: hashedToken,
        expiresAt
      });

      // In production, send email with reset link
      // For now, return the token (in production, don't do this)
      res.json({
        success: true,
        message: "Password reset link sent to email",
        resetToken: resetToken // ONLY for development - remove in production
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: error.message || "Failed to process request" });
    }
  });

  // Reset password endpoint
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;

      if (!resetToken || !newPassword) {
        return res.status(400).json({ error: "Reset token and new password are required" });
      }

      // Hash the token to compare
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Find valid reset token
      const resetRecord = await PasswordReset.findOne({
        token: hashedToken,
        used: false,
        expiresAt: { $gt: new Date() }
      });

      if (!resetRecord) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      // Find user and update password
      const user = await User.findOne({ email: resetRecord.email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.password = newPassword;
      await user.save();

      // Mark token as used
      resetRecord.used = true;
      await resetRecord.save();

      res.json({
        success: true,
        message: "Password reset successfully"
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: error.message || "Failed to reset password" });
    }
  });

  // Get public user profile details
  app.get("/api/profile/public", async (req, res) => {
    try {
      const user = await User.findOne({ email: "naveenkrishnamoorthi2004@gmail.com" }).select('-password');
      if (!user) {
        return res.status(404).json({ error: "No profile found" });
      }
      
      let resumeName = "";
      if (user.resume) {
        const resumeFile = await StoredFile.findById(user.resume).select('fileName');
        if (resumeFile) {
          resumeName = resumeFile.fileName;
        }
      }

      const userObj = user.toObject();
      userObj.resumeName = resumeName;
      res.json(userObj);
    } catch (error: any) {
      console.error("Public profile fetch error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch public profile" });
    }
  });

  // Get user profile (protected)
  app.get("/api/auth/profile", verifyToken, async (req: any, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      let resumeName = "";
      if (user.resume) {
        const resumeFile = await StoredFile.findById(user.resume).select('fileName');
        if (resumeFile) {
          resumeName = resumeFile.fileName;
        }
      }

      const userObj = user.toObject();
      userObj.resumeName = resumeName;
      res.json(userObj);
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch profile" });
    }
  });

  // Save portfolio data (protected)
  app.put("/api/auth/portfolio-data", verifyToken, async (req: any, res) => {
    try {
      const { portfolioData } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { portfolioData, updatedAt: new Date() },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ 
        success: true, 
        message: "Portfolio data saved successfully", 
        portfolioData: user.portfolioData 
      });
    } catch (error: any) {
      console.error("Save portfolio data error:", error);
      res.status(500).json({ error: error.message || "Failed to save portfolio data" });
    }
  });

  // Update user profile (protected)
  app.put("/api/auth/profile", verifyToken, async (req: any, res) => {
    try {
      const { name, linkedin, github, bio } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        {
          name,
          linkedin,
          github,
          bio,
          updatedAt: new Date()
        },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        user
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: error.message || "Failed to update profile" });
    }
  });

  // Change password (protected)
  app.post("/api/auth/change-password", verifyToken, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new passwords are required" });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error: any) {
      console.error("Change password error:", error);
      res.status(500).json({ error: error.message || "Failed to change password" });
    }
  });

  // Update profile image (protected)
  app.post("/api/auth/profile-image", verifyToken, upload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = req.user.userId;

      // Delete existing profile image if any
      await ProfileImage.deleteOne({ userId });

      const profileImage = new ProfileImage({
        userId,
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
      });

      await profileImage.save();

      // Update user document with image reference
      await User.findByIdAndUpdate(userId, { profileImage: profileImage._id });

      res.json({
        success: true,
        message: "Profile image updated successfully",
        imageId: profileImage._id
      });
    } catch (error: any) {
      console.error("Profile image upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload profile image" });
    }
  });

  // Update resume document (protected)
  app.post("/api/auth/resume", verifyToken, upload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = req.user.userId;

      // Delete existing resume file if any from StoredFile
      await StoredFile.deleteMany({ userId, fileType: "resume" });

      const storedFile = new StoredFile({
        userId,
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        fileType: "resume",
        description: "Resume Document",
      });

      await storedFile.save();

      // Update user document with resume reference
      await User.findByIdAndUpdate(userId, { resume: storedFile._id });

      res.json({
        success: true,
        message: "Resume updated successfully",
        fileId: storedFile._id
      });
    } catch (error: any) {
      console.error("Resume upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload resume" });
    }
  });

  // API 1: Parse Raw Resume Text or PDF Documents into Structured Portfolio Data via OpenRouter
  app.post("/api/portfolio/generate", async (req, res) => {
    const { text, fileData, mimeType, defaultName } = req.body;

    if ((!text || text.trim().length === 0) && (!fileData || !mimeType)) {
      return res.status(400).json({ error: "No resume text content or file upload was provided." });
    }

    try {
      const promptText = `
        Analyze this resume dataset (could be provided as text and/or an uploaded file document) and extract it into a highly professional structured digital portfolio JSON dataset. 
        If some details (such as bio, github, phone, etc.) are missing, look for hints in the resume or compose a suitable, professional summary/description.
        Make sure the candidate's name is accurately captured. If the candidate's name is missing, use "${defaultName || 'Naveen Krishnamoorthi'}".
        
        Guidelines to follow:
        1. Categorize all skills into groups like "Frontend", "Backend", "AI & ML", "Operations & Tools", "Mobile Development", "Data Engineering".
        2. Assign realistic competence level values (between 40 and 100) to each skill.
        3. Break down work experience and projects into bullet highlights for details.
        4. Make the personalInfo bio and about paragraph sound professional, creative, elegant and cohesive.
        
        ${text ? `Resume text to parse:\n"""\n${text}\n"""` : "Please analyze and parse the provided resume data."}

        Return ONLY a valid JSON object (no markdown, no code blocks) matching this structure:
        {
          "personalInfo": {
            "name": "string",
            "title": "string",
            "email": "string",
            "phone": "string (optional)",
            "location": "string (optional)",
            "github": "string (optional)",
            "linkedin": "string (optional)",
            "about": "string (1-2 sentence summary)",
            "bio": "string (longer narrative)"
          },
          "skills": [
            {
              "name": "string",
              "level": "number between 40-100",
              "category": "string (Frontend/Backend/AI & ML/Operations & Tools/Mobile Development/Data Engineering)"
            }
          ],
          "experience": [
            {
              "company": "string",
              "role": "string",
              "startDate": "string",
              "endDate": "string",
              "description": ["string array of bullet points"],
              "technologies": ["string array"]
            }
          ],
          "projects": [
            {
              "title": "string",
              "description": "string",
              "link": "string (optional)",
              "github": "string (optional)",
              "tags": ["string array"],
              "role": "string (optional)",
              "highlights": ["string array of highlights"]
            }
          ],
          "education": [
            {
              "institution": "string",
              "degree": "string",
              "fieldOfStudy": "string",
              "startDate": "string",
              "endDate": "string",
              "score": "string (optional)"
            }
          ],
          "certifications": [
            {
              "name": "string",
              "issuer": "string",
              "date": "string"
            }
          ]
        }
      `;

      const systemInstruction = "You are an expert ATS (Applicant Tracking System) parser and portfolio structural compiler. Parse resumes and return perfectly formatted JSON matching the requested schema. Return ONLY valid JSON, no markdown, no code blocks.";

      const response = await callOpenRouterAPI(
        [{ role: "user", content: promptText }],
        systemInstruction
      );

      const cleaned = cleanJsonString(response);
      const parsedData = JSON.parse(cleaned);
      res.json(parsedData);
    } catch (error: any) {
      console.error("Resume parsing error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to parse resume.",
        details: "Please verify that your OpenRouter API Key is configured. Get it from https://openrouter.io"
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
      const systemInstruction = `
        You are a highly professional, intelligent, and helpful AI Portfolio Assistant representing the developer, ${portfolioData.personalInfo.name}.
        Your goal is to answer questions from potential recruiters, employers, or visitors about ${portfolioData.personalInfo.name}'s professional skills, background, work experience, projects, education, and passions.
        
        Ground all your answers strictly on the following portfolio structural data:
        --------------------
        ${JSON.stringify(portfolioData, null, 2)}
        --------------------
        
        Tone guidelines:
        - Keep answers concise, highly engaging, objective, and friendly.
        - Speak inside the perspective of a smart representation (e.g. "${portfolioData.personalInfo.name} is proficient in...", "He has worked on...", or "I am a digital agent for ${portfolioData.personalInfo.name}...").
        - If someone asks a question about skills or experience not listed: politely state that it's not explicitly covered in the resume, but highlight related adjacent skills that are found in the data.
        - You can write short, cleanly formatted markdown blocks (like lists or bold keys) to support readability. Do not output raw HTML.
      `;

      // Convert messages to OpenRouter format
      const conversationMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await callOpenRouterAPI(
        conversationMessages,
        systemInstruction
      );

      res.json({ reply: response });
    } catch (error: any) {
      console.error("Agent chat error:", error);
      res.status(500).json({ 
        error: error.message || "Chat feedback failed.",
        details: "AI service error. Make sure your OpenRouter API Key is configured."
      });
    }
  });

  // ===== FILE MANAGEMENT ENDPOINTS =====

  // Upload profile image
  app.post("/api/files/profile-image", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = req.body.userId || "default-user";
      
      // Delete existing profile image if any
      await ProfileImage.deleteOne({ userId });
      
      const profileImage = new ProfileImage({
        userId,
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
      });

      await profileImage.save();
      res.json({ 
        success: true, 
        message: "Profile image uploaded successfully",
        imageId: profileImage._id 
      });
    } catch (error: any) {
      console.error("Profile image upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload profile image" });
    }
  });

  // Get profile image
  app.get("/api/files/profile-image/:userId", async (req, res) => {
    try {
      const profileImage = await ProfileImage.findOne({ userId: req.params.userId });
      
      if (!profileImage) {
        return res.status(404).json({ error: "Profile image not found" });
      }

      res.contentType(profileImage.contentType);
      res.send(profileImage.data);
    } catch (error: any) {
      console.error("Profile image fetch error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch profile image" });
    }
  });

  // Upload certification
  app.post("/api/files/certification", upload.single("file"), async (req, res) => {
    try {
      const { userId, title, issuer, issueDate, expiryDate, credentialId, credentialUrl } = req.body;

      if (!userId || !title || !issuer || !issueDate) {
        return res.status(400).json({ error: "Missing required certification fields" });
      }

      const certData: any = {
        userId,
        title,
        issuer,
        issueDate: new Date(issueDate),
        credentialId,
        credentialUrl,
      };

      if (expiryDate) {
        certData.expiryDate = new Date(expiryDate);
      }

      if (req.file) {
        certData.certificateFile = {
          fileName: req.file.originalname,
          contentType: req.file.mimetype,
          data: req.file.buffer,
        };
      }

      const certification = new Certification(certData);
      await certification.save();

      res.json({ 
        success: true, 
        message: "Certification uploaded successfully",
        certificationId: certification._id 
      });
    } catch (error: any) {
      console.error("Certification upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload certification" });
    }
  });

  // Get all certifications for user
  app.get("/api/files/certifications/:userId", async (req, res) => {
    try {
      const certifications = await Certification.find({ userId: req.params.userId })
        .select("-certificateFile.data")
        .sort({ issueDate: -1 });

      res.json(certifications);
    } catch (error: any) {
      console.error("Certifications fetch error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch certifications" });
    }
  });

  // Get certification file
  app.get("/api/files/certification/:certId/file", async (req, res) => {
    try {
      const certification = await Certification.findById(req.params.certId);
      
      if (!certification || !certification.certificateFile) {
        return res.status(404).json({ error: "Certificate file not found" });
      }

      res.contentType(certification.certificateFile.contentType);
      res.send(certification.certificateFile.data);
    } catch (error: any) {
      console.error("Certificate file fetch error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch certificate file" });
    }
  });

  // Delete certification
  app.delete("/api/files/certification/:certId", async (req, res) => {
    try {
      const certification = await Certification.findByIdAndDelete(req.params.certId);
      
      if (!certification) {
        return res.status(404).json({ error: "Certification not found" });
      }

      res.json({ success: true, message: "Certification deleted successfully" });
    } catch (error: any) {
      console.error("Certification delete error:", error);
      res.status(500).json({ error: error.message || "Failed to delete certification" });
    }
  });

  // Upload file (resume, portfolio, etc.)
  app.post("/api/files/upload", upload.single("file"), async (req, res) => {
    try {
      const { userId, fileType, description } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!userId || !fileType) {
        return res.status(400).json({ error: "Missing userId or fileType" });
      }

      const storedFile = new StoredFile({
        userId,
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        fileType,
        description,
      });

      await storedFile.save();

      res.json({ 
        success: true, 
        message: "File uploaded successfully",
        fileId: storedFile._id 
      });
    } catch (error: any) {
      console.error("File upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload file" });
    }
  });

  // Get user files
  app.get("/api/files/user/:userId", async (req, res) => {
    try {
      const { fileType } = req.query;
      
      let query: any = { userId: req.params.userId };
      if (fileType) {
        query.fileType = fileType;
      }

      const files = await StoredFile.find(query)
        .select("-data")
        .sort({ uploadedAt: -1 });

      res.json(files);
    } catch (error: any) {
      console.error("Files fetch error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch files" });
    }
  });

  // Get file download
  app.get("/api/files/download/:fileId", async (req, res) => {
    try {
      const file = await StoredFile.findById(req.params.fileId);
      
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      res.contentType(file.contentType);
      res.attachment(file.fileName);
      res.send(file.data);
    } catch (error: any) {
      console.error("File download error:", error);
      res.status(500).json({ error: error.message || "Failed to download file" });
    }
  });

  // Delete file
  app.delete("/api/files/:fileId", async (req, res) => {
    try {
      const file = await StoredFile.findByIdAndDelete(req.params.fileId);
      
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      res.json({ success: true, message: "File deleted successfully" });
    } catch (error: any) {
      console.error("File delete error:", error);
      res.status(500).json({ error: error.message || "Failed to delete file" });
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

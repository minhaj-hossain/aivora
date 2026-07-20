import { Router, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { db, IBoard } from "../db/db.ts";
import { authenticateToken, AuthenticatedRequest } from "./auth.ts";
import jwt from "jsonwebtoken";

export const boardsRouter = Router();

// Lazy initialization of Gemini client
let aiClient: any = null;
function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    throw new Error(
      "GEMINI_API_KEY is not configured in environment. Please add it to your platform secrets in the Settings panel.",
    );
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: key });
    console.log("Initialized Google GenAI Client successfully.");
  }
  return aiClient;
}

// Tolerant JSON extraction: models sometimes wrap JSON in code fences or
// prose. This pulls the first balanced {...} object out of the response.
function extractJson<T>(text: string): T {
  if (typeof text !== "string") {
    throw new Error("Empty response from AI model.");
  }
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // Try to locate the first JSON object in the text.
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1)) as T;
    }
    throw new Error("AI model returned an unparseable response.");
  }
}

// Ordered list of Gemini models to try. The first is preferred; if it is
// temporarily unavailable we transparently fall back to the next.
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

// Calls generateContent, falling back through GEMINI_MODELS on failure.
async function generateWithFallback(
  client: any,
  params: { contents: any; config?: any },
) {
  let lastError: any;
  for (const model of GEMINI_MODELS) {
    try {
      return await client.models.generateContent({ model, ...params });
    } catch (err: any) {
      lastError = err;
      // Only fall back on model/availability errors, not on bad input.
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("api key") || msg.includes("permission") || msg.includes("quota")) {
        break;
      }
    }
  }
  throw lastError;
}

// --- OPTIONAL AUTH MIDDLEWARE FOR GET BOARDS ---
function optionalAuthenticateToken(req: any, res: Response, next: () => void) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = undefined;
    return next();
  }

  const JWT_SECRET =
    process.env.JWT_SECRET || "aivora_fallback_secret_key_123!";
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    console.log("optionalAuthenticateToken success. user:", verified);
  } catch (err) {
    console.error("optionalAuthenticateToken failed:", err);
    req.user = undefined;
  }
  next();
}

// --- ENDPOINTS ---

// Get public-stats (MUST go before GET /:id so it doesn't match as an ID!)
boardsRouter.get(
  "/public-stats",
  async (req: any, res: Response): Promise<void> => {
    try {
      const publicBoards = await db.getBoards({ isPublic: true });
      const decisionCount = publicBoards.filter(
        (b) => b.category === "Decision",
      ).length;
      const ideaCount = publicBoards.filter(
        (b) => b.category === "Idea",
      ).length;
      const planCount = publicBoards.filter(
        (b) => b.category === "Plan",
      ).length;

      res.json({
        totalTemplates: publicBoards.length,
        categoryStats: [
          { name: "Decisions", value: decisionCount || 1 },
          { name: "Ideas", value: ideaCount || 1 },
          { name: "Plans", value: planCount || 1 },
        ],
        coThinkingIndex: 4280 + publicBoards.length * 15,
      });
    } catch (err) {
      console.error("Error fetching public stats:", err);
      res.status(500).json({ error: "Failed to fetch public stats." });
    }
  },
);

// Get all boards (templates + user-owned boards if authenticated)
boardsRouter.get(
  "/",
  optionalAuthenticateToken,
  async (req: any, res: Response): Promise<void> => {
    try {
      const search = req.query.search as string;
      const category = req.query.category as string;
      const userId = req.user?.userId || null;

      // Fetch public templates
      const publicBoards = await db.getBoards({
        search,
        category,
        isPublic: true,
      });

      // Fetch user boards if logged in
      let userBoards: IBoard[] = [];
      if (userId) {
        userBoards = await db.getBoards({
          search,
          category,
          ownerId: userId,
          isPublic: false,
        });
      }

      res.json({
        templates: publicBoards,
        boards: userBoards,
        isLocalDatabaseFallback: db.isLocal,
      });
    } catch (err) {
      console.error("Error fetching boards:", err);
      res.status(500).json({ error: "Failed to fetch boards." });
    }
  },
);

// Get user executive summary / statistics for the dashboard
boardsRouter.get(
  "/summary",
  authenticateToken as any,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized." });
        return;
      }

      const summary = await db.getUserStats(userId);
      res.json(summary);
    } catch (err) {
      console.error("Error generating user summary stats:", err);
      res
        .status(500)
        .json({ error: "Failed to generate dashboard summary stats." });
    }
  },
);

// Get single board by ID (with message history and generated outputs)
boardsRouter.get(
  "/:id",
  optionalAuthenticateToken,
  async (req: any, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const board = await db.getBoardById(id);

      if (!board) {
        res.status(404).json({ error: "Board not found." });
        return;
      }

      // Auth check: if board is private, check if user is the owner
      if (!board.isPublic) {
        const currentUserId = req.user?.userId;
        console.log("GET Board Auth Check - isPublic: false", {
          boardId: id,
          boardOwnerId: board.ownerId,
          boardOwnerIdType: typeof board.ownerId,
          currentUserId,
          currentUserIdType: typeof currentUserId,
          isMatch: board.ownerId === currentUserId,
        });
        if (!currentUserId || board.ownerId !== currentUserId) {
          res.status(403).json({ error: "Access denied. Private Board." });
          return;
        }
      }

      const messages = await db.getMessagesByBoardId(id);
      const outputs = await db.getGeneratedOutputsByBoard(id);

      res.json({
        board,
        messages,
        outputs,
      });
    } catch (err) {
      console.error("Error fetching board details:", err);
      res.status(500).json({ error: "Failed to retrieve board." });
    }
  },
);

// Create board
boardsRouter.post(
  "/",
  authenticateToken as any,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { title, description, context, category } = req.body;
      const userId = req.user?.userId;

      if (!title || !description || !context || !category) {
        res.status(400).json({
          error:
            "Missing required fields: title, description, context, category.",
        });
        return;
      }

      const newBoard = await db.createBoard({
        title,
        description,
        context,
        category,
        isPublic: false,
        ownerId: userId || null,
        status: "Active",
      });

      res.status(201).json(newBoard);
    } catch (err) {
      console.error("Error creating board:", err);
      res.status(500).json({ error: "Failed to create board." });
    }
  },
);

// Clone a template board
boardsRouter.post(
  "/:id/clone",
  authenticateToken as any,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const sourceBoard = await db.getBoardById(id);
      if (!sourceBoard) {
        res.status(404).json({ error: "Source board not found." });
        return;
      }

      if (!sourceBoard.isPublic) {
        res
          .status(403)
          .json({ error: "Can only clone public template boards." });
        return;
      }

      // Create a new board copy
      const clonedBoard = await db.createBoard({
        title: `${sourceBoard.title} (My Work)`,
        description: sourceBoard.description,
        context: sourceBoard.context,
        category: sourceBoard.category,
        isPublic: false,
        ownerId: userId || null,
        status: "Active",
      });

      // Deep-clone messages
      const originalMessages = await db.getMessagesByBoardId(id);
      for (const msg of originalMessages) {
        await db.createMessage({
          boardId: clonedBoard._id.toString(),
          role: msg.role,
          content: msg.content,
        });
      }

      res.status(201).json(clonedBoard);
    } catch (err) {
      console.error("Error cloning board:", err);
      res.status(500).json({ error: "Failed to clone board." });
    }
  },
);

// Update board metadata
boardsRouter.put(
  "/:id",
  authenticateToken as any,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, context, category, status } = req.body;
      const userId = req.user?.userId;

      const board = await db.getBoardById(id);
      if (!board) {
        res.status(404).json({ error: "Board not found." });
        return;
      }

      if (board.ownerId !== userId) {
        res
          .status(403)
          .json({ error: "Unauthorized. You do not own this board." });
        return;
      }

      const updated = await db.updateBoard(id, {
        title: title || board.title,
        description: description || board.description,
        context: context || board.context,
        category: category || board.category,
        status: status || board.status,
      });

      res.json(updated);
    } catch (err) {
      console.error("Error updating board:", err);
      res.status(500).json({ error: "Failed to update board." });
    }
  },
);

// Delete board
boardsRouter.delete(
  "/:id",
  authenticateToken as any,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const board = await db.getBoardById(id);
      if (!board) {
        res.status(404).json({ error: "Board not found." });
        return;
      }

      if (board.ownerId !== userId) {
        res
          .status(403)
          .json({ error: "Unauthorized. You do not own this board." });
        return;
      }

      const deleted = await db.deleteBoard(id);
      res.json({ success: deleted });
    } catch (err) {
      console.error("Error deleting board:", err);
      res.status(500).json({ error: "Failed to delete board." });
    }
  },
);

// --- AI INTELLIGENT INTERACTIVE FEATURES ---

// AI Chat endpoint (Strictly pure Gemini API, throwing errors if missing)
boardsRouter.post(
  "/:id/chat",
  authenticateToken as any,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const userId = req.user?.userId;

      if (!message) {
        res.status(400).json({ error: "Message content is required." });
        return;
      }

      const board = await db.getBoardById(id);
      if (!board) {
        res.status(404).json({ error: "Board not found." });
        return;
      }

      if (board.ownerId !== userId) {
        res
          .status(403)
          .json({ error: "Unauthorized access to private board." });
        return;
      }

      // Save User message
      const userMsg = await db.createMessage({
        boardId: id,
        role: "user",
        content: message,
      });

      // Get message history
      const history = await db.getMessagesByBoardId(id);

      // Call getGeminiClient(). This will THROW if key is missing.
      const client = getGeminiClient();

      let reply = "";
      let suggestions: string[] = [];

      const systemPrompt = `You are Aivora, an elite intellectual AI strategist, co-thinker, and decision advisor.
You are helping the user work through a session called "${board.title}" under the category "${board.category}".
The user provides this starting core context:
"""
${board.context}
"""

Instructions:
1. Provide extremely high-caliber, objective, structured, and insightful reasoning. Help the user break down complexity.
2. Maintain a highly professional, supportive, clear, and clarifying tone.
3. Keep the conversation engaging. Speak directly.
4. IMPORTANT: You must return your response in JSON format matching the schema provided. The response fields are:
   - "reply": Your comprehensive markdown-formatted message answering the user.
   - "suggestions": An array of exactly 3 relevant, click-worthy follow-up questions or prompts that help the user think deeper or proceed.`;

      // Format history for the Gemini API
      const contents = history.map((msg) => ({
        role: msg.role === "user" ? "user" : ("model" as const),
        parts: [{ text: msg.content }],
      }));

      const response = await generateWithFallback(client, {
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              reply: { type: "string" },
              suggestions: {
                type: "array",
                items: { type: "string" },
                description:
                  "Exactly three suggested follow-up actions/questions.",
              },
            },
            required: ["reply", "suggestions"],
          },
        },
      });

      const parsed = extractJson<{ reply?: string; suggestions?: string[] }>(response.text);
      reply = parsed.reply || "";
      suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];

      // Save Model response
      const modelMsg = await db.createMessage({
        boardId: id,
        role: "model",
        content: reply,
      });

      res.json({
        userMessage: userMsg,
        modelMessage: modelMsg,
        suggestions,
      });
    } catch (err: any) {
      console.error("Error in AI Chat:", err);
      res
        .status(500)
        .json({ error: err.message || "Failed to generate AI chat response." });
    }
  },
);

// AI Content Generator Endpoint (Strictly pure Gemini API, throwing errors if missing)
boardsRouter.post(
  "/:id/generate",
  authenticateToken as any,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { type, length } = req.body; // type: 'decision_brief' | 'outline' | 'plan' | 'draft', length: 'short' | 'medium' | 'long'
      const userId = req.user?.userId;

      if (!type || !length) {
        res
          .status(400)
          .json({ error: "Content type and length parameters are required." });
        return;
      }

      const board = await db.getBoardById(id);
      if (!board) {
        res.status(404).json({ error: "Board not found." });
        return;
      }

      if (board.ownerId !== userId) {
        res
          .status(403)
          .json({ error: "Unauthorized access to private board." });
        return;
      }

      const history = await db.getMessagesByBoardId(id);
      const client = getGeminiClient(); // Throws if missing
      let documentContent = "";

      const typeLabels: Record<string, string> = {
        decision_brief: "Comprehensive Decision Brief & Tradeoff Matrix",
        outline: "Refined Hierarchical Outline & Content Plan",
        plan: "Actionable Milestones and Execution Roadmap",
        draft: "Polished Executive Summary and Initial Document Draft",
      };

      const historyText = history
        .map((m) => `${m.role === "user" ? "User" : "Aivora"}: ${m.content}`)
        .join("\n\n");

      const generationPrompt = `You are Aivora, a senior intelligence and strategy generator. 
We need to generate a highly professional, meticulously organized, and fully detailed markdown document called:
**${typeLabels[type]}**

Based on the Board context:
"${board.context}"

And our conversation history:
"""
${historyText}
"""

Document requirements:
- Document Type: ${type} (generate custom content tailored perfectly to this category)
- Format: Clean markdown (utilize rich headings, subheadings, tables, bullet points, and bold terms).
- Length Target: ${length} (short: ~500 words, medium: ~1200 words, long: ~2000+ words of granular depth).
- Aesthetic: Deep, clinical, professional, incredibly detailed, actionable. Avoid high-level fluffy text. Include concrete metrics, steps, risks, and mitigations.

Begin generating immediately in markdown format:`;

      const response = await generateWithFallback(client, {
        contents: generationPrompt,
      });

      documentContent = response.text;

      // Get current version for this document type
      const existingOutputs = await db.getGeneratedOutputsByBoard(id);
      const specificTypeOutputs = existingOutputs.filter(
        (o) => o.type === type,
      );
      const nextVersion =
        specificTypeOutputs.length > 0
          ? Math.max(...specificTypeOutputs.map((o) => o.version)) + 1
          : 1;

      const newOutput = await db.createGeneratedOutput({
        boardId: id,
        type,
        content: documentContent,
        version: nextVersion,
      });

      res.status(201).json(newOutput);
    } catch (err: any) {
      console.error("Error generating content:", err);
      res
        .status(500)
        .json({ error: err.message || "Failed to generate document content." });
    }
  },
);

// AI Smart Recommendations Endpoint (Strictly pure Gemini API, throwing errors if missing)
boardsRouter.get(
  "/:id/recommendations",
  authenticateToken as any,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const board = await db.getBoardById(id);
      if (!board) {
        res.status(404).json({ error: "Board not found." });
        return;
      }

      if (board.ownerId !== userId) {
        res.status(403).json({ error: "Unauthorized access." });
        return;
      }

      const history = await db.getMessagesByBoardId(id);
      const client = getGeminiClient(); // Throws if missing
      let recommendations: any[] = [];

      const historyText = history
        .slice(-5)
        .map((m) => `${m.role === "user" ? "User" : "Aivora"}: ${m.content}`)
        .join("\n");
      const systemPrompt = `You are Aivora, a smart recommendation layer. 
We have a thinking session titled "${board.title}" (Category: "${board.category}").
Context: "${board.context}"
Recent chat:
"""
${historyText}
"""

Task: Output exactly three highly actionable, context-aware "Suggested Next Steps" for this user.
The output MUST be in JSON format matching the schema:
{
  "recommendations": [
    {
      "title": "Short verb-driven action title (e.g. Conduct Pricing Survey)",
      "description": "Clear explanation of how and why to take this step in 2 sentences.",
      "actionType": "Pick one: 'chat' (requires further discussion), 'generate' (requires document output), 'research' (requires external data collection)"
    }
  ]
}`;

      const response = await generateWithFallback(client, {
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    actionType: {
                      type: "string",
                      enum: ["chat", "generate", "research"],
                    },
                  },
                  required: ["title", "description", "actionType"],
                },
              },
            },
            required: ["recommendations"],
          },
        },
      });

      const parsed = extractJson<{ recommendations?: any[] }>(response.text);
      recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];

      res.json({ recommendations });
    } catch (err: any) {
      console.error("Error fetching recommendations:", err);
      res.status(500).json({
        error: err.message || "Failed to load smart recommendations.",
      });
    }
  },
);

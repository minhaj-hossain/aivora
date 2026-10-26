// src/server/app.ts
import express from "express";
import path from "path";

// src/server/auth.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// src/db/db.ts
import mongoose, { Schema } from "mongoose";
var UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
var BoardSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  context: { type: String, required: true },
  category: { type: String, enum: ["Decision", "Idea", "Plan"], required: true },
  status: { type: String, enum: ["Active", "Archived"], default: "Active" },
  isPublic: { type: Boolean, default: false },
  ownerId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
var MessageSchema = new Schema({
  boardId: { type: String, required: true, index: true },
  role: { type: String, enum: ["user", "model"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
var GeneratedOutputSchema = new Schema({
  boardId: { type: String, required: true, index: true },
  type: { type: String, enum: ["decision_brief", "outline", "plan", "draft"], required: true },
  content: { type: String, required: true },
  version: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});
var MongoUser = mongoose.models.User || mongoose.model("User", UserSchema);
var MongoBoard = mongoose.models.Board || mongoose.model("Board", BoardSchema);
var MongoMessage = mongoose.models.Message || mongoose.model("Message", MessageSchema);
var MongoGeneratedOutput = mongoose.models.GeneratedOutput || mongoose.model("GeneratedOutput", GeneratedOutputSchema);
var DEFAULT_TEMPLATES = [
  {
    title: "Career Choice: Startup vs. Corporate",
    description: "Decide whether to join an early-stage startup or an established corporate firm. Weigh stock options, fast growth, work-life balance, and stability.",
    context: "I have two job offers: one from an early-stage Series A tech startup offering 0.5% equity, exciting engineering ownership, but a lower base salary and no formal mentoring; and another from a Fortune 500 company with a structured engineering career path, great salary, robust benefits, but slower development cycles and a highly specialized role.",
    category: "Decision",
    status: "Active",
    isPublic: true,
    ownerId: null
  },
  {
    title: "SaaS Launch Roadmap",
    description: "A detailed product launch plan for a new B2B SaaS software product. Coordinate feature releases, pricing packages, product launch marketing, and beta programs.",
    context: "I am launching a specialized AI-powered meeting summarization SaaS platform in 6 weeks. I need to structure a comprehensive launch plan that includes beta-testing with 100 early adopters, organic marketing checklists, final tech deployment stages, and public PR announcement activities.",
    category: "Plan",
    status: "Active",
    isPublic: true,
    ownerId: null
  },
  {
    title: "Master's Thesis Outline & Thesis Refinement",
    description: "Brainstorm and structure your master's academic research paper, outline chapter topics, formulate methodology steps, and refine the thesis question.",
    context: "My master's research is about 'The Impact of Generative AI on Developer Velocity and Software Quality in Small Enterprises.' I need to develop a solid academic hypothesis, design a qualitative and quantitative research methodology, and map out a structured five-chapter outline.",
    category: "Idea",
    status: "Active",
    isPublic: true,
    ownerId: null
  }
];
var DEFAULT_MESSAGES = {
  "Career Choice: Startup vs. Corporate": [
    {
      role: "user",
      content: "Hi Aivora, I'm feeling torn between these two career paths. One feels risky but high-growth, and the other feels safe but potentially stifling. How should I approach this decision?",
      createdAt: new Date(Date.now() - 36e5)
    },
    {
      role: "model",
      content: "Welcome! Deciding between a Series A startup and a Fortune 500 corporate giant is a classic trade-off between **acceleration** (startup) and **leverage/structure** (corporate).\n\nTo help you think clearly, let's break this down into three key dimensions:\n\n1. **Skill Acquisition Rate**: At the startup, you will wear many hats out of necessity, learning rapidly about broad systems, deployment pipelines, and business priorities. At the corporate firm, you will learn best-in-class industry standards, deep architectural precision, and how to navigate large-scale engineering alignment.\n2. **Financial Risk & Upside**: Startup equity could be worth zero or a life-changing amount. Corporate salary is immediate, liquid, and predictable.\n3. **Mentorship & Quality**: Startups require self-learning; corporates have established documentation and dedicated mentors.\n\nCould you share which of these dimensions matters most to your current career stage?",
      createdAt: new Date(Date.now() - 35e5)
    }
  ],
  "SaaS Launch Roadmap": [
    {
      role: "user",
      content: "I've built the MVP of my SaaS, but I don't know how to schedule the remaining 6 weeks for launch. Can we map this out?",
      createdAt: new Date(Date.now() - 36e5)
    },
    {
      role: "model",
      content: "Congratulations on building your MVP! A 6-week runway is highly manageable if we divide it into clear themes:\n\n* **Weeks 1-2 (The Quality Phase)**: Secure your environment, integrate full error tracing, run user testing with 10 close beta users, and refine critical user-onboarding flows.\n* **Weeks 3-4 (The Amplification Phase)**: Build the landing page, publish 3 helpful blog posts on the problems your platform solves, set up your self-serve billing (Stripe), and warm up your email newsletter list.\n* **Weeks 5-6 (The Ingress Phase)**: Open access to 100 beta signups, fix immediate bugs, refine server scaling, and build the final public launch content for Product Hunt or social platforms.\n\nLet's start by detailing your core target persona. Who gets the absolute highest immediate value from your B2B summarizer?",
      createdAt: new Date(Date.now() - 35e5)
    }
  ]
};
var cachedConnection = null;
var DatabaseService = class {
  constructor() {
    this.isLocal = false;
    this.localStore = {
      users: [],
      boards: [],
      messages: [],
      outputs: []
    };
    if (!cachedConnection) {
      cachedConnection = this.initDatabase();
    }
  }
  async initDatabase() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log("\u2139\uFE0F No MONGODB_URI configured. Starting Aivora in Sandbox JSON/In-Memory mode...");
      this.isLocal = true;
      this.seedLocalStore();
      return null;
    }
    try {
      console.log("Connecting to MongoDB database...");
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5e3,
        dbName: "aivora"
      });
      console.log("Successfully connected to MongoDB Database!");
      this.isLocal = false;
      await this.seedDatabase();
      return mongoose;
    } catch (err) {
      console.warn("\u26A0\uFE0F MongoDB connection failed! Falling back seamlessly to local Sandbox engine...", err);
      this.isLocal = true;
      this.seedLocalStore();
      return null;
    }
  }
  seedLocalStore() {
    this.localStore = {
      users: [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          email: "demo@aivora.app",
          // Pre-hashed bcrypt for 'AivoraDemo123!'
          password: "$2a$10$wN3tVqQ9dImsv5zQ9dCj2uD9L1F2k8S7H3L2j6k5g1P9b7Q0W4X9a",
          name: "Demo Thinker",
          createdAt: /* @__PURE__ */ new Date()
        }
      ],
      boards: [],
      messages: [],
      outputs: []
    };
    console.log("Seeding initial public template boards to Sandbox store...");
    for (let i = 0; i < DEFAULT_TEMPLATES.length; i++) {
      const tpl = DEFAULT_TEMPLATES[i];
      const boardId = new mongoose.Types.ObjectId().toString();
      const createdDate = new Date(Date.now() - i * 864e5);
      this.localStore.boards.push({
        _id: boardId,
        title: tpl.title || "Untitled",
        description: tpl.description || "",
        context: tpl.context || "",
        category: tpl.category || "Decision",
        status: tpl.status || "Active",
        isPublic: true,
        ownerId: null,
        createdAt: createdDate,
        updatedAt: createdDate
      });
      const msgs = DEFAULT_MESSAGES[tpl.title];
      if (msgs) {
        for (const msg of msgs) {
          this.localStore.messages.push({
            _id: new mongoose.Types.ObjectId().toString(),
            boardId,
            role: msg.role,
            content: msg.content || "",
            createdAt: msg.createdAt || /* @__PURE__ */ new Date()
          });
        }
      }
    }
    console.log("Sandbox store seeded with default templates and demo user!");
  }
  async seedDatabase() {
    try {
      const existingBoardsCount = await MongoBoard.countDocuments();
      if (existingBoardsCount === 0) {
        console.log("Seeding initial public template boards to MongoDB...");
        for (let i = 0; i < DEFAULT_TEMPLATES.length; i++) {
          const tpl = DEFAULT_TEMPLATES[i];
          const createdBoard = await MongoBoard.create({
            ...tpl,
            createdAt: new Date(Date.now() - i * 864e5),
            updatedAt: new Date(Date.now() - i * 864e5)
          });
          const msgs = DEFAULT_MESSAGES[tpl.title];
          if (msgs) {
            for (const msg of msgs) {
              await MongoMessage.create({
                boardId: createdBoard._id.toString(),
                role: msg.role,
                content: msg.content,
                createdAt: msg.createdAt || /* @__PURE__ */ new Date()
              });
            }
          }
        }
        console.log("MongoDB database seeding complete!");
      }
    } catch (err) {
      console.error("Error seeding MongoDB database:", err);
    }
  }
  // Resolves once MongoDB or fallback store is initialized
  async ready() {
    if (cachedConnection) {
      try {
        await cachedConnection;
      } catch {
        this.isLocal = true;
      }
    }
  }
  // --- REPOSITORY API: USER ---
  async createUser(userData) {
    await this.ready();
    if (this.isLocal) {
      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        email: (userData.email || "").toLowerCase(),
        password: userData.password,
        name: userData.name || "User",
        createdAt: /* @__PURE__ */ new Date()
      };
      this.localStore.users.push(newUser);
      return { ...newUser };
    }
    const created = await MongoUser.create(userData);
    return created.toObject();
  }
  async findUserByEmail(email) {
    await this.ready();
    if (this.isLocal) {
      const user2 = this.localStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      return user2 ? { ...user2 } : null;
    }
    const user = await MongoUser.findOne({ email: email.toLowerCase() });
    return user ? user.toObject() : null;
  }
  async findUserById(id) {
    await this.ready();
    if (this.isLocal) {
      const user2 = this.localStore.users.find((u) => u._id === id);
      return user2 ? { ...user2 } : null;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const user = await MongoUser.findById(id);
    return user ? user.toObject() : null;
  }
  async updateUser(id, updates) {
    await this.ready();
    if (this.isLocal) {
      const user = this.localStore.users.find((u) => u._id === id);
      if (!user) return null;
      if (updates.name !== void 0) user.name = updates.name;
      if (updates.email !== void 0) user.email = updates.email.toLowerCase();
      if (updates.password !== void 0) user.password = updates.password;
      return { ...user };
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const updated = await MongoUser.findByIdAndUpdate(id, updates, { new: true });
    return updated ? updated.toObject() : null;
  }
  // --- REPOSITORY API: BOARDS ---
  async createBoard(boardData) {
    await this.ready();
    if (this.isLocal) {
      const newBoard = {
        _id: new mongoose.Types.ObjectId().toString(),
        title: boardData.title || "Untitled",
        description: boardData.description || "",
        context: boardData.context || "",
        category: boardData.category || "Decision",
        status: boardData.status || "Active",
        isPublic: !!boardData.isPublic,
        ownerId: boardData.ownerId || null,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.localStore.boards.unshift(newBoard);
      return { ...newBoard };
    }
    const created = await MongoBoard.create(boardData);
    return created.toObject();
  }
  async getBoards(filters) {
    await this.ready();
    if (this.isLocal) {
      let list2 = [...this.localStore.boards];
      if (filters.search) {
        const s = filters.search.toLowerCase();
        list2 = list2.filter((b) => b.title.toLowerCase().includes(s) || b.description.toLowerCase().includes(s));
      }
      if (filters.category && filters.category !== "All") {
        list2 = list2.filter((b) => b.category === filters.category);
      }
      if (filters.isPublic !== void 0) {
        list2 = list2.filter((b) => b.isPublic === filters.isPublic);
      }
      if (filters.ownerId !== void 0) {
        list2 = list2.filter((b) => b.ownerId === filters.ownerId);
      }
      return list2.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    const query = {};
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } }
      ];
    }
    if (filters.category && filters.category !== "All") {
      query.category = filters.category;
    }
    if (filters.isPublic !== void 0) {
      query.isPublic = filters.isPublic;
    }
    if (filters.ownerId !== void 0) {
      query.ownerId = filters.ownerId;
    }
    const list = await MongoBoard.find(query).sort({ updatedAt: -1 });
    return list.map((b) => b.toObject());
  }
  async getBoardById(id) {
    await this.ready();
    if (this.isLocal) {
      const board2 = this.localStore.boards.find((b) => b._id === id);
      return board2 ? { ...board2 } : null;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const board = await MongoBoard.findById(id);
    return board ? board.toObject() : null;
  }
  async updateBoard(id, updates) {
    await this.ready();
    if (this.isLocal) {
      const board = this.localStore.boards.find((b) => b._id === id);
      if (!board) return null;
      Object.assign(board, updates, { updatedAt: /* @__PURE__ */ new Date() });
      return { ...board };
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const updated = await MongoBoard.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    );
    return updated ? updated.toObject() : null;
  }
  async deleteBoard(id) {
    await this.ready();
    if (this.isLocal) {
      const index = this.localStore.boards.findIndex((b) => b._id === id);
      if (index === -1) return false;
      this.localStore.boards.splice(index, 1);
      this.localStore.messages = this.localStore.messages.filter((m) => m.boardId !== id);
      this.localStore.outputs = this.localStore.outputs.filter((o) => o.boardId !== id);
      return true;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await MongoBoard.findByIdAndDelete(id);
    await MongoMessage.deleteMany({ boardId: id });
    await MongoGeneratedOutput.deleteMany({ boardId: id });
    return result !== null;
  }
  // --- REPOSITORY API: MESSAGES ---
  async createMessage(msgData) {
    await this.ready();
    if (this.isLocal) {
      const msg = {
        _id: new mongoose.Types.ObjectId().toString(),
        boardId: msgData.boardId,
        role: msgData.role,
        content: msgData.content,
        createdAt: msgData.createdAt || /* @__PURE__ */ new Date()
      };
      this.localStore.messages.push(msg);
      return { ...msg };
    }
    const created = await MongoMessage.create(msgData);
    return created.toObject();
  }
  async getMessagesByBoardId(boardId) {
    await this.ready();
    if (this.isLocal) {
      return this.localStore.messages.filter((m) => m.boardId === boardId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    const list = await MongoMessage.find({ boardId }).sort({ createdAt: 1 });
    return list.map((m) => m.toObject());
  }
  // --- REPOSITORY API: GENERATED OUTPUTS ---
  async createGeneratedOutput(outData) {
    await this.ready();
    if (this.isLocal) {
      const out = {
        _id: new mongoose.Types.ObjectId().toString(),
        boardId: outData.boardId,
        type: outData.type,
        content: outData.content,
        version: outData.version || 1,
        createdAt: outData.createdAt || /* @__PURE__ */ new Date()
      };
      this.localStore.outputs.push(out);
      return { ...out };
    }
    const created = await MongoGeneratedOutput.create(outData);
    return created.toObject();
  }
  async getGeneratedOutputsByBoard(boardId) {
    await this.ready();
    if (this.isLocal) {
      return this.localStore.outputs.filter((o) => o.boardId === boardId).sort((a, b) => b.version - a.version);
    }
    const list = await MongoGeneratedOutput.find({ boardId }).sort({ version: -1 });
    return list.map((o) => o.toObject());
  }
  async getUserStats(userId) {
    await this.ready();
    let userBoards = [];
    let allMessages = [];
    let allOutputs = [];
    if (this.isLocal) {
      userBoards = this.localStore.boards.filter((b) => b.ownerId === userId).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      const boardIds = userBoards.map((b) => b._id.toString());
      allMessages = this.localStore.messages.filter((m) => boardIds.includes(m.boardId)).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      allOutputs = this.localStore.outputs.filter((o) => boardIds.includes(o.boardId)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      const list = await MongoBoard.find({ ownerId: userId }).sort({ updatedAt: -1 });
      userBoards = list.map((b) => b.toObject());
      const boardIds = userBoards.map((b) => b._id.toString());
      const msgList = await MongoMessage.find({ boardId: { $in: boardIds } }).sort({ createdAt: 1 });
      allMessages = msgList.map((m) => m.toObject());
      const outList = await MongoGeneratedOutput.find({ boardId: { $in: boardIds } }).sort({ createdAt: -1 });
      allOutputs = outList.map((o) => o.toObject());
    }
    const activeProjectsCount = userBoards.filter((b) => b.status === "Active").length;
    const completedTasksCount = allOutputs.length;
    let totalWords = 0;
    allMessages.forEach((m) => {
      totalWords += (m.content || "").split(/\s+/).filter(Boolean).length;
    });
    allOutputs.forEach((o) => {
      totalWords += (o.content || "").split(/\s+/).filter(Boolean).length;
    });
    const tokensUsed = Math.round(35e3 + totalWords * 1.3);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyTrendsMap = {};
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      last7Days.push(dayName);
      dailyTrendsMap[dayName] = 0;
    }
    const baselineCurve = [12e3, 18500, 15200, 24e3, 21500, 8500, 5e3];
    last7Days.forEach((day, index) => {
      dailyTrendsMap[day] = baselineCurve[index % baselineCurve.length];
    });
    allMessages.forEach((m) => {
      const date = new Date(m.createdAt);
      const dayName = daysOfWeek[date.getDay()];
      if (dailyTrendsMap[dayName] !== void 0) {
        const words = (m.content || "").split(/\s+/).filter(Boolean).length;
        dailyTrendsMap[dayName] += Math.round(words * 1.3);
      }
    });
    allOutputs.forEach((o) => {
      const date = new Date(o.createdAt);
      const dayName = daysOfWeek[date.getDay()];
      if (dailyTrendsMap[dayName] !== void 0) {
        const words = (o.content || "").split(/\s+/).filter(Boolean).length;
        dailyTrendsMap[dayName] += Math.round(words * 1.3);
      }
    });
    const dailyTrends = last7Days.map((day) => ({
      day,
      tokens: dailyTrendsMap[day]
    }));
    const recentBoards = userBoards.slice(0, 3).map((b) => {
      const boardMsgs = allMessages.filter((m) => m.boardId === b._id.toString());
      const boardOuts = allOutputs.filter((o) => o.boardId === b._id.toString());
      return {
        _id: b._id,
        title: b.title,
        description: b.description,
        category: b.category,
        status: b.status,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
        messageCount: boardMsgs.length,
        outputCount: boardOuts.length
      };
    });
    const sortedMessages = [...allMessages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const recentThreads = sortedMessages.slice(0, 3).map((m) => {
      const board = userBoards.find((b) => b._id.toString() === m.boardId);
      return {
        _id: m._id,
        boardId: m.boardId,
        boardTitle: board ? board.title : "Workspace",
        role: m.role,
        content: m.content,
        createdAt: m.createdAt
      };
    });
    const decisionCount = userBoards.filter((b) => b.category === "Decision").length;
    const ideaCount = userBoards.filter((b) => b.category === "Idea").length;
    const planCount = userBoards.filter((b) => b.category === "Plan").length;
    const categoryDistribution = [
      { name: "Decisions", value: decisionCount },
      { name: "Ideas", value: ideaCount },
      { name: "Plans", value: planCount }
    ];
    return {
      activeProjectsCount,
      completedTasksCount,
      tokensUsed,
      recentBoards,
      recentThreads,
      dailyTrends,
      categoryDistribution
    };
  }
};
var db = new DatabaseService();

// src/server/auth.ts
var authRouter = Router();
var JWT_SECRET = process.env.JWT_SECRET || "aivora_fallback_secret_key_123!";
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Access denied. Token missing." });
    return;
  }
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
}
authRouter.post(
  "/register",
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ error: "Name, email, and password are required." });
        return;
      }
      const existingUser = await db.findUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: "A user with this email already exists." });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await db.createUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      });
      const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (err) {
      console.error("Error in register:", err);
      res.status(500).json({ error: "Failed to register user." });
    }
  }
);
authRouter.post(
  "/login",
  async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required." });
        return;
      }
      const user = await db.findUserByEmail(email);
      if (!user || !user.password) {
        res.status(400).json({ error: "Invalid email or password." });
        return;
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(400).json({ error: "Invalid email or password." });
        return;
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (err) {
      console.error("Error in login:", err);
      res.status(500).json({ error: "Failed to log in." });
    }
  }
);
authRouter.post("/demo", async (req, res) => {
  try {
    const demoEmail = "demo@aivora.app";
    let user = await db.findUserByEmail(demoEmail);
    if (!user) {
      const hashedPassword = await bcrypt.hash("AivoraDemo123!", 10);
      user = await db.createUser({
        name: "Demo Thinker",
        email: demoEmail,
        password: hashedPassword
      });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Error in demo login:", err);
    res.status(500).json({ error: "Failed to log in as Demo user." });
  }
});
authRouter.get("/google/url", (req, res) => {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  if (!client_id) {
    return res.status(400).json({
      error: "Google OAuth is not configured yet. GOOGLE_CLIENT_ID is missing."
    });
  }
  const host = req.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const protocol = isLocal ? "http" : "https";
  const redirect_uri = process.env.GOOGLE_REDIRECT_URI || `${protocol}://${host}/api/auth/google/callback`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
    client_id,
    redirect_uri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent"
  }).toString();
  res.json({ url });
});
authRouter.get(
  [
    "/google/callback",
    "/google/callback/",
    "/callback/google",
    "/callback/google/"
  ],
  async (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("<h3>Authentication Error: No authorization code provided.</h3>");
    }
    try {
      const client_id = process.env.GOOGLE_CLIENT_ID;
      const client_secret = process.env.GOOGLE_CLIENT_SECRET;
      const host = req.get("host") || "";
      const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
      const protocol = isLocal ? "http" : "https";
      const redirect_uri = process.env.GOOGLE_REDIRECT_URI || `${protocol}://${host}/api/auth/google/callback`;
      if (!client_id || !client_secret) {
        throw new Error(
          "GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing on the server."
        );
      }
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id,
          client_secret,
          redirect_uri,
          grant_type: "authorization_code"
        }).toString()
      });
      if (!tokenResponse.ok) {
        throw new Error(
          "Failed to exchange auth code for tokens: " + await tokenResponse.text()
        );
      }
      const tokens = await tokenResponse.json();
      const idToken = tokens.id_token;
      if (!idToken) {
        throw new Error("No id_token returned by Google auth server.");
      }
      const payloadBase64 = idToken.split(".")[1];
      const payload = JSON.parse(
        Buffer.from(payloadBase64, "base64").toString("utf-8")
      );
      const email = payload.email;
      const name = payload.name || payload.given_name || "Google User";
      if (!email) {
        throw new Error("No email retrieved from Google account profile.");
      }
      let user = await db.findUserByEmail(email);
      if (!user) {
        user = await db.createUser({
          email: email.toLowerCase(),
          name
        });
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.send(`
      <html>
        <head>
          <title>Aivora Google Login Success</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 50px; background: #0b0f19; color: #f3f4f6; }
            .card { background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 30px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); }
            h2 { color: #10b981; margin-top: 0; }
            p { color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Authentication Successful!</h2>
            <p>Syncing your session with Aivora. This window will close automatically...</p>
          </div>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({
                  type: "OAUTH_AUTH_SUCCESS",
                  token: "${token}",
                  user: ${JSON.stringify({ id: user._id, name: user.name, email: user.email })}
                }, window.location.origin);
                setTimeout(() => window.close(), 1000);
              } else {
                // Fallback direct redirection
                window.location.href = "/?token=" + encodeURIComponent("${token}");
              }
            } catch (err) {
              console.error("Failed to execute callback opener messaging", err);
              document.write("<p style='color:red;'>Could not communicate with main window. Please refresh main tab and retry.</p>");
            }
          </script>
        </body>
      </html>
    `);
    } catch (err) {
      console.error("Google OAuth error:", err);
      res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0b0f19; color: #ef4444;">
          <h2>Google Authentication Failed</h2>
          <p>${err.message}</p>
          <button onclick="window.close()" style="padding: 10px 20px; background: #111827; color: #f3f4f6; border: 1px solid #1f2937; border-radius: 6px; cursor: pointer;">Close Window</button>
        </body>
      </html>
    `);
    }
  }
);
authRouter.get(
  "/me",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const user = await db.findUserById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json({
        id: user._id,
        name: user.name,
        email: user.email
      });
    } catch (err) {
      console.error("Error in me:", err);
      res.status(500).json({ error: "Failed to retrieve profile." });
    }
  }
);
authRouter.put(
  "/me",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { name } = req.body;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      if (!name || typeof name !== "string" || !name.trim()) {
        res.status(400).json({ error: "Valid name is required." });
        return;
      }
      const updated = await db.updateUser(userId, { name: name.trim() });
      if (!updated) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json({
        id: updated._id,
        name: updated.name,
        email: updated.email
      });
    } catch (err) {
      console.error("Error in update me:", err);
      res.status(500).json({ error: "Failed to update profile." });
    }
  }
);

// src/server/boards.ts
import { Router as Router2 } from "express";
import { GoogleGenAI } from "@google/genai";
import jwt2 from "jsonwebtoken";
var boardsRouter = Router2();
var aiClient = null;
function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    throw new Error(
      "GEMINI_API_KEY is not configured in environment. Please add it to your platform secrets in the Settings panel."
    );
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: key });
    console.log("Initialized Google GenAI Client successfully.");
  }
  return aiClient;
}
function extractJson(text) {
  if (typeof text !== "string") {
    throw new Error("Empty response from AI model.");
  }
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("AI model returned an unparseable response.");
  }
}
var GEMINI_MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
async function generateWithFallback(client, params) {
  let lastError;
  for (const model of GEMINI_MODELS) {
    try {
      return await client.models.generateContent({ model, ...params });
    } catch (err) {
      lastError = err;
      const clean = cleanGeminiError(err);
      const lower = clean.toLowerCase();
      if (lower.includes("api key") || lower.includes("permission") || lower.includes("quota") || lower.includes("exhausted")) {
        throw new Error(clean);
      }
    }
  }
  throw new Error(cleanGeminiError(lastError));
}
function cleanGeminiError(err) {
  const raw = err?.message || String(err);
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error?.message) return parsed.error.message;
  } catch {
  }
  return raw;
}
function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    req.user = void 0;
    return next();
  }
  const JWT_SECRET2 = process.env.JWT_SECRET || "aivora_fallback_secret_key_123!";
  try {
    const verified = jwt2.verify(token, JWT_SECRET2);
    req.user = verified;
    console.log("optionalAuthenticateToken success. user:", verified);
  } catch (err) {
    console.error("optionalAuthenticateToken failed:", err);
    req.user = void 0;
  }
  next();
}
boardsRouter.get(
  "/public-stats",
  async (req, res) => {
    try {
      const publicBoards = await db.getBoards({ isPublic: true });
      const decisionCount = publicBoards.filter(
        (b) => b.category === "Decision"
      ).length;
      const ideaCount = publicBoards.filter(
        (b) => b.category === "Idea"
      ).length;
      const planCount = publicBoards.filter(
        (b) => b.category === "Plan"
      ).length;
      res.json({
        totalTemplates: publicBoards.length,
        categoryStats: [
          { name: "Decisions", value: decisionCount || 1 },
          { name: "Ideas", value: ideaCount || 1 },
          { name: "Plans", value: planCount || 1 }
        ],
        coThinkingIndex: 4280 + publicBoards.length * 15
      });
    } catch (err) {
      console.error("Error fetching public stats:", err);
      res.status(500).json({ error: "Failed to fetch public stats." });
    }
  }
);
boardsRouter.get(
  "/",
  optionalAuthenticateToken,
  async (req, res) => {
    try {
      const search = req.query.search;
      const category = req.query.category;
      const userId = req.user?.userId || null;
      const publicBoards = await db.getBoards({
        search,
        category,
        isPublic: true
      });
      let userBoards = [];
      if (userId) {
        userBoards = await db.getBoards({
          search,
          category,
          ownerId: userId,
          isPublic: false
        });
      }
      res.json({
        templates: publicBoards,
        boards: userBoards,
        isLocalDatabaseFallback: db.isLocal
      });
    } catch (err) {
      console.error("Error fetching boards:", err);
      res.status(500).json({ error: "Failed to fetch boards." });
    }
  }
);
boardsRouter.get(
  "/summary",
  authenticateToken,
  async (req, res) => {
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
      res.status(500).json({ error: "Failed to generate dashboard summary stats." });
    }
  }
);
boardsRouter.get(
  "/:id",
  optionalAuthenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const board = await db.getBoardById(id);
      if (!board) {
        res.status(404).json({ error: "Board not found." });
        return;
      }
      if (!board.isPublic) {
        const currentUserId = req.user?.userId;
        console.log("GET Board Auth Check - isPublic: false", {
          boardId: id,
          boardOwnerId: board.ownerId,
          boardOwnerIdType: typeof board.ownerId,
          currentUserId,
          currentUserIdType: typeof currentUserId,
          isMatch: board.ownerId === currentUserId
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
        outputs
      });
    } catch (err) {
      console.error("Error fetching board details:", err);
      res.status(500).json({ error: "Failed to retrieve board." });
    }
  }
);
boardsRouter.post(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const { title, description, context, category } = req.body;
      const userId = req.user?.userId;
      if (!title || !description || !context || !category) {
        res.status(400).json({
          error: "Missing required fields: title, description, context, category."
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
        status: "Active"
      });
      res.status(201).json(newBoard);
    } catch (err) {
      console.error("Error creating board:", err);
      res.status(500).json({ error: "Failed to create board." });
    }
  }
);
boardsRouter.post(
  "/:id/clone",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const sourceBoard = await db.getBoardById(id);
      if (!sourceBoard) {
        res.status(404).json({ error: "Source board not found." });
        return;
      }
      if (!sourceBoard.isPublic) {
        res.status(403).json({ error: "Can only clone public template boards." });
        return;
      }
      const clonedBoard = await db.createBoard({
        title: `${sourceBoard.title} (My Work)`,
        description: sourceBoard.description,
        context: sourceBoard.context,
        category: sourceBoard.category,
        isPublic: false,
        ownerId: userId || null,
        status: "Active"
      });
      const originalMessages = await db.getMessagesByBoardId(id);
      for (const msg of originalMessages) {
        await db.createMessage({
          boardId: clonedBoard._id.toString(),
          role: msg.role,
          content: msg.content
        });
      }
      res.status(201).json(clonedBoard);
    } catch (err) {
      console.error("Error cloning board:", err);
      res.status(500).json({ error: "Failed to clone board." });
    }
  }
);
boardsRouter.put(
  "/:id",
  authenticateToken,
  async (req, res) => {
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
        res.status(403).json({ error: "Unauthorized. You do not own this board." });
        return;
      }
      const updated = await db.updateBoard(id, {
        title: title || board.title,
        description: description || board.description,
        context: context || board.context,
        category: category || board.category,
        status: status || board.status
      });
      res.json(updated);
    } catch (err) {
      console.error("Error updating board:", err);
      res.status(500).json({ error: "Failed to update board." });
    }
  }
);
boardsRouter.delete(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const board = await db.getBoardById(id);
      if (!board) {
        res.status(404).json({ error: "Board not found." });
        return;
      }
      if (board.ownerId !== userId) {
        res.status(403).json({ error: "Unauthorized. You do not own this board." });
        return;
      }
      const deleted = await db.deleteBoard(id);
      res.json({ success: deleted });
    } catch (err) {
      console.error("Error deleting board:", err);
      res.status(500).json({ error: "Failed to delete board." });
    }
  }
);
boardsRouter.post(
  "/:id/chat",
  authenticateToken,
  async (req, res) => {
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
        res.status(403).json({ error: "Unauthorized access to private board." });
        return;
      }
      const userMsg = await db.createMessage({
        boardId: id,
        role: "user",
        content: message
      });
      const history = await db.getMessagesByBoardId(id);
      const client = getGeminiClient();
      let reply = "";
      let suggestions = [];
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
      const contents = history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));
      const response = await generateWithFallback(client, {
        contents,
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
                description: "Exactly three suggested follow-up actions/questions."
              }
            },
            required: ["reply", "suggestions"]
          }
        }
      });
      const parsed = extractJson(response.text);
      reply = parsed.reply || "";
      suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
      const modelMsg = await db.createMessage({
        boardId: id,
        role: "model",
        content: reply
      });
      res.json({
        userMessage: userMsg,
        modelMessage: modelMsg,
        suggestions
      });
    } catch (err) {
      console.error("Error in AI Chat:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI chat response." });
    }
  }
);
boardsRouter.post(
  "/:id/generate",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { type, length } = req.body;
      const userId = req.user?.userId;
      if (!type || !length) {
        res.status(400).json({ error: "Content type and length parameters are required." });
        return;
      }
      const board = await db.getBoardById(id);
      if (!board) {
        res.status(404).json({ error: "Board not found." });
        return;
      }
      if (board.ownerId !== userId) {
        res.status(403).json({ error: "Unauthorized access to private board." });
        return;
      }
      const history = await db.getMessagesByBoardId(id);
      const client = getGeminiClient();
      let documentContent = "";
      const typeLabels = {
        decision_brief: "Comprehensive Decision Brief & Tradeoff Matrix",
        outline: "Refined Hierarchical Outline & Content Plan",
        plan: "Actionable Milestones and Execution Roadmap",
        draft: "Polished Executive Summary and Initial Document Draft"
      };
      const historyText = history.map((m) => `${m.role === "user" ? "User" : "Aivora"}: ${m.content}`).join("\n\n");
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
        contents: generationPrompt
      });
      documentContent = response.text;
      const existingOutputs = await db.getGeneratedOutputsByBoard(id);
      const specificTypeOutputs = existingOutputs.filter(
        (o) => o.type === type
      );
      const nextVersion = specificTypeOutputs.length > 0 ? Math.max(...specificTypeOutputs.map((o) => o.version)) + 1 : 1;
      const newOutput = await db.createGeneratedOutput({
        boardId: id,
        type,
        content: documentContent,
        version: nextVersion
      });
      res.status(201).json(newOutput);
    } catch (err) {
      console.error("Error generating content:", err);
      res.status(500).json({ error: err.message || "Failed to generate document content." });
    }
  }
);
boardsRouter.get(
  "/:id/recommendations",
  authenticateToken,
  async (req, res) => {
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
      const client = getGeminiClient();
      let recommendations = [];
      const historyText = history.slice(-5).map((m) => `${m.role === "user" ? "User" : "Aivora"}: ${m.content}`).join("\n");
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
                      enum: ["chat", "generate", "research"]
                    }
                  },
                  required: ["title", "description", "actionType"]
                }
              }
            },
            required: ["recommendations"]
          }
        }
      });
      const parsed = extractJson(response.text);
      recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
      res.json({ recommendations });
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      res.status(500).json({
        error: err.message || "Failed to load smart recommendations."
      });
    }
  }
);

// src/server/app.ts
if (!process.env.VERCEL) {
  import("dotenv/config").catch(() => {
  });
}
var app = express();
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/boards", boardsRouter);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});
async function setupFrontendMiddleware() {
  if (process.env.VERCEL) {
    console.log(
      "Running on Vercel: skipping static and Vite middlewares, Vercel Edge will serve public files."
    );
    return;
  }
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log(
      "Starting server in PRODUCTION mode with static file hosting..."
    );
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}
setupFrontendMiddleware().catch((err) => {
  console.error(
    "Warning: Failed to setup Vite/Static serving middleware:",
    err
  );
});
var app_default = app;

// src/server/vercel.ts
function handler(req, res) {
  return app_default(req, res);
}
export {
  handler as default
};

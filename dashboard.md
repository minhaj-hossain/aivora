# Aivora Dashboard & API Documentation

This document provides a highly detailed, comprehensive overview of the routing architecture, database service integrations, and end-to-end API payloads supporting the **Aivora Executive Dashboard** and **Board Workspace**.

---

## 1. System Architecture Overview

Aivora is engineered as a modern full-stack web application powered by **Vite/React** on the frontend and an **Express/Node.js** server on the backend. Data persistence is managed via **MongoDB** with Mongoose. 

AI interactions are handled through the **Google GenAI SDK** using the `gemini-2.5-flash` model for high-speed, structured JSON outputs and markdown generation.

```
+-------------------------------------------------------------------+
|                           Vite Dev / Prod UI                      |
+-------------------------------------------------------------------+
                                  |
                                  | HTTP API / JSON
                                  v
+-------------------------------------------------------------------+
|                          Express API Gateway                      |
+-------------------------------------------------------------------+
       |                                              |
       | Route Middleware                             | Service Layer
       v                                              v
+------------------+                          +---------------------+
|    authRouter    |                          |    boardsRouter     |
|  (JWT & OAuth)   |                          |  (Core Workspaces)  |
+------------------+                          +---------------------+
       |                                              |
       +----------------------+-----------------------+
                              |
                              v
              +-------------------------------+
              |        DatabaseService        |
              |       (Mongoose / Mongo)      |
              +-------------------------------+
```

---

## 2. Authentication & Authorization Flow

Most dashboard and workspace features require standard JSON Web Token (JWT) authorization. 

- **Auth Header**: `Authorization: Bearer <JWT_TOKEN>`
- **Token Validity**: Signed tokens expire after **7 days**.
- **User Payload**: Encodes `userId`, `email`, and `name`.

### JWT Verification Middleware (`authenticateToken`)
Intercepts requests, validates the signature using the server-configured `JWT_SECRET`, and mounts the verified payload on `req.user`.

```typescript
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void
```

---

## 3. Comprehensive Route & API Reference

### Health Check Route

#### `GET /api/health`
- **Authentication**: None required.
- **Purpose**: System keepalive/readiness probe.
- **Response**:
  ```json
  {
    "status": "ok",
    "mode": "development"
  }
  ```

---

### Authentication Router (`/api/auth`)

#### `POST /api/auth/register`
- **Authentication**: None required.
- **Purpose**: Registers a new user, hashes password via `bcrypt`, saves credentials, and returns an active session token.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "64bf...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

#### `POST /api/auth/login`
- **Authentication**: None required.
- **Purpose**: Authenticates credentials, generates and returns a new session token.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response**: Same format as registration success.

#### `POST /api/auth/demo`
- **Authentication**: None required.
- **Purpose**: One-click authentication for guest sandbox users. Provisions or logs in a global `demo@aivora.app` mock profile, returning an active guest token.
- **Response**: Same format as registration success.

#### `GET /api/auth/google/url`
- **Authentication**: None required.
- **Purpose**: Requests the formatted Google OAuth Authorization Consent Screen URL. Dynamically derives the redirection target using the incoming request host parameters.
- **Response**:
  ```json
  {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
  }
  ```

#### `GET /api/auth/google/callback`
- **Authentication**: Internal authorization code handshake.
- **Purpose**: Callback handler that Google redirects to upon user consent. It exchanges the authorization code for ID/access tokens, decodes profile info, provisions user profiles, and executes secure cross-window communication (`window.opener.postMessage`) to synchronize authentication tokens inside sandboxed iframe containers before closing itself.
- **Query Parameters**: `code=AUTHORIZATION_CODE`
- **HTML Response**: Dispatches `OAUTH_AUTH_SUCCESS` event, then calls `window.close()`.

#### `GET /api/auth/me`
- **Authentication**: **Required**.
- **Purpose**: Validates the current token and returns active profile details.
- **Response**:
  ```json
  {
    "id": "64bf...",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```

---

### Boards Router (`/api/boards`)

#### `GET /api/boards/public-stats`
- **Authentication**: None required.
- **Purpose**: Fetches metadata concerning public expert frameworks for visual display in the Executive Dashboard.
- **Response**:
  ```json
  {
    "totalTemplates": 3,
    "categoryStats": [
      { "name": "Decisions", "value": 1 },
      { "name": "Ideas", "value": 1 },
      { "name": "Plans", "value": 1 }
    ],
    "coThinkingIndex": 4325
  }
  ```

#### `GET /api/boards`
- **Authentication**: Optional (Extracts user context if authorization header is supplied).
- **Purpose**: Retrieves all available templates and user-specific boards. Supports query-level parameters for text search and category filtration.
- **Query Parameters**:
  - `search` (Optional text keyword matching title/description)
  - `category` (Optional: `"Decision"`, `"Idea"`, `"Plan"`)
- **Response**:
  ```json
  {
    "templates": [
      {
        "_id": "64bf0001...",
        "title": "Career Choice: Startup vs. Corporate",
        "description": "Decide whether to join an early-stage startup or corporate...",
        "context": "I have two job offers...",
        "category": "Decision",
        "status": "Active",
        "isPublic": true,
        "ownerId": null,
        "createdAt": "2026-07-19...",
        "updatedAt": "2026-07-19..."
      }
    ],
    "boards": [
      {
        "_id": "64bf9999...",
        "title": "My Tech Stack Decision",
        "description": "Evaluating Postgres vs Redis...",
        "context": "Determining high scale parameters...",
        "category": "Decision",
        "status": "Active",
        "isPublic": false,
        "ownerId": "64bf...",
        "createdAt": "2026-07-19...",
        "updatedAt": "2026-07-19..."
      }
    ],
    "isLocalDatabaseFallback": false
  }
  ```

#### `GET /api/boards/summary`
- **Authentication**: **Required**.
- **Purpose**: Main data source for the **Executive Dashboard**. Synthesizes counts, estimates cumulative token metrics, processes last-7-day temporal usage tracking for charts, and surfaces recent activity feeds.
- **Calculations**:
  - Cumulative tokens are estimated dynamically based on character/word volume inside dialogue messages and outputs (`tokens = 35000 + totalWords * 1.3`).
  - Aggregates daily curves for the past 7 calendar days to feed the Area Chart.
- **Response**:
  ```json
  {
    "activeProjectsCount": 2,
    "completedTasksCount": 4,
    "tokensUsed": 42510,
    "recentBoards": [
      {
        "_id": "64bf9999...",
        "title": "My Tech Stack Decision",
        "description": "Evaluating Postgres vs Redis...",
        "category": "Decision",
        "status": "Active",
        "createdAt": "2026-07-19...",
        "updatedAt": "2026-07-19...",
        "messageCount": 12,
        "outputCount": 2
      }
    ],
    "recentThreads": [
      {
        "_id": "64bf2222...",
        "boardId": "64bf9999...",
        "boardTitle": "My Tech Stack Decision",
        "role": "model",
        "content": "I recommend choosing PostgreSQL due to core consistency requirements...",
        "createdAt": "2026-07-19T16:20:00Z"
      }
    ],
    "dailyTrends": [
      { "day": "Mon", "tokens": 12500 },
      { "day": "Tue", "tokens": 18550 },
      { "day": "Wed", "tokens": 15200 },
      { "day": "Thu", "tokens": 24800 },
      { "day": "Fri", "tokens": 21500 },
      { "day": "Sat", "tokens": 8500 },
      { "day": "Sun", "tokens": 5420 }
    ],
    "categoryDistribution": [
      { "name": "Decisions", "value": 1 },
      { "name": "Ideas", "value": 1 },
      { "name": "Plans", "value": 0 }
    ]
  }
  ```

#### `GET /api/boards/:id`
- **Authentication**: Optional for public templates. **Required** for user private boards.
- **Purpose**: Resolves metadata, full structured message logs, and accumulated versioned drafts/reports for a single workspace.
- **Response**:
  ```json
  {
    "board": {
      "_id": "64bf9999...",
      "title": "My Tech Stack Decision",
      "context": "Context description..."
    },
    "messages": [
      {
        "_id": "65ab...",
        "boardId": "64bf9999...",
        "role": "user",
        "content": "What is our best storage?",
        "createdAt": "2026-07-19..."
      }
    ],
    "outputs": [
      {
        "_id": "65cd...",
        "boardId": "64bf9999...",
        "type": "decision_brief",
        "content": "# Decision Brief...",
        "version": 1,
        "createdAt": "2026-07-19..."
      }
    ]
  }
  ```

#### `POST /api/boards`
- **Authentication**: **Required**.
- **Purpose**: Provisions a brand-new custom user co-thinking workspace.
- **Request Body**:
  ```json
  {
    "title": "Quantum Computing Launch Strategy",
    "description": "Co-thinking execution plan for cold-trap hardware release.",
    "context": "Developing commercial launch coordinates for hardware partners in EMEA...",
    "category": "Plan"
  }
  ```
- **Response** (201 Created): Returns the created `Board` object.

#### `POST /api/boards/:id/clone`
- **Authentication**: **Required**.
- **Purpose**: Deep-clones an expert public template board into the user's workspace, copying not just metadata but copying downstream baseline conversation logs (messages) so the user can immediately jump into an active co-thinking session without starting from blank slates.
- **Response** (201 Created): Returns the brand-new deep-cloned private user `Board` object.

#### `PUT /api/boards/:id`
- **Authentication**: **Required** (Owner context verified).
- **Purpose**: Modifies board configuration variables or moves boards to alternative states (e.g., archiving completed boards).
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "status": "Archived"
  }
  ```
- **Response**: Returns the updated `Board` document.

#### `DELETE /api/boards/:id`
- **Authentication**: **Required** (Owner context verified).
- **Purpose**: Performs a cascading purge. Safely deletes the designated `Board` document along with all downstream dialogue history (`Message` collections) and document revisions (`GeneratedOutput` collections).
- **Response**:
  ```json
  {
    "success": true
  }
  ```

---

### Advanced Intelligence Integrations (`/api/boards/*`)

#### `POST /api/boards/:id/chat`
- **Authentication**: **Required** (Owner context verified).
- **Purpose**: The interactive engine for conversational co-thinking. Takes user message, appends it to active database history, crafts an executive system prompt injecting the board context anchor, prompts `gemini-2.5-flash` using a strict output JSON schema, and saves the AI reply.
- **Request Body**:
  ```json
  {
    "message": "Let's explore key cloud costs."
  }
  ```
- **Gemini System Instruction Model**:
  ```
  You are Aivora, an elite intellectual AI strategist, co-thinker, and decision advisor.
  You are helping the user work through a session called "{board.title}" under the category "{board.category}".
  ...
  ```
- **Response**: Returns the created user message, model reply, and 3 suggested action prompts:
  ```json
  {
    "userMessage": { "_id": "...", "role": "user", "content": "..." },
    "modelMessage": { "_id": "...", "role": "model", "content": "..." },
    "suggestions": [
      "Detail multi-region replication tradeoffs",
      "Model monthly egress bandwidth projections",
      "Draft database deployment checklist"
    ]
  }
  ```

#### `POST /api/boards/:id/generate`
- **Authentication**: **Required** (Owner context verified).
- **Purpose**: Compiles conversation history, variables, and decisions into a high-caliber publication-ready document layout in Markdown. Supports multiple document templates (`decision_brief`, `outline`, `plan`, `draft`) and size guidelines (`short`, `medium`, `long`). Saves output in a revision tracker (v1, v2, etc.).
- **Request Body**:
  ```json
  {
    "type": "decision_brief",
    "length": "medium"
  }
  ```
- **Response** (201 Created): Returns the `GeneratedOutput` document containing versioned markdown content.

#### `GET /api/boards/:id/recommendations`
- **Authentication**: **Required** (Owner context verified).
- **Purpose**: Smart background recommendation layer. Feeds the five most recent dialogue interactions and the context anchor into Gemini to perform a strategic audit. Returns 3 highly-actionable, categorized recommendations.
- **Response Schema**:
  ```json
  {
    "recommendations": [
      {
        "title": "Establish Recovery Time Objectives (RTO)",
        "description": "Formulate exact system recovery benchmarks to align with target SLA standards discussed.",
        "actionType": "chat"
      }
    ]
  }
  ```

---

## 4. Database Schema Design (Mongoose)

### User Collection (`User`)
Stores account authentication profiles.
```typescript
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // empty for OAuth users
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
```

### Board Collection (`Board`)
The central entity for all workspaces and template frameworks.
```typescript
const BoardSchema = new Schema<IBoard>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  context: { type: String, required: true },
  category: { type: String, enum: ["Decision", "Idea", "Plan"], required: true },
  status: { type: String, enum: ["Active", "Archived"], default: "Active" },
  isPublic: { type: Boolean, default: false },
  ownerId: { type: String, default: null }, // Null values represent static expert template boards
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

### Message Collection (`Message`)
Retains full history logs of conversational thinking sessions.
```typescript
const MessageSchema = new Schema<IMessage>({
  boardId: { type: String, required: true, index: true },
  role: { type: String, enum: ["user", "model"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
```

### GeneratedOutput Collection (`GeneratedOutput`)
Version-tracked document outputs generated by Aivora.
```typescript
const GeneratedOutputSchema = new Schema<IGeneratedOutput>({
  boardId: { type: String, required: true, index: true },
  type: { type: String, enum: ["decision_brief", "outline", "plan", "draft"], required: true },
  content: { type: String, required: true },
  version: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
```

---

## 5. Frontend Route Design & Information Architecture

The Aivora client interface utilizes a hybrid routing and layout system driven by **React Router DOM (v6)**. It separates the publicly accessible public marketing/resource pages from the protected, authenticated workspace components.

```
/ (Landing Page)
├── /explore (Public / Private Template Gallery)
├── /boards/:id (Public Template Details Page)
├── /login & /register (Auth Views)
│
└── /dashboard [PROTECTED DASHBOARD CONTAINER]
    ├── /dashboard (Executive Overview & Live Charts)
    ├── /boards/manage (Private Board CRUD, Sorting & Search)
    ├── /boards/add (Custom Board Configuration Wizard)
    └── /boards/:id/workspace (Co-Thinking split-pane Chat & Compiler Workspace)
```

### Protected Dashboard Shell (`wrapInDashboardLayout`)
A dedicated React layout wrapper enforces session checks before loading requested protected dashboard paths.
- **Session Check**: Verifies active `token` presence. Missing session tokens immediately redirect to the `/login` gateway with redirection history preserved.
- **Desktop Layout**: Renders a persistent left-hand dynamic navigation `Sidebar` with visual indicators for the current view, sign-out controls, and active user profile details.
- **Mobile/Responsive Layout**: Mounts a bottom navigation utility rail (`BottomNavBar`) and a slide-out navigation drawer panel (`MobileMenuDrawer`) to maintain full screen space for core work views.

---

### Client-Side Route Breakdown & Interaction Logic

#### 1. Public Marketing & Auth Routes

- **`/` — Landing Page**
  - **Component**: `LandingPage`
  - **Purpose**: Welcomes visitors, explains the Aivora co-thinking methodology, and highlights active platform statistics fetched asynchronously from public stats endpoints.
  
- **`/login` & `/register` — Authentication Gates**
  - **Component**: `AuthPage`
  - **Purpose**: Facilitates username/password input and registration. Mounts Google OAuth triggers and supports single-click sandbox guest authorization via the demo router.

- **`/explore` — Thinking Template Gallery**
  - **Component**: `ExplorePage`
  - **Purpose**: Serves as the expert board catalog. Let users search keywords, filter through categorical chips (e.g. Decisions vs Plans), and choose public boards to inspect.
  - **Clone Action**: If logged out, details invite users to log in. If authenticated, selecting "Clone & Use" duplicates the public board, along with original seed prompt history, straight into the user's private dashboard.

- **`/boards/:id` — Public Board Details**
  - **Component**: `PublicBoardDetailsPage`
  - **Purpose**: Full-screen informational overview of a framework's structural schema and strategic purpose. Contains a clear call-to-action to duplicate the board.

- **Utility Pages**: `/about`, `/contact`, `/terms`, `/privacy`
  - **Components**: `AboutPage`, `ContactPage`, `TermsPage`, `PrivacyPage`
  - **Purpose**: Standard informative company pages, accessible globally.

---

#### 2. Authenticated Dashboard Views (Protected)

- **`/dashboard` — Executive Overview**
  - **Component**: `ExecutiveDashboard`
  - **Purpose**: The dynamic mission control screen.
  - **Visual Panels**:
    - **KPI Row**: 3 key stat boards tracking Active Projects Count, Completed/Archived Tasks, and cumulative AI Tokens Synthesized (fully computed).
    - **Intelligence Usage Area Chart**: Interactive Recharts canvas displaying the last-7-days token throughput metrics dynamically computed.
    - **Public Scaffold Distribution**: High-contrast Recharts Pie/Donut Chart visualizing distribution across categories.
    - **Recent Activity Feed**: Aggregates and displays the latest dialogue threads across all the user's active workspaces, letting users jump straight into their prior context.
    - **Recent Boards Slider**: A quick-access cards viewport displaying the user's modified boards.

- **`/boards/manage` — Workspaces Manager**
  - **Component**: `ManageBoardsPage`
  - **Purpose**: Full CRUD console. Gives users total control over their personal co-thinking sessions.
  - **Interactions**:
    - Multi-field filtering (text keyword search, category, and active vs archived status selectors).
    - Responsive card layout showing board metadata, total message volume, and latest edit timestamp.
    - Row-level controls to open a workspace, toggle status (Archive/Restore), or permanently purge (Cascade Delete).

- **`/boards/add` — New Board Form**
  - **Component**: `NewBoardPage`
  - **Purpose**: Provides a focused workspace creation form asking for a Title, Description, Category, and the crucial Context Anchor. Upon creation, redirects users to their custom workspace.

- **`/boards/:id/workspace` — Core Board Workspace**
  - **Component**: `BoardWorkspace`
  - **Purpose**: The flagship co-thinking feature view.
  - **Key Layout Modules**:
    - **Left Pane (Co-Thinking Chat)**: Interactive dialogue scroll. Embeds contextual prompt instructions, supports dynamic prompt suggestions (AI chips), and posts real-time chat requests.
    - **Right Pane (Markdown Document Workspace)**: An executive report viewport. Switches categories between briefs, outlines, roadmaps, and drafts. Generates a brand-new report using the Gemini compiler with custom length guidelines and lets users browse generated version histories or export layouts to PDF with a single click.
    - **Suggested Next Steps Panel**: Fetches and lists 3 background-audited, highly relevant AI-suggested follow-up actions dynamically tailored to the current dialogue state.
    - **Floating AI Toolbox**: Contextual action menu providing helper shortcuts like "Optimize Context Prompt" and "Summarize Dialogue Thread".


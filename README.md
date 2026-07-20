<div align="center">
  
  # 🌌 Aivora
  **An Intelligent Co-Thinking, Creation, and Decision-Support Platform**

  *Designed for high-agency thinking, systematic analysis, and strategic roadmap creation.*

  [![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://aivora-tan-three.vercel.app/)
  [![Built with React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue?style=flat-square)](https://react.dev)
  [![Backend Express](https://img.shields.io/badge/Backend-Express%20%2B%20TypeScript-darkgreen?style=flat-square)](https://expressjs.com)
  [![Database Mongoose](https://img.shields.io/badge/Database-Mongoose%20%2B%20MongoDB-green?style=flat-square)](https://mongoosejs.com)
  [![Model Gemini](https://img.shields.io/badge/AI%20Engine-Gemini%202.0%20Flash-orange?style=flat-square)](https://deepmind.google/technologies/gemini/)

  ### 🔗 [Live Production Application](https://aivora-tan-three.vercel.app/)
</div>

---

## 📖 Table of Contents
1. [Introduction](#-introduction)
2. [Core Capabilities](#-core-capabilities)
3. [Architecture & Technical Stack](#-architecture--technical-stack)
4. [Local Development Setup](#-local-development-setup)
5. [Vercel Deployment & Production Setup](#-vercel-deployment--production-setup)
6. [Why Did I Get Errors After Deploying? (FAQ)](#-why-did-i-get-errors-after-deploying-faq)
7. [Project Structure](#-project-structure)
8. [Scripts](#-scripts)
9. [API Reference](#-api-reference)
10. [Licensing](#-licensing)

---

## 🌟 Introduction

**Aivora** is an enterprise-grade workspace that elevates brainstorming, critical analysis, and structured planning. By pairing dynamic, context-aware boards with a side-by-side AI assistant panel, Aivora empowers decision-makers to build comprehensive briefs, map out action items, explore complex tradeoffs, and compile dynamic outlines with real-time feedback.

Aivora is built around a single core entity — the **Board** — a saved unit of AI-assisted work that persists its context, full chat history, and generated documents. Boards are private by default, while curated public templates can be browsed and cloned with one click.

---

## 💡 Core Capabilities

*   **Co-Thinking Workspaces (Boards):** Create structured, topic-focused boards with descriptive metadata, categories (Decision / Idea / Plan), and pre-configured scenarios.
*   **Dual-Panel Workspace:**
    *   **Left Panel (Dialogue):** Engage in a context-rich, back-and-forth chat conversation powered by **Google Gemini** (`gemini-2.0-flash`, with `gemini-2.5-flash` / `gemini-1.5-flash` as automatic fallbacks). The assistant maintains conversation history across turns and suggests clickable follow-up chips.
    *   **Right Panel (Generation & Synthesis):** Generate "Decision Briefs", "SaaS Launch Roadmaps", "Thesis Outlines", and "Action Plans" at short/medium/long lengths. Compare version histories, copy markdown, and receive smart recommended next steps.
*   **Best-Practice Template Library:** Preloaded with classic business and academic scenarios (e.g. *Career Choices*, *SaaS Runways*, *Capital Allocations*) ready to clone or explore.
*   **Flexible Access & Security:** Secure credentials using JSON Web Tokens (JWT), seamless **Google OAuth** sign-in, and a one-click **Interactive Demo Login** for immediate sandbox evaluation.
*   **Executive Dashboard:** Usage trends, board distribution, recent threads, and personal stats.
*   **Fully Responsive:** Optimized for mobile, tablet, and desktop.

---

## 🛠️ Architecture & Technical Stack

### Frontend (Client SPA)
*   **React 19 & Vite 6:** Modern, highly optimized rendering with instant client compilation.
*   **Tailwind CSS v4:** Professional, high-contrast typography and fluid, responsive interfaces.
*   **TanStack Query:** Server-state caching and data fetching for boards, messages, and outputs.
*   **React Router:** Client-side routing across landing, auth, explore, dashboard, and workspace views.
*   **Recharts:** Dashboard charts (usage trends, category distribution).
*   **Motion & Lucide Icons:** High-fidelity micro-interactions and unified vector iconography.

### Backend (Server API)
*   **Express (TypeScript):** Robust API router configured to run both as a long-running local server and as a **Vercel serverless function** (`api/index.js`).
*   **`@google/genai`:** Native server-side integration with Gemini, keeping API keys securely hidden from the client.
*   **Mongoose (MongoDB):** Schema-backed persistence for Users, Boards, Messages, and Generated Outputs. The connection is cached across serverless cold starts.
*   **JWT & bcryptjs:** Stateless session auth plus hashed passwords.

> **Stack note:** The frontend is a **Vite + React SPA** (not Next.js) and the backend is **Express** deployed as a Vercel serverless function. `vercel.json` rewrites all `/api/*` requests to that single function.

---

## 💻 Local Development Setup

### 1. Prerequisites
*   **Node.js** (v18 or higher recommended)
*   A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)
*   (Optional) A **MongoDB** instance — local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). If `MONGODB_URI` is omitted locally, the app will attempt `mongodb://localhost:27017/aivora`.

### 2. Step-by-Step Installation

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Configure environment variables:**
    Create a `.env` file in the project root:
    ```env
    PORT=3000
    GEMINI_API_KEY=your_gemini_api_key_here
    JWT_SECRET=your_secret_signing_key

    # MongoDB connection string (optional locally; required on Vercel)
    MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/aivora?appName=Cluster0

    # Google OAuth (optional)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This runs the Express server (via `tsx`) with Vite middleware. Open [http://localhost:3000](http://localhost:3000).

---

## 🚀 Vercel Deployment & Production Setup

Vercel runs **stateless Serverless Functions**, so a full-stack app needs a live, persistent cloud database and environment variables set in the Vercel dashboard.

### Step 1: Provision a Cloud MongoDB Database
Serverless functions are ephemeral — you **cannot** rely on local or in-memory storage in production.
1.  Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Deploy a free shared tier cluster (M0) in your preferred region.
3.  Under **Network Access**, add IP address `0.0.0.0/0` to allow Vercel's nodes to connect.
4.  Under **Database Access**, create a user with read/write privileges.
5.  Click **Connect → Drivers** and copy the connection string:
    `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 2: Set Environment Variables in Vercel
1.  Go to your project dashboard on [Vercel](https://vercel.com).
2.  Navigate to **Settings → Environment Variables** and add:
    *   `MONGODB_URI` — your Atlas connection string from Step 1
    *   `GEMINI_API_KEY` — your Google AI Studio Gemini API key
    *   `JWT_SECRET` — a secure random string used to sign session tokens
    *   `NODE_ENV` — `production`
3.  *Optional (Google login):* `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`.

### Step 3: Configure Google OAuth (Optional)
1.  In the [Google Cloud Console](https://console.cloud.google.com/), create an **OAuth 2.0 Client ID** (Web Application).
2.  Add your Vercel domain to the approved lists:
    *   **Authorized JavaScript origins:** `https://aivora-tan-three.vercel.app`
    *   **Authorized redirect URIs:** `https://aivora-tan-three.vercel.app/api/auth/callback/google`
    *(Use your own production domain if different.)*
3.  Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Vercel env vars.

### Step 4: Deploy
Push to GitHub (Vercel auto-builds) or run:
```bash
vercel --prod
```
`vercel.json` runs `npm run build`, which outputs the SPA (`dist/`) and the serverless API (`api/index.js`), then rewrites `/api/*` to that function.

---

## 🔍 Why Did I Get Errors After Deploying? (FAQ)

### ❓ Issue 1: "Unexpected token 'A'... is not valid JSON" on login/register
*   **Symptom:** The React frontend calls `/api/auth/register` (or `/login`) and receives an HTML error page instead of JSON, so `JSON.parse` fails.
*   **Root cause:** The API function couldn't reach the database. On Vercel, `.env` is **not** deployed — `MONGODB_URI` must be set in the Vercel dashboard. If it's missing, Mongoose fails to connect and auth requests error out. (There is **no** in-memory fallback in production; the connection error is surfaced, not silently swallowed.)
*   **Fix:** Complete **Step 1 & Step 2** so `MONGODB_URI` is set in Vercel's Environment Variables. Redeploy. The function will then connect to Atlas and return proper JSON.

### ❓ Issue 2: "Failed to construct Google OAuth consent pathway"
*   **Root cause:** `GOOGLE_CLIENT_ID` is missing from Vercel's Environment Variables, so the server can't build the consent URL.
*   **Fix:** Complete **Step 3** — add `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` and ensure the redirect URI in Google Cloud Console exactly matches `https://<your-domain>/api/auth/callback/google`.

### ❓ Issue 3: Co-thinking chat returns "Failed to fetch" / no AI output
*   **Root cause (two possibilities):**
    1.  **Wrong model:** the server must call a model your key can access. Aivora uses `gemini-2.0-flash` (confirmed accessible on standard keys) with fallbacks — an invalid model name (e.g. a non-existent version) makes every chat fail.
    2.  **Quota exceeded:** a Google AI Studio **free-tier** key has a daily quota. When exhausted you'll get `429 RESOURCE_EXHAUSTED`. The app surfaces a clear message; wait for the quota to reset or enable billing in Google AI Studio.
*   **Fix:** Ensure `GEMINI_API_KEY` is set in Vercel and that the key has available quota.

---

## 📁 Project Structure
```
aivora/
├── api/
│   └── index.js              # Compiled serverless handler (built from src/server/vercel.ts)
├── src/
│   ├── components/           # UI: pages, dashboard, homepage sections
│   ├── context/              # AuthContext (session state)
│   ├── db/
│   │   └── db.ts             # Mongoose models + repository (User, Board, Message, GeneratedOutput)
│   ├── server/
│   │   ├── app.ts            # Express app + middleware
│   │   ├── auth.ts           # Auth + Google OAuth routes
│   │   ├── boards.ts         # Board CRUD + AI chat/generate/recommend endpoints
│   │   └── vercel.ts         # Serverless entry point
│   ├── server.ts             # Local dev server entry
│   ├── App.tsx               # Router + layout
│   └── main.tsx              # App bootstrap
├── vercel.json               # Vercel build + rewrite config
├── vite.config.ts
└── package.json
```

---

## 🧩 Scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Run the local dev server (Express via `tsx` + Vite middleware) on port 3000. |
| `npm run build` | Build the SPA and bundle the serverless API handler into `api/index.js`. |
| `npm start` | Run the compiled local server (`dist/server.cjs`). |
| `npm run lint` | Type-check the project with `tsc --noEmit`. |
| `npm run clean` | Remove build artifacts. |

---

## 🔌 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create an account. |
| POST | `/login` | Email/password login → returns JWT. |
| POST | `/demo` | One-click demo login (seeded account). |
| GET | `/google/url` | Get the Google OAuth consent URL. |
| GET | `/google/callback` | OAuth callback (exchanges code, issues JWT). |
| GET | `/me` | Return the authenticated user (requires JWT). |

### Boards (`/api/boards`)
All Board routes except `GET /` and `GET /:id` (optional auth) require a `Bearer` JWT.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List public templates + the user's boards (search/category). |
| GET | `/public-stats` | Aggregate template statistics. |
| GET | `/summary` | User dashboard summary/stats. |
| GET | `/:id` | Get a Board with its messages and generated outputs. |
| POST | `/` | Create a Board. |
| POST | `/:id/clone` | Clone a public template into the user's workspace. |
| PUT | `/:id` | Update Board metadata. |
| DELETE | `/:id` | Delete a Board (cascades messages + outputs). |
| POST | `/:id/chat` | Send a chat message; returns AI reply + suggestions. |
| POST | `/:id/generate` | Generate a structured document (type + length). |
| GET | `/:id/recommendations` | Get AI-suggested next steps. |

---

## 📄 Licensing

This project is provided for educational and demonstration purposes. See the repository for license details. Built with care to facilitate modern, systematic co-thinking processes.

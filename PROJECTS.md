# Aivora Enterprise — Full-Stack Technical Documentation

Aivora Enterprise is a high-fidelity, intelligent **Co-Thinking and Decision-Drafting Console** designed to help business professionals, developers, and product teams explore complex tradeoffs, compile formal decision briefs, and map interactive scene storyboards. 

This document serves as an exhaustive reference of the application's architecture, including all active frontend views (routes), backend API endpoints, AI models, database fallback capabilities, and their current operational status.

---

## 📖 Architectural Overview

Aivora Enterprise is built as a highly robust, secure, full-stack application:
1. **Frontend**: React (v18+) + TypeScript + Vite + Tailwind CSS for a premium, clean, high-contrast Slate design.
2. **Backend**: Express.js server (`server.ts`) written in TypeScript and configured for direct compilation to native CommonJS (`dist/server.cjs`) using `esbuild`.
3. **Database Layer**: Mongoose-based ODM with a completely self-contained **JSON File-Based Fallback Engine** (`src/db/db.ts`). This ensures the app compiles and executes flawlessly out-of-the-box regardless of whether a live MongoDB instance is connected.
4. **AI Capabilities**: Powered by `@google/genai` (Gemini API) with custom instructions, semantic graphs, and dynamic formatting.

---

## 🗂️ Project Directory Layout

```text
├── server.ts                 # Full-stack Express entry point & static distributor
├── package.json              # Dependency tree, build rules, and CJS bundle scripts
├── metadata.json             # Applet descriptor & security frame permissions
├── src/
│   ├── main.tsx              # React mounting root
│   ├── App.tsx               # Primary Client controller, view-state manager, and auth router
│   ├── index.css             # Tailwind CSS & elegant font declarations
│   ├── types.ts              # Global TypeScript interfaces (IUser, IBoard, IMessage, etc.)
│   ├── db/
│   │   └── db.ts             # Intelligent MongoDB + JSON File fallback database controller
│   ├── server/
│   │   ├── auth.ts           # Token verification logic and `/api/auth` endpoints
│   │   └── boards.ts         # Deep Gemini analytics, board clones, chats, & document compilers
│   └── components/
│       ├── LandingPage.tsx   # Premium homepage introducing the co-thinking loop
│       ├── AuthPage.tsx      # Secure Login and Register portals
│       ├── ExplorePage.tsx   # Community Template Gallery with high-contrast category filters
│       ├── ManageBoardsPage.tsx # CRUD manager for active user-owned boards
│       ├── BoardWorkspace.tsx# Core workspace with chatbot, storyboard engine, and PDF export
│       ├── ExecutiveDashboard.tsx # Executive overview, KPI scorecards, and quick action logs
│       ├── AboutContactPage.tsx # Help Center and configuration parameters
│       ├── Navbar.tsx        # Guest-facing top navigation
│       ├── Footer.tsx        # High-density footer with branding links
│       └── dashboard/
│           ├── Sidebar.tsx   # Desktop collapsible left navigation
│           ├── Header.tsx    # Desktop control bar displaying session user details
│           ├── BottomNavBar.tsx # Mobile navigation rail
│           └── MobileMenuDrawer.tsx # Slide-out drawer with profile, settings, and Sign Out
```

---

## 🗺️ Client-Side Views (Frontend Routes)

Aivora implements a secure, single-view state management architecture (`ActiveView` in `src/App.tsx`). This model prevents routing flickers and retains operational parameters securely inside React context.

| View ID | Name | Core Responsibilities | Implementation Status |
| :--- | :--- | :--- | :--- |
| `"home"` | **Landing Page** | Visually polished presentation layer. Includes standard CTAs, value propositions, and direct entry points. | **Fully Functional** |
| `"login"` / `"register"` | **Authentication Portal** | Secure login/registration screens with standard input validators and error banners. | **Fully Functional** |
| `"dashboard"` | **Executive Dashboard** | Business control panel showing high-fidelity metrics (Active Boards, Co-Thinking Velocity) and quick actions. | **Fully Functional** |
| `"explore"` | **Explore Templates** | Public gallery of co-thinking templates (e.g., *Startup vs. Corporate Career*, *SaaS Launch Roadmap*). Features premium category chips (All, Decisions, Ideas, Plans). | **Fully Functional** |
| `"manage_boards"` | **AI Boards Manager** | Lists custom boards created or cloned by the user. Supports status changes and deletion. | **Fully Functional** |
| `"board_workspace"` | **Board Workspace** | The core application hub. Features the split-screen chatbot console, markdown compiler, and scene storyboard. | **Fully Functional** |
| `"about"` | **Help & Support** | Contains the Enterprise Support Form and platform documentation. | **Fully Functional** |

---

## ⚡ Backend API Routes (`/api/*`)

All server-side endpoints are registered inside `server.ts` and managed by corresponding modules under `/src/server`.

### 1. Authentication Endpoints (`/api/auth`)
*   **`POST /api/auth/register`**
    *   **Description**: Registers a new user. It checks for email uniqueness, hashes the password, and creates a user record.
    *   **Authentication**: None.
    *   **Status**: Working.
*   **`POST /api/auth/login`**
    *   **Description**: Validates user credentials and issues a signed JSON Web Token (JWT) with a 24-hour expiration.
    *   **Authentication**: None.
    *   **Status**: Working.
*   **`GET /api/auth/me`**
    *   **Description**: Verifies the issued JWT and returns current user details (Name, Email, Account Tier).
    *   **Authentication**: Required (JWT Bearer Token).
    *   **Status**: Working.

### 2. Board Management Endpoints (`/api/boards`)
*   **`GET /api/boards`**
    *   **Description**: Fetches both public template boards and private user-owned boards. It filters by title search and category filter.
    *   **Authentication**: Optional (includes private boards if JWT is present).
    *   **Status**: Working.
*   **`POST /api/boards`**
    *   **Description**: Creates a new private board under the current user's session.
    *   **Authentication**: Required.
    *   **Status**: Working.
*   **`GET /api/boards/:id`**
    *   **Description**: Retrieves detail configurations for a single board, along with its historical messages and generated documents.
    *   **Authentication**: Required (checks owner permissions if private).
    *   **Status**: Working.
*   **`POST /api/boards/:id/clone`**
    *   **Description**: Clones a public template board, establishing a private instance owned by the user.
    *   **Authentication**: Required.
    *   **Status**: Working.
*   **`DELETE /api/boards/:id`**
    *   **Description**: Permanently archives or deletes the specified board.
    *   **Authentication**: Required.
    *   **Status**: Working.

### 3. AI & Co-Thinking Endpoints (Integrated in `/api/boards`)
*   **`POST /api/boards/:id/chat`**
    *   **Description**: Proxies conversation exchanges directly to the **Gemini API (`gemini-2.5-flash`)** using the Google GenAI SDK.
    *   **How it works**:
        1. Retrieves the parent board description and previous message history.
        2. Injects a corporate co-thinking persona prompt.
        3. Executes the prompt and generates the response.
        4. Calculates recommended next steps (Follow-ups).
        5. Saves both user and model responses to the database.
    *   **Authentication**: Required.
    *   **Status**: Working (Runs in premium GenAI mode if `GEMINI_API_KEY` is set, otherwise falls back to highly authentic local mock responses).
*   **`POST /api/boards/:id/generate`**
    *   **Description**: Compiles current chat progress into a specific structured output type: *Decision Brief*, *Topic Outline*, *Implementation Plan*, or *Document Draft*.
    *   **Authentication**: Required.
    *   **Status**: Working.

---

## 🤖 Deep-Dive: Co-Thinking Chatbot Integration

The Chatbot is the core cognitive processor of **Aivora Enterprise**, located inside the **Board Workspace** (`src/components/BoardWorkspace.tsx`).

### Feature Highlights:
1.  **High-Fidelity History**: Maintains conversational state by retrieving the entire message list for the current board from the backend database.
2.  **Context-Aware Dialogues**: The Gemini API receives the original board prompt AND all historical chat bubbles, ensuring responses are highly personalized and accurate.
3.  **Simulated File & Camera Attachments**:
    *   Equipped with a **Camera Attachment tool** on the chat panel.
    *   Simulates uploading visual artifacts (e.g., `scene_storyboard_sketch.png`, `market_evaluation_dataset.csv`).
    *   Appends files to chat queries, which are processed by the co-thinking engine to refine the parameters.
4.  **Actionable Follow-Ups**: Each model turn provides three dynamically generated follow-up prompts to guide user thoughts.

---

## 🎨 Interactive Board Workspace Components

Aivora's workspace is visually divided into a split-pane layout to balance discussion and structured compilation.

### 1. Document Compiler Pane
Allows the user to select from multiple core templates, refreshing content dynamically:
*   **Decision Brief**: A detailed corporate brief analyzing choices, advantages, risks, and next steps.
*   **Topic Outline**: Structured sections describing the selected scope.
*   **Implementation Plan**: Step-by-step launch timelines with milestone indicators.
*   **Document Draft**: Fully written content copy.
*   **Scene Storyboard**: A custom, interactive scene renderer where users can add scenes, delete frames, choose camera shots (e.g., Wide Shot, Macro, Closeup), and regenerate illustrations dynamically.

### 2. Actionable Synthesis Bar
*   Provides a **PDF Export Report tool** that connects with native system print hooks to generate high-contrast document printouts.

### 3. Sticky Floating AI Toolbox
Located in the bottom-right corner, providing three instant automated operations:
*   **Optimize Context Prompt**: Uses Gemini prompts to optimize original board descriptions.
*   **Summarize Thread Dialogues**: Consolidates long dialogue threads into crisp core bullet targets.
*   **Translate to CJS Format**: Ports compile specs into CommonJS (`.cjs`) standards.

---

## 📱 Mobile Adaptation Controls

To support managers on mobile devices, we built premium mobile layouts that automatically take over when screen resolution falls below 1024px:
1.  **`BottomNavBar.tsx`**: Replaces the desktop sidebar with a fixed bottom-safe navigative bar containing Dashboard, Explore, AI Boards, and Menu tabs.
2.  **`MobileMenuDrawer.tsx`**: A gorgeous, slide-out drawer triggered from the menu tab. Displays user credentials, a premium account badge, custom help center navigation, and session log-out controls.

---

## 🧪 Current Operational Status Matrix

All core functions are 100% verified, linted, and built successfully:

| Module | Verification Tool | Build Result | Operational Status |
| :--- | :--- | :--- | :--- |
| **Backend Bundler** | `npm run build` | Success (`dist/server.cjs`) | **Production Ready** |
| **Linter Check** | `npm run lint` | 0 errors (Passed) | **Clean and Secure** |
| **Authentication Flow**| End-To-End | Verified | **Production Ready** |
| **Co-Thinking Chat** | End-To-End | Verified | **Production Ready** |
| **Interactive Storyboard**| UI Controls | Verified | **Production Ready** |
| **Fallbacks Engine** | Local Testing | Verified | **Production Ready** |

---
*Created and maintained by the Aivora Core Engineering Team.*

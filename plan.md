# Aivora — Implementation Plan

This plan outlines the architecture and phase-by-phase build order for **Aivora**, an intelligent thinking and decision-support platform built around **Boards**.

---

## 🛠️ Stack Decisions & Architecture

### 1. Frontend & Backend: Single-Process Express + React (Vite)
- **Frontend**: React (v19) + Vite (v6) + Tailwind CSS + Lucide Icons + Motion (for animations).
- **Backend**: Express (TypeScript) running on Port 3000, serving API endpoints and proxying static Vite assets in dev/prod.
- **Why this works best**: It utilizes the existing workspace dependencies, binds cleanly to the required Port 3000, compiles near-instantly, and keeps API keys secured on the server.

### 2. Database: File-Backed Local JSON Database
- **Storage**: A robust, transaction-safe local JSON storage layer located at `/src/db/db.json`.
- **Capabilities**: Full CRUD, database seeding (e.g. pre-built template boards), searching, category/status filtering, and sorting by creation dates.
- **Why this works best**: 100% self-contained, persists across workspace sessions, and requires zero external database setup or Atlas connections.

### 3. AI Service: `@google/genai`
- **Models**: `gemini-3.5-flash` for both interactive chat routing and structured document generation.
- **Safety**: Fully server-side implementation utilizing the automatically injected `process.env.GEMINI_API_KEY`.

---

## 🗓️ Phase-by-Phase Build Plan

### Phase 1 — Backend & Local Database Foundation
- Create the JSON database model definitions for `User`, `Board`, `Message`, and `GeneratedOutput`.
- Write a helper utility `/src/db/db.ts` to read, write, query, and seed initial template boards (e.g., "Job Offer Comparison", "Thesis Outline Guide").
- Implement the Express routes:
  - **Auth**: Register, Login, Social Login (Google simulation), and **one-click Demo Login** (generating JWTs).
  - **Boards CRUD**: Create, Get All (with search, category filters, and sorting), Get Single (loading historical messages and outputs), and Delete.
  - Apply JWT protection middleware.

### Phase 2 — AI Backend Integration
- **AI Chat Endpoint (`/api/boards/:id/chat`)**: Reads message history, queries `gemini-3.5-flash` with rich contextual styling, saves messages, and outputs 3 follow-up prompt suggestion chips.
- **AI Content Generator Endpoint (`/api/boards/:id/generate`)**: Prompts the AI with custom templates to generate "Decision Briefs", "Thesis Outlines", or "Action Plans" in short/medium/long variations, saving output versions.
- **AI Smart Recommendation Endpoint (`/api/boards/:id/recommendations`)**: Analyzes the current context and suggests 3 actionable next steps or links to similar public templates.

### Phase 3 — Frontend Layout & Global State
- Configure `server.ts` to host Vite middleware and routing.
- Set up Tailwind fonts, importing clean display styles.
- Build the responsive layout shell:
  - Sticky header with dynamic links (Home, Explore, About + dynamic Dashboard, New Board, Manage Boards depending on Auth state).
  - Full-featured footer.

### Phase 4 — Landing Page & Explore Page
- **Hero**: Clean modern grid layout promoting the "Think, Create, Decide" value proposition with a live interactive trial text area.
- **Sections**: Detailed explanation of Boards, Chat Assistant, Document generator, Testimonials, aggregate statistics, and interactive FAQ.
- **Explore**: Grid containing available public template Boards ready to clone. Supports full searches and category filters.

### Phase 5 — Authentication, Management & Board Detail Views
- **Auth**: Custom styled sign-in/sign-up forms, including a prominent **Demo Login** option.
- **New Board Form**: Fields for Title, Context/Description, Category, and cover images.
- **Manage Boards Table**: Multi-column table layout with actions to view, duplicate, or delete.
- **Board detail view & CTA**: Review template boards public metadata with a "Clone to My Boards" action.

### Phase 6 — AI Workspace (The Core Experience)
- Integrate the interactive side-by-side workspace:
  - **Left Panel**: AI Chat interface with typing indicator, follow-up prompt chips, and conversation history.
  - **Right Panel**: Document workspace with structured output options, version tabs, markdown viewer, and recommended next steps.

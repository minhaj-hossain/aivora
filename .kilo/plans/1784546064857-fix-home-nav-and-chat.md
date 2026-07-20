# Plan: Fix dashboard home navigation + co-thinking chat output

## Context
Two bugs reported on the live deployment:
1. Once logged in, there is **no way to return to the homepage** from the dashboard.
2. In a board's **Co-Thinking Chat**, sending a message produces **no AI output**.

## Root-cause analysis (verified against code)

### Bug 1 — No home navigation in dashboard
- `src/App.tsx:97` sets `hideGlobalNavFooter = isDashboardLayout || isAuthView || isWorkspaceView`, so the global `Navbar` (the only place with a logo/"Platform" → home link, `Navbar.tsx:27,44,163`) is hidden on every authenticated route.
- The dashboard chrome components — `src/components/dashboard/Sidebar.tsx` (menu items: Dashboard, My Workspaces, Explore Templates, New Board, Settings + Help/Support), `src/components/dashboard/BottomNavBar.tsx` (Dashboard, Explore, AI Boards, Menu), and `src/components/dashboard/MobileMenuDrawer.tsx` — contain **no "Home" entry**.
- `setView("home")` already maps to `navigate("/")` (`App.tsx:45`), so adding a Home control will work without further routing changes.

### Bug 2 — Chat returns no output
- `src/server/boards.ts` calls Gemini with `model: "gemini-3.5-flash"` at lines **415, 527, 609** (chat, generate, recommendations).
- `gemini-3.5-flash` is **not a valid Gemini model**. The repo's own docs (`dashboard.md:11,339`, `PROJECTS.md:112`) specify **`gemini-2.5-flash`**. The Gemini API rejects the request → the `catch` block returns `500 {error}` → `BoardWorkspace.handleSendChat` shows the message in the red error banner and never appends a model reply. This is the "no output" symptom.
- Secondary fragility: `JSON.parse(response.text)` (lines 436, 637) throws if the model returns non-JSON, also surfacing as an error. Should be made tolerant.

## Implementation steps

### Step A — Add a Home link to the dashboard chrome
Add a "Home" navigation entry (icon `Home` from `lucide-react`) to the three dashboard components, each calling `setView("home")` (which navigates to `/`):
- `src/components/dashboard/Sidebar.tsx`: add a `home` item to `menuItems` (e.g. at the top, label "Home", icon `Home`, description "Back to Platform"). Import `Home` from `lucide-react`.
- `src/components/dashboard/BottomNavBar.tsx`: add a `home` tab (label "Home", icon `Home`). Import `Home`.
- `src/components/dashboard/MobileMenuDrawer.tsx`: add a "Home" button that calls `setView("home")` (read this file to match its existing structure before editing).

Note: `setView` in `App.tsx` already handles `"home"`. Confirm `ActiveView` type (`src/types.ts`) includes `"home"`; if not, add it (Sidebar/BottomNav/Drawer type their items as `ActiveView`).

### Step B — Fix the Gemini model name + make parsing robust
In `src/server/boards.ts`, replace `"gemini-3.5-flash"` with `"gemini-2.5-flash"` at all three call sites (lines 415, 527, 609).

Harden response parsing so a malformed/JSON-wrapped reply doesn't crash:
- For chat (line 436) and recommendations (line 637): wrap `JSON.parse(response.text)` in try/catch; if parse fails, extract a JSON object via a tolerant regex (match first `{...}`) or, for chat, fall back to using `response.text` directly as `reply` with empty `suggestions`.
- (Optional, low priority) Add a model fallback chain: try `gemini-2.5-flash`, then `gemini-2.0-flash`, so a temporarily unavailable model still returns output.

### Step C — Validate
- `npm run lint` (tsc) passes.
- `npm run build` succeeds.
- Manual (or `vercel dev`): open a board workspace, send a chat message → AI reply renders in the chat panel (not just an error banner). Confirm home link appears in Sidebar/BottomNav/Drawer and returns to `/`.

## Risks / notes
- The Google GenAI SDK method `client.models.generateContent({ model, contents, config })` and `response.text` usage are already correct; only the model identifier is wrong.
- `GEMINI_API_KEY` must be set in Vercel env (already noted from prior work); if missing, the endpoint throws a clear "GEMINI_API_KEY is not configured" error — that is expected and not this bug.
- Adding `home` to `ActiveView` only affects typing; no routing change needed since `/` route already exists.

## Open question (answered by default)
- Default: add Home as a normal sidebar/bottom-nav item that calls `setView("home")`. No new route required.

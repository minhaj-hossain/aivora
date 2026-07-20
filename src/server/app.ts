import express from "express";
import path from "path";
import { authRouter } from "./auth.ts";
import { boardsRouter } from "./boards.ts";

// Load dotenv only outside Vercel (Vercel injects env vars natively).
// Imported lazily so the serverless bundle never touches dotenv at load time
// unless actually running locally.
if (!process.env.VERCEL) {
  import("dotenv/config").catch(() => {});
}

const app = express();

// JSON payload parser
app.use(express.json());

// API Endpoints go here FIRST
app.use("/api/auth", authRouter);
app.use("/api/boards", boardsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

// Middleware for hosting asset rendering
async function setupFrontendMiddleware() {
  // If running on Vercel, let Vercel handle static assets natively on its CDN
  if (process.env.VERCEL) {
    console.log(
      "Running on Vercel: skipping static and Vite middlewares, Vercel Edge will serve public files.",
    );
    return;
  }

  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log(
      "Starting server in PRODUCTION mode with static file hosting...",
    );
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

// We initialize front-end setup asynchronously
setupFrontendMiddleware().catch((err) => {
  console.error(
    "Warning: Failed to setup Vite/Static serving middleware:",
    err,
  );
});

export default app;

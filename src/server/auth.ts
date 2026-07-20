import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/db.ts";

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "aivora_fallback_secret_key_123!";

// Extracted Auth Request Type helper
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
  };
}

// JWT Verification Middleware
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied. Token missing." });
    return;
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
}

// --- ENDPOINTS ---

// Register
authRouter.post("/register", async (req: Request, res: Response): Promise<void> => {
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
      password: hashedPassword,
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
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ error: "Failed to register user." });
  }
});

// Login
authRouter.post("/login", async (req: Request, res: Response): Promise<void> => {
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
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ error: "Failed to log in." });
  }
});

// One-Click Seeded Demo Login
authRouter.post("/demo", async (req: Request, res: Response): Promise<void> => {
  try {
    const demoEmail = "demo@aivora.app";
    let user = await db.findUserByEmail(demoEmail);

    if (!user) {
      const hashedPassword = await bcrypt.hash("AivoraDemo123!", 10);
      user = await db.createUser({
        name: "Demo Thinker",
        email: demoEmail,
        password: hashedPassword,
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
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error in demo login:", err);
    res.status(500).json({ error: "Failed to log in as Demo user." });
  }
});

// --- GOOGLE OAUTH FLOWS ---

// Get Google OAuth Authorization URL
authRouter.get("/google/url", (req: Request, res: Response) => {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  if (!client_id) {
    return res.status(400).json({ error: "Google OAuth is not configured yet. GOOGLE_CLIENT_ID is missing." });
  }

  // Construct callback URL dynamically using request host
  const redirect_uri = `${req.protocol}://${req.get("host")}/api/auth/google/callback`;
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

// Google OAuth Callback endpoint (popup closes itself and postMessage back to applet iframe)
authRouter.get(["/google/callback", "/google/callback/"], async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("<h3>Authentication Error: No authorization code provided.</h3>");
  }

  try {
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = `${req.protocol}://${req.get("host")}/api/auth/google/callback`;

    if (!client_id || !client_secret) {
      throw new Error("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing on the server.");
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code as string,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: "authorization_code"
      }).toString()
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange auth code for tokens: " + await tokenResponse.text());
    }

    const tokens = (await tokenResponse.json()) as any;
    const idToken = tokens.id_token;

    if (!idToken) {
      throw new Error("No id_token returned by Google auth server.");
    }

    // Decode ID Token payload
    const payloadBase64 = idToken.split(".")[1];
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString("utf-8"));

    const email = payload.email;
    const name = payload.name || payload.given_name || "Google User";

    if (!email) {
      throw new Error("No email retrieved from Google account profile.");
    }

    // Create user if not exists
    let user = await db.findUserByEmail(email);
    if (!user) {
      user = await db.createUser({
        email: email.toLowerCase(),
        name,
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Deliver token securely to parent window inside preview iframe using postMessage, then self-close.
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
                }, "*");
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
          <p>${(err as Error).message}</p>
          <button onclick="window.close()" style="padding: 10px 20px; background: #111827; color: #f3f4f6; border: 1px solid #1f2937; border-radius: 6px; cursor: pointer;">Close Window</button>
        </body>
      </html>
    `);
  }
});

// Get Me
authRouter.get("/me", authenticateToken as any, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
      email: user.email,
    });
  } catch (err) {
    console.error("Error in me:", err);
    res.status(500).json({ error: "Failed to retrieve profile." });
  }
});

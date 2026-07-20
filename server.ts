import "dotenv/config";
import app from "./src/server/app.ts";

async function startServer() {
  const PORT = 3000;

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aivora full-stack engine running on http://localhost:${PORT}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `\n================================================================`,
      );
      console.error(
        `CRITICAL ERROR: Port ${PORT} is already in use by another process!`,
      );
      console.error(
        `This is why the server cannot start, and authentication is failing.`,
      );
      console.error(
        `================================================================`,
      );
      console.error(`To resolve this and free up Port ${PORT}:`);
      console.error(
        `\n👉 On Windows (PowerShell) - Run this command to kill the active process:`,
      );
      console.error(
        `   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`,
      );
      console.error(`\n👉 On Linux/macOS - Run this command:`);
      console.error(`   kill -9 $(lsof -t -i:${PORT})`);
      console.error(
        `================================================================\n`,
      );
      process.exit(1);
    } else {
      console.error("Express server error:", err);
    }
  });
}

startServer().catch((err) => {
  console.error("Critical: Failed to boot the Aivora full-stack server!", err);
});

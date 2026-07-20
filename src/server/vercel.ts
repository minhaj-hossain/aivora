import app from "./app.ts";

// Vercel serverless (Node) handler, written as an ES module so it loads
// correctly under the project's "type": "module" setting.
// Express' app is itself a (req, res) => void function.
export default function handler(req: any, res: any) {
  return app(req, res);
}

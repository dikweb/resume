import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright-core";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT_DIR = join(ROOT, "out");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const OUT_PATH = join(ROOT, "resume.pdf");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function build() {
  console.log("==> next build");
  await new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "build"], {
      cwd: ROOT,
      stdio: "inherit",
      env: { ...process.env, NEXT_PUBLIC_BASE_PATH: BASE_PATH },
    });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`build failed: ${code}`))
    );
  });
}

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.startsWith(BASE_PATH)) {
        pathname = pathname.slice(BASE_PATH.length) || "/";
      }
      if (pathname.endsWith("/")) pathname += "index.html";
      const filePath = normalize(join(OUT_DIR, pathname));
      if (!filePath.startsWith(OUT_DIR)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) throw new Error("not a file");
      const data = await readFile(filePath);
      res.writeHead(200, { "Content-Type": MIME[extname(filePath)] ?? "application/octet-stream" });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not Found");
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function main() {
  await build();
  const { server, port } = await startServer();
  const url = `http://127.0.0.1:${port}${BASE_PATH}/pdf/`;
  console.log(`==> rendering ${url}`);

  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.pdf({
      path: OUT_PATH,
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" },
    });
    console.log(`==> saved ${OUT_PATH}`);
  } finally {
    await browser?.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

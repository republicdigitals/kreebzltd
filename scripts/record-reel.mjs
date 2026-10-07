// Records the /reel film at 1920×1080.
// Usage: node scripts/record-reel.mjs [url] [seconds]
import { chromium } from "file:///C:/Users/mx444/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "fs";

const url = process.argv[2] || "http://localhost:3000/reel";
const seconds = Number(process.argv[3]) || 40;
const outDir = "reel-recordings";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } },
});
const page = await context.newPage();
await page.goto(url);
await page.waitForTimeout(seconds * 1000);
await context.close(); // flush video
await browser.close();
console.log("saved to", outDir);

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Section-level review captures.
 *   node scripts/capture-sections.mjs [outputDir] [locale] [width] [reducedMotion]
 */
const [, , outputDirArg, localeArg, widthArg, motionArg] = process.argv;
const outputDir = path.resolve(outputDirArg ?? "screenshots/sections");
const locale = localeArg ?? "en-GB";
const width = Number(widthArg ?? 1440);
const reducedMotion = motionArg === "reduce" ? "reduce" : "no-preference";
const origin = process.env.CAPTURE_ORIGIN ?? "http://127.0.0.1:3000";
const height = width <= 430 ? 932 : width <= 768 ? 1024 : 950;

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width, height } });
await page.emulateMedia({ reducedMotion });
await page.goto(`${origin}/${locale}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });

const targets = [
  ["hero", "#overview"],
  ["workflow", "#how-it-works"],
  ["scan", "#scan-preview"],
  ["health", "#product"],
  ["monitored", ".section--monitored"],
  ["features", "#features"],
  ["story", "#story"],
  ["comparison", ".section--comparison"],
  ["business", "#business-types"],
  ["markets", "#markets"],
  ["cta", "#early-access"],
];

for (const [name, selector] of targets) {
  const locator = page.locator(selector).first();
  await locator.scrollIntoViewIfNeeded();
  // Long enough for the hero resolve sequence, the scan run, and the competitor overtake to settle.
  await page.waitForTimeout(name === "scan" ? 4600 : name === "story" ? 2800 : name === "hero" ? 2800 : 1800);
  await locator.screenshot({ path: path.join(outputDir, `${locale}-${width}-${name}.png`), caret: "hide" });
  console.log(`captured ${name}`);
}

await browser.close();

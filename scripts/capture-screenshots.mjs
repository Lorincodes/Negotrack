import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDir = path.resolve("screenshots");
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });

const viewports = [
  [375, 844, "375"],
  [430, 932, "430"],
  [768, 1024, "768"],
  [1024, 900, "1024"],
  [1440, 1000, "1440"],
];

async function captureStitchedPage(page, width, height, outputPath) {
  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const offsets = [];
  for (let offset = 0; offset + height < totalHeight; offset += height) offsets.push(offset);
  const lastOffset = Math.max(0, totalHeight - height);
  if (offsets.at(-1) !== lastOffset) offsets.push(lastOffset);

  await page.addStyleTag({ content: "html[data-capture-scrolled] .site-header{visibility:hidden!important}" });
  const segments = [];
  for (const offset of [...new Set(offsets)].sort((a, b) => a - b)) {
    await page.evaluate(({ top, scrolled }) => {
      document.documentElement.toggleAttribute("data-capture-scrolled", scrolled);
      window.scrollTo({ top, behavior: "auto" });
    }, { top: offset, scrolled: offset > 0 });
    await page.waitForTimeout(30);
    const buffer = await page.screenshot({ type: "png", fullPage: false, animations: "disabled", caret: "hide" });
    segments.push({ input: buffer, top: offset, left: 0 });
  }

  await sharp({ create: { width, height: totalHeight, channels: 4, background: "#ffffff" } })
    .composite(segments)
    .png()
    .toFile(outputPath);
  await page.evaluate(() => {
    document.documentElement.removeAttribute("data-capture-scrolled");
    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

for (const [width, height, label] of viewports) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:3000/en-GB", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let offset = 0; offset < pageHeight; offset += Math.max(320, Math.floor(height * 0.8))) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "auto" }), offset);
    await page.waitForTimeout(24);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.waitForTimeout(80);
  await captureStitchedPage(page, width, height, path.join(outputDir, `negotrack-${label}-full.png`));
  await page.waitForTimeout(80);
  if (label === "375" || label === "1440") {
    await page.screenshot({ path: path.join(outputDir, `negotrack-${label}-hero.png`), fullPage: false, animations: "disabled", caret: "hide" });
  }
  await page.close();
}

await browser.close();

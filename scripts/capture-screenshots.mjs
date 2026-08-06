import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Usage:
 *   node scripts/capture-screenshots.mjs [outputDir] [locales] [widths] [reducedMotion]
 *   node scripts/capture-screenshots.mjs screenshots en-GB,es-ES 375,430,768,1024,1440,1920 reduce
 */
const [, , outputDirArg, localesArg, widthsArg, motionArg] = process.argv;

const outputDir = path.resolve(outputDirArg ?? "screenshots");
const locales = (localesArg ?? "en-GB").split(",").filter(Boolean);
const widths = (widthsArg ?? "375,430,768,1024,1440,1920").split(",").map(Number);
const reducedMotion = motionArg === "reduce" ? "reduce" : "no-preference";
const origin = process.env.CAPTURE_ORIGIN ?? "http://127.0.0.1:3000";

const heightForWidth = (width) => (width <= 430 ? 932 : width <= 768 ? 1024 : width <= 1024 ? 900 : 1000);

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });

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
    await page.waitForTimeout(reducedMotion === "reduce" ? 60 : 420);
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

for (const locale of locales) {
  const prefix = locales.length > 1 ? `negotrack-${locale}` : "negotrack";
  for (const width of widths) {
    const height = heightForWidth(width);
    const label = String(width);
    const page = await browser.newPage({ viewport: { width, height } });
    await page.emulateMedia({ reducedMotion });
    await page.goto(`${origin}/${locale}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let offset = 0; offset < pageHeight; offset += Math.max(320, Math.floor(height * 0.8))) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "auto" }), offset);
      await page.waitForTimeout(reducedMotion === "reduce" ? 24 : 260);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    await page.waitForTimeout(reducedMotion === "reduce" ? 80 : 900);
    await captureStitchedPage(page, width, height, path.join(outputDir, `${prefix}-${label}-full.png`));
    // Target the hero element directly; resetting scroll and shooting the viewport proved unreliable.
    await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    await page.locator("#overview").scrollIntoViewIfNeeded();
    await page.waitForTimeout(reducedMotion === "reduce" ? 120 : 2_800);
    await page.locator("#overview").screenshot({ path: path.join(outputDir, `${prefix}-${label}-hero.png`), animations: "disabled", caret: "hide" });
    await page.close();
    console.log(`captured ${prefix}-${label}`);
  }
}

await browser.close();

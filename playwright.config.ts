import { defineConfig } from "@playwright/test";

const localPort = 3107;
const localBaseUrl = `http://127.0.0.1:${localPort}`;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? localBaseUrl;
const browserChannel = process.env.PLAYWRIGHT_BROWSER_CHANNEL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [
    ["line"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  outputDir: "test-results",
  use: {
    baseURL,
    browserName: "chromium",
    colorScheme: "light",
    locale: "en-GB",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: process.env.PLAYWRIGHT_VIDEO === "1" ? "retain-on-failure" : "off",
    viewport: { width: 1_440, height: 900 },
    ...(browserChannel ? { channel: browserChannel } : {}),
  },
  projects: [{ name: "chromium" }],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `npm run dev -- --hostname 127.0.0.1 --port ${localPort}`,
        url: localBaseUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});

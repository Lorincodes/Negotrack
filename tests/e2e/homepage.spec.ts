import { expect, test, type Page } from "@playwright/test";

const homepages = [
  {
    locale: "en-GB",
    heading: "Know exactly what’s holding your business back.",
  },
  {
    locale: "es-ES",
    heading: "Descubre exactamente qué está frenando tu negocio.",
  },
] as const;

function captureRuntimeErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.message}`);
  });

  return errors;
}

for (const homepage of homepages) {
  test(`${homepage.locale} homepage loads its localised content`, async ({ page }) => {
    const response = await page.goto(`/${homepage.locale}`);

    expect(response, "the document request should return a response").not.toBeNull();
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/NegoTrack/);
    await expect(page.locator("html")).toHaveAttribute("lang", homepage.locale);
    await expect(
      page.getByRole("heading", { level: 1, name: homepage.heading }),
    ).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByTestId("waitlist-form")).toBeAttached();
  });

  test(`${homepage.locale} homepage has no browser console or runtime errors`, async ({
    page,
  }) => {
    const runtimeErrors = captureRuntimeErrors(page);

    await page.goto(`/${homepage.locale}`);
    await expect(
      page.getByRole("heading", { level: 1, name: homepage.heading }),
    ).toBeVisible();
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("waitlist-form")).toBeVisible();

    expect(runtimeErrors).toEqual([]);
  });
}

test("the root URL redirects to the English homepage", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/en-GB$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");
});

test("localised nested routes survive a direct load and refresh", async ({ page }) => {
  const routes = [
    { path: "/en-GB/privacy", heading: "Privacy" },
    { path: "/es-ES/guides", heading: "Guías" },
  ] as const;

  for (const route of routes) {
    const directResponse = await page.goto(route.path);
    expect(directResponse?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: route.heading }),
    ).toBeVisible();

    const refreshResponse = await page.reload();
    expect(refreshResponse?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: route.heading }),
    ).toBeVisible();
  }
});

test("mobile navigation opens, traps focus, and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en-GB");

  const menuButton = page.getByRole("button", { name: "Open navigation" });
  const dialog = page.getByRole("dialog", { name: "Mobile navigation" });

  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await menuButton.click();

  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Close navigation" })).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  await page.keyboard.press("Escape");

  await expect(dialog).toBeHidden();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(menuButton).toBeFocused();
});

test("language switch changes the route, document language, and content", async ({ page }) => {
  await page.goto("/en-GB");

  await page.getByRole("link", { name: "Switch language to es-ES" }).click();

  await expect(page).toHaveURL(/\/es-ES$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es-ES");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Descubre exactamente qué está frenando tu negocio.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Switch language to en-GB" }),
  ).toBeVisible();
});

test("feature tabs filter cards and support roving keyboard selection", async ({ page }) => {
  await page.goto("/en-GB");

  const tablist = page.getByRole("tablist", {
    name: "Powerful features. Clear results.",
  });
  const allTab = tablist.getByRole("tab", { name: "All", exact: true });
  const websiteTab = tablist.getByRole("tab", {
    name: "Website",
    exact: true,
  });
  const reportsTab = tablist.getByRole("tab", {
    name: "Reports",
    exact: true,
  });
  const panel = page.locator("#feature-panel");

  await expect(panel.getByRole("article")).toHaveCount(8);
  await allTab.focus();
  await allTab.press("ArrowRight");

  await expect(websiteTab).toBeFocused();
  await expect(websiteTab).toHaveAttribute("aria-selected", "true");
  await expect(panel.getByRole("article")).toHaveCount(2);
  await expect(
    panel.getByRole("heading", { level: 3, name: "Website analysis" }),
  ).toBeVisible();
  await expect(
    panel.getByRole("heading", { level: 3, name: "AI recommendations" }),
  ).toBeVisible();

  await websiteTab.press("End");
  await expect(reportsTab).toBeFocused();
  await expect(reportsTab).toHaveAttribute("aria-selected", "true");
  await expect(panel.getByRole("article")).toHaveCount(3);
});

test("simulated scan progresses to a result and can be reset", async ({ page }) => {
  await page.goto("/en-GB");

  await page.getByTestId("scan-url").fill("https://example.com");
  await page.getByTestId("scan-submit").click();

  await expect(page.getByTestId("scan-progress")).toBeVisible();
  await expect(page.getByTestId("scan-submit")).toBeDisabled();
  await expect(page.getByTestId("scan-result")).toBeVisible({ timeout: 6_000 });
  await expect(page.getByTestId("scan-result")).toContainText("86");

  await page.getByRole("button", { name: "Try another website" }).click();
  await expect(page.getByTestId("scan-url")).toHaveValue("");
  await expect(page.getByTestId("scan-result")).toBeHidden();
});

test("comparison range responds to standard keyboard controls", async ({ page }) => {
  await page.goto("/en-GB");

  const slider = page.getByRole("slider", { name: "Comparison position" });

  await expect(slider).toHaveValue("52");
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(slider).toHaveValue("53");
  await expect(slider).toHaveAttribute(
    "aria-valuetext",
    "53% NegoTrack explanation",
  );

  await slider.press("Home");
  await expect(slider).toHaveValue("10");
  await slider.press("End");
  await expect(slider).toHaveValue("90");
});

test.describe("reduced motion", () => {
  test("keeps the simulated scan usable without timed animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/es-ES");

    // The root layout starts as en-GB; this client effect is a stable hydration signal.
    await expect(page.locator("html")).toHaveAttribute("lang", "es-ES");

    await expect
      .poll(() =>
        page.evaluate(() =>
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        ),
      )
      .toBe(true);
    await expect
      .poll(() =>
        page.evaluate(
          () => getComputedStyle(document.documentElement).scrollBehavior,
        ),
      )
      .toBe("auto");

    const scanUrl = page.getByTestId("scan-url");
    await scanUrl.fill("https://example.es");
    await expect(scanUrl).toHaveValue("https://example.es");
    await page.getByTestId("scan-submit").click();
    await expect(page.getByTestId("scan-result")).toBeVisible();
  });
});

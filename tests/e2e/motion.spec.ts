import { expect, test, type Page } from "@playwright/test";

/** Nothing from the Next.js development portal may paint over the interface. */
async function devOverlayPaints(page: Page) {
  return page.evaluate(() => {
    const portal = document.querySelector("nextjs-portal");
    const root = (portal as (Element & { shadowRoot: ShadowRoot | null }) | null)?.shadowRoot;
    if (!root) return false;
    return [...root.querySelectorAll("*")].some((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  });
}

test.describe("hero", () => {
  test("the primary action is an email capture form that forwards to the waitlist", async ({ page }) => {
    await page.goto("/en-GB");

    const form = page.getByTestId("hero-waitlist");
    const input = page.getByTestId("hero-email");
    const submit = page.getByTestId("hero-waitlist-submit");

    await expect(form).toBeVisible();
    await expect(input).toHaveAttribute("type", "email");
    await expect(input).toHaveAttribute("placeholder", "Enter your email address");
    await expect(submit).toHaveText("Join the waitlist");

    // Input and action share a height so the row reads as one control.
    const [inputBox, submitBox] = [await input.boundingBox(), await submit.boundingBox()];
    expect(Math.round(inputBox?.height ?? 0)).toBe(Math.round(submitBox?.height ?? 0));

    // Submitting hands the address to the full form, which is where consent is captured.
    await input.fill("owner@example.com");
    await submit.click();
    await expect(page.getByTestId("waitlist-email")).toHaveValue("owner@example.com");
  });

  test("the store badges are understated, non-clickable placeholders", async ({ page }) => {
    await page.goto("/en-GB");

    await expect(page.locator(".hero__mobile-label")).toHaveText("Coming soon on mobile");
    const badges = page.locator(".hero__stores img");
    await expect(badges).toHaveCount(2);
    await expect(badges.nth(0)).toHaveAttribute("alt", "Download on the App Store");
    await expect(badges.nth(1)).toHaveAttribute("alt", "Get it on Google Play");

    // Nothing here may promise a download that does not exist yet.
    await expect(page.locator(".hero__stores a")).toHaveCount(0);
    await expect(page.locator(".hero__stores button")).toHaveCount(0);
    expect(Number(await badges.first().evaluate((n) => getComputedStyle(n).opacity))).toBeLessThan(1);
  });

  test("the social-proof row sits under the CTAs with three avatars and honest copy", async ({
    page,
  }) => {
    await page.goto("/en-GB");

    const proof = page.locator(".hero__proof");
    await expect(proof).toBeVisible();
    await expect(proof).toHaveText("Join the waiting list for early access.");
    await expect(proof.locator("svg")).toHaveCount(3);

    // No fabricated traction: the row must not claim a signup count.
    await expect(proof).not.toContainText(/\d/);

    // Decorative marks stay out of the accessibility tree.
    await expect(proof.locator("[aria-hidden='true']").first()).toBeAttached();

    // On desktop the console sits in the other column, so only the copy column stacks.
    const copyOrder = await page.evaluate(() =>
      [".hero__waitlist", ".hero__actions", ".hero__proof", ".hero__mobile"].map((selector) => {
        const node = document.querySelector(selector);
        return node ? node.getBoundingClientRect().top : Number.NaN;
      }),
    );
    expect(copyOrder.some(Number.isNaN)).toBe(false);
    expect(copyOrder, "copy column must run top to bottom in the specified order").toEqual(
      [...copyOrder].sort((a, b) => a - b),
    );

    // The launch note was removed outright.
    await expect(page.locator(".hero__launch")).toHaveCount(0);
  });

  test("mobile stacks the hero in the specified order", async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 900 });
    await page.goto("/en-GB");
    await expect(page.locator("h1")).toBeVisible();

    const stack = await page.evaluate(() =>
      [
        "h1", ".hero__body", ".hero__waitlist", ".hero__actions", ".hero__proof",
        ".hero__mobile", ".hero__visual", ".hero__tabs", ".trust-strip",
      ].map((selector) => {
        const node = document.querySelector(selector);
        return node ? Math.round(node.getBoundingClientRect().top) : Number.NaN;
      }),
    );

    expect(stack.some(Number.isNaN)).toBe(false);
    expect(stack, "mobile hero must stack in the specified order").toEqual(
      [...stack].sort((a, b) => a - b),
    );
  });

  test("the Spanish hero localises both the CTA and the social-proof line", async ({ page }) => {
    await page.goto("/es-ES");

    await expect(page.getByTestId("hero-waitlist-submit")).toHaveText("Únete a la lista");
    await expect(page.getByTestId("hero-email")).toHaveAttribute(
      "placeholder",
      "Introduce tu correo electrónico",
    );
    await expect(page.locator(".hero__mobile-label")).toHaveText("Muy pronto en móvil");
    await expect(page.locator(".hero__proof")).toHaveText(
      "Únete a la lista de espera para el acceso anticipado.",
    );
  });

  test("the feature pills sit centred beneath the dashboard, on one row", async ({ page }) => {
    await page.goto("/en-GB");

    const geometry = await page.evaluate(() => {
      const list = document.querySelector(".hero-tablist") as HTMLElement;
      const visual = document.querySelector(".hero__visual") as HTMLElement;
      const tabs = [...list.querySelectorAll(".hero-tab")];
      const listBox = list.getBoundingClientRect();
      const visualBox = visual.getBoundingClientRect();
      return {
        rows: new Set(tabs.map((t) => Math.round(t.getBoundingClientRect().top))).size,
        centreOffset: Math.abs((listBox.left + listBox.width / 2) - (visualBox.left + visualBox.width / 2)),
        belowDashboard: listBox.top >= visualBox.bottom - 1,
        firstReachable: tabs[0].getBoundingClientRect().left >= listBox.left - 1,
      };
    });

    expect(geometry.rows, "the pill track must stay on a single row").toBe(1);
    expect(geometry.centreOffset).toBeLessThan(3);
    expect(geometry.belowDashboard).toBe(true);
    expect(geometry.firstReachable).toBe(true);

    // Still wired to the console.
    await page.getByTestId("hero-tab-2").click();
    await expect(page.locator("#hero-console-panel").getByRole("heading", { level: 3 })).toHaveText("SEO foundations");
  });

  test("the console resolves to its demonstration values and shows recency metadata", async ({
    page,
  }) => {
    await page.goto("/en-GB");
    await page.getByTestId("hero-tab-0").click();

    const metrics = page.locator(".hero-dashboard .dashboard-metric");
    await expect(metrics).toHaveCount(4);
    await expect(metrics.nth(0).locator("strong")).toContainText("86", { timeout: 4_000 });
    await expect(metrics.nth(3).locator("strong")).toContainText("4.6");

    await expect(page.locator(".hero-dashboard")).toContainText("Last scanned 2 minutes ago");
    await expect(page.locator(".hero-dashboard")).toContainText("Next scan tomorrow at 9:00");
    await expect(page.locator(".hero-dashboard")).toContainText("3 changes detected this week");
  });

  test("the metric micro-bars actually paint their fill", async ({ page }) => {
    await page.goto("/en-GB");
    await page.getByTestId("hero-tab-0").click();
    await expect(page.locator(".hero-dashboard .dashboard-metric").first()).toBeVisible();
    await page.waitForTimeout(2_000);

    // `.dashboard-metric > div` also matches the bar track; if it wins, the fill collapses to 0px.
    const bars = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".hero-dashboard .dashboard-metric__bar")].map((track) => {
        const fill = track.querySelector("i");
        return {
          trackDisplay: getComputedStyle(track).display,
          trackWidth: Math.round(track.getBoundingClientRect().width),
          fillWidth: Math.round(fill?.getBoundingClientRect().width ?? 0),
        };
      }),
    );

    expect(bars.length).toBeGreaterThan(0);
    for (const bar of bars) {
      expect(bar.trackDisplay).toBe("block");
      expect(bar.trackWidth).toBeGreaterThan(20);
      // Fill is a scaleX of the track, so it must be a real fraction of it — never zero.
      expect(bar.fillWidth).toBeGreaterThan(bar.trackWidth * 0.6);
    }
  });

  test("no development overlay paints over the interface", async ({ page }) => {
    await page.goto("/en-GB");
    await expect(page.locator("h1")).toBeVisible();

    expect(await devOverlayPaints(page)).toBe(false);
  });
});

test.describe("scan demonstration", () => {
  test("starts itself on scroll and never shows an empty panel", async ({ page }) => {
    await page.goto("/en-GB");
    await page.locator("#scan-preview").scrollIntoViewIfNeeded();

    // No click: entering the viewport is enough to show work in progress.
    await expect(page.getByTestId("scan-progress")).toBeVisible({ timeout: 4_000 });
    await expect(page.getByTestId("scan-progress")).toContainText("%");
    await expect(page.getByTestId("scan-result")).toBeVisible({ timeout: 8_000 });
    await expect(page.getByTestId("scan-result")).toContainText("86");
    await expect(page.getByTestId("scan-result")).toContainText(
      "Website speed improved by 4 points since the last check.",
    );
  });

  test("can be replayed from the ready panel", async ({ page }) => {
    await page.goto("/en-GB");
    await page.locator("#scan-preview").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("scan-result")).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: "Try another website" }).click();
    const replay = page.getByRole("button", { name: "Replay the demonstration" });
    await expect(replay).toBeVisible();
    await expect(page.locator(".scan-idle")).toContainText("Last scanned 2 minutes ago");

    await replay.click();
    await expect(page.getByTestId("scan-progress")).toBeVisible();
    await expect(page.getByTestId("scan-result")).toBeVisible({ timeout: 8_000 });
  });

  test("holds the product frame at a constant height across every state", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/en-GB");
    const frame = page.locator("#scan-preview .product-frame");
    await frame.scrollIntoViewIfNeeded();

    const heights = new Set<number>();
    const record = async () => {
      const box = await frame.boundingBox();
      if (box) heights.add(Math.round(box.height));
    };

    await expect(page.getByTestId("scan-progress")).toBeVisible({ timeout: 4_000 });
    await record();
    await expect(page.getByTestId("scan-result")).toBeVisible({ timeout: 8_000 });
    await page.waitForTimeout(600);
    await record();
    await page.getByRole("button", { name: "Try another website" }).click();
    await page.waitForTimeout(500);
    await record();

    expect([...heights], "idle, progress and result must not resize the frame").toHaveLength(1);
  });

  test("announces stage changes through a polite live region", async ({ page }) => {
    await page.goto("/en-GB");
    await page.locator("#scan-preview").scrollIntoViewIfNeeded();

    const live = page.locator(".scan-experience [aria-live='polite']");
    await expect(live).toHaveCount(1);
    await expect(live).toContainText("%", { timeout: 4_000 });
  });
});

test.describe("recommendations", () => {
  test("the top recommendation is flagged and details expand accessibly", async ({ page }) => {
    await page.goto("/en-GB");
    await page.locator(".recommendation-board").scrollIntoViewIfNeeded();

    const rows = page.locator(".recommendation-row");
    await expect(rows.first()).toHaveClass(/is-top/);
    await expect(rows.first()).toContainText("Start here");

    const toggle = rows.first().getByRole("button", { name: "Show details" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();

    await expect(rows.first().getByRole("button", { name: "Hide details" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(rows.first()).toContainText("without scrolling");
  });

  test("reordering by ease keeps every recommendation on screen", async ({ page }) => {
    await page.goto("/en-GB");
    await page.locator(".recommendation-board").scrollIntoViewIfNeeded();

    const rows = page.locator(".recommendation-row");
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(1)).toContainText("Improve mobile hero loading");

    await page.getByRole("button", { name: "Prioritise ease" }).click();

    await expect(rows).toHaveCount(3);
    await expect(rows.nth(1)).toContainText("Respond to recent reviews");
  });
});

test.describe("competitor movement", () => {
  test("a competitor overtakes the example business and the change is explained", async ({
    page,
  }) => {
    await page.goto("/en-GB");
    await page.locator(".competitor-board").scrollIntoViewIfNeeded();

    const rows = page.locator(".competitor-table > div[role='row']");
    // Row 0 is the header; the ranking starts at row 1.
    await expect(rows.nth(1)).toContainText("Market peer A", { timeout: 5_000 });
    await expect(rows.nth(2)).toContainText("Your business");

    const change = page.locator(".competitor-board__change");
    await expect(change).toHaveAttribute("data-shown", "true");
    await expect(change).toContainText("Market peer A moved ahead on reviews");
    await expect(change).toContainText("overtook your business on review volume");
    await expect(change).toHaveAttribute("aria-live", "polite");

    // The demonstration stays user-controllable rather than being a one-way trick.
    await page.getByRole("button", { name: "Health", exact: true }).click();
    await expect(rows.nth(1)).toContainText("Your business");
  });
});

test.describe("reduced motion", () => {
  /** Emulate before navigation and prove the preference actually reached the page. */
  async function reduceMotion(page: Page) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en-GB");
    await expect(page.locator("h1")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches),
      )
      .toBe(true);
  }

  test("removes ambient decoration and shows final values immediately", async ({ page }) => {
    await reduceMotion(page);

    await expect(page.locator(".hero-grid-field")).toHaveCSS("display", "none");
    await expect(page.locator(".hero-orb--one")).toHaveCSS("animation-name", "none");
    await expect(page.locator(".hero-chip--one")).toHaveCSS("animation-name", "none");

    // Numbers are their finished values on the first paint, not a count from zero.
    await expect(page.locator(".hero-dashboard .dashboard-metric strong").first()).toContainText("86");

    // The console keeps its resting angle and never tracks the pointer.
    const before = await page.locator(".hero-dashboard-tilt").evaluate((node) => getComputedStyle(node).transform);
    await page.mouse.move(1_100, 300);
    await page.mouse.move(1_250, 520);
    await page.waitForTimeout(300);
    const after = await page.locator(".hero-dashboard-tilt").evaluate((node) => getComputedStyle(node).transform);
    expect(after).toBe(before);
  });

  test("keeps the competitor explanation and weekly report readable without animation", async ({
    page,
  }) => {
    await reduceMotion(page);
    await page.locator(".competitor-board").scrollIntoViewIfNeeded();

    await expect(page.locator(".competitor-board__change")).toBeVisible();
    await expect(page.locator(".competitor-board__change")).toHaveCSS("opacity", "1");

    await page.locator(".weekly-report").scrollIntoViewIfNeeded();
    const items = page.locator(".weekly-report li");
    await expect(items).toHaveCount(4);
    await expect(items.first()).toHaveCSS("opacity", "1");
    await expect(items.first()).toContainText("2 minutes ago");
  });
});

test.describe("counted numbers", () => {
  test("animated digits keep the type scale of the value they replace", async ({ page }) => {
    await page.goto("/en-GB");

    // The count wrapper is structural; ancestors that style bare `span` descendants must not
    // shrink it (this regressed the score ring and the business-type score once already).
    const sizes = await page.evaluate(() => {
      const measure = (selector: string) => {
        const holder = document.querySelector(selector);
        const digits = holder?.querySelector(".count-up");
        if (!holder || !digits) return null;
        return {
          holder: parseFloat(getComputedStyle(holder).fontSize),
          digits: parseFloat(getComputedStyle(digits).fontSize),
        };
      };
      document.querySelector("#product")?.scrollIntoView();
      return {
        ring: measure(".health-score-panel .score-ring__copy strong"),
        stat: measure(".story-stat strong"),
        metric: measure(".hero-dashboard .dashboard-metric strong"),
      };
    });

    for (const [name, pair] of Object.entries(sizes)) {
      expect(pair, `${name} should render counted digits`).not.toBeNull();
      expect(pair!.digits, `${name} digits should match their holder`).toBeCloseTo(pair!.holder, 1);
    }
    expect(sizes.ring!.digits).toBeGreaterThan(30);
  });
});

test.describe("geometry", () => {
  for (const width of [375, 768, 1_440, 1_920] as const) {
    test(`circular elements stay perfectly circular at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/en-GB");
      await expect(page.locator("h1")).toBeVisible();
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page.locator("h1").scrollIntoViewIfNeeded();

      const squashed = await page.evaluate(() => {
        const offenders: string[] = [];
        for (const element of document.querySelectorAll<HTMLElement>("body *")) {
          const style = getComputedStyle(element);
          if (!style.borderRadius.startsWith("50%")) continue;
          const rect = element.getBoundingClientRect();
          if (rect.width < 4 || rect.height < 4) continue;
          if (Math.abs(rect.width - rect.height) > 1) {
            offenders.push(
              `${element.tagName.toLowerCase()}.${element.className} ${Math.round(rect.width)}x${Math.round(rect.height)}`.slice(0, 90),
            );
          }
        }
        return offenders;
      });

      expect(squashed).toEqual([]);
    });
  }
});

test.describe("ambient budget", () => {
  test("continuous motion is confined to the hero, scan and billboard regions", async ({ page }) => {
    await page.goto("/en-GB");
    await expect(page.locator("h1")).toBeVisible();

    const looping = await page.evaluate(() => {
      const allowed = ["#overview", ".section--scan", ".early-access"];
      const offenders: string[] = [];
      for (const element of document.querySelectorAll<HTMLElement>("body *")) {
        const style = getComputedStyle(element);
        if (style.animationIterationCount !== "infinite") continue;
        if (allowed.some((selector) => element.closest(selector))) continue;
        offenders.push(`${element.tagName.toLowerCase()}.${element.className}`.slice(0, 80));
      }
      return offenders;
    });

    expect(looping).toEqual([]);
  });

  test("hero ambient loops pause once the hero leaves the viewport", async ({ page }) => {
    await page.goto("/en-GB");
    await expect(page.locator(".hero")).toHaveClass(/is-ambient/);

    await page.locator("#markets").scrollIntoViewIfNeeded();
    await expect(page.locator(".hero")).not.toHaveClass(/is-ambient/);
    await expect(page.locator(".hero-orb--one")).toHaveCSS("animation-name", "none");
  });
});

test.describe("hero feature selector", () => {
  const features = [
    { index: 0, tab: "Business Overview", title: "Business overview", marker: "Health over time", firstMetric: "Business health" },
    { index: 1, tab: "Website Analysis", title: "Website analysis", marker: "Page-by-page issues", firstMetric: "Website performance" },
    { index: 2, tab: "SEO", title: "SEO foundations", marker: "Local keyword positions", firstMetric: "Search visibility" },
    { index: 3, tab: "Reviews", title: "Review monitoring", marker: "Sentiment summary", firstMetric: "Google rating" },
    { index: 4, tab: "Competitors", title: "Competitor tracking", marker: "Competitor comparison", firstMetric: "Local position" },
    { index: 5, tab: "AI Actions", title: "AI actions", marker: "Prioritised recommendations", firstMetric: "Actions ready" },
  ] as const;

  test("every feature swaps the console to genuinely different content", async ({ page }) => {
    await page.goto("/en-GB");
    const panel = page.locator("#hero-console-panel");
    const seen = new Set<string>();

    for (const feature of features) {
      await page.getByTestId(`hero-tab-${feature.index}`).click();
      // Wait for the crossfade to land before reading the readout.
      await expect(panel.locator(".dashboard-metric > span").first()).toHaveText(feature.firstMetric);
      await expect(panel.getByRole("heading", { level: 3 })).toHaveText(feature.title);
      await expect(panel).toContainText(feature.marker);

      // The frame itself never unmounts — only its contents change.
      await expect(page.locator("#overview .product-frame")).toHaveCount(1);

      const metrics = await panel.locator(".dashboard-metric > span").allInnerTexts();
      expect(metrics).toHaveLength(4);
      seen.add(metrics.join("|"));
    }

    // Six distinct metric sets: no two features show the same readout.
    expect(seen.size).toBe(features.length);
  });

  test("is a correctly wired tab interface", async ({ page }) => {
    await page.goto("/en-GB");

    const tablist = page.getByRole("tablist", { name: "Explore the product" });
    await expect(tablist.getByRole("tab")).toHaveCount(6);

    const overview = page.getByTestId("hero-tab-0");
    await overview.click();
    await expect(overview).toHaveAttribute("aria-selected", "true");
    await expect(overview).toHaveAttribute("aria-controls", "hero-console-panel");

    const panel = page.locator("#hero-console-panel");
    await expect(panel).toHaveAttribute("role", "tabpanel");
    await expect(panel).toHaveAttribute("aria-labelledby", "hero-tab-overview");

    // Roving tabindex: only the selected tab is in the tab order.
    await expect(page.getByTestId("hero-tab-1")).toHaveAttribute("tabindex", "-1");
  });

  test("supports arrow, Home and End keys", async ({ page }) => {
    await page.goto("/en-GB");

    await page.getByTestId("hero-tab-0").click();
    await page.getByTestId("hero-tab-0").press("ArrowRight");
    await expect(page.getByTestId("hero-tab-1")).toBeFocused();
    await expect(page.getByTestId("hero-tab-1")).toHaveAttribute("aria-selected", "true");

    await page.getByTestId("hero-tab-1").press("End");
    await expect(page.getByTestId("hero-tab-5")).toBeFocused();
    await expect(page.locator("#hero-console-panel").getByRole("heading", { level: 3 })).toHaveText("AI actions");

    await page.getByTestId("hero-tab-5").press("ArrowRight");
    await expect(page.getByTestId("hero-tab-0")).toBeFocused();

    await page.getByTestId("hero-tab-0").press("Home");
    await expect(page.getByTestId("hero-tab-0")).toBeFocused();
  });

  test("rotates on its own, then stops for good once the visitor chooses", async ({ page }) => {
    await page.goto("/en-GB");
    // Keep the pointer away: hovering the showcase legitimately pauses rotation.
    await page.mouse.move(5, 5);

    const selectedIndex = () =>
      page.evaluate(() =>
        [...document.querySelectorAll("[role='tab'].hero-tab")].findIndex(
          (tab) => tab.getAttribute("aria-selected") === "true",
        ),
      );

    await expect.poll(selectedIndex, { timeout: 12_000 }).toBe(1);

    await page.getByTestId("hero-tab-4").click();
    await page.mouse.move(5, 5);
    await expect(page.locator(".hero-tab__progress")).toHaveCount(0);
    await page.waitForTimeout(8_000);
    expect(await selectedIndex()).toBe(4);
  });

  test("localises the selector and its panels", async ({ page }) => {
    await page.goto("/es-ES");

    await expect(page.getByRole("tablist", { name: "Explora el producto" })).toBeVisible();
    await page.getByTestId("hero-tab-3").click();
    const panel = page.locator("#hero-console-panel");
    await expect(panel.getByRole("heading", { level: 3 })).toHaveText("Seguimiento de reseñas");
    await expect(panel).toContainText("Resumen de sentimiento");
  });

  test("the selector scrolls instead of widening the page on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/en-GB");

    const tablist = page.locator(".hero-tablist");
    const scrolls = await tablist.evaluate((node) => node.scrollWidth > node.clientWidth);
    expect(scrolls, "the pill row should scroll horizontally at 375px").toBe(true);

    // Touch targets stay comfortable.
    const box = await page.getByTestId("hero-tab-0").boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

    // Choosing a far tab brings it into view inside its own scroller, not by moving the page.
    await page.getByTestId("hero-tab-5").click();
    await page.waitForTimeout(600);
    const visible = await page.evaluate(() => {
      const list = document.querySelector(".hero-tablist");
      const tab = document.querySelector("[data-testid='hero-tab-5']");
      if (!list || !tab) return false;
      const a = list.getBoundingClientRect();
      const b = tab.getBoundingClientRect();
      return b.left >= a.left - 1 && b.right <= a.right + 1;
    });
    expect(visible, "the chosen tab should be scrolled into view").toBe(true);

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    ).toBeLessThanOrEqual(1);
  });

  test("reduced motion shows a static selector with no rotation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en-GB");
    await page.mouse.move(5, 5);

    await expect(page.locator(".hero-tab__progress")).toHaveCount(0);
    await page.waitForTimeout(7_000);
    await expect(page.getByTestId("hero-tab-0")).toHaveAttribute("aria-selected", "true");

    // The tabs still work, they just do not animate.
    await page.getByTestId("hero-tab-2").click();
    await expect(page.locator("#hero-console-panel").getByRole("heading", { level: 3 })).toHaveText("SEO foundations");
  });
});

test.describe("navigation", () => {
  test("renders as a floating frosted pill and compacts on scroll", async ({ page }) => {
    await page.goto("/en-GB");
    const pill = page.locator(".site-header__inner");
    await expect(pill).toBeVisible();

    const atTop = await pill.evaluate((node) => {
      const style = getComputedStyle(node);
      const header = getComputedStyle(node.parentElement as HTMLElement);
      return {
        radius: parseFloat(style.borderRadius),
        blur: style.backdropFilter,
        height: Math.round(node.getBoundingClientRect().height),
        headerPosition: header.position,
        // It must float clear of the viewport edge, not sit flush like a bar.
        offsetFromTop: Math.round(node.getBoundingClientRect().top),
        shadow: style.boxShadow,
      };
    });

    expect(atTop.radius, "the header must be a full pill, not a rounded rectangle").toBeGreaterThanOrEqual(atTop.height / 2);
    expect(atTop.blur, "the frosted glass must survive CSS compilation").toContain("blur(18px)");
    expect(atTop.headerPosition).toBe("fixed");
    expect(atTop.offsetFromTop).toBeGreaterThan(0);
    expect(atTop.shadow).not.toBe("none");

    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(page.locator(".site-header")).toHaveClass(/is-compact/);
    await page.waitForTimeout(500);

    const scrolled = await pill.evaluate((node) => Math.round(node.getBoundingClientRect().height));
    expect(scrolled, "the pill should shrink once scrolled").toBeLessThan(atTop.height);
    await expect(pill).toBeInViewport();
  });

  test("keeps the same links, routing and mint call to action", async ({ page }) => {
    await page.goto("/en-GB");

    const nav = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(nav.getByRole("link")).toHaveCount(5);
    for (const label of ["Product", "Solutions", "How it works", "Pricing", "Resources"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }

    const cta = page.locator(".site-header .desktop-cta");
    await expect(cta).toHaveAttribute("href", "#early-access");
    const ctaShape = await cta.evaluate((node) => ({
      radius: parseFloat(getComputedStyle(node).borderRadius),
      height: node.getBoundingClientRect().height,
    }));
    expect(ctaShape.radius, "the call to action must be a full pill").toBeGreaterThanOrEqual(ctaShape.height / 2);
    expect(await cta.evaluate((n) => getComputedStyle(n).backgroundImage)).toContain("linear-gradient");

    // Language switching still routes.
    await expect(page.getByRole("link", { name: "Switch language to es-ES" })).toBeVisible();
  });

  test("nav links and the CTA have visible hover and focus states", async ({ page }) => {
    await page.goto("/en-GB");
    const link = page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "How it works" });

    await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await link.hover();
    await expect(link).toHaveCSS("background-color", "rgba(19, 201, 138, 0.09)");

    await link.focus();
    const outline = await link.evaluate((n) => getComputedStyle(n).outlineWidth);
    expect(outline, "focus ring must remain visible on the glass").not.toBe("0px");
  });

  test("collapses to logo and menu control on mobile without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 900 });
    await page.goto("/en-GB");

    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();
    const menu = page.getByRole("button", { name: "Open navigation" });
    await expect(menu).toBeVisible();

    // Poll: under parallel load the viewport change can be measured before styles settle.
    await expect
      .poll(async () => (await menu.boundingBox())?.height ?? 0)
      .toBeGreaterThanOrEqual(44);

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    ).toBeLessThanOrEqual(1);
  });
});

test.describe("hero insight badges", () => {
  test("the left badge tucks into the console edge without covering the sidebar", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/en-GB");
    await page.waitForTimeout(2_500);

    const geometry = await page.evaluate(() => {
      const chip = document.querySelector(".hero-chip--one")!.getBoundingClientRect();
      const visual = document.querySelector(".hero__visual")!.getBoundingClientRect();
      const icon = document.querySelector(".dashboard-sidebar nav > span svg")!.getBoundingClientRect();
      const logo = document.querySelector(".dashboard-sidebar .logo-wordmark")!.getBoundingClientRect();
      const rows = [...document.querySelectorAll(".dashboard-sidebar nav > span")].map((node) => {
        const box = node.getBoundingClientRect();
        return { label: node.textContent?.trim() ?? "", top: box.top, bottom: box.bottom };
      });
      return {
        overlapsFrame: chip.right > visual.left,
        insidePx: chip.right - visual.left,
        clearsNavIcons: chip.right <= icon.left,
        clearsLogo: chip.bottom < logo.top || chip.top > logo.bottom,
        alignedRows: rows.filter((r) => r.bottom > chip.top && r.top < chip.bottom).map((r) => r.label),
      };
    });

    // Attached to the window: it overlaps the frame, but stops short of the navigation.
    expect(geometry.overlapsFrame).toBe(true);
    expect(geometry.insidePx).toBeGreaterThan(8);
    expect(geometry.clearsNavIcons, "must never cover the sidebar icons or labels").toBe(true);
    expect(geometry.clearsLogo, "must never cover the NegoTrack logo").toBe(true);
    expect(geometry.alignedRows).toContain("Website");
    expect(geometry.alignedRows).toContain("SEO");
  });

  test("the right badge stays clear of the feature pills", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/en-GB");
    await page.waitForTimeout(2_500);

    const gap = await page.evaluate(() => {
      const chip = document.querySelector(".hero-chip--two")!.getBoundingClientRect();
      const tabs = document.querySelector(".hero__tabs")!.getBoundingClientRect();
      const visual = document.querySelector(".hero__visual")!.getBoundingClientRect();
      return { toTabs: tabs.top - chip.bottom, withinFrameRight: chip.right <= visual.right };
    });

    expect(gap.toTabs, "the badge must not reach the pill track").toBeGreaterThan(0);
    expect(gap.withinFrameRight).toBe(true);
  });

  test("badges only appear where the two-column hero gives them room", async ({ page }) => {
    for (const width of [768, 1200]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/en-GB");
      await expect(page.locator(".hero-chip--one")).toBeHidden();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      ).toBeLessThanOrEqual(1);
    }

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/en-GB");
    await expect(page.locator(".hero-chip--one")).toBeVisible();
    // Never off the left of the viewport.
    const left = await page.locator(".hero-chip--one").evaluate((n) => n.getBoundingClientRect().left);
    expect(left).toBeGreaterThan(0);
  });
});

test.describe("hero console content bounds", () => {
  test("every feature keeps its panel content inside the panel", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const locale of ["en-GB", "es-ES"]) {
      await page.goto(`/${locale}`);
      await page.waitForTimeout(1_500);

      for (let index = 0; index < 6; index += 1) {
        await page.getByTestId(`hero-tab-${index}`).click();
        await page.waitForTimeout(450);

        const spills = await page.evaluate(() => {
          const out: string[] = [];
          for (const panel of document.querySelectorAll(".hero-dashboard .dashboard-panel")) {
            const panelBox = panel.getBoundingClientRect();
            for (const child of panel.children) {
              const childBox = child.getBoundingClientRect();
              if (childBox.bottom - panelBox.bottom > 1) {
                out.push(`${panel.className.split(" ").pop()} > ${(child.className || child.tagName).toString().split(" ")[0]}`);
              }
            }
          }
          return out;
        });

        expect(spills, `${locale} tab ${index}: content must not spill onto neighbouring panels`).toEqual([]);
      }
    }
  });

  test("each feature carries its own pair of notification icons", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/en-GB");
    await page.waitForTimeout(2_000);

    const seen = new Set<string>();
    for (let index = 0; index < 6; index += 1) {
      await page.getByTestId(`hero-tab-${index}`).click();
      await page.waitForTimeout(450);

      const chips = await page.evaluate(() =>
        [...document.querySelectorAll(".hero-chip")].map((chip) => ({
          icon: [...(chip.querySelector(".hero-chip__icon svg")?.classList ?? [])].find((c) => c.startsWith("lucide-")) ?? "",
          text: chip.textContent?.trim() ?? "",
          opacity: getComputedStyle(chip).opacity,
        })),
      );

      expect(chips).toHaveLength(2);
      for (const chip of chips) {
        expect(chip.icon, "each chip must render a lucide icon").not.toBe("");
        expect(chip.text.length).toBeGreaterThan(0);
        // Chips stay mounted across feature changes; they must never blank out.
        expect(chip.opacity).toBe("1");
      }
      seen.add(chips.map((c) => c.icon).join("+"));
    }

    expect(seen.size, "every feature should have a distinct icon pairing").toBe(6);
  });

  test("the Spanish headline holds three lines on desktop", async ({ page }) => {
    for (const width of [1280, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/es-ES");
      await page.waitForTimeout(900);

      const lines = await page.evaluate(() => {
        const h1 = document.querySelector(".hero h1")!;
        return Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
      });
      expect(lines, `Spanish headline at ${width}px`).toBe(3);
    }
  });
});

test.describe("monitored-areas graphic", () => {
  test("the orbit rings stay centred on the icon they encircle", async ({ page }) => {
    for (const [locale, width] of [["en-GB", 1440], ["en-GB", 768], ["es-ES", 1440]] as const) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/${locale}`);
      await page.locator(".section--monitored").scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      const geometry = await page.evaluate(() => {
        const icon = document.querySelector(".area-preview__mark > span")!.getBoundingClientRect();
        const orbit = document.querySelector(".area-orbit")!.getBoundingClientRect();
        return {
          dx: (orbit.left + orbit.width / 2) - (icon.left + icon.width / 2),
          dy: (orbit.top + orbit.height / 2) - (icon.top + icon.height / 2),
          orbitSquare: Math.abs(orbit.width - orbit.height),
          iconSquare: Math.abs(icon.width - icon.height),
        };
      });

      expect(Math.abs(geometry.dx), `${locale} @${width}: horizontal offset`).toBeLessThan(0.5);
      expect(Math.abs(geometry.dy), `${locale} @${width}: vertical offset`).toBeLessThan(0.5);
      // Both must stay perfectly circular.
      expect(geometry.orbitSquare).toBeLessThan(0.5);
      expect(geometry.iconSquare).toBeLessThan(0.5);
    }
  });
});

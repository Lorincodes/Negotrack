import { expect, test } from "@playwright/test";

const viewportWidths = [375, 430, 768, 1_024, 1_440] as const;
const locales = ["en-GB", "es-ES"] as const;

for (const locale of locales) {
  for (const width of viewportWidths) {
    test(`${locale} has no page-level horizontal overflow at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      await expect(page.locator("h1")).toBeVisible();
      await page.locator("footer").scrollIntoViewIfNeeded();

      const layout = await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );

        const viewportWidth = window.innerWidth;
        const documentWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;

        return {
          viewportWidth,
          documentWidth,
          bodyWidth,
          overflow: Math.max(documentWidth, bodyWidth) - viewportWidth,
        };
      });

      expect(layout.viewportWidth).toBe(width);
      expect(
        layout.overflow,
        `layout widths: ${JSON.stringify(layout)}`,
      ).toBeLessThanOrEqual(1);
    });
  }
}

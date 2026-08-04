import { expect, test } from "@playwright/test";

test("waitlist form validates email and privacy consent before calling the API", async ({
  page,
}) => {
  let apiCalls = 0;
  await page.route("**/api/waitlist", async (route) => {
    apiCalls += 1;
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ ok: false }),
    });
  });
  await page.goto("/en-GB");

  await page.getByTestId("waitlist-submit").click();

  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(
    page.getByText("Please agree to the privacy notice to join the waitlist."),
  ).toBeVisible();
  await expect(page.getByTestId("waitlist-email")).toBeFocused();
  await expect(page.getByTestId("waitlist-email")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(apiCalls).toBe(0);

  await page.getByTestId("waitlist-email").fill("owner@example.com");
  await page.getByTestId("privacy-consent").check();
  await expect(page.getByText("Enter a valid email address.")).toBeHidden();
  await expect(
    page.getByText("Please agree to the privacy notice to join the waitlist."),
  ).toBeHidden();
});

test("successful waitlist submission includes referral and UTM attribution", async ({
  page,
}) => {
  let capturedPayload: Record<string, unknown> | undefined;
  let requestContentType: string | undefined;

  await page.route("**/api/waitlist", async (route) => {
    capturedPayload = route.request().postDataJSON() as Record<string, unknown>;
    requestContentType = route.request().headers()["content-type"];
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        code: "registered",
        message: "Registered",
      }),
    });
  });

  await page.goto("/en-GB/guides");
  const referralUrl = page.url();
  await page.evaluate(() => {
    const link = document.createElement("a");
    link.href =
      "/en-GB?ref=partner-42&utm_source=newsletter&utm_medium=email&utm_campaign=private-beta&utm_term=growth&utm_content=hero";
    document.body.append(link);
    link.click();
  });
  await page.waitForURL(/\/en-GB\?ref=partner-42/);
  await expect(page.getByTestId("waitlist-form")).toBeAttached();
  await expect
    .poll(() => page.evaluate(() => document.referrer))
    .toBe(referralUrl);

  await page.getByTestId("waitlist-email").fill("Owner@Example.COM");
  await page.getByTestId("privacy-consent").check();
  await page.getByTestId("marketing-consent").check();
  await page.getByTestId("waitlist-submit").click();

  const success = page.getByTestId("waitlist-success");
  await expect(success).toBeVisible();
  await expect(success).toContainText("on the NegoTrack waiting list");
  expect(requestContentType).toContain("application/json");
  expect(capturedPayload).toEqual(
    expect.objectContaining({
      email: "owner@example.com",
      country: "GB",
      preferredLanguage: "en-GB",
      privacyConsent: true,
      marketingConsent: true,
      referralUrl,
      referrer: "partner-42",
      utmSource: "newsletter",
      utmMedium: "email",
      utmCampaign: "private-beta",
      utmTerm: "growth",
      utmContent: "hero",
    }),
  );
});

test("duplicate waitlist response shows the localised duplicate state", async ({
  page,
}) => {
  await page.route("**/api/waitlist", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        code: "already_registered",
        message: "Already registered",
      }),
    });
  });
  await page.goto("/en-GB");

  await page.getByTestId("waitlist-email").fill("existing@example.com");
  await page.getByTestId("privacy-consent").check();
  await page.getByTestId("waitlist-submit").click();

  const success = page.getByTestId("waitlist-success");
  await expect(success).toBeVisible();
  await expect(success).toContainText(
    "already on the NegoTrack waiting list",
  );
});

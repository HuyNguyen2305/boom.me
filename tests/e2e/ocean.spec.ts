import { expect, test } from "@playwright/test";

test("depth gauge follows scroll and canvas never blocks clicks", async ({ page, isMobile }) => {
  await page.goto("/");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("aria-hidden", "true");
  await expect(canvas).toHaveCSS("pointer-events", "none");
  if (isMobile || (page.viewportSize()?.width ?? 0) < 640) return; // gauge hidden on phones
  const gauge = page.getByText(/^\d+ m$/);
  await expect(gauge).toHaveText(/^([0-9]|10) m$/); // viewport middle sits between Hero (0 m) and About (10 m)
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await expect(gauge).toHaveText("200 m");
});

test("reduced motion still renders a still frame", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("canvas")).toBeAttached();
});

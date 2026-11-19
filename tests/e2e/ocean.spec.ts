import { expect, test } from "@playwright/test";

const desktopOnly = (width?: number) => (width ?? 0) < 640;

test("depth gauge follows scroll and canvas never blocks clicks", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("aria-hidden", "true");
  await expect(canvas).toHaveCSS("pointer-events", "none");
  if (desktopOnly(page.viewportSize()?.width)) return; // gauge hidden on phones
  const gauge = page.getByText(/^\d+ m$/);
  await expect(gauge).toHaveText(/^\d+ m$/);
  await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await expect(gauge).toHaveText("200 m");
});

test("reduced motion still renders a still frame", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("canvas")).toBeAttached();
});

test("hero describes the controls and has no action buttons", async ({ page }) => {
  test.skip(desktopOnly(page.viewportSize()?.width), "controls are for keyboards");
  await page.goto("/");
  await expect(page.getByText("On Surface")).toBeVisible();
  await expect(page.getByRole("list", { name: "How to control the fish" })).toBeVisible();
  await expect(page.getByRole("link", { name: /start the dive/i })).toHaveCount(0);
});

test("arrow down dives", async ({ page }) => {
  test.skip(desktopOnly(page.viewportSize()?.width), "desktop only");
  await page.goto("/");
  await page.locator("canvas").waitFor(); // Ocean mounts after hydration; its key listener starts with it
  await page.keyboard.down("ArrowDown");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await page.keyboard.up("ArrowDown");
});

test("E opens the project window, Esc closes it", async ({ page }) => {
  test.skip(desktopOnly(page.viewportSize()?.width), "desktop only");
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelector("[data-project]")!.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.keyboard.press("e");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(/Project/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

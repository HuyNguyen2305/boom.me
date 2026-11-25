import { expect, test } from "@playwright/test";

const desktopOnly = (width?: number) => (width ?? 0) < 640;

test("depth gauge follows scroll and canvas never blocks clicks", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator("canvas").first();
  await expect(canvas).toHaveAttribute("aria-hidden", "true");
  await expect(canvas).toHaveCSS("pointer-events", "none");
  if (desktopOnly(page.viewportSize()?.width)) return; // gauge hidden on phones
  const gauge = page.getByText(/^\d+ m$/);
  await expect(gauge).toHaveText(/^\d+ m$/);
  await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await expect.poll(async () => parseInt((await gauge.textContent()) ?? "0")).toBeGreaterThan(150); // the fish is deep by the sea floor
});

test("reduced motion still renders a still frame", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("canvas").first()).toBeAttached();
});

test("hero says On Surface, describes the controls and has no action buttons", async ({ page }) => {
  test.skip(desktopOnly(page.viewportSize()?.width), "controls are for keyboards");
  await page.goto("/");
  await expect(page.getByText("On Surface")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Software Engineer.");
  await expect(page.getByText("Down arrow: dive")).toBeAttached(); // visible hint floats above the fish on the canvas
  await expect(page.getByRole("link", { name: /start the dive/i })).toHaveCount(0);
});

test("arrow down dives", async ({ page }) => {
  test.skip(desktopOnly(page.viewportSize()?.width), "desktop only");
  await page.goto("/");
  await page.locator("canvas").first().waitFor(); // Ocean mounts after hydration; its key listener starts with it
  await page.keyboard.down("ArrowDown");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await page.keyboard.up("ArrowDown");
});

test("E opens the project window, Esc closes it", async ({ page }) => {
  test.skip(desktopOnly(page.viewportSize()?.width), "desktop only");
  await page.goto("/");
  await page.locator("#works").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelector("[data-project]")!.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.locator("[data-project]").first().hover(); // E opens the hovered card (or the one the fish touches)
  await page.keyboard.press("e");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { level: 3 })).toHaveText(/Project/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("hero and About fit on the first screen", async ({ page }) => {
  test.skip(desktopOnly(page.viewportSize()?.width), "desktop only");
  await page.goto("/");
  const photo = await page.locator("#about > div > div").last().boundingBox();
  expect(photo!.y + 80).toBeLessThan(page.viewportSize()!.height); // About content starts on screen
});

test("the fish can swim right as well as left", async ({ page }) => {
  test.skip(desktopOnly(page.viewportSize()?.width), "desktop only");
  await page.goto("/");
  await page.locator("canvas").first().waitFor();
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(600);
  await page.keyboard.up("ArrowRight");
  // no assertion on pixels: this guards against the keys throwing or scrolling the page sideways
  expect(await page.evaluate(() => scrollX)).toBe(0);
});

test("the first screen is only sky, hero and About: Skills starts below the fold", async ({ page }) => {
  test.skip(desktopOnly(page.viewportSize()?.width), "desktop only");
  await page.goto("/");
  const skills = await page.locator("#skills").boundingBox();
  expect(skills!.y).toBeGreaterThanOrEqual(page.viewportSize()!.height - 2);
});

test("the fish swims between two limits before the page scrolls", async ({ page }) => {
  test.skip(desktopOnly(page.viewportSize()?.width), "desktop only");
  await page.goto("/");
  await page.locator("canvas").first().waitFor();
  await page.keyboard.down("ArrowDown");
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => scrollY)).toBe(0); // still inside the limits: only the fish moves
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 8000 }).toBeGreaterThan(50); // at the lower limit the page scrolls
  await page.keyboard.up("ArrowDown");
});

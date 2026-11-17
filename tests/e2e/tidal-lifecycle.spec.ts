import { expect, test } from "@playwright/test";

test("WebGL survives context restore and viewport changes", async ({
  page,
}) => {
  await page.goto("/");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-renderer", "webgl");
  await canvas.evaluate((el) => {
    const gl = (el as HTMLCanvasElement).getContext("webgl")!;
    const extension = gl.getExtension("WEBGL_lose_context")!;
    extension.loseContext();
    setTimeout(() => extension.restoreContext(), 400);
  });
  await expect(canvas).toHaveAttribute("data-renderer", "fallback");
  await expect(page.locator("svg[data-tidal-fallback]")).toBeVisible();
  await expect(canvas).toHaveAttribute("data-renderer", "webgl");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() =>
      canvas.evaluate(
        (el) =>
          (el as HTMLCanvasElement).width / (el as HTMLCanvasElement).height,
      ),
    )
    .toBeCloseTo(390 / 844, 2);
  await page.setViewportSize({ width: 2560, height: 1440 });
  expect(
    await canvas.evaluate(
      (el) =>
        (el as HTMLCanvasElement).width * (el as HTMLCanvasElement).height,
    ),
  ).toBeLessThanOrEqual(1_200_000);
});

test("visibility, runtime reduced-motion and client unmount stop draw calls", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const win = window as typeof window & { tidalDraws: number };
    win.tidalDraws = 0;
    const original = WebGLRenderingContext.prototype.drawArrays;
    WebGLRenderingContext.prototype.drawArrays = function (
      ...args: Parameters<typeof original>
    ) {
      win.tidalDraws++;
      return original.apply(this, args);
    };
  });
  await page.goto("/About");
  await page.getByRole("link", { name: "ホーム", exact: true }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-motion", "running");
  const draws = () =>
    page.evaluate(
      () => (window as typeof window & { tidalDraws: number }).tidalDraws,
    );
  await expect.poll(draws).toBeGreaterThan(2);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(canvas).toHaveAttribute("data-motion", "hidden");
  const hiddenCount = await draws();
  await page.waitForTimeout(150);
  expect(await draws()).toBe(hiddenCount);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(draws).toBeGreaterThan(hiddenCount);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(canvas).toHaveAttribute("data-motion", "reduced");
  const reducedCount = await draws();
  await page.mouse.move(100, 100);
  await page.waitForTimeout(150);
  expect(await draws()).toBe(reducedCount);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(draws).toBeGreaterThan(reducedCount);
  await page.goBack();
  await expect(page).toHaveURL("/About");
  await expect(canvas).toHaveCount(0);
  const disposedCount = await draws();
  await page.waitForTimeout(150);
  expect(await draws()).toBe(disposedCount);
});

test("background touch does not pause and the title remains inert", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-motion", "running");
  const title = (await page.getByRole("heading").boundingBox())!;
  await page.touchscreen.tap(
    title.x + title.width / 2,
    title.y + title.height / 2,
  );
  await expect(canvas).toHaveAttribute("data-motion", "running");
  await page.touchscreen.tap(30, 30);
  await expect(canvas).toHaveAttribute("data-motion", "running");
  await page.touchscreen.tap(30, 30);
  await expect(canvas).toHaveAttribute("data-motion", "running");
  await context.close();
});

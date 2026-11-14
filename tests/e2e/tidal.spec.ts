import { expect, test } from "@playwright/test";

for (const width of [390, 1280]) {
  test(`tidal home contains only the centered title at ${width}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading")).toHaveCount(1);
    const title = page.getByRole("heading", {
      level: 1,
      name: "hamaryo.dev",
      exact: true,
    });
    await expect(title).toBeVisible();
    await expect(page.locator("nav, footer, a")).toHaveCount(0);
    const box = (await title.boundingBox())!;
    expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThan(2);
    expect(Math.abs(box.y + box.height / 2 - 450)).toBeLessThan(2);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= innerWidth &&
          document.documentElement.scrollHeight <= innerHeight,
      ),
    ).toBe(true);
    const canvas = page.locator("canvas");
    await expect(canvas).toHaveAttribute("data-renderer", "webgl");
    await expect(canvas).toHaveAttribute("data-motion", "running");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await canvas.click({ position: { x: 30, y: 30 } });
    await expect(canvas).toHaveAttribute("data-motion", "running");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button")).toBeFocused();
    await page.keyboard.press("Space");
    await expect(canvas).toHaveAttribute("data-motion", "paused");
    const still = await canvas.screenshot();
    await page.mouse.move(width - 20, 100);
    await page.waitForTimeout(160);
    expect((await canvas.screenshot()).equals(still)).toBe(true);
    await page.keyboard.press("Space");
    await expect(canvas).toHaveAttribute("data-motion", "running");
    await page.waitForTimeout(160);
    expect((await canvas.screenshot()).equals(still)).toBe(false);
    await page.keyboard.press("Space");
    await page.keyboard.press("Tab");
    await page.screenshot({ path: info.outputPath(`tidal-${width}.png`) });
    expect(errors).toEqual([]);
  });
}

test("keyboard focus reveals the motion control without making the title interactive", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-motion",
    "running",
  );
  const label = page.locator(".tidal-control-label");
  await expect(label).toBeHidden();
  await page.mouse.move(30, 30);
  await expect(label).toBeHidden();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button")).toBeFocused();
  await expect(label).toBeVisible();
  await expect(label).toHaveText("背景の動きを停止");
  await page.keyboard.press("Space");
  await expect(label).toHaveText("背景の動きを再開");
  await page.getByRole("button").click();
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-motion",
    "running",
  );
  await page.keyboard.press("Enter");
  await expect(page.locator("canvas")).toHaveAttribute("data-motion", "paused");
  await page.keyboard.press("Enter");
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-motion",
    "running",
  );
  await page.keyboard.press("Tab");
  await expect(page.getByRole("heading")).not.toBeFocused();
  await expect(label).toBeHidden();
});

test("reduced motion stays static through pointer and keyboard input", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-renderer", "webgl");
  await expect(canvas).toHaveAttribute("data-motion", "reduced");
  await expect(page.getByRole("button")).toHaveAttribute(
    "aria-label",
    "背景は静止表示です",
  );
  // Compare with the same focus UI; the focus-only label is not animation.
  await page.getByRole("button").focus();
  const still = await canvas.screenshot();
  await page.mouse.move(100, 200);
  await page.keyboard.press("Space");
  await page.waitForTimeout(160);
  expect((await canvas.screenshot()).equals(still)).toBe(true);
  await page.screenshot({ path: info.outputPath("tidal-reduced.png") });
});

test("WebGL unavailable retains the static tidal artwork", async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type === "webgl" || type === "webgl2") return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-renderer",
    "fallback",
  );
  await expect(page.locator("svg[data-tidal-fallback]")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "hamaryo.dev" }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.locator(".tidal-control-label")).toBeVisible();
  await expect(page.locator(".tidal-control-label")).toHaveText(
    "背景は静止表示です",
  );
  await page.keyboard.press("Tab");
  await expect(page.locator(".tidal-control-label")).toBeHidden();
  await page.screenshot({ path: info.outputPath("tidal-fallback.png") });
});

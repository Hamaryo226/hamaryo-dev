import { expect, test } from "@playwright/test";

for (const width of [390, 1280]) {
  test(`works and profile at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/works");
    await expect(page.locator("#works a")).toHaveCount(2);
    for (const title of ["TaikoDive", "Better Tello GUI"]) {
      const card = page.getByRole("link", { name: title, exact: true });
      await expect(card.locator(".work-lead")).toBeVisible();
      await card.locator(".work-figure").click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page.locator(".work-chapters section")).toHaveCount(3);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.locator(".detail-back").click();
      await expect(
        page.getByRole("heading", { name: "Works", exact: true }),
      ).toBeInViewport();
    }
    await page.locator("#about").scrollIntoViewIfNeeded();
    await expect(page.locator("#about img")).toHaveCount(2);
    for (const img of await page.locator("main img").all()) {
      await expect
        .poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
    }
  });
}

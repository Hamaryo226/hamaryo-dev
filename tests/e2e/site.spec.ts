import { expect, test } from "@playwright/test";

const title = "hamaryo.dev の記事を JSON から静的ページにする仕組み";

test("home links to the blog and the new article", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "ブログ 技術記事" }).click();
  await expect(page).toHaveURL("/Blog");
  await page.getByRole("link", { name: new RegExp(title) }).click();
  await expect(page).toHaveURL("/Blog/06");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await expect(page.locator("article pre")).toHaveCount(3);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
});

test("diagram supports keyboard controls and restores focus", async ({
  page,
}) => {
  await page.goto("/Project/strolly");
  const trigger = page.getByRole("button", {
    name: "Strolly の構成図を拡大表示",
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Strolly の構成図" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "閉じる" })).toBeFocused();
  // 最後のボタンから Tab / Shift+Tab で巡回しても、背面へ抜けない。
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "拡大", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "閉じる" })).toBeFocused();
  await page.keyboard.press("+");
  await expect(dialog.getByText("140%", { exact: true })).toBeVisible();
  await page.keyboard.press("-");
  await expect(dialog.getByText("100%", { exact: true })).toBeVisible();
  await page.keyboard.press("+");
  await page.keyboard.press("0");
  await expect(dialog.getByText("100%", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await trigger.click();
  await dialog.getByRole("button", { name: "閉じる" }).click();
  await expect(trigger).toBeFocused();
});

test("mobile article and dark diagram fit the viewport", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ["/", "/Blog", "/Blog/06"]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.screenshot({
    path: testInfo.outputPath("mobile-article.png"),
    fullPage: true,
  });
  await page.goto("/Project/strolly");
  await page.getByRole("button", { name: "Toggle theme" }).first().click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page
    .getByRole("button", { name: "Strolly の構成図を拡大表示" })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.locator('img[src="/diagram/strolly-dark.png"]'),
  ).toBeVisible();
  await expect(dialog).toHaveCSS("width", "375px");
  await page.screenshot({
    path: testInfo.outputPath("mobile-dark-diagram.png"),
  });
  await dialog.getByRole("button", { name: "拡大", exact: true }).click();
  await expect(dialog.getByText("140%", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "閉じる" }).click();
  await expect(dialog).toHaveCount(0);
});

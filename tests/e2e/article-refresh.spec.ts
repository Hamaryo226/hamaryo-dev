import { expect, test } from "@playwright/test";

for (const width of [390, 1280]) {
  test(`Strolly case study at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/Project/strolly");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Strolly");
    await expect(
      page.getByText("聴き切った曲を、歩いたルートと一緒に残す。", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText("対応環境：iOS 17以降", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "曲とルートを、地図に残す",
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "記録の仕組み・技術", exact: true })
      .click();
    await expect(page).toHaveURL(/#technology$/);
    await expect(page.locator("#technology")).toBeInViewport();
    await page.getByRole("link", { name: "できること", exact: true }).click();
    await expect(page).toHaveURL(/#features$/);
    await expect(page.locator("#features")).toBeInViewport();
    await expect(
      page.getByRole("heading", { name: "できること", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "記録を支える仕組み", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "ほかの作品", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("この記事はまだ作成途中です。", { exact: false }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /ダウンロード|TestFlight/ }),
    ).toHaveCount(0);
    const icon = page.getByRole("img", {
      name: "Strollyのアプリアイコン",
      exact: true,
    });
    expect((await icon.boundingBox())!.width).toBeLessThanOrEqual(96);
    const body = page.locator("article section p").first();
    expect(
      parseFloat(await body.evaluate((el) => getComputedStyle(el).fontSize)),
    ).toBeGreaterThanOrEqual(15);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
  });
}

test("keyboard can navigate to another work", async ({ page }) => {
  await page.goto("/Project/strolly");
  const link = page.getByRole("link", {
    name: "TaikoDiveの詳細を見る",
    exact: true,
  });
  for (let i = 0; i < 45; i++) {
    await page.keyboard.press("Tab");
    if (await link.evaluate((el) => el === document.activeElement)) break;
  }
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/Project\/taikodive$/);
});

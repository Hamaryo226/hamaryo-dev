import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

// フィルターのボタンは静的HTMLにも存在するため、操作前にテーマボタンで
// hydration の完了を待つ。
async function openHydratedPage(page: Page, path: string) {
  await page.goto(path);
  await expect(
    page.getByRole("button", { name: "Toggle theme" }),
  ).toBeVisible();
}

test("featured project and profile have distinct destinations", async ({
  page,
}) => {
  await openHydratedPage(page, "/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hamaryo");
  const home = page
    .getByRole("banner")
    .getByRole("link", { name: "ホーム", exact: true });
  await expect(home).toBeVisible();
  await expect(home).toHaveText("");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    "/icon/site-symbol.svg",
  );
  await expect(page.getByText("Webから、")).toHaveCount(0);
  await expect(
    page.getByText("コンセプトイメージ", { exact: false }),
  ).toHaveCount(0);
  const icon = page.getByRole("img", { name: "Strollyのアプリアイコン" });
  await expect(icon).toBeVisible();
  await expect(icon).toHaveAttribute("src", "/img/strolly/app-icon.png");
  await page
    .getByRole("link", { name: "Strollyの詳細を見る", exact: true })
    .click();
  await expect(page).toHaveURL("/Project/strolly");
  await page.goBack();
  await page
    .getByRole("navigation", { name: "メインナビゲーション" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL("/About");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
  await expect(
    page
      .getByRole("navigation", { name: "メインナビゲーション" })
      .getByRole("link", { name: "About", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.getByRole("link", { name: "この分野の作品" }).nth(1).click();
  await expect(page).toHaveURL(/platform=apple/);
  await expect(
    page.getByRole("region", { name: "作品一覧" }).getByRole("link"),
  ).toHaveCount(2);
});

test("compact profile defaults to dark and projects open with the keyboard", async ({
  page,
}) => {
  await openHydratedPage(page, "/");
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(
    await page
      .getByRole("main")
      .evaluate((main) => main.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(640);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
    "font-size",
    "18px",
  );
  await expect(page.getByRole("definition")).toHaveText(["9", "6", "4"]);
  const project = page.getByRole("group", {
    name: "Strollyの紹介",
    exact: true,
  });
  await expect(project).toHaveJSProperty("open", true);
  await project.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(project).toHaveJSProperty("open", false);
  await page.keyboard.press("Enter");
  await expect(project).toHaveJSProperty("open", true);
  await expect(
    project.getByRole("link", { name: "Strollyの詳細を見る" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
});

test("project filters persist in URL, reload and browser history", async ({
  page,
}) => {
  await openHydratedPage(page, "/Project");
  const cards = page
    .getByRole("region", { name: "作品一覧" })
    .getByRole("link");
  await expect(cards).toHaveCount(9);
  await page
    .getByRole("group", { name: "プラットフォーム", exact: true })
    .getByRole("button", { name: "iOS / watchOS", exact: true })
    .click();
  await expect(cards).toHaveCount(2);
  await expect(page).toHaveURL(/platform=apple/);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Toggle theme" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "iOS / watchOS", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(cards).toHaveCount(2);
  await page
    .getByRole("group", { name: "制作区分", exact: true })
    .getByRole("button", { name: "大学開発", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "条件に合うプロジェクトがありません" }),
  ).toBeVisible();
  await page.goBack();
  await expect(cards).toHaveCount(2);
  await page.getByRole("link", { name: "絞り込みを解除" }).click();
  await expect(page).toHaveURL("/Project");
  await expect(cards).toHaveCount(9);
  await page.getByRole("button", { name: "大学開発", exact: true }).click();
  await page
    .getByRole("button", { name: "iOS / watchOS", exact: true })
    .click();
  await page.getByRole("link", { name: "すべて表示", exact: true }).click();
  await expect(cards).toHaveCount(9);
});

test("About is directly served with sitemap metadata and invalid filters are ignored", async ({
  page,
  request,
}) => {
  const response = await request.get("/About");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("制作分野");
  expect((await request.get("/icon/site-symbol.svg")).status()).toBe(200);
  expect((await request.get("/icon/site-touch-icon.png")).status()).toBe(200);
  expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  expect(await (await request.get("/sitemap.xml")).text()).toContain(
    "https://hamaryo.dev/About</loc>",
  );
  await page.goto("/About");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://hamaryo.dev/About",
  );
  await page.goto("/Project?platform=__proto__&category=invalid");
  await expect(
    page.getByRole("region", { name: "作品一覧" }).getByRole("link"),
  ).toHaveCount(9);
});

test("site information retains the build date after hydration", async ({
  page,
  request,
}) => {
  const html = await (await request.get("/Info")).text();
  const date = html.match(/最終更新: <!-- -->(\d{4}\/\d{2}\/\d{2})/)?.[1];
  expect(date).toBeTruthy();
  expect(date).not.toBe("1970/01/01");
  await openHydratedPage(page, "/Info");
  await expect(page.getByText(/^最終更新:/)).toHaveText(`最終更新: ${date}`);
});

test("portfolio pages fit mobile and desktop in both themes", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme,
      );
      await openHydratedPage(page, "/Info");
      const reference = await page.locator("body").evaluate((body) => ({
        background: getComputedStyle(body).backgroundColor,
        color: getComputedStyle(body).color,
      }));
      for (const [name, path] of [
        ["home", "/"],
        ["about", "/About"],
        ["projects", "/Project"],
      ]) {
        await openHydratedPage(page, path);
        await expect(page.locator("html")).toHaveClass(new RegExp(theme));
        await expect(page.locator(".portfolio-shell")).toHaveCSS(
          "background-color",
          reference.background,
        );
        await expect(page.locator(".portfolio-shell")).toHaveCSS(
          "color",
          reference.color,
        );
        await page.evaluate(() => document.fonts.ready);
        // 全ページのスクリーンショットに、画面外の遅延画像も含める。
        expect(
          await page.evaluate(async () => {
            const images = Array.from(document.images);
            for (const image of images) image.loading = "eager";
            await Promise.all(
              images.map((image) => image.decode().catch(() => undefined)),
            );
            return images
              .filter((image) => image.getAttribute("src")?.startsWith("/"))
              .every((image) => image.naturalWidth > 0);
          }),
        ).toBe(true);
        for (const image of await page
          .getByRole("img", { name: "Strollyのアプリアイコン" })
          .all()) {
          expect(
            await image.evaluate((element) => {
              const imageBox = element.getBoundingClientRect();
              const container = element.parentElement?.getBoundingClientRect();
              return (
                container &&
                Math.abs(imageBox.width - container.width) <= 2 &&
                Math.abs(imageBox.height - container.height) <= 2
              );
            }),
          ).toBe(true);
          await expect(image).toHaveCSS("border-radius", "0px");
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await page.screenshot({
          path: testInfo.outputPath(`${name}-${width}-${theme}.png`),
          fullPage: true,
        });
      }
    }
  }
  expect(errors).toEqual([]);
});

import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("project content, code, references and download links survive the redesign", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  const fcs = JSON.parse(
    await readFile(
      new URL("../../src/content/articles/fcs.json", import.meta.url),
      "utf8",
    ),
  ) as {
    title: string;
    content: { 概要: string };
    code: Record<string, { code: string }>;
  };
  await page.goto("/Project/fcs");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(fcs.title);
  await expect(page.locator("article")).toContainText(fcs.content.概要);
  const code = page.locator("article pre code");
  const examples = Object.values(fcs.code);
  await expect(code).toHaveCount(examples.length);
  for (let i = 0; i < examples.length; i++)
    expect(await code.nth(i).textContent()).toBe(examples[i].code);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const sds = JSON.parse(
    await readFile(
      new URL("../../src/content/articles/sds.json", import.meta.url),
      "utf8",
    ),
  ) as { references: Record<string, string> };
  await page.goto("/Project/sds");
  for (const [title, url] of Object.entries(sds.references))
    await expect(
      page.getByRole("link", { name: title, exact: true }),
    ).toHaveAttribute("href", url);
  await page.goto("/Project/muse");
  const download = page.getByRole("link", {
    name: "インストーラーをダウンロード",
  });
  await expect(download).toHaveAttribute("download", "");
  await expect(download).toHaveAttribute(
    "href",
    "/dist/Muse_2.4.1_x64-setup.exe",
  );
});

test("blog list, full article text and Spotify embeds remain reachable", async ({
  page,
}) => {
  const blog = JSON.parse(
    await readFile(
      new URL("../../src/content/blog/b06.json", import.meta.url),
      "utf8",
    ),
  ) as { title: string; content: Array<{ type: string; text?: string }> };
  await page.goto("/Blog");
  await expect(
    page.getByRole("region", { name: "記事一覧" }).getByRole("link"),
  ).toHaveCount(6);
  await page.getByRole("link", { name: new RegExp(blog.title) }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(blog.title);
  for (const block of blog.content)
    if (block.text)
      await expect(page.locator("article")).toContainText(block.text);
  await page.route("https://open.spotify.com/embed/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>Spotify embed fixture</title>",
    }),
  );
  await page.goto("/Blog/04");
  const spotify = JSON.parse(
    await readFile(
      new URL("../../src/content/blog/b04.json", import.meta.url),
      "utf8",
    ),
  ) as { content: Array<{ type: string; url?: string }> };
  const embeds = spotify.content.filter((block) => block.type === "embed");
  await expect(page.getByTitle("Spotify埋め込み")).toHaveCount(embeds.length);
  for (const frame of await page.getByTitle("Spotify埋め込み").all()) {
    await expect(frame).toHaveAttribute(
      "src",
      /^https:\/\/open\.spotify\.com\/embed\//,
    );
    await expect(frame).toHaveAttribute(
      "referrerpolicy",
      "strict-origin-when-cross-origin",
    );
  }
});

test("missing pages keep 404 status and provide the shared navigation", async ({
  page,
  request,
}) => {
  for (const [path, title, backLabel, destination] of [
    ["/not-a-page", "ページが見つかりません", "ホームに戻る", "/"],
    [
      "/Project/not-a-project",
      "ページが見つかりません",
      "プロジェクト一覧に戻る",
      "/Project",
    ],
    ["/Blog/not-a-blog", "ブログが見つかりません", "ブログ一覧に戻る", "/Blog"],
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(
      page.getByRole("navigation", { name: "メインナビゲーション" }),
    ).toBeVisible();
    await page.getByRole("link", { name: backLabel, exact: true }).click();
    await expect(page).toHaveURL(destination);
  }
});

test("remaining pages use the common layout in mobile, desktop and both themes", async ({
  page,
}, testInfo) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme,
      );
      for (const [name, path, active] of [
        ["blog-list", "/Blog", "Blog"],
        ["blog-article", "/Blog/06", "Blog"],
        ["project-article", "/Project/strolly", "Project"],
        ["info", "/Info", "Info"],
      ]) {
        await page.goto(path);
        await expect(
          page.getByRole("button", { name: "Toggle theme" }),
        ).toBeVisible();
        await expect(page.locator("html")).toHaveClass(new RegExp(theme));
        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(page.getByRole("banner")).toHaveCount(1);
        await expect(page.getByRole("contentinfo")).toHaveCount(1);
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await expect(
          page
            .getByRole("navigation", { name: "メインナビゲーション" })
            .getByRole("link", { name: active, exact: true }),
        ).toHaveAttribute("aria-current", "page");
        const colors = await page.evaluate(() => ({
          page: getComputedStyle(document.querySelector(".portfolio-shell")!)
            .backgroundColor,
          body: getComputedStyle(document.body).backgroundColor,
        }));
        expect(colors.page).toBe(colors.body);
        await page.evaluate(async () => {
          await document.fonts.ready;
          const images = Array.from(document.images);
          for (const image of images) image.loading = "eager";
          await Promise.all(
            images.map((image) => image.decode().catch(() => undefined)),
          );
        });
        expect(
          await page
            .locator('img[src^="/"]')
            .evaluateAll((images) =>
              images.every(
                (image) =>
                  image instanceof HTMLImageElement && image.naturalWidth > 0,
              ),
            ),
        ).toBe(true);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: testInfo.outputPath(`${name}-${width}-${theme}.png`),
          fullPage: true,
        });
      }
    }
  }
  expect(errors).toEqual([]);
});

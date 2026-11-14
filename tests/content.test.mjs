import assert from "node:assert/strict";
import test from "node:test";
import { readdir, readFile } from "node:fs/promises";

test("collection detects duplicate slugs and reports the offending file", async () => {
  const { validateArticleCollection } =
    await import("../src/lib/article-schema.ts");
  const data = JSON.parse(
    await readFile(
      new URL("../src/content/articles/strolly.json", import.meta.url),
      "utf8",
    ),
  );
  assert.throws(
    () =>
      validateArticleCollection([
        { data, slug: "same", file: "first.json" },
        { data, slug: "same", file: "second.json" },
      ]),
    /second.json.*duplicate slug/,
  );
});

test("section blocks and editorial intro validate strictly", async () => {
  const { validateArticle } = await import("../src/lib/article-schema.ts");
  const data = JSON.parse(
    await readFile(
      new URL("../src/content/articles/strolly.json", import.meta.url),
      "utf8",
    ),
  );
  for (const change of [
    { articleStatus: ["draft"] },
    { distribution: { status: ["unknown"] } },
    { sections: [{ type: "raw-html", title: "Bad", body: "text" }] },
    { sections: [{ type: "features", title: "Bad", items: "not-array" }] },
    { sections: [{ title: "Bad", body: "text", id: "bad id" }] },
    { intro: { headline: 42 } },
  ])
    assert.throws(
      () => validateArticle({ ...data, ...change }, "fixture.json"),
      /fixture.json/,
    );
  assert.throws(
    () =>
      validateArticle({ ...data, links: { bad: "not-a-url" } }, "fixture.json"),
    /fixture.json.links.bad/,
  );
});

test("schema rejects malformed state, unsafe links and inconsistent distribution", async () => {
  const { validateArticle } = await import("../src/lib/article-schema.ts");
  const data = JSON.parse(
    await readFile(
      new URL("../src/content/articles/strolly.json", import.meta.url),
      "utf8",
    ),
  );
  assert.doesNotThrow(() => validateArticle(data));
  for (const change of [
    { articleStatus: "complete" },
    { distribution: { status: "available" } },
    { distribution: { status: "unknown", url: "https://example.com" } },
    {
      distribution: {
        status: "available",
        url: "javascript:alert(1)",
        label: "App",
      },
    },
    {
      distribution: {
        status: "available",
        url: "//evil.example/file",
        label: "App",
      },
    },
    { links: { bad: "javascript:alert(1)" } },
    { sections: [{ title: 42, body: "text" }] },
    { code: { bad: { title: "missing code" } } },
    { content: { 技術スタック: { App: "Swift" } } },
    { diagram: { light: "javascript:alert(1)" } },
  ])
    assert.throws(() => validateArticle({ ...data, ...change }));
  for (const articleStatus of ["draft", "review", "published"])
    assert.doesNotThrow(() =>
      validateArticle({
        ...data,
        articleStatus,
        distribution: {
          status: "available",
          url: "https://example.com/app",
          label: "利用先",
        },
      }),
    );
});

test("all repository article JSON validates", async () => {
  const { validateArticle } = await import("../src/lib/article-schema.ts");
  const dir = new URL("../src/content/articles/", import.meta.url);
  for (const file of await readdir(dir)) {
    const article = JSON.parse(await readFile(new URL(file, dir), "utf8"));
    assert.doesNotThrow(() => validateArticle(article, file));
  }
});

test("optional sections hide empty headings and fall back to legacy overview", async () => {
  const { getArticleSections } = await import("../src/lib/article-schema.ts");
  assert.deepEqual(
    getArticleSections({
      sections: [
        { title: "Empty", body: "  " },
        { title: " ", body: "text" },
        { title: "Custom", body: "content" },
      ],
    }),
    [{ title: "Custom", body: "content" }],
  );
  assert.deepEqual(getArticleSections({ content: { 概要: "legacy" } }), [
    { title: "概要", body: "legacy" },
  ]);
  assert.deepEqual(getArticleSections({ sections: [] }), []);
});

test("legacy articles are not implicitly published or distributed", async () => {
  const { getArticleState } = await import("../src/lib/article-schema.ts");
  const legacy = JSON.parse(
    await readFile(
      new URL("../src/content/articles/strolly.json", import.meta.url),
      "utf8",
    ),
  );
  delete legacy.articleStatus;
  delete legacy.distribution;
  assert.deepEqual(getArticleState(legacy), {
    articleStatus: "draft",
    distribution: { status: "unknown" },
  });
  assert.deepEqual(
    getArticleState({
      articleStatus: "published",
      distribution: { status: "unavailable" },
    }),
    { articleStatus: "published", distribution: { status: "unavailable" } },
  );
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { NOINDEX, seo } from "../src/config/site.ts";
import {
  getSpotifyEmbedUrl,
  SECURITY_HEADERS,
  withSecurityHeaders,
} from "../src/lib/security.ts";

const id = "5k6P9fm2sRLMQaCdJPJXvd";

test("HTML metadata continues to exclude the site from search", () => {
  assert.equal(NOINDEX, true);
  const metadata = seo({ title: "Search exclusion test", path: "/Project" });
  for (const name of ["robots", "googlebot"]) {
    assert.equal(
      metadata.find((entry) => entry.name === name)?.content,
      "noindex, nofollow",
    );
  }
});

test("general crawlers can read noindex while specific AI blocks remain", async () => {
  const rawRobots = await readFile(
    new URL("../public/robots.txt", import.meta.url),
    "utf8",
  );
  for (const robots of [
    rawRobots.replace(/\r?\n/g, "\n"),
    rawRobots.replace(/\r?\n/g, "\r\n"),
  ]) {
    const groups = robots
      .split(/\r?\n\s*\r?\n/)
      .map((group) =>
        group.split(/\r?\n/).filter((line) => line && !line.startsWith("#")),
      )
      .filter((group) => group.length);
    assert.deepEqual(groups[0], ["User-agent: *", "Allow: /"]);
    assert.deepEqual(groups[1], [
      "User-agent: GPTBot",
      "User-agent: ChatGPT-User",
      "User-agent: Google-Extended",
      "User-agent: CCBot",
      "User-agent: Omgilibot",
      "User-agent: FacebookBot",
      "User-agent: anthropic-ai",
      "User-agent: Claude-Web",
      "User-agent: ClaudeBot",
      "User-agent: cohere-ai",
      "Disallow: /",
    ]);
    assert.equal(groups.length, 2);
  }
});

test("Worker responses enforce noindex on success, redirects and errors", () => {
  for (const status of [200, 301, 404, 500]) {
    const response = withSecurityHeaders(
      new Response(null, {
        status,
        headers: {
          "X-Robots-Tag": "index",
          Location: "/Project",
        },
      }),
    );
    assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow");
    assert.equal(response.status, status);
    assert.equal(response.headers.get("Location"), "/Project");
  }
});

test("Spotify links are canonicalized without tracking parameters", () => {
  for (const type of ["playlist", "track", "album", "episode", "show"]) {
    for (const prefix of ["", "embed/"]) {
      assert.equal(
        getSpotifyEmbedUrl(
          `https://open.spotify.com/${prefix}${type}/${id}?si=tracking#fragment`,
        ),
        `https://open.spotify.com/embed/${type}/${id}`,
      );
    }
  }
});

test("unsafe schemes, origins, credentials and malformed Spotify paths are rejected", () => {
  for (const url of [
    `http://open.spotify.com/track/${id}`,
    `https://evil.example/track/${id}`,
    `https://open.spotify.com.evil.example/track/${id}`,
    `https://open.spotify.com@evil.example/track/${id}`,
    `https://user:pass@open.spotify.com/track/${id}`,
    `https://open.spotify.com:8443/track/${id}`,
    `https://open.spotify.com/track/${id}/extra`,
    "https://open.spotify.com/track/%3Cscript%3E",
    "https://open.spotify.com/track/short",
    "javascript:alert(document.domain)",
    "data:text/html,<script>alert(1)</script>",
    "//open.spotify.com/track/" + id,
    "not a URL",
  ]) {
    assert.equal(getSpotifyEmbedUrl(url), undefined, url);
  }
});

test("existing blog embeds remain valid", async () => {
  const blog = JSON.parse(
    await readFile(new URL("../src/content/blog/b04.json", import.meta.url)),
  );
  for (const block of blog.content.filter((block) => block.type === "embed")) {
    assert.ok(getSpotifyEmbedUrl(block.url), block.url);
  }
});

test("Worker responses preserve body, status and existing headers", async () => {
  const original = new Response("missing page", {
    status: 404,
    headers: { "content-type": "text/html", "cache-control": "no-store" },
  });
  const response = withSecurityHeaders(original);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("content-type"), "text/html");
  assert.equal(await response.text(), "missing page");
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    assert.equal(response.headers.get(name), value);
    assert.equal(original.headers.get(name), null);
  }
});

test("static asset policy matches the Worker policy", async () => {
  const rawHeaders = await readFile(
    new URL("../public/_headers", import.meta.url),
    "utf8",
  );
  for (const text of [
    rawHeaders.replace(/\r?\n/g, "\n"),
    rawHeaders.replace(/\r?\n/g, "\r\n"),
  ]) {
    assert.equal(text.split(/\r?\n/)[0], "/*");
    const rules = Object.fromEntries(
      text
        .trim()
        .split(/\r?\n/)
        .slice(1)
        .map((line) => {
          const split = line.indexOf(":");
          return [line.slice(0, split).trim(), line.slice(split + 1).trim()];
        }),
    );
    assert.deepEqual(rules, SECURITY_HEADERS);
  }
});

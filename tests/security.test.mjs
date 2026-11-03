import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getSpotifyEmbedUrl,
  SECURITY_HEADERS,
  withSecurityHeaders,
} from "../src/lib/security.ts";

const id = "5k6P9fm2sRLMQaCdJPJXvd";

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
  const text = await readFile(
    new URL("../public/_headers", import.meta.url),
    "utf8",
  );
  assert.equal(text.split("\n")[0], "/*");
  const rules = Object.fromEntries(
    text
      .trim()
      .split("\n")
      .slice(1)
      .map((line) => {
        const split = line.indexOf(":");
        return [line.slice(0, split).trim(), line.slice(split + 1).trim()];
      }),
  );
  assert.deepEqual(rules, SECURITY_HEADERS);
});

import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

import { SITE_URL } from "./src/config/site";
import { getAllSlugs } from "./src/lib/articles";
import { getAllBlogSlugs } from "./src/lib/blogs";

/**
 * ビルド時に静的 HTML へ焼くページの一覧。
 *
 * crawlLinks は使わない。ホームからブログへのリンクがコメントアウトされていて
 * /Blog 以下に到達できないうえ、クロールさせると
 * /dist/Muse_2.4.1_x64-setup.exe（インストーラー）や末尾スラッシュ違いの重複 URL まで
 * sitemap に載ってしまうため。ここで列挙した内容がそのまま sitemap.xml になる。
 *
 * priority / changefreq は旧 src/app/sitemap.ts の値を引き継いでいる。
 */
const pages = [
  { path: "/", sitemap: { priority: 1, changefreq: "monthly" as const } },
  {
    path: "/Project",
    sitemap: { priority: 0.8, changefreq: "monthly" as const },
  },
  { path: "/Blog", sitemap: { priority: 0.8, changefreq: "monthly" as const } },
  { path: "/Info", sitemap: { priority: 0.8, changefreq: "monthly" as const } },
  ...getAllSlugs().map((slug) => ({
    path: `/Project/${slug}`,
    sitemap: { priority: 0.6, changefreq: "monthly" as const },
  })),
  ...getAllBlogSlugs().map((slug) => ({
    path: `/Blog/${slug}`,
    sitemap: { priority: 0.5, changefreq: "weekly" as const },
  })),
];

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        // ページは下で明示列挙するため、クロールもルート自動検出も切る。
        // autoStaticPathsDiscovery を有効にすると index ルートが
        // 末尾スラッシュ付き（/Blog/ など）で二重に sitemap へ載る。
        crawlLinks: false,
        autoStaticPathsDiscovery: false,
        failOnError: true,
      },
      sitemap: { enabled: true, host: SITE_URL },
      pages,
    }),
    viteReact(),
  ],
});

export default config;

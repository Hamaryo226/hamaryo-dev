import { readFileSync, readdirSync } from "node:fs";
const root = new URL("../src/content/", import.meta.url);
function read(file) {
  return JSON.parse(readFileSync(new URL(file, root), "utf8"));
}
export function readSeedCatalog() {
  const university = ["fcs", "sds", "order-manager2"];
  const files = [
    ...university,
    "dw",
    "lyra",
    "muse",
    "health2bpm",
    "taikodive",
    "strolly",
  ];
  return {
    articles: files.map((file) => ({
      ...read("articles/" + file + ".json"),
      slug: file === "dw" ? "drop-watermark" : file,
      category: university.includes(file) ? "university" : "personal",
    })),
    blogs: readdirSync(new URL("blog/", root))
      .filter((file) => /^b\d+\.json$/.test(file))
      .sort()
      .reverse()
      .map((file) => ({
        ...read("blog/" + file),
        slug: file.slice(1, -5),
      })),
    works: read("works.json"),
  };
}

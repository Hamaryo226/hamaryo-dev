import { execFileSync } from "node:child_process";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, extname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { readSeedCatalog } from "./seed-catalog.mjs";
import { localStorage, remoteStorage } from "./cloud-storage.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = join(root, "public");
const types = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".gif": "image/gif",
  ".avif": "image/avif",
};
const imageType = (path) => types[extname(path).toLowerCase()];
const schema = `CREATE TABLE IF NOT EXISTS site_content (
  collection TEXT NOT NULL CHECK (collection IN ('articles','blogs','works')),
  slug TEXT NOT NULL,
  position INTEGER NOT NULL,
  body TEXT NOT NULL CHECK(json_valid(body)),
  PRIMARY KEY (collection,slug)
)`;
async function seed(storage) {
  await storage.query(schema);
  const existing = new Set(await storage.keys());
  let images = 0;
  for (const key of await readdir(publicDir, { recursive: true })) {
    const type = imageType(key);
    if (!type || existing.has(key.split(sep).join("/"))) continue;
    await storage.put(
      key.split(sep).join("/"),
      await readFile(join(publicDir, key)),
      type,
    );
    images++;
  }
  for (const [collection, entries] of Object.entries(readSeedCatalog())) {
    for (const [position, { slug, ...body }] of entries.entries()) {
      await storage.query(
        "INSERT INTO site_content(collection,slug,position,body) VALUES(?,?,?,?) ON CONFLICT(collection,slug) DO NOTHING",
        [collection, slug, position, JSON.stringify(body)],
      );
    }
  }
  console.log("Seeded missing content. Uploaded images:", images);
}
async function build(storage) {
  const catalog = { articles: [], blogs: [], works: [] };
  const rows = await storage.query(
    "SELECT collection,slug,body FROM site_content ORDER BY collection,position,slug",
  );
  for (const { collection, slug, body } of rows) {
    if (
      !Object.hasOwn(catalog, collection) ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    )
      throw new Error("Invalid content key: " + slug);
    catalog[collection].push({ ...JSON.parse(body), slug });
  }
  if (!rows.length)
    throw new Error("Empty content database. Run the initial seed first.");
  const dir = await mkdtemp(join(tmpdir(), "hamaryo-build-"));
  try {
    const dest = join(dir, "public");
    await cp(publicDir, dest, {
      recursive: true,
      filter: (path) => !imageType(path),
    });
    const keys = (await storage.keys()).filter(imageType);
    for (const key of keys) {
      if (
        key.includes("\\") ||
        key.split("/").some((part) => !part || part === "." || part === "..")
      )
        throw new Error("Invalid R2 object path: " + key);
      const path = join(dest, key);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, await storage.get(key));
    }
    await writeFile(join(dir, "catalog.json"), JSON.stringify(catalog));
    console.log(
      "Building with",
      rows.length,
      "D1 records and",
      keys.length,
      "R2 images",
    );
    runVite(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
function runVite(snapshot) {
  const env = { ...process.env };
  if (snapshot) env.HAMARYO_CONTENT_SNAPSHOT = snapshot;
  execFileSync(
    process.execPath,
    [join(root, "node_modules/vite/bin/vite.js"), "build"],
    {
      cwd: root,
      stdio: "inherit",
      env,
    },
  );
}

const [mode, explicitTarget] = process.argv.slice(2);
const target =
  explicitTarget ??
  (process.env.HAMARYO_CONTENT_SOURCE === "cloudflare"
    ? "--remote"
    : undefined);
if (mode === "build" && !target) {
  runVite();
} else {
  if (
    !["seed", "build"].includes(mode) ||
    !["--local", "--remote"].includes(target)
  )
    throw new Error("Expected (seed|build) (--local|--remote)");
  const storage =
    target === "--local"
      ? await localStorage()
      : await remoteStorage(mode === "seed");
  try {
    if (mode === "seed") await seed(storage);
    else await build(storage);
  } finally {
    await storage.dispose();
  }
}

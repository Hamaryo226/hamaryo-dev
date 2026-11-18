const bucket = "hamaryo-media-preview";
const database = "hamaryo-content-preview";

export async function remoteStorage(seed) {
  const { CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token } =
    process.env;
  if (!account || !token)
    throw new Error(
      "Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN for the preview account.",
    );
  const base =
    "https://api.cloudflare.com/client/v4/accounts/" +
    encodeURIComponent(account);
  async function request(path, options = {}) {
    const response = await fetch(base + path, {
      ...options,
      headers: { Authorization: "Bearer " + token, ...options.headers },
    });
    if (!response.ok)
      throw new Error(
        path +
          ": HTTP " +
          response.status +
          " " +
          (await response.text()).slice(0, 400),
      );
    return response;
  }
  async function json(path, data) {
    const response = await request(
      path,
      data === undefined
        ? {}
        : {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          },
    );
    const result = await response.json();
    if (!result.success)
      throw new Error(path + ": " + JSON.stringify(result.errors));
    return result;
  }
  const databases = "/d1/database";
  let db = (await json(databases + "?name=" + database)).result.find(
    (row) => row.name === database,
  );
  if (!db && seed) db = (await json(databases, { name: database })).result;
  if (!db) throw new Error(database + " is missing");
  const bucketPath = "/r2/buckets/" + bucket;
  if (seed) {
    const buckets = (await json("/r2/buckets?name_contains=" + bucket)).result
      .buckets;
    if (!buckets.some((row) => row.name === bucket))
      await json("/r2/buckets", { name: bucket, storageClass: "Standard" });
  }
  const objects = bucketPath + "/objects";
  const objectPath = (key) =>
    objects + "/" + key.split("/").map(encodeURIComponent).join("/");
  return {
    async query(sql, params = []) {
      const { result } = await json(databases + "/" + db.uuid + "/query", {
        sql,
        params,
      });
      if (!result[0]?.success) throw new Error("D1 query failed");
      return result[0].results;
    },
    async keys() {
      const keys = [];
      let cursor;
      do {
        const page = await json(
          objects + "?" + new URLSearchParams(cursor ? { cursor } : {}),
        );
        keys.push(...page.result.map((row) => row.key));
        cursor = page.result_info?.cursor;
        if (!page.result_info?.is_truncated) break;
        if (!cursor) throw new Error("Missing R2 pagination cursor");
      } while (cursor);
      return keys;
    },
    async put(key, bytes, type) {
      await request(objectPath(key), {
        method: "PUT",
        headers: { "Content-Type": type },
        body: bytes,
      });
    },
    async get(key) {
      return Buffer.from(await (await request(objectPath(key))).arrayBuffer());
    },
    dispose() {},
  };
}

export async function localStorage() {
  const { getPlatformProxy } = await import("wrangler");
  const proxy = await getPlatformProxy({
    configPath: "scripts/wrangler.content-local.jsonc",
    persist: { path: ".wrangler/content-preview" },
  });
  const { DB, MEDIA } = proxy.env;
  return {
    async query(sql, params = []) {
      const statement = DB.prepare(sql);
      return (
        await (params.length ? statement.bind(...params) : statement).all()
      ).results;
    },
    async keys() {
      const keys = [];
      let cursor;
      do {
        const page = await MEDIA.list({ cursor });
        keys.push(...page.objects.map((obj) => obj.key));
        cursor = page.truncated ? page.cursor : undefined;
      } while (cursor);
      return keys;
    },
    async put(key, bytes, type) {
      await MEDIA.put(key, bytes, { httpMetadata: { contentType: type } });
    },
    async get(key) {
      const obj = await MEDIA.get(key);
      if (!obj) throw new Error("Missing R2 image: " + key);
      return Buffer.from(await obj.arrayBuffer());
    },
    dispose: proxy.dispose,
  };
}

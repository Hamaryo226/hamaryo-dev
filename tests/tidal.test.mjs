import assert from "node:assert/strict";
import test from "node:test";

test("tidal render size caps DPR and total pixels without changing aspect", async () => {
  const { tidalSize } = await import("../src/lib/tidal.ts");
  for (const [width, height, dpr] of [
    [390, 844, 3],
    [3840, 2160, 2],
    [1280, 900, 1],
    [0, 0, 2],
  ]) {
    const size = tidalSize(width, height, dpr);
    assert.ok(size.width * size.height <= 1_200_000);
    assert.ok(size.width >= 1 && size.height >= 1);
    assert.ok(size.width <= Math.max(1, width) * 1.5);
    assert.ok(size.height <= Math.max(1, height) * 1.5);
    if (width && height)
      assert.ok(Math.abs(size.width / size.height - width / height) < 0.01);
  }
});

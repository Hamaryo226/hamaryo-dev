import { expect, test } from "@playwright/test";

for (const width of [390, 1280]) {
  test(`pointer crosses the static title without leaving canvas at ${width}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const canvas = page.locator("canvas");
    await expect(canvas).toHaveAttribute("data-motion", "running");
    await page.evaluate(() => document.fonts.ready);
    const box = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x - 20, y);
    await canvas.evaluate((el) => {
      const events: { type: string; x: number; related: string | null }[] = [];
      (
        window as typeof window & { titleCrossingEvents: typeof events }
      ).titleCrossingEvents = events;
      for (const type of ["pointermove", "pointerleave", "pointerenter"]) {
        el.addEventListener(type, (raw) => {
          const event = raw as PointerEvent;
          events.push({
            type,
            x: event.clientX,
            related:
              event.relatedTarget instanceof Element
                ? event.relatedTarget.tagName
                : null,
          });
        });
      }
    });
    await page.mouse.move(box.x + box.width + 20, y, { steps: 40 });
    const events = await page.evaluate(
      () =>
        (
          window as typeof window & {
            titleCrossingEvents: {
              type: string;
              x: number;
              related: string | null;
            }[];
          }
        ).titleCrossingEvents,
    );
    await info.attach("title-crossing-events", {
      body: JSON.stringify({ width, box, y, events }, null, 2),
      contentType: "application/json",
    });
    expect(events.filter((event) => event.type !== "pointermove")).toEqual([]);
    expect(events.filter((event) => event.type === "pointermove")).toHaveLength(
      40,
    );
    expect(
      events.some(
        (event) =>
          event.x > box.x + box.width * 0.4 &&
          event.x < box.x + box.width * 0.6,
      ),
    ).toBe(true);
    await page.mouse.click(box.x + box.width / 2, y);
    await expect(canvas).toHaveAttribute("data-motion", "running");
    await expect(page.getByRole("heading")).toHaveText("hamaryo.dev");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button")).toBeFocused();
    await page.keyboard.press("Space");
    await expect(canvas).toHaveAttribute("data-motion", "paused");
    await page.keyboard.press("Enter");
    await expect(canvas).toHaveAttribute("data-motion", "running");
  });
}

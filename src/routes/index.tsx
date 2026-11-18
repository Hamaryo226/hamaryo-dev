import { createFileRoute } from "@tanstack/react-router";
import { TidalTrace } from "@/components/tidal-trace";
import { seo } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { name: "theme-color", content: "#030507" },
      ...seo({
        title: "hamaryo.dev",
        description: "hamaryo.dev — Tidal Trace",
        path: "/",
      }),
    ],
  }),
  component: TidalTrace,
});

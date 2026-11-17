import { createFileRoute } from "@tanstack/react-router";
import { TidalTrace } from "@/components/tidal-trace";
import { seo } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seo({
      title: "hamaryo.dev",
      description: "hamaryo.dev — Tidal Trace",
      path: "/",
    }),
  }),
  component: TidalTrace,
});

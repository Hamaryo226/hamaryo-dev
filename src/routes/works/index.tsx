import { createFileRoute } from "@tanstack/react-router";
import { WorksHome } from "@/components/selected-works";
import { seo } from "@/config/site";

export const Route = createFileRoute("/works/")({
  head: () => ({
    meta: seo({
      title: "Works | hamaryo.dev",
      description: "hamaryoの作品とプロフィール。",
      path: "/works",
    }),
  }),
  component: WorksHome,
});

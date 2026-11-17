import { createFileRoute } from "@tanstack/react-router";
import { WorksHome } from "@/components/selected-works";
import { seo } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seo({
      title: "hamaryo.dev",
      description: "hamaryoの制作したリズムゲームとドローン制御ツール。",
      path: "/",
    }),
  }),
  component: WorksHome,
});

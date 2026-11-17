import { createFileRoute } from "@tanstack/react-router";
import { WorkDetail } from "@/components/selected-works";
import { seo } from "@/config/site";

export const Route = createFileRoute("/works/better-tello-gui")({
  head: () => ({
    meta: seo({
      title: "Better Tello GUI | hamaryo.dev",
      path: "/works/better-tello-gui",
    }),
  }),
  component: () => <WorkDetail slug="better-tello-gui" />,
});

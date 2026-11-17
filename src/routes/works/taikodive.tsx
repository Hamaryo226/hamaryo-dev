import { createFileRoute } from "@tanstack/react-router";
import { WorkDetail } from "@/components/selected-works";
import { seo } from "@/config/site";

export const Route = createFileRoute("/works/taikodive")({
  head: () => ({
    meta: seo({ title: "TaikoDive | hamaryo.dev", path: "/works/taikodive" }),
  }),
  component: () => <WorkDetail slug="taikodive" />,
});

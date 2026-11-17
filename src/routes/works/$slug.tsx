import { createFileRoute, notFound } from "@tanstack/react-router";
import { WorkDetail } from "@/components/selected-works";
import { archivedWorks, isArchiveSlug } from "@/lib/archived-works";
import { seo } from "@/config/site";

export const Route = createFileRoute("/works/$slug")({
  loader: ({ params }) => {
    if (!isArchiveSlug(params.slug)) throw notFound();
    return params.slug;
  },
  head: ({ loaderData: slug }) =>
    slug
      ? {
          meta: seo({
            title: archivedWorks[slug].name + " | hamaryo.dev",
            description: archivedWorks[slug].intro,
            image: archivedWorks[slug].image,
            path: "/works/" + slug,
          }),
        }
      : {},
  component: ArchivedDetail,
});
function ArchivedDetail() {
  return <WorkDetail slug={Route.useLoaderData()} />;
}

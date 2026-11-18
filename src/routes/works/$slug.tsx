import { createFileRoute, notFound } from "@tanstack/react-router";
import { WorkDetail } from "@/components/selected-works";
import { works } from "@/lib/works";
import { seo } from "@/config/site";

export const Route = createFileRoute("/works/$slug")({
  loader: ({ params }) => {
    const work = works.get(params.slug);
    if (!work) throw notFound();
    return work;
  },
  head: ({ loaderData: work }) =>
    work
      ? {
          meta: seo({
            title: work.name + " | hamaryo.dev",
            description: work.intro,
            image: work.image,
            path: "/works/" + work.slug,
          }),
        }
      : {},
  component: ArchivedDetail,
});
function ArchivedDetail() {
  return <WorkDetail slug={Route.useLoaderData().slug} />;
}

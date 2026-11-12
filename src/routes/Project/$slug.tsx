import { createFileRoute, notFound } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { getArticleBySlug } from "@/lib/articles";
import { getProjectPresentation, platforms } from "@/config/portfolio";
import { BackButton } from "@/components/back-button";
import {
  ArticleSection,
  CodeBlock,
  ExternalLink,
} from "@/components/article-elements";
import { DiagramViewer } from "@/components/diagram-viewer";
import { MissingPage } from "@/components/missing-page";
import { PortfolioLayout } from "@/components/portfolio-layout";
import { WipBanner } from "@/components/wip-banner";
import { pageTitle, seo } from "@/config/site";

export const Route = createFileRoute("/Project/$slug")({
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    if (!article) return { meta: seo({ title: "記事が見つかりません" }) };
    return {
      meta: seo({
        title: pageTitle(article.title),
        description: article.description,
        image: article.thumbnail,
        path: `/Project/${article.slug}`,
      }),
    };
  },
  component: ProjectDetailPage,
  notFoundComponent: ProjectNotFound,
});

function ProjectDetailPage() {
  const { article } = Route.useLoaderData();
  const { platform, appIcon } = getProjectPresentation(article);
  const techStack = article.content?.技術スタック;
  const techEntries =
    techStack && typeof techStack !== "string" ? Object.entries(techStack) : [];
  const details = [
    ["想定クライアント", article.content?.想定クライアント],
    ["目的", article.content?.目的],
    ["目標", article.content?.目標],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
  const related = Object.entries(article.links ?? {}).filter(
    ([title]) => title !== "Installer",
  );
  const references = Object.entries(article.references ?? {});
  const image =
    appIcon ??
    (article.thumbnail === "/thum/0.jpg" ? undefined : article.thumbnail);

  return (
    <PortfolioLayout>
      <div className="py-8 sm:py-10">
        <BackButton href="/Project" label="プロジェクト一覧に戻る" />
        <header className="mb-9 mt-8 border-b pb-8 sm:mt-10 sm:pb-10">
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="font-mono">{article.date}</span>
            <span>
              {article.category === "university" ? "大学開発" : "個人開発"}
            </span>
            {platform && <span>{platforms[platform]}</span>}
          </div>
          <h1 className="max-w-4xl break-words text-3xl font-semibold leading-[1.5] tracking-tight sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-muted-foreground">
            {article.description}
          </p>
        </header>
        {image && (
          <div className="mb-10 aspect-[16/9] overflow-hidden rounded-xl border bg-muted">
            <img
              src={image}
              alt={
                appIcon
                  ? `${article.systemname}のアプリアイコン`
                  : article.title
              }
              width={appIcon ? 1024 : 1920}
              height={appIcon ? 1024 : 1080}
              fetchPriority="high"
              className={`h-full w-full ${appIcon ? "object-cover object-bottom" : "object-contain"}`}
            />
          </div>
        )}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
          <article className="min-w-0">
            <WipBanner />
            {article.links?.Installer && (
              <a
                href={article.links.Installer}
                download
                className="mb-10 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background transition-opacity hover:opacity-80"
              >
                <Download className="size-4" aria-hidden="true" />
                インストーラーをダウンロード
              </a>
            )}
            <div className="space-y-12">
              {article.content?.概要 && (
                <ArticleSection title="概要">
                  <p className="whitespace-pre-line break-words text-base leading-8 text-muted-foreground">
                    {article.content.概要}
                  </p>
                </ArticleSection>
              )}
              {article.diagram && (
                <ArticleSection title="構成図">
                  <figure>
                    <DiagramViewer
                      light={article.diagram.light}
                      dark={article.diagram.dark}
                      alt={article.diagram.alt}
                    />
                    {article.diagram.caption && (
                      <figcaption className="mt-3 text-xs leading-6 text-muted-foreground">
                        {article.diagram.caption}
                      </figcaption>
                    )}
                  </figure>
                </ArticleSection>
              )}
              {details.length > 0 && (
                <ArticleSection title="プロジェクト詳細">
                  <dl className="divide-y border-y">
                    {details.map(([label, value]) => (
                      <div
                        key={label}
                        className="grid gap-2 py-5 sm:grid-cols-[130px_1fr] sm:gap-6"
                      >
                        <dt className="text-xs leading-7 text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="text-sm leading-8">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </ArticleSection>
              )}
              {(techEntries.length > 0 ||
                (typeof techStack === "string" && techStack)) && (
                <ArticleSection title="技術スタック">
                  {typeof techStack === "string" ? (
                    <p className="text-sm leading-8 text-muted-foreground">
                      {techStack}
                    </p>
                  ) : (
                    <div className="space-y-5">
                      {techEntries.map(([category, techs]) => (
                        <div
                          key={category}
                          className="grid gap-3 sm:grid-cols-[130px_1fr] sm:gap-6"
                        >
                          <h3 className="text-xs leading-7 text-muted-foreground">
                            {category}
                          </h3>
                          <ul className="flex flex-wrap gap-2">
                            {techs.map((tech) => (
                              <li
                                key={tech}
                                className="rounded-md border px-3 py-1.5 text-xs leading-5"
                              >
                                {tech}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </ArticleSection>
              )}
              {article.code && (
                <ArticleSection title="実装例">
                  <div className="space-y-6">
                    {Object.entries(article.code).map(([key, code]) => (
                      <CodeBlock key={key} {...code} />
                    ))}
                  </div>
                </ArticleSection>
              )}
            </div>
          </article>
          <aside className="min-w-0 space-y-9 lg:sticky lg:top-8">
            <section className="border-t pt-5">
              <h2 className="mb-4 text-sm font-semibold">プロジェクト情報</h2>
              <dl className="space-y-3 text-xs leading-6">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">カテゴリ</dt>
                  <dd>
                    {article.category === "university"
                      ? "大学開発"
                      : "個人開発"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">期間</dt>
                  <dd className="text-right">{article.date}</dd>
                </div>
              </dl>
            </section>
            {related.length > 0 && (
              <section className="border-t pt-5">
                <h2 className="mb-4 text-sm font-semibold">関連リンク</h2>
                <ul className="space-y-3">
                  {related.map(([title, url]) => (
                    <li key={title}>
                      <ExternalLink href={url}>{title}</ExternalLink>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {references.length > 0 && (
              <section className="border-t pt-5">
                <h2 className="mb-4 text-sm font-semibold">参考文献</h2>
                <ol className="list-decimal space-y-4 pl-4 text-xs text-muted-foreground">
                  {references.map(([title, url]) => (
                    <li key={title}>
                      <ExternalLink href={url}>{title}</ExternalLink>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </aside>
        </div>
        <div className="mt-12 border-t pt-6">
          <BackButton href="/Project" label="プロジェクト一覧に戻る" />
        </div>
      </div>
    </PortfolioLayout>
  );
}

function ProjectNotFound() {
  return (
    <MissingPage
      title="ページが見つかりません"
      description="お探しのプロジェクトは存在しないか、URLが変更された可能性があります。"
      backTo="/Project"
      backLabel="プロジェクト一覧に戻る"
    />
  );
}

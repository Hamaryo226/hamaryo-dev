import { createElement } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { getSpotifyEmbedUrl } from "@/lib/security";
import { getBlogBySlug } from "@/lib/blogs";
import type { BlogContent } from "@/lib/blogs";
import { BackButton } from "@/components/back-button";
import { CodeBlock, ExternalLink } from "@/components/article-elements";
import { MissingPage } from "@/components/missing-page";
import { PortfolioLayout } from "@/components/portfolio-layout";
import { pageTitle, seo } from "@/config/site";

export const Route = createFileRoute("/Blog/$slug")({
  loader: ({ params }) => {
    const blog = getBlogBySlug(params.slug);
    if (!blog) throw notFound();
    return { blog };
  },
  head: ({ loaderData }) => {
    const blog = loaderData?.blog;
    if (!blog) return { meta: seo({ title: "ブログが見つかりません" }) };
    return {
      meta: seo({
        title: pageTitle(blog.title),
        description: blog.description,
        image: blog.thumbnail,
        path: `/Blog/${blog.slug}`,
      }),
    };
  },
  component: BlogDetailPage,
  notFoundComponent: BlogNotFound,
});

function BlogDetailPage() {
  const { blog } = Route.useLoaderData();
  return (
    <PortfolioLayout>
      <div className="min-w-0 py-8 sm:py-10">
        <BackButton href="/Blog" label="ブログ一覧に戻る" />
        <header className="mb-8 mt-6 border-b border-border/60 pb-7">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
            <time className="font-mono">{blog.date}</time>
            {blog.tags?.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h1 className="break-words text-[22px] font-medium leading-[1.6] tracking-tight sm:text-2xl">
            {blog.title}
          </h1>
          <p className="mt-4 text-[13px] leading-7 text-muted-foreground">
            {blog.description}
          </p>
        </header>
        {blog.thumbnail && (
          <div className="mb-10 overflow-hidden rounded-xl border">
            <img
              src={blog.thumbnail}
              alt=""
              width={1920}
              height={1080}
              fetchPriority="high"
              className="block h-auto w-full"
            />
          </div>
        )}
        <article className="min-w-0">
          {blog.content.map((block, index) => (
            <BlogBlock key={index} block={block} />
          ))}
        </article>
        <div className="mt-12 border-t pt-6">
          <BackButton href="/Blog" label="ブログ一覧に戻る" />
        </div>
      </div>
    </PortfolioLayout>
  );
}

function BlogBlock({ block }: { block: BlogContent }) {
  switch (block.type) {
    case "heading": {
      // 記事タイトルを唯一の h1 とし、本文の見出しは h2 以下にする。
      const level = Math.min(6, Math.max(2, block.level));
      const sizes: Record<number, string> = {
        2: "mt-10 mb-4 text-lg",
        3: "mt-8 mb-3 text-base",
        4: "mt-7 mb-3 text-sm",
        5: "mt-7 mb-3 text-base",
        6: "mt-7 mb-3 text-sm",
      };
      return createElement(
        `h${level}`,
        {
          className: `${sizes[level]} font-medium leading-relaxed tracking-tight`,
        },
        block.text,
      );
    }
    case "paragraph":
      return (
        <p className="mb-6 whitespace-pre-line break-words text-[13px] leading-7 text-muted-foreground">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="mb-7 list-disc space-y-3 pl-5 text-[13px] leading-7 text-muted-foreground">
          {block.items.map((item, index) => (
            <li key={index} className="pl-1 break-words">
              {item}
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div className="my-8">
          <CodeBlock code={block.code} language={block.language} />
        </div>
      );
    case "link":
      return (
        <div className="mb-7">
          <ExternalLink href={block.url}>{block.text}</ExternalLink>
        </div>
      );
    case "image":
      return (
        <figure className="my-9">
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            className="block h-auto w-full rounded-xl border"
          />
          {block.caption && (
            <figcaption className="mt-3 text-xs leading-6 text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "embed": {
      // JSON は型アサーションで読み込むため、実データの platform も確認する。
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (block.platform !== "spotify") return null;
      const url = getSpotifyEmbedUrl(block.url);
      if (!url) return null;
      return (
        <figure className="my-9 overflow-hidden rounded-xl border">
          <iframe
            src={url}
            title="Spotify埋め込み"
            width="100%"
            height="352"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            className="block w-full border-0"
          />
        </figure>
      );
    }
  }
}

function BlogNotFound() {
  return (
    <MissingPage
      title="ブログが見つかりません"
      description="お探しのブログは存在しないか、削除された可能性があります。"
      backTo="/Blog"
      backLabel="ブログ一覧に戻る"
    />
  );
}

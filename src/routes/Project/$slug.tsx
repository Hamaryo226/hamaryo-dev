import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  Info,
  Link2,
  SearchX,
  Wrench,
} from "lucide-react";
import { getArticleBySlug } from "@/lib/articles";
import { BackButton } from "@/components/back-button";
import { DiagramViewer } from "@/components/diagram-viewer";
import { featureIcon } from "@/components/feature-icons";
import { MathText } from "@/components/math-text";
import { SectionHeading } from "@/components/section-heading";
import { ModeToggle } from "@/components/mode-toggle";
import { WipBanner } from "@/components/wip-banner";
import { pageTitle, seo } from "@/config/site";

function getTechLogoPath(
  techName: string,
): { light?: string; dark?: string } | null {
  const normalizedName = techName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/#/g, "sharp");

  const logoMap: Record<string, { light?: string; dark?: string }> = {
    nextjs: { light: "/Logo/nextjs.svg", dark: "/Logo/nextjs.svg" },
    "next.js": { light: "/Logo/nextjs.svg", dark: "/Logo/nextjs.svg" },
    react: { light: "/Logo/nextjs.svg", dark: "/Logo/nextjs.svg" },
    javascript: { light: "/Logo/javascript.svg", dark: "/Logo/javascript.svg" },
    typescript: { light: "/Logo/typescript.svg", dark: "/Logo/typescript.svg" },
    tailwindcss: {
      light: "/Logo/tailwindcss.svg",
      dark: "/Logo/tailwindcss.svg",
    },
    tailwind: { light: "/Logo/tailwindcss.svg", dark: "/Logo/tailwindcss.svg" },
    bootstrap: { light: "/Logo/bootstrap.svg", dark: "/Logo/bootstrap.svg" },
    bootstrap5: { light: "/Logo/bootstrap.svg", dark: "/Logo/bootstrap.svg" },
    python: { light: "/Logo/python.svg", dark: "/Logo/python.svg" },
    django: { light: "/Logo/django.svg", dark: "/Logo/django.svg" },
    php: { light: "/Logo/php.svg", dark: "/Logo/php_dark.svg" },
    csharp: { light: "/Logo/csharp.svg", dark: "/Logo/csharp.svg" },
    "c#": { light: "/Logo/csharp.svg", dark: "/Logo/csharp.svg" },
    dotnet: { light: "/Logo/dotnet.svg", dark: "/Logo/dotnet.svg" },
    ".net": { light: "/Logo/dotnet.svg", dark: "/Logo/dotnet.svg" },
    ".netfreamework": { light: "/Logo/dotnet.svg", dark: "/Logo/dotnet.svg" },
    ".netframework": { light: "/Logo/dotnet.svg", dark: "/Logo/dotnet.svg" },
    neon: { light: "/Logo/neon.svg", dark: "/Logo/neon.svg" },
    postgresql: { light: "/Logo/neon.svg", dark: "/Logo/neon.svg" },
    "postgresql(neon)": { light: "/Logo/neon.svg", dark: "/Logo/neon.svg" },
    vercel: { light: "/Logo/Vercel_light.svg", dark: "/Logo/Vercel_dark.svg" },
    webcomponents: {
      light: "/Logo/webcomponents.svg",
      dark: "/Logo/webcomponents.svg",
    },
  };

  for (const [key, paths] of Object.entries(logoMap)) {
    if (normalizedName.includes(key)) {
      return paths;
    }
  }

  return null;
}

export const Route = createFileRoute("/Project/$slug")({
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    if (!article) {
      return { meta: seo({ title: "記事が見つかりません" }) };
    }
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

  const techStack = article.content?.["技術スタック"];
  const techEntries =
    techStack && typeof techStack !== "string" ? Object.entries(techStack) : [];
  // 3 項目とも無い記事では見出しだけが残るので、セクションごと出さない
  const hasProjectDetail = Boolean(
    article.content?.想定クライアント ||
    article.content?.目的 ||
    article.content?.目標,
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/20">
      <main className="mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* 戻る */}
        <div className="mb-6 flex items-center justify-between">
          <BackButton href="/Project" label="プロジェクト一覧に戻る" />
          <div>
            <ModeToggle />
          </div>
        </div>

        {/* ===== HERO ===== */}
        {article.thumbnail && (
          <div className="relative w-full max-h-[200px] sm:max-h-[280px] md:max-h-[360px] aspect-[16/9] sm:aspect-[21/9] rounded-xl sm:rounded-2xl overflow-hidden border mb-8 shadow-sm">
            <img
              src={article.thumbnail}
              alt={article.title}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}

        {/* ===== ヘッダー情報 ===== */}
        <header className="mb-10">
          {article.systemname && (
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
              {article.systemname}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight break-words leading-tight">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Wrench className="w-4 h-4" />
              {article.category === "university" ? "大学開発" : "個人開発"}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
          {/* ===== メインコンテンツ ===== */}
          <div className="min-w-0">
            <WipBanner />

            {/* 説明 */}
            {article.description && (
              <p className="text-base leading-relaxed text-foreground/80 mb-10 border-l-4 border-primary/40 pl-4 italic">
                {article.description}
              </p>
            )}

            {/* ダウンロード */}
            {article.links?.Installer && (
              <div className="mb-10">
                <a
                  href={article.links.Installer}
                  download
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  インストーラーをダウンロード
                </a>
              </div>
            )}

            {/* 構成図 */}
            {article.diagram && (
              <section className="mb-10">
                <SectionHeading>構成図</SectionHeading>
                <figure>
                  <DiagramViewer
                    light={article.diagram.light}
                    dark={article.diagram.dark}
                    alt={article.diagram.alt}
                  />
                  {article.diagram.caption && (
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      {article.diagram.caption}
                    </figcaption>
                  )}
                </figure>
              </section>
            )}

            {/* コンテンツ */}
            {article.content && (
              <div className="space-y-10">
                {/* 概要 */}
                {article.content.概要 && (
                  <section>
                    <SectionHeading>概要</SectionHeading>
                    <div className="space-y-3 text-muted-foreground leading-relaxed">
                      {article.content.概要.split("\n").map((paragraph, i) => (
                        <p key={i}>
                          <MathText>{paragraph}</MathText>
                        </p>
                      ))}
                    </div>
                  </section>
                )}

                {/* 目的・目標・クライアント */}
                {hasProjectDetail && (
                  <section>
                    <SectionHeading>プロジェクト詳細</SectionHeading>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {article.content.想定クライアント && (
                        <div className="rounded-xl border bg-card p-5">
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                            想定クライアント
                          </h3>
                          <p className="text-foreground font-medium">
                            <MathText>
                              {article.content.想定クライアント}
                            </MathText>
                          </p>
                        </div>
                      )}
                      {article.content.目的 && (
                        <div className="rounded-xl border bg-card p-5">
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                            目的
                          </h3>
                          <p className="text-foreground font-medium">
                            <MathText>{article.content.目的}</MathText>
                          </p>
                        </div>
                      )}
                      {article.content.目標 && (
                        <div
                          className={`rounded-xl border bg-card p-5 ${article.content.想定クライアント && article.content.目的 ? "" : "sm:col-span-2"}`}
                        >
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                            目標
                          </h3>
                          <p className="text-foreground font-medium">
                            <MathText>{article.content.目標}</MathText>
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* 主な機能 */}
                {article.content.主な機能 &&
                  article.content.主な機能.length > 0 && (
                    <section>
                      <SectionHeading>主な機能</SectionHeading>
                      <div className="space-y-8">
                        {article.content.主な機能.map((group) => (
                          <div key={group.title}>
                            <h3 className="text-lg font-semibold">
                              {group.title}
                            </h3>
                            {group.summary && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                <MathText>{group.summary}</MathText>
                              </p>
                            )}
                            <dl className="mt-4 space-y-4 border-l pl-5">
                              {group.items.map((item) => {
                                const Icon = featureIcon(item.icon);
                                return (
                                  <div key={item.title} className="relative">
                                    {/* 縦罫の上にアイコンを重ねて、項目の頭を揃える */}
                                    <span className="absolute -left-[31px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-background text-primary">
                                      <Icon className="h-4 w-4" />
                                    </span>
                                    <dt className="text-sm font-medium">
                                      {item.title}
                                    </dt>
                                    <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                      <MathText>{item.description}</MathText>
                                    </dd>
                                  </div>
                                );
                              })}
                            </dl>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                {/* 技術スタック */}
                {techEntries.length > 0 && (
                  <section>
                    <SectionHeading>技術スタック</SectionHeading>
                    {/* 区分を左の見出し列に寄せ、バッジは枠を外して軽くする */}
                    <dl className="divide-y rounded-xl border overflow-hidden">
                      {techEntries.map(([category, techs]) => (
                        <div
                          key={category}
                          className="grid gap-1.5 px-4 py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-5"
                        >
                          <dt className="text-xs font-medium text-muted-foreground sm:pt-1 sm:text-right">
                            {category}
                          </dt>
                          <dd className="flex flex-wrap gap-1.5">
                            {techs.map((tech, i) => {
                              const logoPaths = getTechLogoPath(tech);
                              return (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1 text-xs"
                                >
                                  {logoPaths && (
                                    <>
                                      {logoPaths.light && (
                                        <img
                                          src={logoPaths.light}
                                          alt=""
                                          width={14}
                                          height={14}
                                          className="object-contain dark:hidden"
                                        />
                                      )}
                                      {logoPaths.dark && (
                                        <img
                                          src={logoPaths.dark}
                                          alt=""
                                          width={14}
                                          height={14}
                                          className="object-contain hidden dark:block"
                                        />
                                      )}
                                    </>
                                  )}
                                  {tech}
                                </span>
                              );
                            })}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}

                {/* コード例 */}
                {article.code && (
                  <section>
                    <SectionHeading>実装例</SectionHeading>
                    <div className="space-y-4">
                      {Object.entries(article.code).map(([key, codeData]) => (
                        <div
                          key={key}
                          className="rounded-xl border overflow-hidden shadow-sm"
                        >
                          {/* パス付きの長いファイル名でも見出しが潰れないよう、狭い幅では縦に積む */}
                          <div className="flex flex-col gap-2 px-4 py-3 bg-muted/30 border-b sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                            <div className="min-w-0">
                              <div className="font-medium text-sm">
                                {codeData.title}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {codeData.description}
                              </div>
                            </div>
                            <span className="self-start text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded break-all sm:self-auto sm:max-w-[45%] sm:text-right">
                              {codeData.filename}
                            </span>
                          </div>
                          <pre className="bg-muted/50 p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed">
                            <code className={`language-${codeData.language}`}>
                              {codeData.code}
                            </code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>

          {/* ===== サイドバー ===== */}
          <aside className="space-y-6">
            {/* 関連リンク */}
            {article.links &&
              Object.entries(article.links).filter(([t]) => t !== "Installer")
                .length > 0 && (
                <div className="rounded-xl border bg-card p-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    関連リンク
                  </h3>
                  <ul className="space-y-2">
                    {Object.entries(article.links)
                      .filter(([t]) => t !== "Installer")
                      .map(([title, url], i) => (
                        <li key={i}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2 rounded-lg hover:bg-muted/50"
                          >
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{title}</span>
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

            {/* 参考文献 */}
            {article.references && (
              <div className="rounded-xl border bg-card p-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  参考文献
                </h3>
                <ul className="space-y-2">
                  {Object.entries(article.references).map(([title, url], i) => (
                    <li key={i}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2 rounded-lg hover:bg-muted/50"
                      >
                        <span className="text-xs text-primary shrink-0 mt-0.5">
                          [{i + 1}]
                        </span>
                        <span className="truncate">{title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* プロジェクト情報カード */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                プロジェクト情報
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">カテゴリ</dt>
                  <dd className="font-medium">
                    {article.category === "university"
                      ? "大学開発"
                      : "個人開発"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">期間</dt>
                  <dd className="font-medium text-right">{article.date}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        {/* フッター戻る */}
        <div className="mt-12 pt-8 border-t">
          <BackButton href="/Project" label="プロジェクト一覧に戻る" />
        </div>
      </main>
    </div>
  );
}

function ProjectNotFound() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <main className="mx-auto w-full max-w-screen-md px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full border flex items-center justify-center">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            ページが見つかりません
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            お探しのプロジェクトは存在しないか、URLが変更された可能性があります。
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 border rounded-md px-4 py-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

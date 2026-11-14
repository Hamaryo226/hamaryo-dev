import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Code2, Monitor, Smartphone } from "lucide-react";
import { PortfolioLayout } from "@/components/portfolio-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { pageTitle, seo } from "@/config/site";

export const Route = createFileRoute("/About/")({
  head: () => ({
    meta: seo({
      title: pageTitle("About"),
      description:
        "システムエンジニア・プログラマーのHamaryoのプロフィールと制作分野。",
      path: "/About",
    }),
  }),
  component: AboutPage,
});
const areas = [
  {
    number: "01",
    title: "Webアプリケーション",
    icon: Code2,
    text: "大学でのシステム開発から個人のWeb制作まで。注文管理や情報支援など、用途に合わせたシステムに取り組んできました。",
    tags: ["TypeScript", "React / Next.js", "Python / Django", "PHP"],
    platform: "web",
  },
  {
    number: "02",
    title: "iOS・watchOSアプリ",
    icon: Smartphone,
    text: "音楽や移動の記録、Apple Watchの心拍数との連携など。Appleのフレームワークを使うアプリを制作しています。",
    tags: ["Swift", "SwiftUI", "MusicKit", "HealthKit"],
    platform: "apple",
  },
  {
    number: "03",
    title: "デスクトップ・ツール",
    icon: Monitor,
    text: "リズムゲーム、音楽のメタデータ管理、写真の加工など。PCで使うアプリや日々の作業を支えるツールも制作しています。",
    tags: ["C# / .NET", "Python", "SQLite"],
    platform: "desktop",
  },
] as const;
function AboutPage() {
  return (
    <PortfolioLayout>
      <header className="pt-10 pb-8 sm:pt-14">
        <h1 className="text-xl font-medium tracking-tight">About</h1>
      </header>
      <section aria-labelledby="profile-heading">
        <div className="flex items-center gap-3">
          <Avatar className="size-12 border border-border/60">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/52881627?v=4"
              alt="Hamaryoのプロフィール画像"
            />
            <AvatarFallback>H</AvatarFallback>
          </Avatar>
          <div>
            <h2 id="profile-heading" className="text-sm font-medium">
              Hamaryo
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              システムエンジニア / プログラマー
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-4 text-[13px] leading-7 text-muted-foreground">
          <p>
            システムエンジニアとしての制作や、個人で取り組んだ成果をこのサイトにまとめています。大学でのシステム開発をはじめ、WebアプリやiOSアプリ、PC向けのツールを制作してきました。
          </p>
          <p>
            音楽にまつわるアプリやリズムゲーム、写真を扱うツールなども制作しています。制作物の機能や技術的な実装はProjectに、開発の記録や普段使うアプリの話はBlogに掲載しています。
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
          <Link
            to="/Project"
            className="rounded-full bg-foreground px-3 py-1.5 text-background"
          >
            作品を見る
          </Link>
          <Link
            to="/Blog"
            className="rounded-full bg-muted/50 px-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            ブログを読む
          </Link>
        </div>
      </section>
      <section aria-labelledby="areas-heading" className="mt-12">
        <h2
          id="areas-heading"
          className="mb-6 font-mono text-[10px] tracking-[0.12em] text-muted-foreground"
        >
          制作分野
        </h2>
        <div className="space-y-8">
          {areas.map((area) => (
            <div key={area.number} className="flex items-start gap-3">
              <area.icon
                className="mt-1 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium">{area.title}</h3>
                <p className="mt-2 text-[13px] leading-7 text-muted-foreground">
                  {area.text}
                </p>
                <p className="mt-2 font-mono text-[10px] leading-6 text-muted-foreground">
                  {area.tags.join(" / ")}
                </p>
                <Link
                  to="/Project"
                  search={{ platform: area.platform }}
                  className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  この分野の作品{" "}
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section aria-labelledby="elsewhere-heading" className="mt-12">
        <h2
          id="elsewhere-heading"
          className="mb-4 font-mono text-[10px] tracking-[0.12em] text-muted-foreground"
        >
          リンク
        </h2>
        <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground">
          <a
            href="https://github.com/Hamaryo226"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            GitHub <ArrowUpRight className="size-3" aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/ryota_ztts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            Instagram <ArrowUpRight className="size-3" aria-hidden="true" />
          </a>
          <Link
            to="/Info"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            サイト情報 <ArrowUpRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </PortfolioLayout>
  );
}

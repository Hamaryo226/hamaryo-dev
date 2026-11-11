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
      <header className="py-12 sm:py-16">
        <p className="mb-5 font-mono text-xs tracking-[0.16em] text-muted-foreground">
          ABOUT / BEHIND THE WORK
        </p>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
          About me<span className="text-emerald-700 dark:text-lime-300">.</span>
        </h1>
      </header>
      <section
        aria-labelledby="profile-heading"
        className="grid gap-8 border-y py-9 sm:py-12 md:grid-cols-[240px_1fr] md:gap-16"
      >
        <div>
          <Avatar className="mb-6 size-24 border sm:size-28">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/52881627?v=4"
              alt="Hamaryoのプロフィール画像"
            />
            <AvatarFallback>H</AvatarFallback>
          </Avatar>
          <h2
            id="profile-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            Hamaryo
          </h2>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            システムエンジニア
            <br />
            プログラマー
          </p>
          <a
            href="https://github.com/Hamaryo226"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-sm font-mono text-xs hover:underline hover:underline-offset-4"
          >
            @Hamaryo226 <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
        <div className="max-w-xl self-center">
          <p className="text-xl font-medium leading-[1.8] tracking-tight sm:text-2xl">
            Web、モバイル、デスクトップ。
            <br />
            幅広い環境で制作しています。
          </p>
          <div className="mt-6 space-y-4 text-sm leading-8 text-muted-foreground">
            <p>
              システムエンジニアとしての制作や、個人で取り組んだ成果をこのサイトにまとめています。大学でのシステム開発をはじめ、WebアプリやiOSアプリ、PC向けのツールを制作してきました。
            </p>
            <p>
              音楽にまつわるアプリやリズムゲーム、写真を扱うツールなども制作しています。制作物の機能や技術的な実装はProjectに、開発の記録や普段使うアプリの話はBlogに掲載しています。
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-5 text-sm">
            <Link
              to="/Project"
              className="inline-flex items-center gap-2 rounded-sm underline underline-offset-4"
            >
              作品を見る <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/Blog"
              className="inline-flex items-center gap-2 rounded-sm underline underline-offset-4"
            >
              ブログを読む{" "}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section aria-labelledby="areas-heading" className="mt-12 sm:mt-16">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">01—03</span>
          <h2 id="areas-heading" className="text-lg font-semibold">
            取り組んできた分野
          </h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-7">
          {areas.map((area) => (
            <div key={area.number} className="border-t pt-6">
              <div className="mb-6 flex items-center justify-between">
                <area.icon
                  className="size-6 text-emerald-700 dark:text-lime-300"
                  aria-hidden="true"
                />
                <span className="font-mono text-xs text-muted-foreground">
                  {area.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{area.title}</h3>
              <p className="mt-4 text-sm leading-8 text-muted-foreground">
                {area.text}
              </p>
              <ul
                aria-label="制作で扱っている技術"
                className="mt-5 flex flex-wrap gap-2"
              >
                {area.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border px-2 py-1 font-mono text-[10px] text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <Link
                to="/Project"
                search={{ platform: area.platform }}
                className="mt-6 inline-flex items-center gap-2 rounded-sm text-xs hover:underline hover:underline-offset-4"
              >
                この分野の作品{" "}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>
      <section
        aria-labelledby="elsewhere-heading"
        className="mt-14 grid gap-6 border-t pt-7 sm:mt-20 sm:grid-cols-2 sm:gap-12"
      >
        <div>
          <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
            ELSEWHERE
          </p>
          <h2 id="elsewhere-heading" className="text-lg font-semibold">
            ほかの場所でも。
          </h2>
          <div className="mt-5 flex gap-6 text-sm">
            <a
              href="https://github.com/Hamaryo226"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline hover:underline-offset-4"
            >
              GitHub <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/ryota_ztts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline hover:underline-offset-4"
            >
              Instagram <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="self-end">
          <p className="text-sm leading-7 text-muted-foreground">
            このサイトの構成や使用パッケージは、サイト情報にまとめています。
          </p>
          <Link
            to="/Info"
            className="mt-3 inline-flex items-center gap-2 rounded-sm text-xs underline underline-offset-4"
          >
            サイト情報を見る{" "}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </PortfolioLayout>
  );
}

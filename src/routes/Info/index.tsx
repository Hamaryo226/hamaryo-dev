import { createFileRoute } from "@tanstack/react-router";
import { PortfolioLayout } from "@/components/portfolio-layout";
import { ExternalLink } from "@/components/article-elements";
import { pageTitle, seo } from "@/config/site";
import packageJson from "../../../package.json";

export const Route = createFileRoute("/Info/")({
  head: () => ({
    meta: seo({
      title: pageTitle("Info"),
      description: "サイトの技術スタック・バージョン・リポジトリ情報",
      path: "/Info",
    }),
  }),
  component: InfoPage,
});

const techStack = [
  {
    name: "TanStack Start",
    version: packageJson.dependencies["@tanstack/react-start"],
    category: "Framework",
  },
  {
    name: "TanStack Router",
    version: packageJson.dependencies["@tanstack/react-router"],
    category: "Routing",
  },
  {
    name: "React",
    version: packageJson.dependencies.react,
    category: "UI Library",
  },
  {
    name: "Vite",
    version: packageJson.devDependencies.vite,
    category: "Build Tool",
  },
  {
    name: "TypeScript",
    version: packageJson.devDependencies.typescript,
    category: "Language",
  },
  {
    name: "Tailwind CSS",
    version: packageJson.dependencies.tailwindcss,
    category: "Styling",
  },
  {
    name: "Radix UI",
    version: packageJson.dependencies["@radix-ui/react-avatar"],
    category: "Primitive",
  },
  {
    name: "Lucide React",
    version: packageJson.dependencies["lucide-react"],
    category: "Icon",
  },
  {
    name: "next-themes",
    version: packageJson.dependencies["next-themes"],
    category: "Theme",
  },
  {
    name: "class-variance-authority",
    version: packageJson.dependencies["class-variance-authority"],
    category: "Utility",
  },
  {
    name: "ESLint",
    version: packageJson.devDependencies.eslint,
    category: "Tooling",
  },
  {
    name: "@cloudflare/vite-plugin",
    version: packageJson.devDependencies["@cloudflare/vite-plugin"],
    category: "Adapter",
  },
];
const summary = [
  {
    label: "Framework",
    value: "TanStack Start",
    detail: packageJson.dependencies["@tanstack/react-start"],
  },
  { label: "Deploy", value: "Cloudflare", detail: "Cloudflare Workers" },
  { label: "Package Manager", value: "npm", detail: "package-lock.json" },
];
const environment = [
  ["Hosting", "Cloudflare Workers"],
  ["Domain", "Cloudflare Registrar"],
  ["Runtime", "TanStack Start"],
  ["Package", "npm"],
];

function InfoPage() {
  return (
    <PortfolioLayout>
      <header className="py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          サイト情報
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-8 text-muted-foreground">
          このサイトの構成、利用している技術、公開しているリポジトリを確認できます。
        </p>
      </header>
      <dl className="mb-12 grid divide-y border-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {summary.map((item) => (
          <div key={item.label} className="py-5 sm:px-6 sm:first:pl-0">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="mt-2 text-lg font-medium">{item.value}</dd>
            <dd className="mt-2 font-mono text-xs text-muted-foreground">
              {item.detail}
            </dd>
          </div>
        ))}
      </dl>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
        <section aria-labelledby="stack-heading" className="min-w-0">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2
              id="stack-heading"
              className="text-xl font-semibold tracking-tight"
            >
              技術スタック
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {techStack.length} items
            </span>
          </div>
          <p className="mb-6 text-sm leading-7 text-muted-foreground">
            使用している主要パッケージとバージョンです。
          </p>
          <table className="w-full table-fixed border-y text-left text-sm">
            <thead className="border-b">
              <tr>
                <th
                  scope="col"
                  className="py-3 text-xs font-medium text-muted-foreground"
                >
                  技術
                </th>
                <th
                  scope="col"
                  className="hidden w-28 py-3 text-xs font-medium text-muted-foreground sm:table-cell"
                >
                  用途
                </th>
                <th
                  scope="col"
                  className="w-24 py-3 text-right text-xs font-medium text-muted-foreground"
                >
                  バージョン
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {techStack.map((tech) => (
                <tr key={tech.name}>
                  <th scope="row" className="py-4 pr-4 font-medium">
                    <span className="break-words">{tech.name}</span>
                    <span className="mt-1 block text-xs font-normal text-muted-foreground sm:hidden">
                      {tech.category}
                    </span>
                  </th>
                  <td className="hidden py-4 text-xs text-muted-foreground sm:table-cell">
                    {tech.category}
                  </td>
                  <td className="py-4 text-right font-mono text-xs text-muted-foreground">
                    {tech.version}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            最終更新: {import.meta.env.VITE_BUILD_DATE}
          </p>
        </section>
        <aside className="min-w-0 space-y-9">
          <section className="border-t pt-5">
            <h2 className="mb-4 text-sm font-semibold">リポジトリ</h2>
            <p className="mb-3 break-words font-mono text-xs leading-6 text-muted-foreground">
              Hamaryo226/hamaryo-dev
            </p>
            <ExternalLink href="https://github.com/Hamaryo226/hamaryo-dev">
              GitHubで開く
            </ExternalLink>
          </section>
          <section className="border-t pt-5">
            <h2 className="mb-4 text-sm font-semibold">公開環境</h2>
            <dl className="space-y-3 text-xs leading-6">
              {environment.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="border-t pt-5">
            <h2 className="mb-4 text-sm font-semibold">サイトのQRコード</h2>
            <figure>
              <div className="w-36">
                <img
                  src="/img/qrw.png"
                  alt="hamaryo.devのQRコード"
                  width={144}
                  height={144}
                  className="block h-auto w-full dark:hidden"
                />
                <img
                  src="/img/qrd.png"
                  alt="hamaryo.devのQRコード（ダーク）"
                  width={144}
                  height={144}
                  className="hidden h-auto w-full dark:block"
                />
              </div>
              <figcaption className="mt-3 font-mono text-xs text-muted-foreground">
                hamaryo.dev
              </figcaption>
            </figure>
          </section>
        </aside>
      </div>
    </PortfolioLayout>
  );
}

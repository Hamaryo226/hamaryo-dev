import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PortfolioLayout } from "@/components/portfolio-layout";

export function MissingPage({
  title = "ページが見つかりません",
  description = "お探しのページは存在しないか、URLが変更された可能性があります。",
  backTo = "/",
  backLabel = "ホームに戻る",
}: {
  title?: string;
  description?: string;
  backTo?: "/" | "/Project" | "/Blog";
  backLabel?: string;
}) {
  return (
    <PortfolioLayout>
      <div className="flex min-h-[55vh] items-center py-16 sm:py-24">
        <div className="max-w-xl">
          <p className="mb-5 font-mono text-xs text-muted-foreground">404</p>
          <h1 className="text-xl font-medium leading-relaxed tracking-tight">
            {title}
          </h1>
          <p className="mt-5 text-[13px] leading-7 text-muted-foreground">
            {description}
          </p>
          <Link
            to={backTo}
            className="mt-8 inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {backLabel}
          </Link>
        </div>
      </div>
    </PortfolioLayout>
  );
}

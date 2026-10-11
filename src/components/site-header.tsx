import { Link } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="site-brand">
        <span>
          hamaryo<span className="text-muted-foreground">.dev</span>
        </span>
      </Link>
      <nav aria-label="メインナビゲーション" className="site-nav">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ className: "is-active" }}
        >
          ホーム
        </Link>
        <Link to="/Project" activeProps={{ className: "is-active" }}>
          プロジェクト
        </Link>
        <Link to="/Info" activeProps={{ className: "is-active" }}>
          サイト情報
        </Link>
      </nav>
      <ModeToggle />
    </header>
  );
}

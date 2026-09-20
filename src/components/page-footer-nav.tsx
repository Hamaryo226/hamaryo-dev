import { Link } from "@tanstack/react-router";

/** 下層ページの末尾に置くナビゲーション。ホーム以外の行き先をひと通り並べる。 */
export function PageFooterNav() {
  return (
    <footer className="mt-12 border-t pt-6">
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-foreground">
          ホーム
        </Link>
        <Link to="/Project" className="transition-colors hover:text-foreground">
          プロジェクト
        </Link>
        <Link to="/Blog" className="transition-colors hover:text-foreground">
          ブログ
        </Link>
        <Link to="/About" className="transition-colors hover:text-foreground">
          About
        </Link>
        <Link to="/Now" className="transition-colors hover:text-foreground">
          Now
        </Link>
        <Link to="/Uses" className="transition-colors hover:text-foreground">
          Uses
        </Link>
        <Link to="/Info" className="transition-colors hover:text-foreground">
          サイト情報
        </Link>
      </nav>
    </footer>
  );
}

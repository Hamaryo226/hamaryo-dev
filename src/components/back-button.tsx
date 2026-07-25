import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  // ルート定義から型が引かれるので、存在しないパスはコンパイルエラーになる
  href: LinkProps["to"];
  label: string;
  className?: string;
}

export function BackButton({ href, label, className }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={cn(
        "-ml-2 text-muted-foreground hover:text-foreground transition-colors",
        className,
      )}
    >
      <Link to={href}>
        <ChevronLeft className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    </Button>
  );
}

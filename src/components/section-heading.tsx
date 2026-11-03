import type { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  icon: LucideIcon;
  children: string;
}

/** 記事内のセクション見出し。アクセントの縦棒＋アイコンで並びを揃える */
export function SectionHeading({ icon: Icon, children }: SectionHeadingProps) {
  return (
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2.5">
      <span className="w-1 h-6 bg-primary rounded-full shrink-0" />
      <Icon className="h-5 w-5 shrink-0 text-primary" />
      {children}
    </h2>
  );
}

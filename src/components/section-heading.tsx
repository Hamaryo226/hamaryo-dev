interface SectionHeadingProps {
  children: string;
}

/** 記事内のセクション見出し。他ページと同じアクセントの縦棒だけで揃える */
export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
      <span className="w-1 h-6 bg-primary rounded-full shrink-0" />
      {children}
    </h2>
  );
}

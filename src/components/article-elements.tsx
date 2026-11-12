import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function ArticleSection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="mb-5 text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CodeBlock({
  code,
  language,
  title,
  description,
  filename,
}: {
  code: string;
  language: string;
  title?: string;
  description?: string;
  filename?: string;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border">
      <div className="flex flex-col gap-3 border-b bg-muted/40 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {title ? (
            <h3 className="text-sm font-medium">{title}</h3>
          ) : (
            <span className="font-mono text-xs text-muted-foreground">
              {language}
            </span>
          )}
          {description && (
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {filename && (
          <span className="min-w-0 break-all font-mono text-xs leading-6 text-muted-foreground">
            {filename}
          </span>
        )}
      </div>
      <pre className="max-w-full overflow-x-auto bg-muted/30 p-4 text-xs leading-7 sm:p-5 sm:text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}

export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full items-start gap-2 rounded-sm text-sm leading-7 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <span className="min-w-0 break-words">{children}</span>
      <ArrowUpRight className="mt-1.5 size-3.5 shrink-0" aria-hidden="true" />
    </a>
  );
}

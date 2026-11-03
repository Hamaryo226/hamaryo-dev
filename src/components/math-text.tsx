import { Fragment, useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  children: string;
  className?: string;
}

type Segment =
  | { kind: "text"; value: string }
  | { kind: "math"; value: string; display: boolean };

// $$...$$ を先に見るので、$...$ が $$ の中身を食わない
const PATTERN = /\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g;

function parse(source: string): Array<Segment> {
  const segments: Array<Segment> = [];
  let last = 0;
  for (const m of source.matchAll(PATTERN)) {
    if (m.index > last) {
      segments.push({ kind: "text", value: source.slice(last, m.index) });
    }
    // $$...$$ なら m[1]、$...$ なら m[2] にだけ中身が入る
    const display = typeof m[1] === "string";
    segments.push({
      kind: "math",
      value: (display ? m[1] : m[2]).trim(),
      display,
    });
    last = m.index + m[0].length;
  }
  if (last < source.length) {
    segments.push({ kind: "text", value: source.slice(last) });
  }
  return segments;
}

/**
 * 記事本文の `$...$` / `$$...$$` を KaTeX で組む。
 * 数式の外は素のテキストのまま出すので、Markdown 全体を解釈するわけではない。
 */
export function MathText({ children, className }: MathTextProps) {
  const segments = useMemo(() => parse(children), [children]);

  // 数式が無いときは余計な span を挟まない
  if (segments.every((s) => s.kind === "text")) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={className}>
      {segments.map((segment, i) => {
        if (segment.kind === "text") {
          return <Fragment key={i}>{segment.value}</Fragment>;
        }
        let html: string;
        try {
          html = katex.renderToString(segment.value, {
            displayMode: segment.display,
            throwOnError: false,
            output: "html",
          });
        } catch {
          // 壊れた式でページごと落とさない。元の記法のまま見せる
          return (
            <code key={i} className="text-xs">
              {segment.display ? `$$${segment.value}$$` : `$${segment.value}$`}
            </code>
          );
        }
        return (
          <span
            key={i}
            className={segment.display ? "block my-3 overflow-x-auto" : ""}
            // KaTeX の出力。入力はリポジトリ内の記事 JSON だけ
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}

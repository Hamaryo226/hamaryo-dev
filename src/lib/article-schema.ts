export type ArticleStatus = "draft" | "review" | "published";
export type Distribution =
  | { status: "unknown" | "unavailable" }
  | { status: "available"; url: string; label: string };

export type ArticleState = {
  articleStatus?: ArticleStatus;
  distribution?: Distribution;
};

export type ArticleSectionData = {
  type?: "text" | "features";
  id?: string;
  navLabel?: string;
  title: string;
  body: string;
  items?: { title: string; body: string }[];
};
export type ArticleIntro = {
  headline: string;
  lead: string;
  environment: string;
};

function record(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${path}: expected object`);
  return value as Record<string, unknown>;
}

function text(
  value: unknown,
  path: string,
  allowEmpty = false,
): asserts value is string {
  if (typeof value !== "string" || (!allowEmpty && !value.trim()))
    throw new Error(
      `${path}: expected ${allowEmpty ? "" : "non-empty "}string`,
    );
}

function url(value: unknown, path: string) {
  text(value, path);
  if (/[\s\\\\]/.test(value)) throw new Error(`${path}: invalid URL`);
  if (/^\/(?!\/)/.test(value)) return;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${path}: invalid URL`);
  }
  if (
    !["https:", "http:"].includes(parsed.protocol) ||
    parsed.username ||
    parsed.password
  )
    throw new Error(`${path}: expected HTTP(S) or root-relative URL`);
}

/** Validate raw JSON before it is trusted by the renderer. No publication inference. */
export function validateArticle(input: unknown, path = "article"): void {
  const article = record(input, path);
  for (const key of ["title", "systemname", "date", "description"])
    text(article[key], `${path}.${key}`);
  if (
    article.articleStatus !== undefined &&
    (typeof article.articleStatus !== "string" ||
      !["draft", "review", "published"].includes(article.articleStatus))
  )
    throw new Error(`${path}.articleStatus: invalid state`);
  if (article.distribution !== undefined) {
    const distribution = record(article.distribution, `${path}.distribution`);
    if (
      typeof distribution.status !== "string" ||
      !["unknown", "unavailable", "available"].includes(distribution.status)
    )
      throw new Error(`${path}.distribution.status: invalid state`);
    if (distribution.status === "available") {
      url(distribution.url, `${path}.distribution.url`);
      text(distribution.label, `${path}.distribution.label`);
    } else if (
      distribution.url !== undefined ||
      distribution.label !== undefined
    ) {
      throw new Error(
        `${path}.distribution: only available distribution may have a CTA`,
      );
    }
  }
  if (article.intro !== undefined) {
    const intro = record(article.intro, `${path}.intro`);
    for (const key of ["headline", "lead", "environment"])
      text(intro[key], `${path}.intro.${key}`);
  }
  if (article.thumbnail !== undefined)
    url(article.thumbnail, `${path}.thumbnail`);
  for (const key of ["links", "references"]) {
    if (article[key] === undefined) continue;
    for (const [label, href] of Object.entries(
      record(article[key], `${path}.${key}`),
    )) {
      text(label, `${path}.${key} label`);
      url(href, `${path}.${key}.${label}`);
    }
  }
  if (article.sections !== undefined) {
    if (!Array.isArray(article.sections))
      throw new Error(`${path}.sections: expected array`);
    const ids = new Set<string>();
    for (const [index, value] of article.sections.entries()) {
      const section = record(value, `${path}.sections[${index}]`);
      text(section.title, `${path}.sections[${index}].title`, true);
      text(section.body, `${path}.sections[${index}].body`, true);
      if (
        section.type !== undefined &&
        section.type !== "text" &&
        section.type !== "features"
      )
        throw new Error(`${path}.sections[${index}].type: unsupported block`);
      if (section.id !== undefined) {
        text(section.id, `${path}.sections[${index}].id`);
        if (
          !/^[a-z][a-z0-9-]*$/.test(section.id) ||
          section.id === "other-projects" ||
          ids.has(section.id)
        )
          throw new Error(
            `${path}.sections[${index}].id: invalid or duplicate anchor`,
          );
        ids.add(section.id);
      }
      if (section.navLabel !== undefined) {
        text(section.navLabel, `${path}.sections[${index}].navLabel`);
        if (!section.id)
          throw new Error(`${path}.sections[${index}].navLabel: id required`);
      }
      if (section.type === "features") {
        if (!Array.isArray(section.items))
          throw new Error(`${path}.sections[${index}].items: expected array`);
        for (const [itemIndex, itemValue] of section.items.entries()) {
          const item = record(
            itemValue,
            `${path}.sections[${index}].items[${itemIndex}]`,
          );
          text(
            item.title,
            `${path}.sections[${index}].items[${itemIndex}].title`,
            true,
          );
          text(
            item.body,
            `${path}.sections[${index}].items[${itemIndex}].body`,
            true,
          );
        }
      } else if (section.items !== undefined)
        throw new Error(
          `${path}.sections[${index}].items: only features may have items`,
        );
    }
  }
  if (article.content !== undefined) {
    for (const [key, value] of Object.entries(
      record(article.content, `${path}.content`),
    )) {
      if (key === "技術スタック" && typeof value !== "string") {
        for (const [label, techs] of Object.entries(
          record(value, `${path}.content.${key}`),
        )) {
          if (!Array.isArray(techs))
            throw new Error(`${path}.content.${key}.${label}: expected array`);
          for (const tech of techs)
            text(tech, `${path}.content.${key}.${label}`);
        }
      } else text(value, `${path}.content.${key}`, true);
    }
  }
  if (article.diagram !== undefined) {
    const diagram = record(article.diagram, `${path}.diagram`);
    for (const key of ["light", "dark"])
      url(diagram[key], `${path}.diagram.${key}`);
    text(diagram.alt, `${path}.diagram.alt`);
    if (diagram.caption !== undefined)
      text(diagram.caption, `${path}.diagram.caption`, true);
  }
  if (article.code !== undefined) {
    for (const [key, value] of Object.entries(
      record(article.code, `${path}.code`),
    )) {
      const code = record(value, `${path}.code.${key}`);
      for (const field of [
        "title",
        "description",
        "filename",
        "language",
        "code",
      ])
        text(
          code[field],
          `${path}.code.${key}.${field}`,
          field === "description",
        );
    }
  }
}

export function getArticleSections(article: {
  sections?: ArticleSectionData[];
  content?: { 概要?: string };
}): ArticleSectionData[] {
  const sections = article.sections ?? [
    { title: "概要", body: article.content?.概要 ?? "" },
  ];
  return sections
    .map((section) =>
      section.type === "features"
        ? {
            ...section,
            items: section.items?.filter(
              (item) => item.title.trim() && item.body.trim(),
            ),
          }
        : section,
    )
    .filter(
      (section) =>
        section.title.trim() && (section.body.trim() || section.items?.length),
    );
}

export function validateArticleCollection(
  entries: { data: unknown; slug: string; file: string }[],
): void {
  const slugs = new Set<string>();
  for (const entry of entries) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug))
      throw new Error(`${entry.file}.slug: invalid slug`);
    if (slugs.has(entry.slug))
      throw new Error(`${entry.file}.slug: duplicate slug ${entry.slug}`);
    slugs.add(entry.slug);
    validateArticle(entry.data, entry.file);
  }
}

export function getArticleState(article: ArticleState) {
  return {
    articleStatus: article.articleStatus ?? "draft",
    distribution: article.distribution ?? { status: "unknown" as const },
  };
}

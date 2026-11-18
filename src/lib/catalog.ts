import type { Article } from "./articles";
import type { Blog } from "./blogs";
import type { PortfolioWork } from "./works";

export interface SiteCatalog {
  articles: Article[];
  blogs: Blog[];
  works: (PortfolioWork & { slug: string })[];
}
declare const __SITE_CATALOG__: SiteCatalog;
export const catalog = __SITE_CATALOG__;

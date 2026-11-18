import { catalog } from "./catalog";

export interface PortfolioWork {
  name: string;
  intro: string;
  chapters: ReadonlyArray<readonly [string, string]>;
  image?: string;
  source?: string;
  sourceLabel?: string;
}

export const works = new Map(catalog.works.map((work) => [work.slug, work]));

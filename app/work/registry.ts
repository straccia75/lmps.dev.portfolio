import type { CaseStudy, Category } from "./types";
import { prospeak } from "./prospeak/content";

export const CATEGORIES: { id: Category; label: string; empty: string }[] = [
  {
    id: "software",
    label: "Software Development",
    empty: "Projects coming soon.",
  },
  {
    id: "data",
    label: "Data Engineering",
    empty: "Pipelines, data modelling and analytics projects. In preparation.",
  },
];

/* Order here is the order on the site. */
export const PROJECTS: CaseStudy[] = [prospeak];

export function categoryLabel(id: Category) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

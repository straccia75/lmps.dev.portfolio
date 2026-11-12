/*
  Data model for the portfolio.
  To add a project: write a CaseStudy (see prospeak/content.ts as the example),
  register it in work/registry.ts, and add a 3-line page in app/work/<slug>/page.tsx.
*/

export type Category = "software" | "data";

export type System = {
  id: string;
  title: string;
  intro: string;
  points: string[];
};

export type CaseStudy = {
  slug: string;
  category: Category;
  name: string;
  tagline: string;
  summary: string;

  /* Card shown in the Work tabs on the home page */
  card: {
    kicker: string;
    blurb: string;
    points: string[];
    tags: string[];
  };

  meta: { label: string; value: string }[];
  facts: { value: string; label: string }[];

  /* Section 01: how things move through the system (customers, data, ...) */
  flow: {
    title: string;
    intro: string;
    steps: { step: string; detail: string; actor: string }[];
  };

  /* Section 02 */
  architecture: {
    title: string;
    paragraphs: string[];
    stack: { group: string; items: string[] }[];
  };

  /* Section 03: systems grouped by what they do */
  groups: { name: string; description: string; systems: System[] }[];

  /* Section 04 */
  decisions: { choice: string; why: string }[];

  /* Closing call to action */
  cta: { title: string; text: string };
};

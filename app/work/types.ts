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
  /* Optional demo video shown inside the system, above its points */
  video?: Media & { poster: string };
  /* Optional id of a video in "See it working" that demos this system (shows a "Watch the demo" link) */
  demo?: string;
};

/* Extra demo video in "See it working", with its own heading and anchor */
export type DemoVideo = Media & { poster: string; id: string; title: string };

/* Image or video shown on the site. Files live in public/work/<slug>/ */
export type Media = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type CaseStudy = {
  slug: string;
  category: Category;
  name: string;
  tagline: string;
  summary: string;

  /* Optional visuals: thumbnail for the home card, demo video and screenshots for the case study */
  media?: {
    thumbnail?: Media;
    video?: Media & { poster: string };
    videos?: DemoVideo[];
    screenshots?: Media[];
  };

  /* Card shown in the Work tabs on the home page */
  card: {
    kicker: string;
    blurb: string;
    points: string[];
    /* Capabilities, highlighted in the accent colour before the tech tags */
    skills?: string[];
    tags: string[];
  };

  meta: { label: string; value: string }[];
  facts: { value: string; label: string }[];

  /* Optional links shown under the summary (repository, live site) */
  links?: { label: string; href: string }[];

  /* Section 01: how things move through the system (customers, data, ...).
     Optional: a project with an architecture diagram tells the flow there instead. */
  flow?: {
    title: string;
    intro: string;
    steps: { step: string; detail: string; actor: string }[];
  };

  /* Section 02 */
  architecture: {
    title: string;
    /* Optional diagram drawn above the text. Key of a component in components/diagrams.tsx */
    diagram?: "aviation-pipeline";
    paragraphs: string[];
    stack: { group: string; items: string[] }[];
  };

  /* Section 03: systems grouped by what they do */
  systemsIntro?: string;
  groups: { name: string; description: string; systems: System[] }[];

  /* Section 04 */
  decisions: { choice: string; why: string }[];

  /* Closing call to action */
  cta: { title: string; text: string };
};

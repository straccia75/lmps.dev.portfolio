import { headers } from "next/headers";

/*
  The same site is served on two domains:
  - lmps.dev          → full site, with WhatsApp and LinkedIn
  - upwork.lmps.dev   → clean version for Upwork: no phone, no external contact,
                        every call to action points to the Upwork profile.
  Contact details are never rendered in the Upwork version (not hidden: absent).

  Local testing: open http://upwork.localhost:3000
*/

export type SiteMode = "main" | "upwork";

export const UPWORK_PROFILE_URL = "https://www.upwork.com/freelancers/~012cc8d15a10f01935";

export async function getSiteMode(): Promise<SiteMode> {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").toLowerCase();
  return host.startsWith("upwork.") ? "upwork" : "main";
}

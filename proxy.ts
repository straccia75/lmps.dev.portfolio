import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
  The CV lives in public/ but is only for visitors of lmps.dev.
  On upwork.lmps.dev it does not exist: the request gets a plain 404.
  Same host check as app/lib/site-mode.ts.
*/

export function proxy(request: NextRequest) {
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").toLowerCase();

  if (host.startsWith("upwork.")) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Keep the CV out of search engines on the main site too
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: "/resume.pdf",
};

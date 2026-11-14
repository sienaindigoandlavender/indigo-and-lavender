import { NextRequest, NextResponse } from "next/server";

// When ii.riaddisiena.com proxies a guest page here it adds ?via=ii (the-douaria next.config.js): the layout then shows
// the Douaria's footer for Booking.com guests. Airbnb guests on this site keep the bare page (Jacqueline, 14 Nov 2026).
export function middleware(req: NextRequest) {
  if (req.nextUrl.searchParams.get("via") !== "ii") return NextResponse.next();
  const headers = new Headers(req.headers);
  headers.set("x-via", "ii");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/welcome", "/arrival", "/keys", "/the-riad/:path*", "/the-douaria/:path*"] };

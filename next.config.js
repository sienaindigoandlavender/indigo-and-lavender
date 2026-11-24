/** @type {import('next').NextConfig} */
// ii.riaddisiena.com (the-douaria project) proxies these guest pages for Booking.com guests (14 Nov 2026).
// The path assetPrefix keeps this site's /_next files apart from the Douaria's when served through ii.
module.exports = {
  assetPrefix: "/il-static",
  async rewrites() {
    return { beforeFiles: [{ source: "/il-static/_next/:path+", destination: "/_next/:path+" }] };
  },
  // Every guest's page moved to riaddisiena.com (Jacqueline, 24 Nov 2026: "move everything to riaddisiena"). Old links
  // in Airbnb messages and emails land there, query (b, k, lang) kept. This domain becomes the Indigo & Lavender shop.
  async redirects() {
    const R = "https://www.riaddisiena.com";
    return ["/welcome", "/arrival", "/keys", "/the-riad/:path*", "/the-douaria/:path*", "/api/tax"].map((source) => ({
      source,
      destination: `${R}${source}`,
      permanent: true,
    }));
  },
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

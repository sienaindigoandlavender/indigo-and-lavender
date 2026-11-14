/** @type {import('next').NextConfig} */
// ii.riaddisiena.com (the-douaria project) proxies these guest pages for Booking.com guests (14 Nov 2026).
// The path assetPrefix keeps this site's /_next files apart from the Douaria's when served through ii.
module.exports = {
  assetPrefix: "/il-static",
  async rewrites() {
    return { beforeFiles: [{ source: "/il-static/_next/:path+", destination: "/_next/:path+" }] };
  },
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

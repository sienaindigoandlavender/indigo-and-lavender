// The house's data lives behind the main site's API. This site asks for it server-side,
// so a guest's browser only ever talks to indigoandlavender.love.
export const UPSTREAM = process.env.UPSTREAM_URL || "https://www.riaddisiena.com";

/** Strip the old house name and links from anything shown to guests here. */
export function neutral(text: string) {
  return text
    .replace(/https:\/\/res\.cloudinary\.com\/[^"\s]*riad-di-siena[^"\s]*/g, (u) => `/api/img?u=${encodeURIComponent(u)}`)
    .replace(/https?:\/\/(www\.)?riaddisiena\.com\/transfer/g, "https://indigoandlavender.love/the-riad/transfer")
    .replace(/https?:\/\/(www\.)?riaddisiena\.com\/directions\?building=annex/g, "https://indigoandlavender.love/the-douaria/directions")
    .replace(/https?:\/\/(www\.)?riaddisiena\.com\/directions/g, "https://indigoandlavender.love/the-riad/directions")
    .replace(/https?:\/\/(www\.)?riaddisiena\.com\/dinners/g, "https://indigoandlavender.love/the-riad/dinners")
    .replace(/Riad di Siena/g, "the house");
}

export async function pass(req: Request, path: string) {
  const url = new URL(req.url);
  const r = await fetch(`${UPSTREAM}${path}${url.search}`, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.text(),
    cache: "no-store",
  });
  const body = neutral(await r.text());
  return new Response(body, { status: r.status, headers: { "Content-Type": r.headers.get("content-type") || "application/json" } });
}

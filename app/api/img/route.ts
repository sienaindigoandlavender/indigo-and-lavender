// Directions photos sit on Cloudinary under file names that carry the old house name.
// They are served from here so the address bar and "open image" never show it.
export const runtime = "edge";
export async function GET(req: Request) {
  const u = new URL(req.url).searchParams.get("u") || "";
  if (!/^https:\/\/res\.cloudinary\.com\//.test(u)) return new Response("Not found", { status: 404 });
  const r = await fetch(u);
  return new Response(r.body, { status: r.status, headers: { "Content-Type": r.headers.get("content-type") || "image/jpeg", "Cache-Control": "public, max-age=604800, immutable" } });
}

import { UPSTREAM } from "@/lib/upstream";
export const dynamic = "force-dynamic";
// The city-tax pay link: the house's endpoint answers with a redirect to PayPal; pass that redirect on.
export async function GET(req: Request) {
  const r = await fetch(`${UPSTREAM}/api/tax${new URL(req.url).search}`, { redirect: "manual", cache: "no-store" });
  const to = r.headers.get("location");
  if (to && !/\/\/(www\.)?riaddisiena\.com/.test(to)) return Response.redirect(to, 302);
  return Response.redirect(new URL("/keys" + new URL(req.url).search + "&tax=failed", req.url).toString(), 302);
}

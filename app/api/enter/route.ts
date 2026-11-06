export const dynamic = "force-dynamic";
// SITE_PASSWORD lives only in Vercel. Without it, no password opens anything.
export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const ok = !!process.env.SITE_PASSWORD && password === process.env.SITE_PASSWORD;
  return new Response(JSON.stringify({ ok }), { status: ok ? 200 : 401, headers: { "Content-Type": "application/json" } });
}

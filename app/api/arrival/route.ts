import { pass } from "@/lib/upstream";
export const dynamic = "force-dynamic";
export const GET = (req: Request) => pass(req, "/api/arrival");
export const POST = (req: Request) => pass(req, "/api/arrival");

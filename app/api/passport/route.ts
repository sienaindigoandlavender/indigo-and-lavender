import { pass } from "@/lib/upstream";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const POST = (req: Request) => pass(req, "/api/passport");

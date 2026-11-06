import { pass } from "@/lib/upstream";
export const dynamic = "force-dynamic";
export const GET = (req: Request) => pass(req, "/api/transfer");
export const POST = (req: Request) => pass(req, "/api/transfer");
export const DELETE = (req: Request) => pass(req, "/api/transfer");

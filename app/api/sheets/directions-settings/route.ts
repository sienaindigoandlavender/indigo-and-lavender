import { pass } from "@/lib/upstream";
export const dynamic = "force-dynamic";
export const GET = (req: Request) => pass(req, "/api/sheets/directions-settings");

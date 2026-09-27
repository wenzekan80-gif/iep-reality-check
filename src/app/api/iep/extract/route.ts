import { extractRequest } from "../../../../ai/server/service";

export const runtime = "nodejs";
export const maxDuration = 20;

export async function POST(request: Request) { return extractRequest(request); }

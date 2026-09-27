import { extractRequest } from "../../../../ai/server/service";

// Compatibility path only: uses the same DeepSeek provider and flat response as /api/extract.

export const runtime = "nodejs";
export const maxDuration = 20;

export async function POST(request: Request) { return extractRequest(request); }

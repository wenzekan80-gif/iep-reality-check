import "server-only";
import { z } from "zod";
import { approvedExample, MAX_EXCERPT_LENGTH } from "../examples";
import { EvidenceError, validateExtraction } from "../extraction";
import { deepSeekProvider, ProviderUnavailable, type ExtractionProvider } from "./provider";

type Env = Record<string, string | undefined>;
const bodySchema = z.object({ text: z.string().min(1).max(MAX_EXCERPT_LENGTH), synthetic: z.literal(true) }).strict();
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const error = (status: number, code: string, message: string) => Response.json({ code, message }, { status, headers });

// Per-process bounds. No addresses or excerpt text retained. Not a distributed budget.
export function createCallGate() {
  let active = 0; let minute = -1; let calls = 0;
  return { acquire(now = Date.now()) {
    const current = Math.floor(now / 60000);
    if (current !== minute) { minute = current; calls = 0; }
    if (active >= 2 || calls >= 6) return null;
    calls++; active++;
    return () => { active--; };
  } };
}
const callGate = createCallGate();

export async function extractRequest(request: Request, options: {
  env?: Env; provider?: ExtractionProvider; gate?: ReturnType<typeof createCallGate>; timeoutMs?: number;
} = {}) {
  const env = options.env ?? process.env;
  if (env.IEP_AI_ENABLED !== "true") return error(503, "disabled", "AI extraction is switched off. Use Ethan’s original demo.");
  if (!env.DEEPSEEK_API_KEY?.trim()) return error(503, "unavailable", "AI extraction is not configured. Use Ethan’s original demo.");
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return error(403, "origin", "Open this demo directly to try extraction.");
  if (!request.headers.get("content-type")?.startsWith("application/json")) return error(415, "format", "Send a synthetic text example as JSON.");
  // Enforce actual streamed bytes, not only the caller's Content-Length.
  let raw = ""; let bytes = 0; const reader = request.body?.getReader();
  if (!reader) return error(400, "input", "Choose a synthetic example first.");
  try {
    const decoder = new TextDecoder();
    while (true) {
      const part = await reader.read(); if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > 12000) return error(413, "length", "The excerpt is too long. Use a short synthetic example.");
      raw += decoder.decode(part.value, { stream: true });
    }
    raw += decoder.decode();
  } catch { return error(400, "input", "The excerpt could not be read."); }
  finally { await reader.cancel(); }
  let body: z.infer<typeof bodySchema>;
  try { body = bodySchema.parse(JSON.parse(raw)); }
  catch { return error(400, "input", "Choose a synthetic excerpt of 1–2400 characters and confirm it contains no real student data."); }
  const localCustom = env.NODE_ENV === "development" && env.IEP_AI_LOCAL_CUSTOM === "true" &&
    ["127.0.0.1", "localhost", "[::1]"].includes(new URL(request.url).hostname);
  if (!approvedExample(body.text) && !localCustom) return error(422, "example_only", "This public demo accepts only the unchanged Clear example or Vague example. Do not submit real student data.");
  const release = (options.gate ?? callGate).acquire();
  if (!release) return error(429, "limit", "The demo’s AI call limit has been reached. Wait a minute or use Ethan’s original demo.");
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const provider = options.provider ?? deepSeekProvider(env.DEEPSEEK_API_KEY, env.DEEPSEEK_MODEL?.trim() || "deepseek-flash");
    const output = await Promise.race([
      provider.extract(body.text, controller.signal),
      new Promise<never>((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new ProviderUnavailable()); }, options.timeoutMs ?? 15000); }),
    ]);
    const extraction = validateExtraction(output, body.text);
    return Response.json(extraction, { headers });
  } catch (failure) {
    return failure instanceof EvidenceError ? error(422, "evidence", failure.message) : error(503, "unavailable", new ProviderUnavailable().message);
  } finally { clearTimeout(timer); controller.abort(); release(); }
}

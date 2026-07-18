import { Router } from "express";
import { logger } from "../lib/logger";
import { bypassLimiter } from "../lib/rate-limits";

const router = Router();

// Allowed protocols — block file://, javascript:, data: etc.
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

// Known bypass-able link-shortener patterns
function detectService(url: string): string | null {
  const lower = url.toLowerCase();
  if (lower.includes("linkvertise"))      return "Linkvertise";
  if (lower.includes("loot-link") || lower.includes("lootlink")) return "LootLink";
  if (lower.includes("lootlabs"))         return "LootLabs";
  if (lower.includes("direct-link"))      return "Direct Link";
  if (lower.includes("link-center"))      return "Link Center";
  if (lower.includes("flux.li"))          return "Flux";
  if (lower.includes("rblx.land"))        return "Rblx Land";
  if (lower.includes("bloxlander"))       return "Blox Lander";
  if (lower.includes("sub2unlock"))       return "Sub2Unlock";
  if (lower.includes("pastebin"))         return "Pastebin";
  return null;
}

/**
 * GET /bypass/proxy?url=<encoded>
 * Proxies the bypass request server-side to avoid browser CORS restrictions.
 * Rate-limited to 10 req/min per IP.
 */
router.get("/bypass/proxy", bypassLimiter, async (req, res) => {
  const { url } = req.query as { url?: string };

  // --- Input validation ---
  if (!url || typeof url !== "string") {
    res.status(400).json({ success: false, error: "url query parameter is required." });
    return;
  }

  if (url.length > 2048) {
    res.status(400).json({ success: false, error: "URL is too long (max 2048 characters)." });
    return;
  }

  let decodedUrl: string;
  let parsed: URL;
  try {
    decodedUrl = decodeURIComponent(url.trim());
    parsed = new URL(decodedUrl);
  } catch {
    res.status(400).json({ success: false, error: "Invalid URL. Must be a full URL (e.g. https://example.com)." });
    return;
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    res.status(400).json({ success: false, error: "Only http and https URLs are supported." });
    return;
  }

  // Reject private/internal IPs (SSRF protection)
  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.startsWith("127.") ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.") ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local")
  ) {
    res.status(400).json({ success: false, error: "Private/internal URLs are not allowed." });
    return;
  }

  // --- Proxy to bypass API ---
  try {
    const apiUrl = `https://4pi-bypass.vercel.app/api/bypass?url=${encodeURIComponent(decodedUrl)}`;
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(20_000),
      headers: { "User-Agent": "BYPASS-Dashboard/1.0" },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      logger.warn({ status: response.status, text: text.slice(0, 200) }, "Bypass API error");
      res.status(502).json({
        success: false,
        originalUrl: decodedUrl,
        error: response.status === 429
          ? "Bypass API rate limit reached. Try again in a moment."
          : `Bypass API unavailable (HTTP ${response.status}).`,
      });
      return;
    }

    let data: Record<string, unknown>;
    try {
      data = await response.json() as Record<string, unknown>;
    } catch {
      res.status(502).json({ success: false, originalUrl: decodedUrl, error: "Bypass API returned invalid response." });
      return;
    }

    const bypassedUrl =
      (typeof data.result   === "string" ? data.result   : null) ??
      (typeof data.bypassed === "string" ? data.bypassed : null) ??
      (typeof data.url      === "string" ? data.url      : null) ??
      null;

    const success = data.success !== false && bypassedUrl !== null;

    // Validate the bypassed URL is safe to return
    if (bypassedUrl) {
      try {
        const bypassedParsed = new URL(bypassedUrl);
        if (!ALLOWED_PROTOCOLS.has(bypassedParsed.protocol)) {
          res.status(502).json({ success: false, originalUrl: decodedUrl, error: "Bypass API returned an unsafe URL." });
          return;
        }
      } catch {
        res.status(502).json({ success: false, originalUrl: decodedUrl, error: "Bypass API returned an invalid URL." });
        return;
      }
    }

    res.json({
      success,
      originalUrl: decodedUrl,
      bypassedUrl: bypassedUrl ?? null,
      error: success ? null : (typeof data.error === "string" ? data.error : "Bypass failed — link may not be supported."),
      service: detectService(decodedUrl),
    });
  } catch (err) {
    const isTimeout = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    logger.error({ err: isTimeout ? "timeout" : String(err) }, "Bypass proxy error");
    res.status(504).json({
      success: false,
      originalUrl: decodedUrl!,
      error: isTimeout
        ? "Request timed out. The bypass API did not respond in time."
        : "Failed to reach the bypass API. Check your connection and try again.",
    });
  }
});

export default router;

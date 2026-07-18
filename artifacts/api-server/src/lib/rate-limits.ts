import rateLimit from "express-rate-limit";

/** Bypass-specific: 10 req / min per IP (bypass is expensive) */
export const bypassLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Bypass rate limit reached. Wait 1 minute." },
});

/** Auth: 20 req / 10 min per IP */
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth requests. Please wait." },
});

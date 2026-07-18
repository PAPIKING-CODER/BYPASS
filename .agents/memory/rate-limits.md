---
name: Rate-limits circular import fix
description: bypassLimiter and authLimiter must live in lib/rate-limits.ts to avoid circular deps with app.ts
---

Originally these were exported from app.ts. app.ts imports routes/index.ts → routes/auth.ts and routes/bypass.ts → re-imported app.ts: a circular ESM dependency that caused "argument handler must be a function" at startup (the export resolved to undefined).

**Why:** Node ESM circular imports resolve to undefined for not-yet-initialized exports.

**How to apply:** Any new route-level rate limiter goes in `artifacts/api-server/src/lib/rate-limits.ts`. app.ts may import from there for global middleware. Routes must never import from app.ts.

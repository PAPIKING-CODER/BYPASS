import { Router } from "express";

const router = Router();

/**
 * GET /bot/stats
 *
 * Returns live server stats where available.
 * Fields that require real Discord bot IPC return null — the frontend
 * shows "Unavailable" for those. Wire up real values by setting env vars:
 *   BOT_SERVERS, BOT_USERS, BOT_COMMANDS_USED, BOT_TOTAL_BYPASSES, BOT_PING_MS, BOT_VERSION
 */
router.get("/bot/stats", (_req, res) => {
  const parseEnvInt = (key: string): number | null => {
    const v = process.env[key];
    if (!v) return null;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  };

  res.json({
    servers:        parseEnvInt("BOT_SERVERS"),
    users:          parseEnvInt("BOT_USERS"),
    commandsUsed:   parseEnvInt("BOT_COMMANDS_USED"),
    totalBypasses:  parseEnvInt("BOT_TOTAL_BYPASSES"),
    ping:           parseEnvInt("BOT_PING_MS"),
    version:        process.env.BOT_VERSION ?? null,
    // Real server uptime — always available
    uptime:         Math.floor(process.uptime()),
    online:         true,
  });
});

export default router;

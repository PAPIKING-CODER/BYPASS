import { Router } from "express";
import { logger } from "../lib/logger";
import { authLimiter } from "../lib/rate-limits";

const router = Router();

const CLIENT_ID     = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI  = process.env.DISCORD_REDIRECT_URI;

// Scopes needed for the dashboard
const SCOPES = ["identify", "guilds"].join("%20");

router.get("/discord", authLimiter, (req, res) => {
  if (!CLIENT_ID || !REDIRECT_URI) {
    res.status(503).json({ error: "Discord OAuth is not configured on this server." });
    return;
  }
  const state = Math.random().toString(36).slice(2);
  req.session.oauthState = state;
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPES}&state=${state}&prompt=none`;
  res.redirect(url);
});

router.get("/discord/callback", authLimiter, async (req, res) => {
  const { code, state, error } = req.query as Record<string, string | undefined>;

  if (error) {
    logger.warn({ error }, "Discord OAuth error from Discord");
    res.redirect("/?auth=error&reason=" + encodeURIComponent(error));
    return;
  }

  if (!code) {
    res.status(400).json({ error: "Missing code parameter." });
    return;
  }

  // CSRF check
  if (state !== req.session.oauthState) {
    logger.warn("OAuth state mismatch — possible CSRF attempt");
    res.status(403).json({ error: "OAuth state mismatch." });
    return;
  }
  delete req.session.oauthState;

  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    res.status(503).json({ error: "Discord OAuth is not configured on this server." });
    return;
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type:    "authorization_code",
        code,
        redirect_uri:  REDIRECT_URI,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!tokenRes.ok) {
      const detail = await tokenRes.text().catch(() => "");
      logger.error({ status: tokenRes.status, detail: detail.slice(0, 200) }, "Token exchange failed");
      res.status(502).json({ error: "Failed to exchange code with Discord." });
      return;
    }

    const tokenData = await tokenRes.json() as {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
    };

    // Fetch user profile
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      signal: AbortSignal.timeout(10_000),
    });

    if (!userRes.ok) {
      logger.error({ status: userRes.status }, "Failed to fetch Discord user");
      res.status(502).json({ error: "Failed to fetch Discord user profile." });
      return;
    }

    const discordUser = await userRes.json() as {
      id: string;
      username: string;
      discriminator: string;
      avatar: string | null;
      email?: string;
      banner?: string | null;
      accent_color?: number | null;
    };

    // Fetch guilds
    const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      signal: AbortSignal.timeout(10_000),
    });
    const guilds = guildsRes.ok ? await guildsRes.json() as unknown[] : [];

    // Store in session — never store the access_token client-side
    req.session.user = {
      id:            discordUser.id,
      username:      discordUser.username,
      discriminator: discordUser.discriminator,
      avatar:        discordUser.avatar,
      banner:        discordUser.banner ?? null,
      accentColor:   discordUser.accent_color ?? null,
      guilds:        (guilds as Array<{ id: string; name: string; icon: string | null; owner: boolean; permissions: string }>).map(g => ({
        id:    g.id,
        name:  g.name,
        icon:  g.icon,
        owner: g.owner,
      })),
    };

    res.redirect("/?auth=success");
  } catch (err) {
    const isTimeout = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    logger.error({ err: isTimeout ? "timeout" : String(err) }, "OAuth callback error");
    res.redirect("/?auth=error&reason=server_error");
  }
});

router.get("/me", (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }
  res.json(req.session.user);
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) logger.error({ err }, "Session destroy error");
    res.clearCookie("sid");
    res.json({ success: true });
  });
});

export default router;

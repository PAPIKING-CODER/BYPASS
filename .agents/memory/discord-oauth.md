---
name: Discord OAuth configuration
description: Client ID and redirect URI for the BYPASS bot Discord login flow
---

- DISCORD_CLIENT_ID: 1525040833814855710
- DISCORD_REDIRECT_URI: set to dev domain callback (update to production URL after deployment)
- Callback route: GET /api/auth/discord/callback
- Scopes: identify, guilds

**Why:** The user provided the bot invite URL as "redirect URI" — the actual OAuth callback URL was inferred and set to the Replit dev domain.

**How to apply:** After deploying, update DISCORD_REDIRECT_URI in both the Replit env vars AND the Discord Developer Portal's OAuth2 → Redirects list.

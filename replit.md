# BYPASS Dashboard

A premium 2026 cyberpunk/glassmorphism dashboard for a Discord Bot that bypasses link shorteners and integrates with Roblox executors.

## Run & Operate

- `pnpm --filter @workspace/bypass-dashboard run dev` — run the frontend (served via workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 + Framer Motion + Wouter + TanStack Query
- API: Express 5 + express-session + connect-pg-simple
- DB: PostgreSQL + Drizzle ORM (sessions table)
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/bypass-dashboard/src/pages/` — all page components (Home, Bypass, Executors, Status, Commands, Discord, Music, Statistics, Settings, Support)
- `artifacts/bypass-dashboard/src/components/` — shared components (layout, sidebar, music player, settings provider)
- `artifacts/api-server/src/routes/` — auth, bot, commands, bypass proxy, status proxy
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/db/src/schema/sessions.ts` — sessions table for Discord OAuth

## Required Environment Variables / Secrets

### Secrets (set via Replit Secrets panel)
- `SESSION_SECRET` — random string for session encryption (already set)
- `DISCORD_CLIENT_SECRET` — Discord bot OAuth2 client secret
- `GITHUB_TOKEN` — GitHub personal access token for pushing to BYPASS repo

### Non-secret env vars
- `DISCORD_CLIENT_ID` — Discord bot application client ID
- `DISCORD_REDIRECT_URI` — Full OAuth2 callback URL (e.g. `https://your-domain.com/api/auth/discord/callback`)

## Discord OAuth Setup

1. Go to https://discord.com/developers/applications → your bot → OAuth2
2. Set redirect URI to `<your-deployed-url>/api/auth/discord/callback`
3. Set `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`
4. Set `DISCORD_REDIRECT_URI` to the same callback URL

## Architecture decisions

- Backend proxies external APIs (bypass, executors, Roblox status) to avoid CORS issues in the browser
- Discord OAuth sessions stored in PostgreSQL via connect-pg-simple
- Music player persists across navigation using React Context (MusicProvider wraps the app)
- All localStorage keys prefixed with `bypass_` for easy cleanup
- Bot stats endpoint returns realistic static values — wire to your actual bot via IPC or shared DB

## Product

A full-featured dashboard with: cyberpunk black/red/blue neon theme, glassmorphism cards, animated particle backgrounds, link bypass tool with history, executor status tracker, Roblox version monitor, Discord OAuth login, music player with SoundHelix tracks, statistics charts, settings with theme/accent customization, Discord server widget, and support page.

## User preferences

- Language: Spanish preferred in chat
- Cyberpunk + Glassmorphism design
- No emojis in the UI
- Red and blue neon accents on black background

## Gotchas

- Tailwind v4: `@apply` cannot reference custom classes (like `.glass-panel`). Always expand custom classes inline in `@apply` rules.
- The sessions table is created automatically by connect-pg-simple on first startup (`createTableIfMissing: true`)
- Bot stats (`/api/bot/stats`) returns hardcoded values — replace with real bot IPC when ready
- After each OpenAPI spec change, run: `pnpm --filter @workspace/api-spec run codegen`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- GitHub repo: https://github.com/PAPIKING-CODER/BYPASS

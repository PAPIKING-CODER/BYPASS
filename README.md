# 👑 KING BOT WEBSITE

> **The ultimate Discord bot dashboard** — bypass link shorteners, track executor status, monitor your bot in real time, and manage your server with style.

[![Discord](https://img.shields.io/badge/Discord-Add%20Bot-5865F2?logo=discord\&logoColor=white)](https://discord.com/oauth2/authorize?client_id=1525040833814855710&permissions=8&integration_type=0&scope=bot+applications.commands)
[![GitHub](https://img.shields.io/badge/GitHub-PAPIKING--CODER%2FBYPASS-181717?logo=github)](https://github.com/PAPIKING-CODER/BYPASS)

---

## 📦 Project Structure

```
BYPASS/
├── artifacts/
│   ├── bypass-dashboard/   # React + Vite frontend (this website)
│   └── api-server/         # Express 5 backend API
├── bypass-bot/
│   ├── bot.py              # Discord bot (Python / discord.py)
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── lib/
│   ├── api-spec/           # OpenAPI spec (source of truth)
│   ├── api-client-react/   # Auto-generated React Query hooks
│   └── db/                 # Drizzle ORM schema
└── README.md
```

---

## 🤖 Bot Setup (`bypass-bot/bot.py`)

### Prerequisites
- Python 3.10+
- A Discord bot token from the [Developer Portal](https://discord.com/developers/applications)

### Installation

```bash
cd bypass-bot
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your DISCORD_TOKEN
```

### Running the bot

```bash
python bot.py
```

### Bot Commands

| Command | Description | Permissions |
|---|---|---|
| `/bypass <url>` | Bypass a link shortener instantly | Everyone |
| `/setupautobypass` | Configure auto-bypass in a channel | Admin |
| `/executor list` | List supported executors | Everyone |
| `/set <channel>` | Set executor info channel | Admin |
| `/ping` | Check bot latency | Everyone |
| `/suported` | List supported bypass services | Everyone |
| `/say <message>` | Make the bot say something | Admin |
| `/help` | Show all commands | Everyone |

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DISCORD_TOKEN` | ✅ | Your bot token |
| `PORT` | ❌ | Health server port (default `8080`) |
| `BOT_INVITE_URL` | ❌ | Override the invite URL |

---

## 🌐 Dashboard Setup

The dashboard is a **pnpm monorepo**. You need Node 20+ and pnpm 9+.

### Installation

```bash
# Install all workspace dependencies
pnpm install
```

### Development

```bash
# Start both the frontend and API in separate terminals:
pnpm --filter @workspace/bypass-dashboard run dev
pnpm --filter @workspace/api-server run dev
```

### Environment Variables (Dashboard)

Copy `.env.example` to `.env` in the repo root and fill in:

| Variable | Required | Description |
|---|---|---|
| `DISCORD_CLIENT_ID` | ✅ | App client ID from the Developer Portal |
| `DISCORD_CLIENT_SECRET` | ✅ | OAuth2 client secret (keep secret!) |
| `DISCORD_REDIRECT_URI` | ✅ | Must match the redirect URI in the Dev Portal |
| `SESSION_SECRET` | ✅ | Random string for session signing |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `BOT_SERVERS` | ❌ | Bot guild count (for real stats) |
| `BOT_USERS` | ❌ | Bot user count |
| `BOT_COMMANDS_USED` | ❌ | Total commands executed |
| `BOT_TOTAL_BYPASSES` | ❌ | Total links bypassed |
| `BOT_PING_MS` | ❌ | Bot latency in ms |
| `BOT_VERSION` | ❌ | Bot version string |

### Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications/1525040833814855710/oauth2)
2. Under **OAuth2 → Redirects** add your callback URL:
   - Development: `http://localhost:8080/api/auth/discord/callback`
   - Production: `https://your-domain.com/api/auth/discord/callback`
3. Set `DISCORD_REDIRECT_URI` to the same URL in your env vars.

---

## 🚀 Deployment

This project is optimized for **Replit** but works anywhere:

```bash
# Build the frontend
pnpm --filter @workspace/bypass-dashboard run build

# Build the API
pnpm --filter @workspace/api-server run build

# Start production API
node --enable-source-maps artifacts/api-server/dist/index.mjs
```

---

## ✨ Features

- 🔗 **Link Bypasser** — Supports Linkvertise, Work.ink, Loot.link, and more
- 🤖 **Bot Dashboard** — Real-time server count, users, uptime, and latency
- 🎮 **Executor Tracker** — Status for popular Roblox executors
- 📊 **Statistics** — Bot metrics with live charts
- 🎵 **Music Player** — Built-in phonk / trap / synthwave player
- 🔒 **Discord Login** — OAuth2 with guild list
- 📱 **PWA** — Installable on mobile and desktop, works offline
- 🛡️ **Security** — Helmet, rate limiting, SSRF protection, input validation

---

## 📄 License

MIT — free to use, modify, and distribute.

---

> Made with 💀 by [PAPIKING-CODER](https://github.com/PAPIKING-CODER)

import { Router } from "express";

const router = Router();

const COMMANDS = [
  {
    name: "/bypass",
    description: "Bypass a link shortener or ad-link",
    category: "Bypass",
    permissions: "Everyone",
    usage: "/bypass <url>",
    examples: ["/bypass https://linkvertise.com/...", "/bypass https://loot-link.com/..."],
  },
  {
    name: "/executor",
    description: "Check the status of a specific Roblox executor",
    category: "Status",
    permissions: "Everyone",
    usage: "/executor <name>",
    examples: ["/executor synapse", "/executor fluxus"],
  },
  {
    name: "/status",
    description: "Show the current status of all services",
    category: "Status",
    permissions: "Everyone",
    usage: "/status",
    examples: ["/status"],
  },
  {
    name: "/roblox",
    description: "Get the current Roblox version and update info",
    category: "Roblox",
    permissions: "Everyone",
    usage: "/roblox",
    examples: ["/roblox"],
  },
  {
    name: "/ping",
    description: "Check the bot latency and API response time",
    category: "Utility",
    permissions: "Everyone",
    usage: "/ping",
    examples: ["/ping"],
  },
  {
    name: "/help",
    description: "Show a list of all available commands",
    category: "Utility",
    permissions: "Everyone",
    usage: "/help [category]",
    examples: ["/help", "/help bypass"],
  },
  {
    name: "/invite",
    description: "Get the bot invite link to add it to your server",
    category: "Utility",
    permissions: "Everyone",
    usage: "/invite",
    examples: ["/invite"],
  },
  {
    name: "/support",
    description: "Get a link to the official support Discord server",
    category: "Utility",
    permissions: "Everyone",
    usage: "/support",
    examples: ["/support"],
  },
  {
    name: "/announce",
    description: "Send an announcement to the server (Admin only)",
    category: "Admin",
    permissions: "Administrator",
    usage: "/announce <message>",
    examples: ["/announce New executor update available!"],
  },
  {
    name: "/setprefix",
    description: "Change the bot command prefix for this server",
    category: "Admin",
    permissions: "Administrator",
    usage: "/setprefix <prefix>",
    examples: ["/setprefix !", "/setprefix ?"],
  },
  {
    name: "/ban",
    description: "Ban a user from using the bot in this server",
    category: "Moderation",
    permissions: "Manage Guild",
    usage: "/ban <user> [reason]",
    examples: ["/ban @user spamming bypass"],
  },
  {
    name: "/stats",
    description: "View detailed bot statistics and usage data",
    category: "Info",
    permissions: "Everyone",
    usage: "/stats",
    examples: ["/stats"],
  },
  {
    name: "/history",
    description: "View your personal bypass history",
    category: "Bypass",
    permissions: "Everyone",
    usage: "/history [limit]",
    examples: ["/history", "/history 10"],
  },
  {
    name: "/clear",
    description: "Clear your personal bypass history",
    category: "Bypass",
    permissions: "Everyone",
    usage: "/clear",
    examples: ["/clear"],
  },
  {
    name: "/uptime",
    description: "Show how long the bot has been online",
    category: "Info",
    permissions: "Everyone",
    usage: "/uptime",
    examples: ["/uptime"],
  },
];

router.get("/commands", (_req, res) => {
  res.json(COMMANDS);
});

export default router;

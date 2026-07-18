import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import router from "./routes";
import { logger } from "./lib/logger";
import { sessionMiddleware } from "./lib/session";

const app: Express = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // managed by frontend
  crossOriginEmbedderPolicy: false,
}));

// HTTP request logger — strips query params to avoid logging tokens
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// CORS — only allow the same Replit origin in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : true; // open in dev
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Session
app.use(sessionMiddleware);

// Body parsing — tight limits to prevent DoS
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Global rate limit: 200 req / 5 min per IP
const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
  skip: (req) => req.method === "OPTIONS",
});
app.use(globalLimiter);

app.use("/api", router);

export default app;

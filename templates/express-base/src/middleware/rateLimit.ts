import { rateLimit } from "express-rate-limit";
import { config } from "@/config/config";

const windowMs = 15 * 60 * 1000; // 15 minutes
const max = config.rateLimitMax ?? 100;

export const rateLimitMiddleware = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

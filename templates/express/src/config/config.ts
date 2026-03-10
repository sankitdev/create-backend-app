// dotenv is used to load environment variables from .env file
import "dotenv/config";

/**
 * This function is used to get the environment variables
 * It also give type safety and error handling if environment variable is not found
 * @param key The key of the environment variable
 * @param defaultValue The default value of the environment variable
 * @returns The value of the environment variable
 */
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const config = {
  port: parseInt(getEnv("PORT", "3000"), 10),
  mongoURI: getEnv("MONGO_URI"),
  nodeEnv: getEnv("NODE_ENV", "development"),

  // optional: used when rate limit or auth is enabled via features
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX ?? "100", 10),
  jwtSecret: process.env.JWT_SECRET,

  // computed values
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

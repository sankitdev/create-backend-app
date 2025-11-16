import "dotenv/config";

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

  // computed values
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

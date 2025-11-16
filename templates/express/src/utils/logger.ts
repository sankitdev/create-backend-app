import pino from "pino";
import { config } from "../config/config";

const { isProduction } = config;
export const logger = pino({
  level: isProduction ? "info" : "debug",
  transport: !isProduction
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
          ignore: "pid, hostname",
        },
      }
    : undefined,
});

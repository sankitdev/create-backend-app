import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { config } from "../config/config";

const { isDevelopment } = config;
export const errorHandler = (err: Error, req: Request, res: Response) => {
  logger.error(
    {
      error: err.message,
      stack: err.stack,
      method: req.method,
      path: req.path,
    },
    "Request error"
  );

  res.status(500).json({
    success: false,
    message: isDevelopment ? err.message : "Internal server error",
    ...(isDevelopment && { stack: err.stack }),
  });
};

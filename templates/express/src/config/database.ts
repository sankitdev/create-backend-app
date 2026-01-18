import mongoose from "mongoose";
import { config } from "@/config/config";
import { logger } from "@/utils/logger";
import { MESSAGES } from "@/constants/messages";

/**
 * This function is used to connect to the database
 * It is called in app.ts before starting server
 *
 * Note: If the connection fails, the server will not start
 */
export const connectDb = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    logger.info(MESSAGES.DATABASE_SUCCESS);
  } catch (error) {
    logger.error({ error }, MESSAGES.DATABASE_ERROR);
    process.exit(1);
  }
};

import mongoose from "mongoose";
import { config } from "./config";
import { logger } from "../utils/logger";
import { MESSAGES } from "../constants/messages";

export const connectDb = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    logger.info(MESSAGES.DATABASE_SUCCESS);
  } catch (error) {
    logger.error({ error }, MESSAGES.DATABASE_ERROR);
    process.exit(1);
  }
};

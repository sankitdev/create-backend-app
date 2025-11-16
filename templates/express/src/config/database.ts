import mongoose from "mongoose";
import { config } from "./config";
import { logger } from "../utils/logger";

export const connectDb = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    logger.info("Connected to Mongo DB");
  } catch (error) {
    logger.error({ error }, "Error while connecting to MongoDB");
    process.exit(1);
  }
};

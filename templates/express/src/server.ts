import { app } from "./app";
import { config } from "./config/config";
import { connectDb } from "./config/database";
import { logger } from "./utils/logger";

const startServer = async () => {
  try {
    // Connect to database
    await connectDb();

    // Start server
    app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`📝 Environment: ${config.nodeEnv}`);
      logger.info(`🔗 Health: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    logger.error({ error }, "Failed to start server");
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled Rejection");
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error({ error }, "Uncaught Exception");
  process.exit(1);
});

startServer();

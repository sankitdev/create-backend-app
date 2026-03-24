import { PrismaClient } from "@prisma/client";
import { logger } from "@/utils/logger";
import { MESSAGES } from "@/constants/messages";

/**
 * Prisma client singleton
 * Ensures only one instance of PrismaClient is created across the app
 */
const prisma = new PrismaClient();

/**
 * This function is used to connect to the database
 * It is called in server.ts before starting server
 *
 * Note: If the connection fails, the server will not start
 */
export const connectDb = async () => {
  try {
    await prisma.$connect();
    logger.info(MESSAGES.DATABASE_SUCCESS);
  } catch (error) {
    logger.error({ error }, MESSAGES.DATABASE_ERROR);
    process.exit(1);
  }
};

/**
 * Export the prisma client for use in services
 */
export { prisma };

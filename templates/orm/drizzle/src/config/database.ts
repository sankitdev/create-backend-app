import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { config } from "@/config/config";
import { logger } from "@/utils/logger";
import { MESSAGES } from "@/constants/messages";
import * as schema from "@/db/schema";

const { Pool } = pg;

/**
 * Create PostgreSQL connection pool
 */
const pool = new Pool({
  connectionString: config.databaseUrl,
});

/**
 * Create Drizzle ORM instance with schema
 */
export const db = drizzle(pool, { schema });

/**
 * This function is used to connect to the database
 * It is called in server.ts before starting server
 *
 * Note: If the connection fails, the server will not start
 */
export const connectDb = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    client.release();
    logger.info(MESSAGES.DATABASE_SUCCESS);
  } catch (error) {
    logger.error({ error }, MESSAGES.DATABASE_ERROR);
    process.exit(1);
  }
};

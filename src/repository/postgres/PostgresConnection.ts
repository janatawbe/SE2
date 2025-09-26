import { Pool } from "pg";
import dotenv from "dotenv";
import logger from "../../util/logger";
import { DatabaseConnectionException } from "../../util/exceptions/DatabaseConnectionException";

dotenv.config();

export class PostgresConnection {
  private static pool: Pool | null = null;

  private constructor() {}

  static init(): void {
    try {
      if (!this.pool) {
        const url = process.env.DATABASE_URL;
        if (!url) {
          throw new Error("DATABASE_URL not set");
        }
        this.pool = new Pool({
          connectionString: url,
          ssl: { rejectUnauthorized: false },
        });
        logger.info("PostgreSQL pool initialized");
      }
    } catch (err) {
      throw new DatabaseConnectionException("Failed to initialize Postgres", err as Error);
    }
  }

  static getPool(): Pool {
    if (!this.pool) {
      throw new Error("DB not initialized. Call PostgresConnection.init() first.");
    }
    return this.pool;
  }
}
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import logger from "../../util/logger";
import { DatabaseConnectionException } from "../../util/exceptions/DatabaseConnectionException";
import config from "../../config";

export class ConnectionManager {
    private static db: Database | null = null;

    private constructor() {}

    public static async getConnection(): Promise<Database> {
        if (this.db === null) {
            try {
                this.db = await open({
                    filename: config.storagePath.sqlite,
                    driver: sqlite3.Database
                });
                logger.info("Database connection established.");
            } catch (error: unknown) {
                logger.error("Failed to connect to database", error as Error);
                throw new DatabaseConnectionException("Failed to connect to database", error as Error);
            }
        }

        return this.db;
    }
}

import fs from "fs";
import logger from "./logger";

export function parseJSON<T = unknown>(filePath: string): T {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const text = raw.trim();

    if (!text) {
      throw new Error("Empty JSON file");
    }

    return JSON.parse(text) as T;
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error("JSON parse failed for %s: %o", filePath, err);
      throw new Error(`Invalid JSON at ${filePath}: ${err.message}`);
    } else {
      logger.error("JSON parse failed for %s: Unknown error", filePath);
      throw new Error(`Invalid JSON at ${filePath}: Unknown error`);
    }
  }
}

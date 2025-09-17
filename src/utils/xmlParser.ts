import fs from "fs";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import logger from "./logger";

export function parseXML<T = unknown>(filePath: string): T {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const text = raw.trim();

    if (!text) {
      throw new Error("Empty XML file");
    }

    // Validate XML before parsing
    const validationResult = XMLValidator.validate(text);
    if (validationResult !== true) {
      const errorMessage =
        typeof validationResult === "object" && "err" in validationResult
          ? validationResult.err?.msg ?? "Unknown error"
          : "Unknown error";
      throw new Error(`Invalid XML at ${filePath}: ${errorMessage}`);
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@",
      allowBooleanAttributes: true,
      parseAttributeValue: true,
      trimValues: true,
    });

    const result = parser.parse(text);
    return result as T;
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error("XML parse failed for %s: %o", filePath, err);
      throw new Error(`XML parse failed for ${filePath}: ${err.message}`);
    } else {
      logger.error("XML parse failed for %s: Unknown error", filePath);
      throw new Error(`XML parse failed for ${filePath}: Unknown error`);
    }
  }
}

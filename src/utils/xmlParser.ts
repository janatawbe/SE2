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
    const valid = XMLValidator.validate(text);
    if (valid !== true) {
      throw new Error(
        `Invalid XML at ${filePath}: ${(valid as any).err?.msg ?? "Unknown error"}`
      );
    }

    const parser = new XMLParser({
      ignoreAttributes: false, // keep attributes like <tag attr="value">
      attributeNamePrefix: "@", // attributes will have '@' prefix
      allowBooleanAttributes: true,
      parseAttributeValue: true,
      trimValues: true,
    });

    const result = parser.parse(text);
    return result as T;
  } catch (err: any) {
    logger.error("XML parse failed for %s: %o", filePath, err);
    throw new Error(`XML parse failed for ${filePath}: ${err.message}`);
  }
}
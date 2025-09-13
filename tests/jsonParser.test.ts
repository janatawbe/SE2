import path from "path";
import fs from "fs";
import { parseJSON } from "../src/utils/jsonParser";

const dataPath = (fileName: string) =>
  path.join(__dirname, "..", "src", "data", fileName);

describe("parseJSON", () => {
  test("parses a valid JSON file", () => {
    const file = dataPath("book orders.json");
    const result = parseJSON<any>(file);

    expect(result).toBeTruthy();
    expect(typeof result).toBe("object");
  });

  test("throws an error for empty JSON file", () => {
    const file = dataPath("empty.json");
    fs.writeFileSync(file, ""); // create empty file

    expect(() => parseJSON(file)).toThrow("Empty JSON file");

    fs.unlinkSync(file); // cleanup
  });

  test("throws an error for invalid JSON", () => {
    const file = dataPath("invalid.json");
    fs.writeFileSync(file, "{ not valid json }");

    expect(() => parseJSON(file)).toThrow();

    fs.unlinkSync(file);
  });

  test("throws an error for malformed JSON structure", () => {
    const file = dataPath("malformed.json");
    // Missing closing brace
    fs.writeFileSync(file, '{"id": 1, "name": "Book"');

    expect(() => parseJSON(file)).toThrow();

    fs.unlinkSync(file); // cleanup
  });
});
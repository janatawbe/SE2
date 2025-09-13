import path from "path";
import fs from "fs";
import { parseXML } from "../src/utils/xmlParser";

const dataPath = (fileName: string) =>
  path.join(__dirname, "..", "src", "data", fileName);

describe("parseXML", () => {
  test("parses a valid XML file", () => {
    const file = dataPath("toy orders.xml");
    const result = parseXML<any>(file);

    expect(result).toBeTruthy();
    expect(typeof result).toBe("object");
  });

  test("throws an error for empty XML file", () => {
    const file = dataPath("empty.xml");
    fs.writeFileSync(file, ""); // create empty file

    expect(() => parseXML(file)).toThrow("Empty XML file");

    fs.unlinkSync(file); // cleanup
  });

  test("throws an error for invalid XML", () => {
    const file = dataPath("invalid.xml");
    fs.writeFileSync(file, "<root><unclosed></root>");

    expect(() => parseXML(file)).toThrow();

    fs.unlinkSync(file); // cleanup
  });

  test("throws an error for malformed XML structure", () => {
    const file = dataPath("malformed.xml");
    // Missing closing tag for <order>
    fs.writeFileSync(file, "<orders><order><id>1</id></order");

    expect(() => parseXML(file)).toThrow();

    fs.unlinkSync(file); // cleanup
});
});
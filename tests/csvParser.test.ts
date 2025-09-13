import path from "path";
import fs from "fs";
import { parseCSV } from "../src/utils/csvParser";

const dataPath = (fileName: string) =>
  path.join(__dirname, "..", "src", "data", fileName);

describe("parseCSV", () => {
  test("parses a valid CSV file", async () => {
    const file = dataPath("cake orders.csv");
    const rows = await parseCSV(file);

    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
  });

  test("throws an error for missing file", async () => {
    const file = dataPath("not-exist.csv");
    await expect(parseCSV(file)).rejects.toThrow();
  });

  test("handles an empty CSV file", async () => {
    const file = dataPath("empty.csv");
    fs.writeFileSync(file, ""); // create empty CSV

    const rows = await parseCSV(file);
    expect(rows).toEqual([]); // should return an empty array

    fs.unlinkSync(file); // cleanup
  });

  test("handles malformed CSV rows (uneven columns)", async () => {
    const file = dataPath("malformed.csv");
    // First row has 3 columns, second row only 2
    fs.writeFileSync(file, "id,name,price\n1,Book\n2,Pen,1.5");

    const rows = await parseCSV(file);

    // Parser won't throw — it just splits whatever it sees.
    // So we expect uneven row lengths.
    expect(rows[0].length).toBe(3);
    expect(rows[1].length).toBeLessThan(3);

    fs.unlinkSync(file); // cleanup
});
});
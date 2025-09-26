import { CSVCakeMapper } from "../../src/mappers/cake.mapper";
import { Cake } from "../../src/model/cake.model";

describe("CSVCakeMapper", () => {
  const rowOk = [
    "42",                 // id
    "Birthday", "Vanilla", "Strawberry", "Medium", "2",
    "Buttercream", "Vanilla",
    "Sprinkles", "Rainbow",
    "Happy", "Round", "None", "None", "Box",
    "30", "3"             // price, quantity
  ];

  it("maps a valid CSV row to Cake", () => {
    const cake = new CSVCakeMapper().map(rowOk);
    expect(cake).toBeInstanceOf(Cake);
  });

  it("throws on malformed row (too short)", () => {
    const bad = ["id", "OnlyOneField"];
    expect(() => new CSVCakeMapper().map(bad)).toThrow("Malformed CSV row for Cake");
  });

  it("throws when a required field is missing (builder check)", () => {
    const bad = [...rowOk];
    bad[2] = undefined as any; // flavor missing instead of empty string
    expect(() => new CSVCakeMapper().map(bad)).toThrow("Missing required property for Cake");
  });
});
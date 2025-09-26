import { XMLToyMapper } from "../src/mappers/toy.mapper";
import { Toy } from "../src/model/toy.model";

describe("XMLToyMapper", () => {
  const ok = {
    type: "Robot",
    ageGroup: "6+",
    brand: "RoboCo",
    material: "Plastic",
    batteryRequired: "Yes",
    educational: "STEM"
  };

  it("maps a valid node to Toy", () => {
    const toy = new XMLToyMapper().map(ok);
    expect(toy).toBeInstanceOf(Toy);
  });

  it("throws on malformed node", () => {
    expect(() => new XMLToyMapper().map(undefined as any)).toThrow("Malformed XML node for Toy");
  });

  it("throws when a required field is empty (builder validation)", () => {
    const bad = { ...ok, brand: "" };
    expect(() => new XMLToyMapper().map(bad)).toThrow("Missing required property for Toy");
  });
});
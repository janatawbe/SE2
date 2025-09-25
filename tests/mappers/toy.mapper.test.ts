import { XMLToyMapper } from "../../src/mappers/toy.mapper";
import { Toy } from "../../src/model/toy.model";

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

  it("fills missing fields with empty string", () => {
    const bad = { ...ok, brand: undefined as any };
    const toy = new XMLToyMapper().map(bad);
    expect(toy).toBeInstanceOf(Toy);
    expect(toy.getBrand()).toBe(""); // empty string instead of error
  });
});
import { ToyBuilder } from "../../src/model/builders/toy.builder";
import { Toy } from "../../src/model/toy.model";

function makeValidToyBuilder() {
  return new ToyBuilder()
    .setType("Robot")
    .setAgeGroup("6+")
    .setBrand("RoboCo")
    .setMaterial("Plastic")
    .setBatteryRequired("Yes")
    .setEducational("STEM");
}

describe("ToyBuilder", () => {
  it("builds a Toy when all fields are set", () => {
    const toy = makeValidToyBuilder().build();
    expect(toy).toBeInstanceOf(Toy);
  });

  it("throws when a required field is missing (undefined)", () => {
    // leave out batteryRequired
    const builder = new ToyBuilder()
      .setType("Robot")
      .setAgeGroup("6+")
      .setBrand("RoboCo")
      .setMaterial("Plastic")
      // .setBatteryRequired("Yes")  <-- intentionally missing
      .setEducational("STEM");

    expect(() => builder.build()).toThrow("Missing required property for Toy");
  });

  it("throws when a field has the wrong type", () => {
    const builder = makeValidToyBuilder();
    (builder as any).setMaterial(true); // wrong type
    expect(() => builder.build()).toThrow("Incorrect data type for Toy");
  });
});
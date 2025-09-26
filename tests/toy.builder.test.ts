import { ToyBuilder } from "../src/model/builders/toy.builder";
import { Toy } from "../src/model/toy.model";

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

  it("throws on missing/empty field", () => {
    const builder = makeValidToyBuilder().setBatteryRequired("");
    expect(() => builder.build()).toThrow("Missing required property for Toy");
  });

  it("throws on incorrect data type", () => {
    const builder = makeValidToyBuilder();
    (builder as any).setMaterial(true);
    expect(() => builder.build()).toThrow("Incorrect data type for Toy");
  });
});
import { CakeBuilder } from "../../src/model/builders/cake.builder";
import { Cake } from "../../src/model/cake.model";

function makeValidCakeBuilder() {
  return new CakeBuilder()
    .setType("Birthday")
    .setFlavor("Vanilla")
    .setFilling("Strawberry")
    .setSize("Medium")
    .setLayers("2")
    .setFrostingType("Buttercream")
    .setFrostingFlavor("Vanilla")
    .setDecorationType("Sprinkles")
    .setDecorationColor("Rainbow")
    .setCustomMessage("Happy Day")
    .setShape("Round")
    .setAllergies("None")
    .setSpecialIngredients("None")
    .setPackagingType("Box");
}

describe("CakeBuilder", () => {
  it("builds a Cake when all fields are set", () => {
    const cake = makeValidCakeBuilder().build();
    expect(cake).toBeInstanceOf(Cake);
  });

  it("throws when a required field is missing (undefined)", () => {
    // Don't set flavor → simulate missing required property
    const builder = new CakeBuilder()
      .setType("Birthday")
      // .setFlavor("Vanilla")  <-- intentionally missing
      .setFilling("Strawberry")
      .setSize("Medium")
      .setLayers("2")
      .setFrostingType("Buttercream")
      .setFrostingFlavor("Vanilla")
      .setDecorationType("Sprinkles")
      .setDecorationColor("Rainbow")
      .setCustomMessage("Happy Day")
      .setShape("Round")
      .setAllergies("None")
      .setSpecialIngredients("None")
      .setPackagingType("Box");

    expect(() => builder.build()).toThrow("Missing required property for Cake");
  });

  it("throws when a field has the wrong type", () => {
    const builder = makeValidCakeBuilder();
    // pass a number as any to simulate wrong runtime type
    (builder as any).setLayers(2);
    expect(() => builder.build()).toThrow("Incorrect data type for Cake");
  });
});
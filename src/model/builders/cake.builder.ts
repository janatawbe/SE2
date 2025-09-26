import logger from "../../util/logger";
import { Cake, IdentifiableCake } from "../cake.model";

export class CakeBuilder {
  private type!: string;
  private flavor!: string;
  private filling!: string;
  private size!: string;
  private layers!: string;
  private frostingType!: string;
  private frostingFlavor!: string;
  private decorationType!: string;
  private decorationColor!: string;
  private customMessage!: string;
  private shape!: string;
  private allergies!: string;
  private specialIngredients!: string;
  private packagingType!: string;

  public static newBuilder(): CakeBuilder {
    return new CakeBuilder();
  }

  setType(type: string): CakeBuilder { this.type = type; return this; }
  setFlavor(flavor: string): CakeBuilder { this.flavor = flavor; return this; }
  setFilling(filling: string): CakeBuilder { this.filling = filling; return this; }
  setSize(size: string): CakeBuilder { this.size = size; return this; }
  setLayers(layers: string): CakeBuilder { this.layers = layers; return this; }
  setFrostingType(frostingType: string): CakeBuilder { this.frostingType = frostingType; return this; }
  setFrostingFlavor(frostingFlavor: string): CakeBuilder { this.frostingFlavor = frostingFlavor; return this; }
  setDecorationType(decorationType: string): CakeBuilder { this.decorationType = decorationType; return this; }
  setDecorationColor(decorationColor: string): CakeBuilder { this.decorationColor = decorationColor; return this; }
  setCustomMessage(customMessage: string): CakeBuilder { this.customMessage = customMessage; return this; }
  setShape(shape: string): CakeBuilder { this.shape = shape; return this; }
  setAllergies(allergies: string): CakeBuilder { this.allergies = allergies; return this; }
  setSpecialIngredients(specialIngredients: string): CakeBuilder { this.specialIngredients = specialIngredients; return this; }
  setPackagingType(packagingType: string): CakeBuilder { this.packagingType = packagingType; return this; }

  build(): Cake {
    const required = [
      ["type", this.type],
      ["flavor", this.flavor],
      ["filling", this.filling],
      ["size", this.size],
      ["layers", this.layers],
      ["frostingType", this.frostingType],
      ["frostingFlavor", this.frostingFlavor],
      ["decorationType", this.decorationType],
      ["decorationColor", this.decorationColor],
      ["customMessage", this.customMessage],
      ["shape", this.shape],
      ["allergies", this.allergies],
      ["specialIngredients", this.specialIngredients],
      ["packagingType", this.packagingType],
    ];

    for (const [name, value] of required) {
      if (value === undefined || value === null) {
        logger.error(`Missing required field "${name}" for Cake`);
        throw new Error("Missing required property for Cake");
      }
      if (typeof value !== "string") {
        logger.error(`Incorrect data type for "${name}" (expected string)`);
        throw new Error("Incorrect data type for Cake");
      }
    }

    return new Cake(
      this.type,
      this.flavor,
      this.filling,
      this.size,
      this.layers,
      this.frostingType,
      this.frostingFlavor,
      this.decorationType,
      this.decorationColor,
      this.customMessage,
      this.shape,
      this.allergies,
      this.specialIngredients,
      this.packagingType
    );
  }
}

export class IdentifiableCakeBuilder {
  private id!: string;
  private cake!: Cake;

  static newBuilder(): IdentifiableCakeBuilder {
    return new IdentifiableCakeBuilder();
  }

  setId(id: string): IdentifiableCakeBuilder { this.id = id; return this; }
  setCake(cake: Cake): IdentifiableCakeBuilder { this.cake = cake; return this; }

  build(): IdentifiableCake {
    if (!this.id || !this.cake) {
      logger.error("Missing required property for IdentifiableCake");
      throw new Error("Missing required property for IdentifiableCake");
    }
    return new IdentifiableCake(
      this.id,
      this.cake.getType(),
      this.cake.getFlavor(),
      this.cake.getFilling(),
      this.cake.getSize(),
      this.cake.getLayers(),
      this.cake.getFrostingType(),
      this.cake.getFrostingFlavor(),
      this.cake.getDecorationType(),
      this.cake.getDecorationColor(),
      this.cake.getCustomMessage(),
      this.cake.getShape(),
      this.cake.getAllergies(),
      this.cake.getSpecialIngredients(),
      this.cake.getPackagingType()
    );
  }
}
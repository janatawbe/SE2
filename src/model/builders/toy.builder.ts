import logger from "../../util/logger";
import { Toy, IdentifiableToy } from "../toy.model";

export class ToyBuilder {
  private type!: string;
  private ageGroup!: string;
  private brand!: string;
  private material!: string;
  private batteryRequired!: string;
  private educational!: string;

  public static newBuilder(): ToyBuilder {
    return new ToyBuilder();
  }

  setType(type: string): ToyBuilder { this.type = type; return this; }
  setAgeGroup(ageGroup: string): ToyBuilder { this.ageGroup = ageGroup; return this; }
  setBrand(brand: string): ToyBuilder { this.brand = brand; return this; }
  setMaterial(material: string): ToyBuilder { this.material = material; return this; }
  setBatteryRequired(batteryRequired: string): ToyBuilder { this.batteryRequired = batteryRequired; return this; }
  setEducational(educational: string): ToyBuilder { this.educational = educational; return this; }

  build(): Toy {
    const required = [
      ["type", this.type],
      ["ageGroup", this.ageGroup],
      ["brand", this.brand],
      ["material", this.material],
      ["batteryRequired", this.batteryRequired],
      ["educational", this.educational],
    ];

    for (const [name, value] of required) {
      if (value === undefined || value === null) {
        logger.error(`Missing required field "${name}" for Toy`);
        throw new Error("Missing required property for Toy");
      }
      if (typeof value !== "string") {
        logger.error(`Incorrect data type for "${name}" (expected string)`);
        throw new Error("Incorrect data type for Toy");
      }
    }

    return new Toy(
      this.type,
      this.ageGroup,
      this.brand,
      this.material,
      this.batteryRequired,
      this.educational
    );
  }
}

export class IdentifiableToyBuilder {
  private id!: string;
  private toy!: Toy;

  static newBuilder(): IdentifiableToyBuilder {
    return new IdentifiableToyBuilder();
  }

  setId(id: string): IdentifiableToyBuilder { this.id = id; return this; }
  setToy(toy: Toy): IdentifiableToyBuilder { this.toy = toy; return this; }

  build(): IdentifiableToy {
    if (!this.id || !this.toy) {
      logger.error("Missing required property for IdentifiableToy");
      throw new Error("Missing required property for IdentifiableToy");
    }

    return new IdentifiableToy(
      this.id,
      this.toy.getType(),
      this.toy.getAgeGroup(),
      this.toy.getBrand(),
      this.toy.getMaterial(),
      this.toy.getBatteryRequired(),
      this.toy.getEducational()
    );
  }
}

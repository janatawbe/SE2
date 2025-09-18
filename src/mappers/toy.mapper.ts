import { IMapper } from "./IMapper";
import { Toy } from "../model/toy.model";
import { ToyBuilder } from "../model/builders/toy.builder";

export class XMLToyMapper implements IMapper<any, Toy> {
  map(node: any): Toy {
    if (!node || typeof node !== "object") {
      throw new Error("Malformed XML node for Toy");
    }

    // Helper to get either Capitalized or lower-case key
    const g = (A: string, a: string) => {
      const v = node[A] ?? node[a];
      return v === undefined || v === null ? "" : String(v);
    };

    return ToyBuilder.newBuilder()
      .setType(g("Type", "type"))
      .setAgeGroup(g("AgeGroup", "ageGroup"))
      .setBrand(g("Brand", "brand"))
      .setMaterial(g("Material", "material"))
      .setBatteryRequired(g("BatteryRequired", "batteryRequired"))
      .setEducational(g("Educational", "educational"))
      .build();
  }
}
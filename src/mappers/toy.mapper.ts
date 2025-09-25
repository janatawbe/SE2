import { IMapper } from "./IMapper";
import { IdentifiableToy, Toy } from "../model/toy.model";
import { IdentifiableToyBuilder, ToyBuilder } from "../model/builders/toy.builder";

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

  reverseMap(data: Toy) {
    throw new Error("Method not implemented.");
  }
}

export interface PostgresToy {
  id: string;
  type: string;
  age_group: string;
  brand: string;
  material: string;
  battery_required: string;
  educational: string;
}

export class PostgresToyMapper implements IMapper<PostgresToy, IdentifiableToy> {
  map(data: PostgresToy): IdentifiableToy {
    return IdentifiableToyBuilder.newBuilder()
      .setId(data.id)
      .setToy(
        ToyBuilder.newBuilder()
          .setType(data.type)
          .setAgeGroup(data.age_group)
          .setBrand(data.brand)
          .setMaterial(data.material)
          .setBatteryRequired(data.battery_required)
          .setEducational(data.educational)
          .build()
      )
      .build();
  }

  reverseMap(data: IdentifiableToy): PostgresToy {
    return {
      id: data.getId(),
      type: data.getType(),
      age_group: data.getAgeGroup(),
      brand: data.getBrand(),
      material: data.getMaterial(),
      battery_required: data.getBatteryRequired(),
      educational: data.getEducational(),
    };
  }
}

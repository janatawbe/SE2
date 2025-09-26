import { Cake } from "../model/cake.model";
import { IMapper } from "./IMapper";
import { CakeBuilder } from "../model/builders/cake.builder";

export class CSVCakeMapper implements IMapper<string[], Cake> {
  map(data: string[]): Cake {
    // basic malformed check: expect at least id + 14 cake fields + price + qty = 17 columns
    if (!Array.isArray(data) || data.length < 17) {
      throw new Error("Malformed CSV row for Cake");
    }

    return CakeBuilder.newBuilder()
      .setType(data[1])
      .setFlavor(data[2])
      .setFilling(data[3])
      .setSize(data[4])
      .setLayers(data[5])
      .setFrostingType(data[6])
      .setFrostingFlavor(data[7])
      .setDecorationType(data[8])
      .setDecorationColor(data[9])
      .setCustomMessage(data[10])
      .setShape(data[11])
      .setAllergies(data[12])
      .setSpecialIngredients(data[13])
      .setPackagingType(data[14])
      .build();
  }
}
import { Cake, IdentifiableCake } from "../model/cake.model";
import { IMapper } from "./IMapper";
import { CakeBuilder, IdentifiableCakeBuilder } from "../model/builders/cake.builder";

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

  reverseMap(data: Cake): string[] {
    return [
      data.getType(),
      data.getFlavor(),
      data.getFilling(),
      data.getSize(),
      data.getLayers().toString(),
      data.getFrostingType(),
      data.getFrostingFlavor(),
      data.getDecorationType(),
      data.getDecorationColor(),
      data.getCustomMessage(),
      data.getShape(),
      data.getAllergies(),
      data.getSpecialIngredients(),
      data.getPackagingType()
    ];
  }
}

export interface PostgresCake {
  id: string;
  type: string;
  flavor: string;
  filling: string;
  size: string;
  layers: string;            
  frosting_type: string;
  frosting_flavor: string;
  decoration_type: string;
  decoration_color: string;
  custom_message: string;
  shape: string;
  allergies: string;
  special_ingredients: string;
  packaging_type: string;
}

export class PostgresCakeMapper implements IMapper<PostgresCake, IdentifiableCake> {
  map(data: PostgresCake): IdentifiableCake {
    return IdentifiableCakeBuilder.newBuilder()
      .setCake(CakeBuilder.newBuilder()
        .setType(data.type)
        .setFlavor(data.flavor)
        .setFilling(data.filling)
        .setSize(data.size)
        .setLayers(data.layers.toString()) // builder expects string, so convert
        .setFrostingType(data.frosting_type)
        .setFrostingFlavor(data.frosting_flavor)
        .setDecorationType(data.decoration_type)
        .setDecorationColor(data.decoration_color)
        .setCustomMessage(data.custom_message)
        .setShape(data.shape)
        .setAllergies(data.allergies)
        .setSpecialIngredients(data.special_ingredients)
        .setPackagingType(data.packaging_type)
        .build())
      .setId(data.id)
      .build();
  }

  reverseMap(data: IdentifiableCake): PostgresCake {
    return {
      id: data.getId(),
      type: data.getType(),
      flavor: data.getFlavor(),
      filling: data.getFilling(),
      size: data.getSize(),
      layers: data.getLayers(), // convert back to number
      frosting_type: data.getFrostingType(),
      frosting_flavor: data.getFrostingFlavor(),
      decoration_type: data.getDecorationType(),
      decoration_color: data.getDecorationColor(),
      custom_message: data.getCustomMessage(),
      shape: data.getShape(),
      allergies: data.getAllergies(),
      special_ingredients: data.getSpecialIngredients(),
      packaging_type: data.getPackagingType()
    };
  }
}

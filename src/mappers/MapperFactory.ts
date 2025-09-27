import { ItemCategory } from "../model/IItem";
import { CSVCakeMapper } from "./cake.mapper";
import { JSONBookMapper } from "./book.mapper";
import { XMLToyMapper } from "./toy.mapper";

export enum MapperType {
  CSV,
  JSON,
  XML,
}

export class MapperFactory {
  static create(category: ItemCategory, type: MapperType) {
    switch (category) {
      case ItemCategory.CAKE:
        if (type === MapperType.CSV) return new CSVCakeMapper();
        break;

      case ItemCategory.BOOK:
        if (type === MapperType.JSON) return new JSONBookMapper();
        break;

      case ItemCategory.TOY:
        if (type === MapperType.XML) return new XMLToyMapper();
        break;
    }

    throw new Error(`Unsupported mapper for category=${category} and type=${MapperType[type]}`);
  }
}
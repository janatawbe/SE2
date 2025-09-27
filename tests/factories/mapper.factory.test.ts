import { MapperFactory, MapperType } from "../../src/mappers/MapperFactory";
import { ItemCategory } from "../../src/model/IItem";
import { CSVCakeMapper } from "../../src/mappers/cake.mapper";
import { JSONBookMapper } from "../../src/mappers/book.mapper";
import { XMLToyMapper } from "../../src/mappers/toy.mapper";

describe("MapperFactory", () => {
  it("returns CSVCakeMapper for CAKE + CSV", () => {
    const mapper = MapperFactory.create(ItemCategory.CAKE, MapperType.CSV);
    expect(mapper).toBeInstanceOf(CSVCakeMapper);
  });

  it("returns JSONBookMapper for BOOK + JSON", () => {
    const mapper = MapperFactory.create(ItemCategory.BOOK, MapperType.JSON);
    expect(mapper).toBeInstanceOf(JSONBookMapper);
  });

  it("returns XMLToyMapper for TOY + XML", () => {
    const mapper = MapperFactory.create(ItemCategory.TOY, MapperType.XML);
    expect(mapper).toBeInstanceOf(XMLToyMapper);
  });

  it("throws error for unsupported combination", () => {
    expect(() => MapperFactory.create(ItemCategory.CAKE, MapperType.XML)).toThrow(
      "Unsupported mapper for category=cake and type=XML"
    );
  });
});
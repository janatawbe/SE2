import { JSONBookMapper } from "../src/mappers/book.mapper";
import { Book } from "../src/model/book.model";

describe("JSONBookMapper", () => {
  const ok = {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    format: "Hardcover",
    language: "EN",
    publisher: "Chilton",
    specialEdition: "None",
    packaging: "Shrinkwrap"
  };

  it("maps a valid object to Book", () => {
    const book = new JSONBookMapper().map(ok);
    expect(book).toBeInstanceOf(Book);
  });

  it("throws on malformed input", () => {
    expect(() => new JSONBookMapper().map(null as any)).toThrow("Malformed JSON for Book");
  });

  it("throws on incorrect data types (builder validation)", () => {
    const bad = { ...ok, language: 123 as any };
    expect(() => new JSONBookMapper().map(bad)).toThrow("Incorrect data type for Book");
  });
});
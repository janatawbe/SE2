import { JSONBookMapper } from "../../src/mappers/book.mapper";
import { Book } from "../../src/model/book.model";

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

  it("converts non-string values to strings", () => {
    const withNumber = { ...ok, language: 123 as any };
    const book = new JSONBookMapper().map(withNumber);
    expect(book).toBeInstanceOf(Book);
    expect(book.getLanguage()).toBe("123"); // number turned into string
  });

  it("fills missing fields with empty string", () => {
    const incomplete = { ...ok };
    delete (incomplete as any).title; // required field missing

    const book = new JSONBookMapper().map(incomplete);
    expect(book).toBeInstanceOf(Book);
    expect(book.getTitle()).toBe(""); // mapper fills missing with ""
  });
});
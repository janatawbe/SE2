import { BookBuilder } from "../src/model/builders/book.builder";
import { Book } from "../src/model/book.model";

function makeValidBookBuilder() {
  return new BookBuilder()
    .setTitle("Dune")
    .setAuthor("Frank Herbert")
    .setGenre("Sci-Fi")
    .setFormat("Hardcover")
    .setLanguage("EN")
    .setPublisher("Chilton")
    .setSpecialEdition("None")
    .setPackaging("Shrinkwrap");
}

describe("BookBuilder", () => {
  it("builds a Book when all fields are set", () => {
    const book = makeValidBookBuilder().build();
    expect(book).toBeInstanceOf(Book);
  });

  it("throws on missing/empty field", () => {
    const builder = makeValidBookBuilder().setPackaging("");
    expect(() => builder.build()).toThrow("Missing required property for Book");
  });

  it("throws on incorrect data type", () => {
    const builder = makeValidBookBuilder();
    (builder as any).setLanguage(123);
    expect(() => builder.build()).toThrow("Incorrect data type for Book");
  });
});
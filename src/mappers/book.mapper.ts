import { IMapper } from "./IMapper";
import { Book } from "../model/book.model";
import { BookBuilder } from "../model/builders/book.builder";

export class JSONBookMapper implements IMapper<any, Book> {
  map(obj: any): Book {
    if (obj == null || typeof obj !== "object") {
      throw new Error("Malformed JSON for Book");
    }

    // Expect keys: title, author, genre, format, language, publisher, specialEdition, packaging
    // Convert everything to string so the builder's validation can run consistently
    const s = (v: unknown) => (v === undefined || v === null ? "" : String(v));

    return BookBuilder.newBuilder()
      .setTitle(s(obj.title))
      .setAuthor(s(obj.author))
      .setGenre(s(obj.genre))
      .setFormat(s(obj.format))
      .setLanguage(s(obj.language))
      .setPublisher(s(obj.publisher))
      .setSpecialEdition(s(obj.specialEdition))
      .setPackaging(s(obj.packaging))
      .build();
  }
}
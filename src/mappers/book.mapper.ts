import { IMapper } from "./IMapper";
import { Book, IdentifiableBook } from "../model/book.model";
import { BookBuilder, IdentifiableBookBuilder } from "../model/builders/book.builder";

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

  reverseMap(data: Book) {
    throw new Error("Method not implemented.");
  }
}

export interface PostgresBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  format: string;
  language: string;
  publisher: string;
  special_edition: string;
  packaging: string;
}

export class PostgresBookMapper implements IMapper<PostgresBook, IdentifiableBook> {
  map(data: PostgresBook): IdentifiableBook {
    return IdentifiableBookBuilder.newBuilder()
      .setId(data.id)
      .setBook(BookBuilder.newBuilder()
        .setTitle(data.title)
        .setAuthor(data.author)
        .setGenre(data.genre)
        .setFormat(data.format)
        .setLanguage(data.language)
        .setPublisher(data.publisher)
        .setSpecialEdition(data.special_edition)
        .setPackaging(data.packaging)
        .build())
      .build();
  }

  reverseMap(data: IdentifiableBook): PostgresBook {
    return {
      id: data.getId(),
      title: data.getTitle(),
      author: data.getAuthor(),
      genre: data.getGenre(),
      format: data.getFormat(),
      language: data.getLanguage(),
      publisher: data.getPublisher(),
      special_edition: data.getSpecialEdition(),
      packaging: data.getPackaging(),
    };
  }
}

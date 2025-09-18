import logger from "../../utils/logger";
import { Book } from "../book.model";

export class BookBuilder {
  private title!: string;
  private author!: string;
  private genre!: string;
  private format!: string;
  private language!: string;
  private publisher!: string;
  private specialEdition!: string;
  private packaging!: string;

  public static newBuilder(): BookBuilder {
    return new BookBuilder();
  }

  setTitle(title: string): BookBuilder { this.title = title; return this; }
  setAuthor(author: string): BookBuilder { this.author = author; return this; }
  setGenre(genre: string): BookBuilder { this.genre = genre; return this; }
  setFormat(format: string): BookBuilder { this.format = format; return this; }
  setLanguage(language: string): BookBuilder { this.language = language; return this; }
  setPublisher(publisher: string): BookBuilder { this.publisher = publisher; return this; }
  setSpecialEdition(specialEdition: string): BookBuilder { this.specialEdition = specialEdition; return this; }
  setPackaging(packaging: string): BookBuilder { this.packaging = packaging; return this; }

  build(): Book {
    const required = [
      ["title", this.title],
      ["author", this.author],
      ["genre", this.genre],
      ["format", this.format],
      ["language", this.language],
      ["publisher", this.publisher],
      ["specialEdition", this.specialEdition],
      ["packaging", this.packaging],
    ];

    for (const [name, value] of required) {
      if (value === undefined || value === null) {
        logger.error(`Missing required field "${name}" for Book`);
        throw new Error("Missing required property for Book");
      }
      if (typeof value !== "string") {
        logger.error(`Incorrect data type for "${name}" (expected string)`);
        throw new Error("Incorrect data type for Book");
      }
    }

    return new Book(
      this.title,
      this.author,
      this.genre,
      this.format,
      this.language,
      this.publisher,
      this.specialEdition,
      this.packaging
    );
  }
}
import { PostgresConnection } from "./PostgresConnection";
import { IdentifiableBook } from "../../model/book.model";
import { id, Initializable, IRepository } from "../IRepository";
import {
  DbException,
  InitializationException,
  InvalidItemException,
  ItemNotFoundException
} from "../../util/exceptions/repositoryExceptions";
import logger from "../../util/logger";

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    format TEXT NOT NULL,
    language TEXT NOT NULL,
    publisher TEXT NOT NULL,
    specialEdition TEXT,
    packaging TEXT
  );
`;

const INSERT_BOOK = `
  INSERT INTO books (id, title, author, genre, format, language, publisher, specialEdition, packaging)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
`;

const SELECT_BOOK_BY_ID = `SELECT * FROM books WHERE id = $1;`;
const SELECT_ALL_BOOKS = `SELECT * FROM books;`;

const UPDATE_BOOK = `
  UPDATE books
  SET title=$2, author=$3, genre=$4, format=$5, language=$6,
      publisher=$7, specialEdition=$8, packaging=$9
  WHERE id=$1;
`;

const DELETE_BOOK = `DELETE FROM books WHERE id = $1;`;

export class BookRepository implements IRepository<IdentifiableBook>, Initializable {
  async init(): Promise<void> {
    try {
      await PostgresConnection.getPool().query(CREATE_TABLE);
      logger.info("Book table ensured in database.");
    } catch (err) {
      logger.error("Failed to init Book table", err);
      throw new InitializationException("Failed to init Book table", err as Error);
    }
  }

  async create(item: IdentifiableBook): Promise<id> {
    if (!item) throw new InvalidItemException("Invalid Book item");

    try {
      await PostgresConnection.getPool().query(INSERT_BOOK, [
        item.getId(),
        item.getTitle(),
        item.getAuthor(),
        item.getGenre(),
        item.getFormat(),
        item.getLanguage(),
        item.getPublisher(),
        item.getSpecialEdition(),
        item.getPackaging()
      ]);

      logger.info("Created book with id: %s", item.getId());
      return item.getId();
    } catch (err) {
      logger.error("Failed to create book", err);
      throw new DbException("Failed to create book", err as Error);
    }
  }

  async get(id: id): Promise<IdentifiableBook> {
    try {
      const result = await PostgresConnection.getPool().query(SELECT_BOOK_BY_ID, [id]);

      if (result.rows.length === 0)
        throw new ItemNotFoundException(`Book with id ${id} not found`);

      const row = result.rows[0];
      return new IdentifiableBook(
        row.id,
        row.title,
        row.author,
        row.genre,
        row.format,
        row.language,
        row.publisher,
        row.specialedition,
        row.packaging
      );
    } catch (err) {
      if (err instanceof ItemNotFoundException) throw err;

      logger.error("Failed to get book", err);
      throw new DbException("Failed to get book", err as Error);
    }
  }

  async getAll(): Promise<IdentifiableBook[]> {
    try {
      const result = await PostgresConnection.getPool().query(SELECT_ALL_BOOKS);
      return result.rows.map((row) =>
        new IdentifiableBook(
          row.id,
          row.title,
          row.author,
          row.genre,
          row.format,
          row.language,
          row.publisher,
          row.specialedition,
          row.packaging
        )
      );
    } catch (err) {
      logger.error("Failed to get all books", err);
      throw new DbException("Failed to get all books", err as Error);
    }
  }

  async update(item: IdentifiableBook): Promise<void> {
    try {
      await PostgresConnection.getPool().query(UPDATE_BOOK, [
        item.getId(),
        item.getTitle(),
        item.getAuthor(),
        item.getGenre(),
        item.getFormat(),
        item.getLanguage(),
        item.getPublisher(),
        item.getSpecialEdition(),
        item.getPackaging()
      ]);
    } catch (err) {
      logger.error("Failed to update book", err);
      throw new DbException("Failed to update book", err as Error);
    }
  }

  async delete(id: id): Promise<void> {
    try {
      await PostgresConnection.getPool().query(DELETE_BOOK, [id]);
    } catch (err) {
      logger.error("Failed to delete book", err);
      throw new DbException("Failed to delete book", err as Error);
    }
  }
}

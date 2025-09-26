import { BookRepository } from '../../src/repository/postgres/book.repository';
import { PostgresConnection } from '../../src/repository/postgres/PostgresConnection';
import { Book, IdentifiableBook } from '../../src/model/book.model';
import { InvalidItemException, ItemNotFoundException, DbException, InitializationException } from '../../src/util/exceptions/repositoryExceptions';
import logger from '../../src/util/logger';

jest.mock('../../src/repository/postgres/PostgresConnection', () => ({
  PostgresConnection: {
    getPool: jest.fn()
  }
}));

jest.mock('../../src/util/logger');

const mockQuery = jest.fn();

(PostgresConnection.getPool as jest.Mock).mockReturnValue({
  query: mockQuery
});

describe('BookRepository', () => {
  const repo = new BookRepository();

  const mockIdBook = new IdentifiableBook(
    'book-id-123',
    'Title',
    'Author',
    'Genre',
    'Format',
    'English',
    'Publisher',
    'Yes',
    'Box'
  );


  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('init()', () => {
    it('should initialize the table', async () => {
      mockQuery.mockResolvedValueOnce({});
      await expect(repo.init()).resolves.not.toThrow();
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE'));
    });

    it('should throw InitializationException on failure', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB down'));
      await expect(repo.init()).rejects.toThrow(InitializationException);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    it('should insert book successfully', async () => {
      mockQuery.mockResolvedValueOnce({});
      await expect(repo.create(mockIdBook)).resolves.toBe('book-id-123');
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO books'), expect.any(Array));
    });

    it('should throw InvalidItemException for null input', async () => {
      // @ts-expect-error intentional bad input
      await expect(repo.create(null)).rejects.toThrow(InvalidItemException);
    });

    it('should throw DbException on DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Unique violation'));
      await expect(repo.create(mockIdBook)).rejects.toThrow(DbException);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('get()', () => {
    it('should return a book if found', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'book-id-123',
          title: 'Title',
          author: 'Author',
          genre: 'Genre',
          format: 'Format',
          language: 'English',
          publisher: 'Publisher',
          specialedition: 'Yes',
          packaging: 'Box'
        }]
      });

      const result = await repo.get('book-id-123');
      expect(result.getId()).toBe('book-id-123');
      expect(result.getTitle()).toBe('Title');
    });

    it('should throw ItemNotFoundException if no book found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await expect(repo.get('missing-id')).rejects.toThrow(ItemNotFoundException);
    });

    it('should throw DbException on DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB error'));
      await expect(repo.get('any')).rejects.toThrow(DbException);
    });
  });

  describe('getAll()', () => {
    it('should return all books', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'book-id-123',
            title: 'Title',
            author: 'Author',
            genre: 'Genre',
            format: 'Format',
            language: 'English',
            publisher: 'Publisher',
            specialedition: 'Yes',
            packaging: 'Box'
          }
        ]
      });

      const result = await repo.getAll();
      expect(result).toHaveLength(1);
      expect(result[0].getId()).toBe('book-id-123');
    });

    it('should throw DbException on DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB error'));
      await expect(repo.getAll()).rejects.toThrow(DbException);
    });
  });

  describe('update()', () => {
    it('should update book successfully', async () => {
      mockQuery.mockResolvedValueOnce({});
      await expect(repo.update(mockIdBook)).resolves.not.toThrow();
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('UPDATE books'), expect.any(Array));
    });

    it('should throw DbException on update failure', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Update failed'));
      await expect(repo.update(mockIdBook)).rejects.toThrow(DbException);
    });
  });

  describe('delete()', () => {
    it('should delete book successfully', async () => {
      mockQuery.mockResolvedValueOnce({});
      await expect(repo.delete('book-id-123')).resolves.not.toThrow();
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM books'), ['book-id-123']);
    });

    it('should throw DbException on delete failure', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Delete failed'));
      await expect(repo.delete('book-id-123')).rejects.toThrow(DbException);
    });
  });
});

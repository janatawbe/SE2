import { CakeRepository } from '../../src/repository/postgres/cake.repository';
import { PostgresConnection } from '../../src/repository/postgres/PostgresConnection';
import { IdentifiableCake } from '../../src/model/cake.model';
import {
  InitializationException,
  DbException,
  InvalidItemException,
  ItemNotFoundException,
} from '../../src/util/exceptions/repositoryExceptions';
import logger from '../../src/util/logger';

jest.mock('../../src/repository/postgres/PostgresConnection', () => ({
  PostgresConnection: {
    getPool: jest.fn(),
  },
}));

jest.mock('../../src/util/logger');

const mockQuery = jest.fn();
(PostgresConnection.getPool as jest.Mock).mockReturnValue({
  query: mockQuery,
});

describe('CakeRepository', () => {
  const repo = new CakeRepository();

  const mockCake = new IdentifiableCake(
    'cake-1',
    'birthday',
    'vanilla',
    'cream',
    'medium',
    '2',
    'buttercream',
    'vanilla',
    'sprinkles',
    'blue',
    'Happy Birthday!',
    'round',
    'nuts',
    'honey',
    'box'
  );

  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('init()', () => {
    it('should initialize the table', async () => {
      mockQuery.mockResolvedValueOnce({});
      await expect(repo.init()).resolves.not.toThrow();
    });

    it('should throw InitializationException on failure', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB error'));
      await expect(repo.init()).rejects.toThrow(InitializationException);
    });
  });

  describe('create()', () => {
    it('should insert cake successfully', async () => {
      mockQuery.mockResolvedValueOnce({});
      await expect(repo.create(mockCake)).resolves.toBe('cake-1');
    });

    it('should throw InvalidItemException for null input', async () => {
      await expect(repo.create(null as unknown as IdentifiableCake)).rejects.toThrow(InvalidItemException);
    });

    it('should throw DbException on DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Insert failed'));
      await expect(repo.create(mockCake)).rejects.toThrow(DbException);
    });
  });

  describe('get()', () => {
    it('should return a cake if found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [mockCake] });
      const result = await repo.get('cake-1');
      expect(result.getId()).toBe('cake-1');
    });

    it('should throw ItemNotFoundException if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await expect(repo.get('missing-id')).rejects.toThrow(ItemNotFoundException);
    });

    it('should throw DbException on DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB error'));
      await expect(repo.get('cake-1')).rejects.toThrow(DbException);
    });
  });

  describe('getAll()', () => {
    it('should return all cakes', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [mockCake] });
      const cakes = await repo.getAll();
      expect(cakes.length).toBe(1);
    });

    it('should throw DbException on DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Query failed'));
      await expect(repo.getAll()).rejects.toThrow(DbException);
    });
  });

  describe('update()', () => {
    it('should update cake successfully', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      await expect(repo.update(mockCake)).resolves.not.toThrow();
    });

    it('should throw InvalidItemException for null input', async () => {
      await expect(repo.update(null as unknown as IdentifiableCake)).rejects.toThrow(InvalidItemException);
    });

    it('should throw ItemNotFoundException if no row updated', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      await expect(repo.update(mockCake)).rejects.toThrow(ItemNotFoundException);
    });

    it('should throw DbException on update error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Update error'));
      await expect(repo.update(mockCake)).rejects.toThrow(DbException);
    });
  });

  describe('delete()', () => {
    it('should delete cake successfully', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      await expect(repo.delete('cake-1')).resolves.not.toThrow();
    });

    it('should throw ItemNotFoundException if no row deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      await expect(repo.delete('cake-1')).rejects.toThrow(ItemNotFoundException);
    });

    it('should throw DbException on delete error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Delete failed'));
      await expect(repo.delete('cake-1')).rejects.toThrow(DbException);
    });
  });
});

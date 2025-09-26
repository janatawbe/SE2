import { ToyRepository } from '../../src/repository/postgres/toy.repository';
import { PostgresConnection } from '../../src/repository/postgres/PostgresConnection';
import { Toy, IdentifiableToy } from '../../src/model/toy.model';
import { InvalidItemException, ItemNotFoundException, DbException, InitializationException } from '../../src/util/exceptions/repositoryExceptions';
import logger from '../../src/util/logger';

// mock PostgresConnection
jest.mock('../../src/repository/postgres/PostgresConnection', () => ({
  PostgresConnection: {
    getPool: jest.fn()
  }
}));

// mock logger
jest.mock('../../src/util/logger');

const mockQuery = jest.fn();
(PostgresConnection.getPool as jest.Mock).mockReturnValue({
  query: mockQuery
});

describe('ToyRepository', () => {
  const repo = new ToyRepository();

  const mockIdToy = new IdentifiableToy(
    'toy-id-123',
    'Robot',
    '6+',
    'RoboCo',
    'Plastic',
    'Yes',
    'STEM'
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
    it('should insert toy successfully', async () => {
      mockQuery.mockResolvedValueOnce({});
      await expect(repo.create(mockIdToy)).resolves.toBe('toy-id-123');
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO toys'), expect.any(Array));
    });

    it('should throw InvalidItemException for null input', async () => {
      // @ts-expect-error testing bad input
      await expect(repo.create(null)).rejects.toThrow(InvalidItemException);
    });

    it('should throw DbException on DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Unique violation'));
      await expect(repo.create(mockIdToy)).rejects.toThrow(DbException);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('get()', () => {
    it('should return a toy if found', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'toy-id-123',
          type: 'Robot',
          agegroup: '6+',
          brand: 'RoboCo',
          material: 'Plastic',
          batteryrequired: 'Yes',
          educational: 'STEM'
        }]
      });

      const result = await repo.get('toy-id-123');
      expect(result.getId()).toBe('toy-id-123');
      expect(result.getType()).toBe('Robot');
    });

    it('should throw ItemNotFoundException if no toy found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await expect(repo.get('missing-id')).rejects.toThrow(ItemNotFoundException);
    });

    it('should throw DbException on DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB error'));
      await expect(repo.get('any')).rejects.toThrow(DbException);
    });
  });

  describe('getAll()', () => {
    it('should return all toys', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'toy-id-123',
            type: 'Robot',
            agegroup: '6+',
            brand: 'RoboCo',
            material: 'Plastic',
            batteryrequired: 'Yes',
            educational: 'STEM'
          }
        ]
      });

      const result = await repo.getAll();
      expect(result).toHaveLength(1);
      expect(result[0].getId()).toBe('toy-id-123');
    });

    it('should throw DbException on DB error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('DB error'));
      await expect(repo.getAll()).rejects.toThrow(DbException);
    });
  });

  describe('update()', () => {
    it('should update toy successfully', async () => {
      mockQuery.mockResolvedValueOnce({});
      await expect(repo.update(mockIdToy)).resolves.not.toThrow();
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('UPDATE toys'), expect.any(Array));
    });

    it('should throw DbException on update failure', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Update failed'));
      await expect(repo.update(mockIdToy)).rejects.toThrow(DbException);
    });
  });

  describe('delete()', () => {
    it('should delete toy successfully', async () => {
      mockQuery.mockResolvedValueOnce({});
      await expect(repo.delete('toy-id-123')).resolves.not.toThrow();
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM toys'), ['toy-id-123']);
    });

    it('should throw DbException on delete failure', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Delete failed'));
      await expect(repo.delete('toy-id-123')).rejects.toThrow(DbException);
    });
  });
});
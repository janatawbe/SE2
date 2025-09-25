import { parseCSV, writeCSVFile } from '../../src/util/csvParser';
import { promises as fs } from 'fs';
import { parse as csvParse } from 'csv-parse';
import { stringify as csvStringify } from 'csv-stringify';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

jest.mock('csv-parse', () => ({
  parse: jest.fn()
}));

jest.mock('csv-stringify', () => ({
  stringify: jest.fn()
}));

describe('CSV Utils', () => {
  const mockReadFile = fs.readFile as jest.Mock;
  const mockWriteFile = fs.writeFile as jest.Mock;
  const mockCsvParse = csvParse as jest.Mock;
  const mockCsvStringify = csvStringify as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseCSV', () => {
    it('should parse CSV and exclude header by default', async () => {
      const csvText = 'name,age\nAlice,30\nBob,25';
      const parsedData = [
        ['name', 'age'],
        ['Alice', '30'],
        ['Bob', '25']
      ];

      mockReadFile.mockResolvedValue(csvText);
      mockCsvParse.mockImplementation((input, options, callback) => {
        callback(null, parsedData);
      });

      const result = await parseCSV('dummy.csv');
      expect(result).toEqual([
        ['Alice', '30'],
        ['Bob', '25']
      ]);
      expect(mockReadFile).toHaveBeenCalledWith('dummy.csv', 'utf-8');
    });

    it('should parse CSV and include header when specified', async () => {
      const csvText = 'name,age\nAlice,30\nBob,25';
      const parsedData = [
        ['name', 'age'],
        ['Alice', '30'],
        ['Bob', '25']
      ];

      mockReadFile.mockResolvedValue(csvText);
      mockCsvParse.mockImplementation((input, options, callback) => {
        callback(null, parsedData);
      });

      const result = await parseCSV('dummy.csv', true);
      expect(result).toEqual(parsedData);
    });

    it('should throw an error if reading file fails', async () => {
      mockReadFile.mockRejectedValue(new Error('File not found'));

      await expect(parseCSV('missing.csv')).rejects.toThrow('Error reading CSV file');
    });

    it('should throw an error if csvParse fails', async () => {
      mockReadFile.mockResolvedValue('invalid,csv,data');
      mockCsvParse.mockImplementation((input, options, callback) => {
        callback(new Error('Parse error'), null);
      });

      await expect(parseCSV('invalid.csv')).rejects.toThrow('Parse error');
    });
  });

  describe('writeCSVFile', () => {
    it('should stringify data and write to file', async () => {
      const csvOutput = 'name,age\nAlice,30\nBob,25\n';
      const data = [
        ['name', 'age'],
        ['Alice', '30'],
        ['Bob', '25']
      ];

      mockCsvStringify.mockImplementation((input, callback) => {
        callback(null, csvOutput);
      });

      await writeCSVFile('output.csv', data);

      expect(mockCsvStringify).toHaveBeenCalledWith(data, expect.any(Function));
      expect(mockWriteFile).toHaveBeenCalledWith('output.csv', csvOutput, 'utf-8');
    });

    it('should throw an error if stringify fails', async () => {
      mockCsvStringify.mockImplementation((input, callback) => {
        callback(new Error('Stringify failed'), null);
      });

      await expect(writeCSVFile('fail.csv', [])).rejects.toThrow('Error writing CSV file: Error: Stringify failed');
    });

    it('should throw an error if writeFile fails', async () => {
      const csvOutput = 'a,b\n';
      mockCsvStringify.mockImplementation((input, callback) => {
        callback(null, csvOutput);
      });
      mockWriteFile.mockRejectedValue(new Error('Write failed'));

      await expect(writeCSVFile('fail.csv', [['a', 'b']])).rejects.toThrow('Error writing CSV file: Error: Write failed');
    });
  });
});

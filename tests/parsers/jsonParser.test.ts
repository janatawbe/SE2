import fs from 'fs';
import { parseJSON } from '../../src/util/jsonParser';
import logger from '../../src/util/logger';

jest.mock('fs');
jest.mock('../../src/util/logger');

const mockReadFileSync = fs.readFileSync as jest.Mock;
const mockLoggerError = logger.error as jest.Mock;

describe('parseJSON', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse valid JSON correctly', () => {
    const json = { name: 'Alice', age: 30 };
    mockReadFileSync.mockReturnValue(JSON.stringify(json));

    const result = parseJSON<typeof json>('valid.json');
    expect(result).toEqual(json);
    expect(mockReadFileSync).toHaveBeenCalledWith('valid.json', 'utf-8');
  });

  it('should throw an error for empty JSON file', () => {
    mockReadFileSync.mockReturnValue('   \n  ');

    expect(() => parseJSON('empty.json')).toThrow('Empty JSON file');
  });

  it('should throw an error for invalid JSON', () => {
    mockReadFileSync.mockReturnValue('{"invalidJson": }');

    expect(() => parseJSON('bad.json')).toThrow(/Invalid JSON at bad\.json: Unexpected token/);
    expect(mockLoggerError).toHaveBeenCalledWith(
      'JSON parse failed for %s: %o',
      'bad.json',
      expect.any(SyntaxError)
    );
  });

  it('should handle unknown errors gracefully', () => {
    // Simulate a non-Error throw, e.g. throw "string"
    mockReadFileSync.mockImplementation(() => {
      throw 'Something strange';
    });

    expect(() => parseJSON('unknown.json')).toThrow('Invalid JSON at unknown.json: Unknown error');
    expect(mockLoggerError).toHaveBeenCalledWith(
      'JSON parse failed for %s: Unknown error',
      'unknown.json'
    );
  });
});

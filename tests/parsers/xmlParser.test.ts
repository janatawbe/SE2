import fs from 'fs';
import { parseXML } from '../../src/util/xmlParser';
import { XMLValidator, XMLParser, ValidationError } from 'fast-xml-parser';
import logger from '../../src/util/logger';

jest.mock('fs');
jest.mock('../../src/util/logger');

const mockReadFileSync = fs.readFileSync as jest.Mock;
const mockLoggerError = logger.error as jest.Mock;

describe('parseXML', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse valid XML successfully', () => {
    const xml = `
      <person>
        <name>Alice</name>
        <age>30</age>
      </person>
    `;

    const expected = {
      person: {
        name: 'Alice',
        age: 30
      }
    };

    mockReadFileSync.mockReturnValue(xml);

    const result = parseXML<typeof expected>('valid.xml');
    expect(result).toEqual(expected);
    expect(mockReadFileSync).toHaveBeenCalledWith('valid.xml', 'utf-8');
  });

  it('should throw an error for empty XML file', () => {
    mockReadFileSync.mockReturnValue('   ');

    expect(() => parseXML('empty.xml')).toThrow('Empty XML file');
  });

  it('should throw an error for invalid XML (validation fails)', () => {
    const xml = `<person><name>Alice</name><age>30</age>`; // Missing closing tag

    mockReadFileSync.mockReturnValue(xml);

    const validationResult = {
      err: {
        code: 'ERR_MISSING_TAG',
        msg: 'Missing closing tag for person',
        line: 1,
        col: 1
      }
    };

    // Override the validation method to simulate invalid XML
    jest.spyOn(XMLValidator, 'validate').mockReturnValue(validationResult);

    expect(() => parseXML('invalid.xml')).toThrow(
      'Invalid XML at invalid.xml: Missing closing tag for person'
    );
    expect(mockLoggerError).toHaveBeenCalledWith(
      'XML parse failed for %s: %o',
      'invalid.xml',
      expect.any(Error)
    );
  });

  it('should throw an error if XMLValidator returns unknown format', () => {
    const xml = `<foo>bar</foo>`;
    mockReadFileSync.mockReturnValue(xml);

    // Simulate unexpected return from validate
    jest.spyOn(XMLValidator, 'validate').mockReturnValue('some-string' as unknown as true | ValidationError);

    expect(() => parseXML('weird.xml')).toThrow(
      'Invalid XML at weird.xml: Unknown error'
    );
    expect(mockLoggerError).toHaveBeenCalledWith(
      'XML parse failed for %s: %o',
      'weird.xml',
      expect.any(Error)
    );
  });

  it('should handle unexpected errors thrown by readFileSync', () => {
    mockReadFileSync.mockImplementation(() => {
      throw 'something unexpected';
    });

    expect(() => parseXML('crash.xml')).toThrow(
      'XML parse failed for crash.xml: Unknown error'
    );

    expect(mockLoggerError).toHaveBeenCalledWith(
      'XML parse failed for %s: Unknown error',
      'crash.xml'
    );
  });
});

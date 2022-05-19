import { fs, vol } from 'memfs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { extractFileSection } from '@/lib/utils/readFile';

vi.mock('node:fs');
vi.mock('node:fs/promises');

describe('readFile test', () => {
  const filePath = '/file.txt';

  beforeEach(() => {
    vol.reset();
  });

  describe('extractFileSection', () => {
    const mockText = `
      Hello Test:
      start
      why don't you join me?
      end
      ps: what's more!
    `;

    beforeEach(async () => {
      await fs.promises.writeFile(filePath, mockText);
    });

    it('is a function', () => {
      expect(extractFileSection).toBeTypeOf('function');
    });

    it('should read the whole file without start or end predicate', async () => {
      await expect(extractFileSection({ filePath })).resolves.toEqual(mockText);
    });

    it('should read from start with start predicate', async () => {
      const expectedResult = `      start
      why don't you join me?
      end
      ps: what's more!
    `;
      await expect(
        extractFileSection({
          filePath,
          startPredicate: (line) => /start/.test(line),
        })
      ).resolves.toEqual(expectedResult);
    });

    it('should read till end with end predicate', async () => {
      const expectedResult = `
      Hello Test:
      start
      why don't you join me?
      end`;
      await expect(
        extractFileSection({
          filePath,
          endPredicate: (line) => /end/.test(line),
        })
      ).resolves.toEqual(expectedResult);
    });

    it('should read from start to end with start and end predicate', async () => {
      const expectedResult = `      start
      why don't you join me?
      end`;
      await expect(
        extractFileSection({
          filePath,
          startPredicate: (line) => /start/.test(line),
          endPredicate: (line) => /end/.test(line),
        })
      ).resolves.toEqual(expectedResult);
    });
  });
});

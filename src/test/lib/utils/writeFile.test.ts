import { fs, vol } from 'memfs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { writeWholeFileAndOutputBuffer } from '@/lib/utils/writeFile';

vi.mock('node:fs');
vi.mock('node:fs/promises');

describe('readFile test', () => {
  const filePath = '/file.txt';

  beforeEach(() => {
    vol.reset();
  });

  describe('writeWholeFileAndOutputBuffer', () => {
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
      expect(writeWholeFileAndOutputBuffer).toBeTypeOf('function');
    });

    it('should write the whole file', async () => {
      const mockTextToWrite = `
      Hey
      Hello
      `;
      await expect(
        writeWholeFileAndOutputBuffer({ text: mockTextToWrite, filePath })
      ).resolves.toEqual(Buffer.from(mockTextToWrite));
      const fd = await fs.promises.open(filePath, 'r');
      await expect(fs.promises.readFile(fd, 'utf-8')).resolves.toEqual(
        mockTextToWrite
      );
    });
  });
});

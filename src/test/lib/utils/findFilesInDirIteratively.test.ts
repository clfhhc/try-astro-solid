import { vol } from 'memfs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  findFilesInDirIteratively,
  findFilesInDirIterativelyAsync,
} from '../../../lib/utils/findFilesInDirIteratively';

vi.mock('node:fs');
vi.mock('node:fs/promises');

describe('node:fs test', () => {
  const mockVol = {
    some: {
      'file1.txt': 'file 1 content',
      'file2.js': 'file 2 content',
      what: {
        'file3.ts': 'file 3 content',
      },
    },
  };
  const mockCwd = '/tmp';
  const expectedFilePaths = [
    '/tmp/some/file1.txt',
    '/tmp/some/file2.js',
    '/tmp/some/what/file3.ts',
  ];

  beforeEach(() => {
    vol.reset();
  });

  describe('findFilesInDirIteratively', () => {
    it('should get all file paths', () => {
      vol.fromNestedJSON(mockVol, mockCwd);
      expect(findFilesInDirIteratively('/tmp/some')).toEqual(expectedFilePaths);
    });
  });

  describe('findFilesInDirIterativelyAsync', () => {
    it('should get all file paths asynchronously', async () => {
      vol.fromNestedJSON(mockVol, mockCwd);
      expect(findFilesInDirIterativelyAsync('/tmp/some')).resolves.toEqual(
        expectedFilePaths
      );
    });
  });
});

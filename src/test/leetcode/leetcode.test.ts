import { importLocalLeetcodeFiles } from '../../lib/leetcode/importLocalLeetcodeFiles';
import { describe, expect, it } from 'vitest';

describe('LeetCode Tests', async () => {
  Object.values(await importLocalLeetcodeFiles()).forEach(
    ({ filePath, testCases }) => {
      describe(filePath, () => {
        describe('should meet all included testCases', () => {
          testCases.forEach(({ f, cases }) => {
            describe(f.name, () => {
              cases.forEach(({ i, o }) => {
                it(`given ${JSON.stringify(i)} should output ${JSON.stringify(
                  o
                )}`, () => {
                  expect(f(...i)).toEqual(o);
                });
              });
            });
          });
        });
      });
    }
  );
});

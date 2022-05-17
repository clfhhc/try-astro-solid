import { TestCaseWithFunction } from '@/lib/utils/types';

/* solution start */

function lengthOfLongestSubstring(s: string): number {
  let maxSubstringLength = 0;
  let nonRepeatedStart = 0;
  const unique = new Set();
  let i = 0;
  while (i < s.length) {
    if (unique.has(s[i])) {
      maxSubstringLength = Math.max(unique.size, maxSubstringLength);
      unique.delete(s[nonRepeatedStart]);
      nonRepeatedStart++;
    } else {
      unique.add(s[i]);
      i++;
    }
  }
  maxSubstringLength = Math.max(unique.size, maxSubstringLength);
  return maxSubstringLength;
}

/* solution end */

export const testCases: [
  TestCaseWithFunction<typeof lengthOfLongestSubstring>
] = [
  {
    f: lengthOfLongestSubstring,
    cases: [],
  },
];

(
  [
    ['abcabcbb', 3],
    ['bbbbb', 1],
    ['pwwkew', 3],
    ['aab', 2],
    ['cdd', 2],
    ['abba', 2],
  ] as [string, number][]
).forEach((array) => {
  const [input, o] = [...array];
  testCases[0].cases.push({ i: [input], o });
});

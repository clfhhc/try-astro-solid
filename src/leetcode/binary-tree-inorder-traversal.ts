import type { TestCaseWithFunction } from '@/lib/utils/types';

/* solution start */

/**
 * Definition for a binary tree node.
 */
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let pointer = root;
  while (pointer || stack.length) {
    while (pointer) {
      stack.push(pointer);
      pointer = pointer.left;
    }
    pointer = stack.pop() as TreeNode;
    result.push(pointer.val);
    pointer = pointer.right;
  }

  return result;
}

/* solution end */

const createTreeNodeFromValue = (
  value: number | null | undefined
): TreeNode | null => {
  if (value === null) {
    return null;
  }
  return new TreeNode(value);
};

const createTreeNodeFromArray = (array: (number | null)[]): TreeNode | null => {
  if (!Array.isArray(array) || !array.length) {
    return null;
  }

  const tempArray = [...array];
  const root = createTreeNodeFromValue(tempArray.shift());
  if (root === null) {
    return root;
  }

  let pointer = 0;
  const currentTreeNodeArray: TreeNode[] = [root];
  while (tempArray.length) {
    if (pointer === 0) {
      currentTreeNodeArray[0].left = createTreeNodeFromValue(tempArray.shift());
      currentTreeNodeArray[0].left === null ||
        currentTreeNodeArray.push(currentTreeNodeArray[0].left);
    } else {
      currentTreeNodeArray[0].right = createTreeNodeFromValue(
        tempArray.shift()
      );
      currentTreeNodeArray[0].right === null ||
        currentTreeNodeArray.push(currentTreeNodeArray[0].right);
      currentTreeNodeArray.shift();
    }
    pointer = 1 - pointer;
  }

  return root;
};

export const testCases: [
  TestCaseWithFunction<typeof inorderTraversal>,
  TestCaseWithFunction<typeof createTreeNodeFromValue>,
  TestCaseWithFunction<typeof createTreeNodeFromArray>
] = [
  {
    f: inorderTraversal,
    cases: [],
  },
  {
    f: createTreeNodeFromValue,
    cases: [],
  },
  {
    f: createTreeNodeFromArray,
    cases: [],
  },
];

(
  [
    [
      [1, null, 2, 3],
      [1, 3, 2],
    ],
    [[], []],
    [[1], [1]],
    [
      [1, 2, 3, 4, 5],
      [4, 2, 5, 1, 3],
    ],
  ] as [(number | null)[], number[]][]
).forEach((array) => {
  const [input, o] = [...array];
  testCases[0].cases.push({ i: [createTreeNodeFromArray(input)], o });
});

(
  [
    [null, null],
    [1, new TreeNode(1)],
    [2, new TreeNode(2)],
  ] as [number | null, TreeNode | null][]
).forEach((array) => {
  const [input, o] = [...array];
  testCases[1].cases.push({ i: [input], o });
});

(
  [
    [[], null],
    [[1, null, 2, 3], new TreeNode(1, null, new TreeNode(2, new TreeNode(3)))],
    [[1], new TreeNode(1)],
  ] as [(number | null)[], TreeNode | null][]
).forEach((array) => {
  const [input, o] = [...array];
  testCases[2].cases.push({ i: [input], o });
});

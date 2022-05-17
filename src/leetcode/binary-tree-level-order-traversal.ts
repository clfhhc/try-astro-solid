import { TestCaseWithFunction } from '@/lib/utils/types';

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

function levelOrder(root: TreeNode | null): number[][] {
  if (!root) {
    return [];
  }
  let pointer = root;
  const result: number[][] = [[]];
  const traverse: TreeNode[][] = [[pointer], []];
  while (traverse[0].length) {
    pointer = traverse[0].shift() as TreeNode;
    result[result.length - 1].push(pointer.val);
    pointer.left && traverse[1].push(pointer.left);
    pointer.right && traverse[1].push(pointer.right);
    if (traverse[0].length === 0) {
      traverse.push(traverse.shift() as TreeNode[]);
      result.push([]);
      continue;
    }
  }
  if (result.length && result[result.length - 1].length === 0) {
    result.pop();
  }
  return result;
}

/* solution end */

export const testCases: [TestCaseWithFunction<typeof levelOrder>] = [
  {
    f: levelOrder,
    cases: [],
  },
];

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
  let currentTreeNodeArray: TreeNode[] = [root];
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

(
  [
    [
      [3, 9, 20, null, null, 15, 7],
      [[3], [9, 20], [15, 7]],
    ],
    [[1], [[1]]],
    [[], []],
  ] as [(number | null)[], number[][]][]
).forEach((array) => {
  const [input, o] = [...array];
  testCases[0].cases.push({ i: [createTreeNodeFromArray(input)], o });
});

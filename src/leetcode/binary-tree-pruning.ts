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

function pruneTree(root: TreeNode | null): TreeNode | null {
  if (!root) {
    return root;
  }

  const node = new TreeNode(root.val);
  node.left = pruneTree(root.left);
  node.right = pruneTree(root.right);
  if (root.val === 1 || node.left || node.right) {
    return node;
  }
  return null;
}

/* solution end */

export const testCases: [TestCaseWithFunction<typeof pruneTree>] = [
  {
    f: pruneTree,
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
      [1, null, 0, 0, 1],
      [1, null, 0, null, 1],
    ],
    [
      [1, 0, 1, 0, 0, 0, 1],
      [1, null, 1, null, 1],
    ],
    [
      [1, 1, 0, 1, 1, 0, 1, 0],
      [1, 1, 0, 1, 1, null, 1],
    ],
  ] as [(number | null)[], (number | null)[]][]
).forEach((array) => {
  const [input, output] = [...array];
  testCases[0].cases.push({
    i: [createTreeNodeFromArray(input)],
    o: createTreeNodeFromArray(output),
  });
});

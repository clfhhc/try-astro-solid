import { FunctionTestCases, TestCaseWithFunction } from '@/lib/utils/types';

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

function isSameValue(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) {
    return true;
  }
  if (!p || !q) {
    return false;
  }
  if (p.val !== q.val) {
    return false;
  }
  return true;
}

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  const queueP = [p];
  const queueQ = [q];

  let pointerP: TreeNode | null;
  let pointerQ: TreeNode | null;
  while (queueP.length) {
    pointerP = queueP.shift() as TreeNode | null;
    pointerQ = queueQ.shift() as TreeNode | null;

    if (!isSameValue(pointerP, pointerQ)) {
      return false;
    }
    if (pointerP !== null) {
      queueP.push((pointerP as TreeNode).left, (pointerP as TreeNode).right);
      queueQ.push((pointerQ as TreeNode).left, (pointerQ as TreeNode).right);
    }
  }
  return true;
}

/* solution end */

export const testCases: [TestCaseWithFunction<typeof isSameTree>] = [
  {
    f: isSameTree,
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
    [[1, 2, 3], [1, 2, 3], true],
    [[1, 2], [1, null, 2], false],
    [[1, 2, 1], [1, 1, 2], false],
  ] as [(number | null)[], (number | null)[], boolean][]
).forEach((array) => {
  const [p, q, o] = [...array];
  testCases[0].cases.push({
    i: [createTreeNodeFromArray(p), createTreeNodeFromArray(q)],
    o,
  });
});

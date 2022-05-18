import type { TestCaseWithFunction } from '@/lib/utils/types';

/* solution start */

/**
 * Definition for singly-linked list.
 */
class ListNode {
  val: number;

  next: ListNode | null;

  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  if (!l1 || !l2) {
    return null;
  }

  let lNode1: ListNode | null = l1;
  let lNode2: ListNode | null = l2;
  const result = new ListNode(0);
  let pointer: ListNode | null = result;

  // copy l1's value
  while (lNode1 !== null && pointer !== null) {
    pointer.val += lNode1.val;
    if (lNode1.next && pointer.next === null) {
      pointer.next = new ListNode(0);
    }
    pointer = pointer.next;
    lNode1 = lNode1.next;
  }

  // add l2's value
  pointer = result;
  while (lNode2 !== null && pointer !== null) {
    pointer.val += lNode2.val;
    if (lNode2.next && pointer.next === null) {
      pointer.next = new ListNode(0);
    }
    pointer = pointer.next;
    lNode2 = lNode2.next;
  }

  // process overflow
  let overflow = 0;
  pointer = result;
  while (pointer !== null) {
    pointer.val += overflow;

    overflow = 0;
    if (pointer.val >= 10) {
      pointer.val -= 10;
      overflow = 1;
    }

    if (overflow === 1 && pointer.next === null) {
      pointer.next = new ListNode(0);
    }

    pointer = pointer.next;
  }

  return result;
}

/* solution end */

export const testCases: [TestCaseWithFunction<typeof addTwoNumbers>] = [
  {
    f: addTwoNumbers,
    cases: [],
  },
];

const createListNodeFromArray = (array: number[]): ListNode | null => {
  if (!Array.isArray(array)) {
    return null;
  }
  const [result] = array.reduce<Array<ListNode | null>>(
    (arr, val) => {
      const newNode = new ListNode(val);
      arr[0] = arr[0] || newNode;
      if (!arr[1]) {
        arr[1] = newNode;
      } else {
        arr[1].next = newNode;
        arr[1] = newNode;
      }
      return arr;
    },
    [null, null]
  );

  return result;
};

[
  [
    [2, 4, 3],
    [5, 6, 4],
    [7, 0, 8],
  ],
  [[0], [0], [0]],
  [
    [9, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9],
    [8, 9, 9, 9, 0, 0, 0, 1],
  ],
].forEach((array) => {
  const [l1, l2, sum] = array.map(createListNodeFromArray);
  testCases[0].cases.push({ i: [l1, l2], o: sum });
});

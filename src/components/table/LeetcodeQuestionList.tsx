import { createEffect, createSignal, For } from 'solid-js';
import { createTableInstance, getCoreRowModel } from '@tanstack/solid-table';
import {
  columns,
  LeetcodeQuestion,
  leetcodeQuestionListTable,
} from './questionListTable';
import styles from './leetcodeQuestionList.module.css';
export interface Props {
  leetcodeQuestionList: LeetcodeQuestion[];
}

export function LeetcodeQuestionList({ leetcodeQuestionList }: Props) {
  const instance = createTableInstance(leetcodeQuestionListTable, {
    data: leetcodeQuestionList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [rows, setRows] = createSignal(instance.getRowModel().rows);

  createEffect(() => {
    const columnIdsShouldHide = ['questionId', 'titleSlug', 'categoryTitle'];
    columnIdsShouldHide.forEach((columnId) => {
      console.log(instance.getColumn(columnId).id);
      instance.getColumn(columnId).toggleVisibility(false);
    });
    setRows(instance.getRowModel().rows);
  });

  return (
    <div class={styles['question-list']}>
      <For each={instance.getHeaderGroups()}>
        {(headerGroup: ReturnType<typeof instance.getHeaderGroups>[number]) => {
          if (headerGroup.id === '0') {
            return null;
          }
          return (
            <For each={headerGroup.headers}>
              {(header) => (
                <div class={styles['question-list-header']}>
                  {header.isPlaceholder ? null : header.renderHeader()}
                </div>
              )}
            </For>
          );
        }}
      </For>
      <For each={rows()}>
        {(row) => (
          <For each={row.getVisibleCells()}>
            {(cell) => (
              <div
                classList={{ [styles['darker-row']]: cell.row.index % 2 === 1 }}
              >
                {cell.renderCell()}
              </div>
            )}
          </For>
        )}
      </For>
    </div>
  );
}

export default LeetcodeQuestionList;

import { For, createEffect } from 'solid-js';
import { createTableInstance, getCoreRowModel } from '@tanstack/solid-table';
import {
  columns,
  LeetcodeQuestion,
  leetcodeQuestionListTable,
} from './questionListTable';

export interface Props {
  leetcodeQuestionList: LeetcodeQuestion[];
}

export function LeetcodeQuestionList({ leetcodeQuestionList }: Props) {
  const instance = createTableInstance(leetcodeQuestionListTable, {
    data: leetcodeQuestionList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  createEffect(() => {
    const columnHeadersShouldHide = ['Index', 'Slug', 'Category'];
    instance.getHeaderGroups().forEach((group) => {
      group.headers.forEach((header) => {
        if (columnHeadersShouldHide.includes(header.renderHeader())) {
          header.column.toggleVisibility(false);
        }
      });
    });
  });

  return (
    <table>
      <thead>
        <For each={instance.getHeaderGroups()}>
          {(
            headerGroup: ReturnType<typeof instance.getHeaderGroups>[number]
          ) => {
            if (headerGroup.id === '0') {
              return null;
            }
            return (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : header.renderHeader()}
                    </th>
                  )}
                </For>
              </tr>
            );
          }}
        </For>
      </thead>
      <tbody>
        <For each={instance.getRowModel().rows}>
          {(row) => (
            <tr>
              <For each={row.getVisibleCells()}>
                {(cell) => <td>{cell.renderCell()}</td>}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}

export default LeetcodeQuestionList;

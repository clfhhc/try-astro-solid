import { createTable, Overwrite, TableGenerics } from '@tanstack/solid-table';
import { QuestionListQuery } from '@/graphql/leetcode/questionList.query';
import QuestionLink from './QuestionLink';
import 'node:url';

export type LeetcodeQuestion =
  QuestionListQuery['questionList']['data'][number];

export const leetcodeQuestionListTable =
  createTable().setRowType<LeetcodeQuestion>();

export type LeetcodeQuestionListTable = Overwrite<
  TableGenerics,
  { Row: LeetcodeQuestion }
>;

export const columns = [
  leetcodeQuestionListTable.createGroup({
    header: 'Question',
    columns: [
      leetcodeQuestionListTable.createDataColumn('questionId', {
        header: 'Index',
        defaultIsVisible: false,
        cell: (Cell) => Cell.getValue(),
      }),
      leetcodeQuestionListTable.createDataColumn('titleSlug', {
        header: 'Slug',
        defaultIsVisible: false,
        cell: (Cell) => Cell.getValue(),
      }),
      leetcodeQuestionListTable.createDataColumn(
        (row) => `${row.questionId}. ${row.title}`,
        {
          id: 'display',
          header: 'Question',
          cell: (Cell) => (
            <QuestionLink
              text={Cell.getValue()}
              href={`${import.meta.env.BASE_URL}${
                import.meta.env.BASE_URL.endsWith('/') ? '' : '/'
              }leetcode/${Cell.row.original.titleSlug}`}
            />
          ),
        }
      ),
    ],
  }),
  leetcodeQuestionListTable.createGroup({
    header: 'Properties',
    columns: [
      leetcodeQuestionListTable.createDataColumn('difficulty', {
        header: 'Difficulty',
        cell: (Cell) => Cell.getValue(),
      }),
      leetcodeQuestionListTable.createDataColumn('categoryTitle', {
        header: 'Category',
        defaultIsVisible: false,
        cell: (Cell) => Cell.getValue(),
      }),
    ],
  }),
];

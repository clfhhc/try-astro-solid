import { Scalars } from '@/lib/graphql/types';
import { Exact, InputMaybe } from '@/lib/utils/types';
import { gql } from '@urql/core';

export type QuestionListQuery = {
  questionList: {
    __typename?: 'PagifiedQuestionNode';
    totalNum?: number;
    data?: {
      __typename?: 'QuestionNode';
      questionId?: string | null;
      title?: string | null;
      titleSlug?: string | null;
      difficulty?: 'Easy' | 'Medium' | 'Hard' | null;
      categoryTitle?: string | null;
      topicTags?: Array<{
        id?: string | null;
        name?: string | null;
        slug?: string | null;
        __typename?: 'TopicTagNode';
      } | null>;
    }[];
  };
};

export type QuestionListQueryVariables = Exact<{
  categorySlug: Scalars['String'];
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  filters: Record<string, any>;
}>;

export const QuestionListDocument = gql<
  QuestionListQuery,
  QuestionListQueryVariables
>`
  query questionList(
    $categorySlug: String
    $limit: Int
    $skip: Int
    $filters: QuestionListFilterInput
  ) {
    questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      __typename
      totalNum
      data {
        __typename
        difficulty
        questionId: questionFrontendId
        title
        titleSlug
        topicTags {
          __typename
          name
          id
          slug
        }
      }
    }
  }
`;

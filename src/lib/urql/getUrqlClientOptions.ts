import {
  dedupExchange,
  debugExchange,
  fetchExchange,
  ClientOptions,
} from '@urql/core';
import type { SSRExchange } from '@urql/core/dist/types/exchanges/ssr';
import { cacheExchange, Data, StorageAdapter } from '@urql/exchange-graphcache';
import { QuestionDataQuery } from '@/graphql/leetcode/questionData.query';
import { graphqlUrls } from '../graphql/urls';
import { getIsProduction, getIsServer } from '../utils/getEnv';

export const getUrqlClientOptions =
  (storage?: StorageAdapter) =>
  (ssrCache: SSRExchange): ClientOptions => {
    const isClient = !getIsServer();
    const isProduction = getIsProduction();

    return {
      url: graphqlUrls.leetcode,
      exchanges: [
        dedupExchange,
        cacheExchange({
          keys: {
            QuestionNode: (data: Data & QuestionDataQuery['question']) =>
              data?.titleSlug ?? null,
            TopicTagNode: (
              data: Data &
                NonNullable<
                  NonNullable<QuestionDataQuery['question']>['topicTags']
                >[number]
            ) => data.id ?? null,
            PagifiedQuestionNode: () => null,
          },
          ...(storage ? { storage } : {}),
        }),
        ...(isClient && !isProduction ? [debugExchange] : []),
        // ssrExchange has to come after cacheExchange and before fetchExchange,
        ssrCache,
        fetchExchange,
      ],
    };
  };

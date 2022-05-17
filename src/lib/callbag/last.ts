import type { Source } from 'callbag';
import { createSource, consumeSource } from 'callbag-toolkit';

/**
 * Take only last n emitted values from the source
 * @param n optional, number of last emitted values desired
 * @param predicate optional, predicate to filter desired emitted values
 */
export function last<I>(
  n = 1,
  predicate?: (data: I) => boolean
): (source: Source<I>) => Source<I> {
  return function op(inputSource) {
    return createSource(({ next, complete, ...rest }) => {
      const lastVals: I[] = [];
      const consumption = consumeSource(inputSource, {
        next: (data) => {
          if (n <= 0) {
            return;
          }
          if (!predicate || predicate(data)) {
            if (lastVals.length === n) {
              lastVals.shift();
            }
            lastVals.push(data);
          }
        },
        complete: () => {
          lastVals.forEach((item) => {
            next(item);
          });
          consumption && consumption.started && consumption?.stop();
          complete();
        },
        ...rest,
      });
      return consumption;
    });
  };
}

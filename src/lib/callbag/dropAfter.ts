import type { Source } from 'callbag';
import { createSource, consumeSource } from 'callbag-toolkit';

/**
 * Drop the emitted values from the source after the predicate becomes true
 * @param predicate predicate
 * @param inclusive include the value that meet the predicate or not, default to true
 */
export function dropAfter<I>(
  predicate: (data: I) => boolean,
  inclusive = true
): (source: Source<I>) => Source<I> {
  return function op(inputSource) {
    return createSource(({ next, complete, ...rest }) => {
      const consumption = consumeSource(inputSource, {
        next: (data) => {
          if (!predicate(data)) {
            next(data);
          } else {
            if (inclusive) {
              next(data);
            }
            consumption && consumption.started && consumption.stop();
            complete();
          }
        },
        complete,
        ...rest,
      });
      return consumption;
    });
  };
}

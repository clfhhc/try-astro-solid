import type { Source } from 'callbag';
import { consumeSource, createSource } from '@clfhhc/callbag-toolkit';

/**
 * Take the emitted values from the source after the predicate becomes true
 * @param predicate predicate
 * @param inclusive include the value that meet the predicate or not, default to false
 */
export function takeAfter<I>(
  predicate: (data: I) => boolean,
  inclusive = false
): (source: Source<I>) => Source<I> {
  return function op(inputSource) {
    return createSource(({ next, ...rest }) => {
      let pulling = false;
      const consumption = consumeSource(inputSource, {
        next: (data) => {
          if (pulling) {
            next(data);
          } else if (predicate(data)) {
            pulling = true;
            if (inclusive) {
              next(data);
            }
          }
        },
        ...rest,
      });
      return consumption;
    });
  };
}

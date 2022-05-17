import type { Source } from 'callbag';

export function toSubscribable<
  T,
  Next extends (v: T) => void,
  Error extends (err: unknown) => void,
  Complete extends () => void,
  Observer extends { next: Next; error?: Error; complete?: Complete }
>(
  source: Source<T>
): {
  subscribe: (listener: Next | Observer) =>
    | (() => void)
    | {
        unsubscribe: () => void;
      };
} {
  return {
    subscribe(listener) {
      let talkback;
      const { next, error, complete } = (
        (listener as Observer).next ? listener : { next: listener }
      ) as Observer;
      // @ts-ignore
      source(0, (t, d) => {
        try {
          if (t === 0) {
            talkback = d;
          }
          if (t === 1 && next) {
            next(d);
          }
          if (t === 2 && d && error) {
            error(d);
          } else if (t === 2 && complete) {
            complete();
            talkback = void 0;
          }
        } catch (err) {
          error && error(err);
        }
      });

      return function unsubscribe() {
        talkback && talkback(2);
      };
    },
  };
}

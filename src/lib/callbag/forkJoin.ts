import type { Callbag, DATA, END, Sink, Source, START } from 'callbag';
import of from 'callbag-of';

export function forkJoin(sources: []): Source<[]>;
export function forkJoin<T extends readonly (Source<unknown> | undefined)[]>(
  sources: [...T]
): Source<{
  -readonly [P in keyof T]: T[P] extends Source<infer S> ? S : T[P];
}>;
export function forkJoin(sources: any[]): Source<any> {
  // @ts-ignore
  return function op(start: START | DATA | END, sink: Sink<any>) {
    if (start !== 0) return;
    const { length } = sources;
    const values = new Array(length);
    const talkbacks = new Array<Callbag<any, any>>(length);
    let haveEmissions = 0;
    let haveCompletions = 0;
    let done = false;
    let disposed = false;
    let error = false;
    // @ts-ignore
    sink(0, (t) => {
      if (disposed || done || error) {
        return;
      }
      if (t === 2) {
        disposed = true;
      }
    });

    if (!length) {
      sink(1, []);
      done = true;
      sink(2);
    } else {
      sources.forEach((originalSource, sourceIndex) => {
        const source: Source<any> =
          typeof originalSource === 'function'
            ? originalSource
            : of(originalSource);
        source(0, (t, d) => {
          if (t === 0) {
            talkbacks[sourceIndex] = d;
          }
          if (t === 1) {
            if ((haveEmissions & (1 << sourceIndex)) === 0) {
              haveEmissions |= 1 << sourceIndex;
            }
            values[sourceIndex] = d;
          }
          if (t === 2 && !d) {
            haveCompletions |= 1 << sourceIndex;
            talkbacks[sourceIndex] && talkbacks[sourceIndex](2);
            talkbacks[sourceIndex] = undefined;
            if (
              haveCompletions === (1 << length) - 1 ||
              (haveEmissions & (1 << sourceIndex)) === 0
            ) {
              if (haveEmissions === (1 << length) - 1) {
                sink(1, values);
              }
              done = true;
              sink(2);
              return;
            }
          }
          if (t === 2 && d) {
            talkbacks.forEach((talkback) => {
              talkback && talkback(2, d);
            });
            error = true;
            sink(2, d);
          }
        });
      });
    }
  };
}

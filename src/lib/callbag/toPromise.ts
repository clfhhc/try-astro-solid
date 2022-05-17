import type { Source } from 'callbag';
import { consumeSource } from 'callbag-toolkit';

/**
 * convert a callbag to Promise
 * @param inputSource input source
 */
export function toPromise<I>(inputSource: Source<I>): Promise<I> {
  return new Promise((resolve, reject) => {
    let lastVal: I;
    let hasEmitted = false;
    const consumption = consumeSource(
      inputSource,
      {
        next: (data) => {
          hasEmitted = true;
          lastVal = data;
          if (consumption.started) {
            consumption.pull();
          }
        },
        complete: () => {
          if (hasEmitted) {
            resolve(lastVal);
          } else {
            const err = new Error('No elements in sequence.');
            reject(err);
          }
        },
        start: () => {
          consumption.pull();
        },
        error: (err) => {
          consumption && consumption.started && consumption?.stop();
          reject(err);
        },
      },
      true
    );
    consumption.start();
  });
}

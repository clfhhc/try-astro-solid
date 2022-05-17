import fromIter from 'callbag-from-iter';
import fromPromise from 'callbag-from-promise';
import of from 'callbag-of';
import { describe, expect, it } from 'vitest';
import { toPromise } from '../../../lib/callbag/toPromise';

describe('toPromise', () => {
  it('is a function', () => {
    expect(toPromise).toBeTypeOf('function');
  });

  it('should resolve to the last value emitted', async () => {
    const testPromises = [
      expect(toPromise(fromIter([1, 2, 3]))).resolves.toBe(3),
      expect(toPromise(of(5))).resolves.toBe(5),
      expect(toPromise(fromPromise(Promise.resolve(5)))).resolves.toBe(5),
    ];
    await Promise.all(testPromises);
  });

  it('should reject if no values are emitted when complete', async () => {
    const testPromises = [
      expect(toPromise(fromIter([]))).rejects.toThrow(
        'No elements in sequence.'
      ),
    ];
    await Promise.all(testPromises);
  });

  it('should reject if no values are emitted when complete', async () => {
    const testError = 'testing error 1234';
    await expect(
      toPromise(fromPromise(Promise.reject(new Error(testError))))
    ).rejects.toThrow(testError);
  });
});

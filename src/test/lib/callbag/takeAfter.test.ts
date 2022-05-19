import fromIter from 'callbag-from-iter';
import { consumeSource } from '@clfhhc/callbag-toolkit';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { takeAfter } from '@/lib/callbag/takeAfter';

describe('takeAfter', () => {
  const next = vi.fn<[number], void>();
  const complete = vi.fn<[], void>();
  const error = vi.fn<[Error], void>();
  const end = vi.fn<[], void>();

  afterEach(() => {
    next.mockClear();
    complete.mockClear();
    error.mockClear();
    end.mockClear();
  });

  it('is a function', () => {
    expect(takeAfter).toBeTypeOf('function');
  });

  it('should take after the predicate', () => {
    const source = takeAfter<number>((data) => data >= 1)(fromIter([1, 2, 3]));

    const handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    handlers.pull();
    expect(next).toHaveBeenCalledTimes(0);
    handlers.pull();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith(2);
    handlers.pull();
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenLastCalledWith(3);
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });

  it('should take after the predicate, with inclusive equal false', () => {
    const source = takeAfter<number>(
      (data) => data >= 1,
      false
    )(fromIter([1, 2, 3]));

    const handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    handlers.pull();
    expect(next).toHaveBeenCalledTimes(0);
    handlers.pull();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith(2);
    handlers.pull();
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenLastCalledWith(3);
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });

  it('should take one data before the predicate, with inclusive equal true', () => {
    const source = takeAfter<number>(
      (data) => data >= 1,
      true
    )(fromIter([1, 2, 3]));

    const handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    handlers.pull();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith(1);
    handlers.pull();
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenLastCalledWith(2);
    handlers.pull();
    expect(next).toHaveBeenCalledTimes(3);
    expect(next).toHaveBeenLastCalledWith(3);
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });

  it('should take no data if the predicate is always false', () => {
    const source = takeAfter<number>((data) => data < 0)(fromIter([1, 2, 3]));

    const handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    Array.from(Array(4)).forEach(() => {
      handlers.pull();
      expect(next).not.toHaveBeenCalled();
    });
    expect(handlers.started).toBe(false);
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });
});

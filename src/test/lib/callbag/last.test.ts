import fromIter from 'callbag-from-iter';
import { consumeSource } from '@clfhhc/callbag-toolkit';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { last } from '../../../lib/callbag/last';

describe('last', () => {
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
    expect(last).toBeTypeOf('function');
  });

  it('should take the last emitted value from the source', () => {
    const source = last()(fromIter([1, 2, 3]));

    const handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    for (let i = 0; i < 3; i += 1) {
      handlers.pull();
      expect(next).not.toHaveBeenCalled();
    }
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith(3);
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });

  it('should take the last n number', () => {
    const source = last(2)(fromIter([1, 2, 3, 4, 5, 6, 7, 8]));

    const handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    for (let i = 0; i < 8; i += 1) {
      handlers.pull();
      expect(next).not.toHaveBeenCalled();
    }
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith(7);
    expect(next).toHaveBeenCalledWith(8);
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });

  it('should take the last n number that match the predicate', () => {
    const source = last<number>(
      2,
      (n) => n % 2 === 1
    )(fromIter([1, 2, 3, 4, 5, 6, 7, 8]));

    const handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    for (let i = 0; i < 8; i += 1) {
      handlers.pull();
      expect(next).not.toHaveBeenCalled();
    }
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith(5);
    expect(next).toHaveBeenCalledWith(7);
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });

  it('should take the last number that match the predicate if n is not provided', () => {
    const source = last<number>(
      undefined,
      (n) => n % 2 === 1
    )(fromIter([1, 2, 3, 4, 5, 6, 7, 8]));

    const handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    for (let i = 0; i < 8; i += 1) {
      handlers.pull();
      expect(next).not.toHaveBeenCalled();
    }
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(7);
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });

  it('should not emit any value from the source if n is not a positive number', () => {
    let source = last<number>(null, (n) => n % 2 === 1)(fromIter([1, 2, 3, 4]));

    let handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    for (let i = 0; i < 4; i += 1) {
      handlers.pull();
      expect(next).not.toHaveBeenCalled();
    }
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(next).not.toHaveBeenCalled();
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );

    source = last<number>(0, (n) => n % 2 === 1)(fromIter([1, 2, 3, 4]));

    handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    for (let i = 0; i < 4; i += 1) {
      handlers.pull();
      expect(next).not.toHaveBeenCalled();
    }
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(next).not.toHaveBeenCalled();
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );

    source = last<number>(-1, (n) => n % 2 === 1)(fromIter([1, 2, 3, 4]));

    handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    for (let i = 0; i < 4; i += 1) {
      handlers.pull();
      expect(next).not.toHaveBeenCalled();
    }
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(next).not.toHaveBeenCalled();
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });

  it('should not emit any value from the source if predicate is always false', () => {
    const source = last<number>(1, (n) => n < 0)(fromIter([1, 2, 3, 4]));

    const handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    for (let i = 0; i < 4; i += 1) {
      handlers.pull();
      expect(next).not.toHaveBeenCalled();
    }
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(next).not.toHaveBeenCalled();
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });

  it('should emit all values from the source if n is greater than emitted values length', () => {
    const source = last<number>(5, (n) => n > 0)(fromIter([1, 2, 3, 4]));

    const handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    for (let i = 0; i < 4; i += 1) {
      handlers.pull();
      expect(next).not.toHaveBeenCalled();
    }
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(next).toHaveBeenCalledTimes(4);
    for (let i = 0; i < 4; i += 1) {
      expect(next).toHaveBeenCalledWith(i + 1);
    }
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });

  it('should emit all values from the source if n is greater than length of all emitted values that matches the predicate', () => {
    const source = last<number>(3, (n) => n % 2 === 0)(fromIter([1, 2, 3, 4]));

    const handlers = consumeSource(source, {
      next,
      complete,
      error,
      end,
    });

    expect(handlers.started).toBe(true);
    expect(next).not.toHaveBeenCalled();
    for (let i = 0; i < 4; i += 1) {
      handlers.pull();
      expect(next).not.toHaveBeenCalled();
    }
    handlers.pull();
    expect(handlers.started).toBe(false);
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith(2);
    expect(next).toHaveBeenCalledWith(4);
    expect(handlers.pull).toThrowErrorMatchingInlineSnapshot(
      `"Cannot pull from source that is not started."`
    );
    expect(handlers.stop).toThrowErrorMatchingInlineSnapshot(
      `"Cannot stop a source that is not started."`
    );
  });
});

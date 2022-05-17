import type { Source } from 'callbag';
import pipe from 'callbag-pipe';
import scan from 'callbag-scan';
import * as callbagToolkit from 'callbag-toolkit';
import { read, openSync, closeSync } from 'node:fs';
import { dropAfter } from '../callbag/dropAfter';
import { last } from '../callbag/last';
import { takeAfter } from '../callbag/takeAfter';
import { toPromise } from '../callbag/toPromise';

const { createSource } = callbagToolkit;

const defaultBufferSize = 1e2;

export type ReadBytesResolve = (result: {
  bytesRead: number;
  buffer: Buffer;
}) => void;

export type ReadBytesReject = (err: NodeJS.ErrnoException) => void;

export type CreateReadSource = (
  filePath: string,
  bufferSize?: number
) => Source<string>;

export interface ExtractFileSectionSourceProps {
  filePath: string;
  bufferSize?: number;
  startPredicate?: (line: string) => boolean;
  endPredicate?: (line: string) => boolean;
  createLineSource?: CreateReadSource;
}

export function readBytes({
  fd,
  sharedBuffer,
  position = null,
  resolve,
  reject = console.error,
}: {
  fd: number;
  sharedBuffer: Buffer;
  position?: number | null;
  resolve: ReadBytesResolve;
  reject?: ReadBytesReject;
}) {
  read(
    fd,
    sharedBuffer,
    0,
    sharedBuffer.length,
    position,
    (err, bytesRead, buffer) => {
      if (err) {
        return reject(err);
      }
      return resolve({ bytesRead, buffer });
    }
  );
}

export function createReadBytesSource(
  filePath: string,
  bufferSize = defaultBufferSize
) {
  return createSource<Buffer>(({ next, complete, start, error }) => {
    const sharedBuffer = Buffer.alloc(bufferSize);
    const fd = openSync(filePath, 'r');
    let position = 0;
    let paused = false;

    const reject: ReadBytesReject = (err) => {
      try {
        closeSync(fd);
      } catch {}
      error(err);
    };

    const resolve: ReadBytesResolve = ({ buffer, bytesRead }) => {
      if (!paused) {
        next(buffer.slice(0, bytesRead));
        position += bytesRead;
        if (bytesRead === 0) {
          try {
            closeSync(fd);
          } catch {}
          complete();
          return;
        }
        readBytes({ fd, sharedBuffer, position, resolve, reject });
      }
    };

    start();
    readBytes({ fd, sharedBuffer, position, resolve, reject });

    return {
      pull: () => {
        paused = false;
      },
      stop: () => {
        paused = true;
      },
    };
  });
}

export const createReadLineSource: CreateReadSource = (
  filePath,
  bufferSize = defaultBufferSize
) => {
  return createSource<string>(({ next, start, complete, error }) => {
    const sharedBuffer = Buffer.alloc(bufferSize);
    const fd = openSync(filePath, 'r');
    let position = 0;
    let paused = false;
    let data = '';

    const reject: ReadBytesReject = (err) => {
      try {
        closeSync(fd);
      } catch {}
      error(err);
    };

    const resolve: ReadBytesResolve = ({ buffer, bytesRead }) => {
      if (!paused) {
        if (bytesRead === 0) {
          next(data);
          try {
            closeSync(fd);
          } catch {}
          complete();
          return;
        }
        data += buffer.toString('utf-8', 0, bytesRead);
        const parts = data.split('\n');
        data = parts.pop() || '';
        parts.forEach(next);
        position += bytesRead;
        readBytes({ fd, sharedBuffer, position, resolve, reject });
      }
    };

    start();
    readBytes({ fd, sharedBuffer, position, resolve, reject });

    return {
      pull: () => {
        paused = false;
      },
      stop: () => {
        paused = true;
      },
    };
  });
};

export const extractFileSectionSource = ({
  filePath,
  bufferSize = defaultBufferSize,
  startPredicate,
  endPredicate,
  createLineSource = createReadLineSource,
}: ExtractFileSectionSourceProps) => {
  let source = createLineSource(filePath, bufferSize);

  startPredicate && (source = pipe(source, takeAfter(startPredicate, true)));
  endPredicate && (source = pipe(source, dropAfter(endPredicate, true)));

  return pipe(
    source,
    scan<string, string>(
      (accu, line) => (accu === undefined ? line : `${accu}\n${line}`),
      undefined
    ),
    last(1)
  );
};

export const extractFileSection = (arg: ExtractFileSectionSourceProps) =>
  pipe(extractFileSectionSource(arg), toPromise);

export const readWholeFileSource: CreateReadSource = (
  filePath,
  bufferSize = defaultBufferSize
) => {
  return pipe(
    createReadBytesSource(filePath, bufferSize),
    scan((accu, buffer) => accu + buffer.toString('utf-8'), ''),
    last(1)
  );
};

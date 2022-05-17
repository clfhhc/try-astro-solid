import pipe from 'callbag-pipe';
import scan from 'callbag-scan';
import { createSource } from '@clfhhc/callbag-toolkit';
import { closeSync, openSync, write } from 'node:fs';
import { toPromise } from '../callbag/toPromise';

const defaultBufferSize = 1e5;

export type WriteBytesResolve = (result: {
  bytesWriten: number;
  buffer: Buffer;
}) => void;

export type WriteBytesReject = (err: NodeJS.ErrnoException) => void;

export interface WriteFileProps {
  text: string;
  filePath: string;
  bufferSize?: number;
}

export function writeBytes({
  fd,
  sharedBuffer,
  start = 0,
  end = sharedBuffer.length,
  position = 0,
  resolve,
  reject = console.error,
}: {
  fd: number;
  sharedBuffer: Buffer;
  start?: number;
  end?: number;
  position?: number;
  resolve: WriteBytesResolve;
  reject?: WriteBytesReject;
}) {
  write(fd, sharedBuffer, start, end, position, (err, bytesWriten, buffer) => {
    if (err) {
      return reject(err);
    }
    return resolve({ bytesWriten, buffer });
  });
}

export const createWriteBytesSource = ({
  text,
  filePath,
  bufferSize = defaultBufferSize,
}: WriteFileProps) => {
  return createSource<Buffer>(({ next, complete, start, error }) => {
    const sharedBuffer = Buffer.alloc(bufferSize);
    const fd = openSync(filePath, 'w');
    const totalLength = text.length;
    let position = 0;
    let bytesToWrite = Math.min(bufferSize, totalLength);
    let paused = false;

    const reject: WriteBytesReject = (err) => {
      try {
        closeSync(fd);
      } catch {}
      error(err);
    };

    const resolve: WriteBytesResolve = ({ buffer, bytesWriten }) => {
      if (!paused) {
        next(buffer.slice(0, bytesToWrite));
        position += bytesWriten;
        bytesToWrite = Math.min(bufferSize, totalLength - position);
        if (bytesToWrite === 0) {
          try {
            closeSync(fd);
          } catch {}
          complete();
          return;
        }
        sharedBuffer.fill(
          text.substring(position, position + bytesToWrite),
          0,
          bytesToWrite,
          'utf-8'
        );
        writeBytes({
          fd,
          sharedBuffer,
          end: bytesToWrite,
          position,
          resolve,
          reject,
        });
      }
    };

    start();
    if (bytesToWrite === 0) {
      next(sharedBuffer.slice(0, bytesToWrite));
      complete();
    } else {
      sharedBuffer.fill(
        text.substring(position, position + bytesToWrite),
        0,
        bytesToWrite,
        'utf-8'
      );
      writeBytes({
        fd,
        sharedBuffer,
        end: bytesToWrite,
        position,
        resolve,
        reject,
      });
    }

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

export const writeWholeFileAndOutputBuffer = ({
  text,
  filePath,
  bufferSize = defaultBufferSize,
}: WriteFileProps) => {
  return pipe(
    createWriteBytesSource({ text, filePath, bufferSize }),
    scan((accu, buffer) => Buffer.concat([accu, buffer]), Buffer.from('')),
    toPromise
  );
};

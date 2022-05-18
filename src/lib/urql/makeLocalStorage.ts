import { SerializedEntries, StorageAdapter } from '@urql/exchange-graphcache';
import pipe from 'callbag-pipe';
import map from 'callbag-map';
import { toPromise } from '../callbag/toPromise';
import { readWholeFileSource } from '../utils/readFile';
import { createWriteBytesSource } from '../utils/writeFile';
import { resolve } from 'path';

const defaultDataPath = resolve(process.cwd(), './tmp/cache/data');

export const makeLocalStorage = ({
  dataPath = defaultDataPath,
  shouldWrite = true,
  shouldRead = true,
}: {
  dataPath?: string;
  shouldWrite?: boolean;
  shouldRead?: boolean;
} = {}): StorageAdapter => {
  const cache: SerializedEntries = {};

  return {
    async writeData(delta) {
      Object.assign(cache, delta);

      if (!shouldWrite || !Object.keys(delta).length) {
        return;
      }

      console.info('Writing cache');
      await pipe(
        createWriteBytesSource({
          text: JSON.stringify(cache),
          filePath: dataPath,
        }),
        toPromise
      );
    },
    async readData() {
      if (!shouldRead) {
        return cache;
      }
      console.info('Reading cache');
      return pipe(
        readWholeFileSource(dataPath),
        map((local) => {
          if (local) {
            try {
              Object.assign(cache, JSON.parse(local));
            } catch (err) {
              console.error(
                'error parsing cache file: ',
                (err as Error)?.message
              );
              return cache;
            }
          }
          return cache;
        }),
        toPromise
      ).catch((err) => {
        console.error('error reading cache file: ', err.message);
        return {};
      });
    },
  };
};

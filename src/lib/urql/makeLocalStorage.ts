import { SerializedEntries, StorageAdapter } from '@urql/exchange-graphcache';
import pipe from 'callbag-pipe';
import map from 'callbag-map';
import * as _ from 'lodash';
import { toPromise } from '../callbag/toPromise';
import { readWholeFileSource } from '../utils/readFile';
import { createWriteBytesSource } from '../utils/writeFile';

const defaultDataPath = new URL('../../../tmp/cache/data', import.meta.url)
  .pathname;

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

      if (!shouldWrite || _.isEmpty(delta)) {
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

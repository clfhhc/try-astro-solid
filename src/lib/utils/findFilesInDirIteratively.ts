import { readdirSync, statSync, promises } from 'node:fs';
import * as path from 'node:path';

const { readdir, stat } = promises;

export const findFilesInDirIteratively = (...dirList: string[]) => {
  const files: string[] = [];
  const dirInRead: string[] = [...dirList];

  while (dirInRead.length) {
    const dirPath = dirInRead.shift();
    if (dirPath) {
      try {
        const dirContent = readdirSync(dirPath);
        const extraDir: string[] = [];
        dirContent.forEach((content) => {
          const contentPath = path.join(dirPath, content);
          const stats = statSync(contentPath);
          if (stats?.isFile()) {
            files.push(contentPath);
          } else if (stats?.isDirectory()) {
            extraDir.push(contentPath);
          }
        });
        dirInRead.unshift(...extraDir);
      } catch (err) {
        console.warn('cannot access path from: ', dirPath);
      }
    }
  }

  return files;
};

export const findFilesInDirIterativelyAsync = async (...dirList: string[]) => {
  const files: string[] = [];
  const dirInRead: string[] = [...dirList];

  /* eslint-disable no-await-in-loop */
  while (dirInRead.length) {
    const dirPath = dirInRead.shift();
    if (dirPath) {
      try {
        const dirContent = await readdir(dirPath);
        await Promise.all(
          dirContent.map(async (content) => {
            const contentPath = path.join(dirPath, content);
            const contentStat = await stat(contentPath);
            if (contentStat.isFile()) {
              files.push(contentPath);
            } else if (contentStat.isDirectory()) {
              dirInRead.push(contentPath);
            }
          })
        );
      } catch {
        console.warn('cannot access path from: ', dirPath);
      }
    }
  }
  /* eslint-enable no-await-in-loop */

  return files;
};

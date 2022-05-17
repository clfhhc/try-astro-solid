import { findFilesInDirIterativelyAsync } from '@/lib/utils/findFilesInDirIteratively';
import { parse, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface SlugIndexed<T> {
  [slug: string]: T;
}
const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultLeetcodeFolderPath = resolve(process.cwd(), './src/leetcode');
console.log('__dirname: ', __dirname);
console.log('getLeetcodeFolderPath: ', defaultLeetcodeFolderPath);

export const getLocalLeetcodeSlugs = async (
  folderPath: string = defaultLeetcodeFolderPath
) =>
  (await findFilesInDirIterativelyAsync(folderPath)).reduce<
    SlugIndexed<{ slug: string }>
  >((obj, filePath) => {
    const relativePath = relative(folderPath, filePath);
    const pathParts = parse(relativePath);
    const slug = pathParts.name;
    const relativePathMinusExtension = `${
      pathParts.dir ? `${pathParts.dir}/` : ''
    }${pathParts.name}`;
    return {
      ...obj,
      [relativePathMinusExtension]: { slug },
    };
  }, {});

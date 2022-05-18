import { findFilesInDirIterativelyAsync } from '@/lib/utils/findFilesInDirIteratively';
import { parse, relative, resolve } from 'node:path';

export interface SlugIndexed<T> {
  [slug: string]: T;
}
// to accommodate both non-compiled and compiled scripts, use process.cwd()
const defaultLeetcodeFolderPath = resolve(process.cwd(), './src/leetcode');

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

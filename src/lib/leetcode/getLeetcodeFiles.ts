import { findFilesInDirIterativelyAsync } from '../utils/findFilesInDirIteratively';
import { parse, relative, resolve } from 'node:path';

export interface SlugIndexed<T> {
  [slug: string]: T;
}
// to accommodate both non-compiled and compiled scripts, use process.cwd()
export const defaultLeetcodeFolderPath = resolve(
  process.cwd(),
  './src/leetcode'
);

export async function getLocalLeetcodeSlugs<T>({
  folderPath = defaultLeetcodeFolderPath,
  getExtraItems,
}: {
  folderPath?: string;
  getExtraItems?: (filePath: string) => T | Promise<T>;
} = {}): Promise<SlugIndexed<T & { slug: string; filePath: string }>> {
  const filePaths = await findFilesInDirIterativelyAsync(folderPath);
  const requestAllItems = filePaths.map(async (filePath) => {
    const relativePath = relative(folderPath, filePath);
    const pathParts = parse(relativePath);
    const slug = pathParts.name;
    const relativePathMinusExtension = `${
      pathParts.dir ? `${pathParts.dir}/` : ''
    }${pathParts.name}`;
    const extraItems = getExtraItems
      ? await getExtraItems(filePath)
      : ({} as T);
    return {
      slug,
      relativePath: relativePathMinusExtension,
      filePath,
      ...extraItems,
    };
  });
  const allItems = await Promise.all(requestAllItems);
  return allItems.reduce(
    (obj, { relativePath, ...rest }) => ({
      ...obj,
      [relativePath]: rest,
    }),
    {}
  );
}

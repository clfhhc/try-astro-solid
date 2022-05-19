import { TestCaseWithFunction } from '@/lib/utils/types';
import { getLocalLeetcodeSlugs } from './getLeetcodeFiles';

export interface ImportedObj {
  testCases: TestCaseWithFunction[];
}

export async function importLocalLeetcodeFiles() {
  return getLocalLeetcodeSlugs<ImportedObj>({
    getExtraItems: async (filePath) => import(filePath),
  });
}

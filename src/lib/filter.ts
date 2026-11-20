import type { WorkItem } from '../types';

export const CATEGORY_ALL = '__all__';
export const CATEGORY_NONE = '__none__';

/** CATEGORY_ALL | CATEGORY_NONE | 분야 id */
export type CategoryFilter = string;
export type TypeFilter = 'all' | 'mine' | 'handover';

export type Filters = {
  query: string;
  category: CategoryFilter;
  type: TypeFilter;
};

export const INITIAL_FILTERS: Filters = { query: '', category: CATEGORY_ALL, type: 'all' };

export function isFiltering(filters: Filters): boolean {
  return filters.query.trim() !== '' || filters.category !== CATEGORY_ALL || filters.type !== 'all';
}

/** 업무명 부분 일치(대소문자·앞뒤 공백 무시) AND 분야 AND 구분 */
export function filterItems(items: WorkItem[], filters: Filters): WorkItem[] {
  const query = filters.query.trim().toLowerCase();
  return items.filter((item) => {
    if (query !== '' && !item.title.toLowerCase().includes(query)) return false;
    if (filters.category === CATEGORY_NONE && item.categoryId !== null) return false;
    if (
      filters.category !== CATEGORY_ALL &&
      filters.category !== CATEGORY_NONE &&
      item.categoryId !== filters.category
    ) {
      return false;
    }
    if (filters.type !== 'all' && item.type !== filters.type) return false;
    return true;
  });
}

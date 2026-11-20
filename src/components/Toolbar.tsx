import type { WorkCategory } from '../types';
import { CATEGORY_ALL, CATEGORY_NONE, type Filters, type TypeFilter } from '../lib/filter';
import { UNCATEGORIZED_LABEL } from '../lib/labels';
import styles from './Toolbar.module.css';

type Props = {
  filters: Filters;
  categories: WorkCategory[];
  onChange: (filters: Filters) => void;
  onManageCategories: () => void;
};

export function Toolbar({ filters, categories, onChange, onManageCategories }: Props) {
  return (
    <div className={styles.toolbar}>
      <input
        type="search"
        className={`input ${styles.search}`}
        placeholder="업무명 검색"
        aria-label="업무명 검색"
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
      />
      <select
        className={`select ${styles.filter}`}
        aria-label="업무 분야 필터"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        <option value={CATEGORY_ALL}>분야: 전체</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
        <option value={CATEGORY_NONE}>{UNCATEGORIZED_LABEL}</option>
      </select>
      <select
        className={`select ${styles.filter}`}
        aria-label="업무 구분 필터"
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value as TypeFilter })}
      >
        <option value="all">구분: 전체</option>
        <option value="mine">내 업무</option>
        <option value="handover">이관할 업무</option>
      </select>
      <button type="button" className="btn" onClick={onManageCategories}>
        분야 관리
      </button>
    </div>
  );
}

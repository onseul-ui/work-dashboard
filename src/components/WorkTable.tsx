import type { WorkCategory, WorkItem } from '../types';
import { UNCATEGORIZED_LABEL } from '../lib/labels';
import { TypeBadge } from './Badges';
import styles from './WorkTable.module.css';

type Props = {
  items: WorkItem[];
  categories: WorkCategory[];
  /** 전체 업무가 0개인지 (빈 상태 문구 구분용) */
  hasAnyItem: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (item: WorkItem) => void;
};

function CheckCell({ item, checked }: { item: WorkItem; checked: boolean }) {
  if (item.type === 'mine') return <span className="muted">-</span>;
  return <span aria-label={checked ? '체크됨' : '체크 안 됨'}>{checked ? '✔' : ''}</span>;
}

export function WorkTable({ items, categories, hasAnyItem, selectedId, onSelect, onDelete }: Props) {
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <colgroup>
          <col className={styles.colCategory} />
          <col />
          <col className={styles.colType} />
          <col className={styles.colCheck} />
          <col className={styles.colCheck} />
          <col className={styles.colAction} />
        </colgroup>
        <thead>
          <tr>
            <th>업무 분야</th>
            <th>업무명</th>
            <th>업무 구분</th>
            <th className={styles.center}>이관 준비 완료</th>
            <th className={styles.center}>이관 완료</th>
            <th>
              <span className={styles.srOnly}>삭제</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={item.id === selectedId ? styles.selected : undefined}
              onClick={() => onSelect(item.id)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target === e.currentTarget) onSelect(item.id);
              }}
              aria-selected={item.id === selectedId}
            >
              <td className={styles.ellipsis}>
                {item.categoryId === null ? (
                  <span className="muted">{UNCATEGORIZED_LABEL}</span>
                ) : (
                  categoryName.get(item.categoryId) ?? UNCATEGORIZED_LABEL
                )}
              </td>
              <td className={`${styles.ellipsis} ${styles.title}`}>{item.title}</td>
              <td>
                <TypeBadge type={item.type} />
              </td>
              <td className={styles.center}>
                <CheckCell item={item} checked={item.handoverPrepared} />
              </td>
              <td className={styles.center}>
                <CheckCell item={item} checked={item.handoverPrepared && item.handoverCompleted} />
              </td>
              <td className={styles.center}>
                <button
                  type="button"
                  className="btn btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                  }}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <p className={styles.empty}>
          {hasAnyItem
            ? '조건에 맞는 업무가 없습니다.'
            : '등록된 업무가 없습니다. [+ 업무 추가]로 시작하세요.'}
        </p>
      )}
    </div>
  );
}

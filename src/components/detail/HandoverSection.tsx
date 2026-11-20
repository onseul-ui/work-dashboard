import type { WorkItem } from '../../types';
import { useData } from '../../state/DataContext';
import { getHandoverStatus } from '../../lib/status';
import { StatusBadge } from '../Badges';
import form from '../Form.module.css';
import section from './Section.module.css';
import styles from './HandoverSection.module.css';

/** 이관 체크. type === "handover"일 때만 렌더링된다. */
export function HandoverSection({ item }: { item: WorkItem }) {
  const { dispatch } = useData();
  const prepared = item.handoverPrepared;
  const completed = item.handoverPrepared && item.handoverCompleted;

  function set(nextPrepared: boolean, nextCompleted: boolean) {
    dispatch({ type: 'setHandover', id: item.id, prepared: nextPrepared, completed: nextCompleted });
  }

  function togglePrepared(checked: boolean) {
    // 준비 완료 해제 시 이관 완료도 함께 해제
    set(checked, checked ? completed : false);
  }

  function toggleCompleted(checked: boolean) {
    if (!checked) {
      set(prepared, false);
      return;
    }
    if (!prepared) {
      if (!window.confirm('이관 준비 완료가 체크되지 않았습니다. 준비 완료도 함께 체크할까요?')) return;
      set(true, true);
      return;
    }
    set(true, true);
  }

  return (
    <section className={section.section}>
      <div className={styles.headRow}>
        <h3 className={section.heading}>이관 체크</h3>
        <StatusBadge status={getHandoverStatus(item)} />
      </div>
      <div className={styles.checks}>
        <label className={form.radio}>
          <input
            type="checkbox"
            checked={prepared}
            onChange={(e) => togglePrepared(e.target.checked)}
          />
          이관 준비 완료
        </label>
        <label className={form.radio}>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => toggleCompleted(e.target.checked)}
          />
          이관 완료
        </label>
      </div>
    </section>
  );
}

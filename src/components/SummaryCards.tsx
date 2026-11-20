import type { SummaryCounts } from '../lib/status';
import styles from './SummaryCards.module.css';

const CARDS: { key: keyof SummaryCounts; label: string }[] = [
  { key: 'mine', label: '내 업무' },
  { key: 'handover', label: '이관할 업무' },
  { key: 'prepared', label: '준비 완료' },
  { key: 'completed', label: '이관 완료' },
];

/** 숫자 표시 전용. 클릭 동작 없음. */
export function SummaryCards({ counts }: { counts: SummaryCounts }) {
  return (
    <section className={styles.cards} aria-label="업무 현황">
      {CARDS.map((card) => (
        <div key={card.key} className={styles.card}>
          <span className={styles.label}>{card.label}</span>
          <span className={styles.count}>{counts[card.key]}</span>
        </div>
      ))}
    </section>
  );
}

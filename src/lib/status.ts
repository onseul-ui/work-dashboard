import type { WorkItem } from '../types';

export type HandoverStatus = 'notReady' | 'prepared' | 'completed';

export const HANDOVER_STATUS_LABEL: Record<HandoverStatus, string> = {
  notReady: '준비 전',
  prepared: '준비 완료',
  completed: '이관 완료',
};

/** 이관 상태 (type === "handover"일 때만 의미가 있다) */
export function getHandoverStatus(
  item: Pick<WorkItem, 'handoverPrepared' | 'handoverCompleted'>,
): HandoverStatus {
  if (item.handoverPrepared && item.handoverCompleted) return 'completed';
  if (item.handoverPrepared) return 'prepared';
  return 'notReady';
}

export type SummaryCounts = {
  mine: number;
  handover: number;
  prepared: number;
  completed: number;
};

/** 현황 카드 집계. 검색·필터와 무관하게 전체 업무 기준. */
export function getSummaryCounts(items: WorkItem[]): SummaryCounts {
  const counts: SummaryCounts = { mine: 0, handover: 0, prepared: 0, completed: 0 };
  for (const item of items) {
    if (item.type === 'mine') {
      counts.mine += 1;
      continue;
    }
    counts.handover += 1;
    const status = getHandoverStatus(item);
    if (status === 'prepared') counts.prepared += 1;
    else if (status === 'completed') counts.completed += 1;
  }
  return counts;
}

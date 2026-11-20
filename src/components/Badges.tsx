import type { WorkType } from '../types';
import { HANDOVER_STATUS_LABEL, type HandoverStatus } from '../lib/status';
import { TYPE_LABEL } from '../lib/labels';

export function TypeBadge({ type }: { type: WorkType }) {
  return <span className={`badge ${type === 'mine' ? 'badge-mine' : 'badge-handover'}`}>{TYPE_LABEL[type]}</span>;
}

export function StatusBadge({ status }: { status: HandoverStatus }) {
  return (
    <span className={`badge ${status === 'notReady' ? 'badge-neutral' : 'badge-handover'}`}>
      {HANDOVER_STATUS_LABEL[status]}
    </span>
  );
}

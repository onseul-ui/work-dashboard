import type { WorkTextField } from '../../types';
import { AutoTextarea } from '../AutoTextarea';
import type { TextDraft } from './DetailPanel';
import form from '../Form.module.css';
import section from './Section.module.css';

const FIELDS: { field: WorkTextField; label: string }[] = [
  { field: 'prerequisites', label: '시작 전 확인사항' },
  { field: 'procedures', label: '수행 절차' },
  { field: 'tools', label: '사용 시스템·도구' },
  { field: 'validation', label: '완료 시 확인사항' },
];

type Props = {
  draft: TextDraft;
  onText: (field: WorkTextField, value: string) => void;
};

export function MethodSection({ draft, onText }: Props) {
  return (
    <section className={section.section}>
      <h3 className={section.heading}>업무 수행 방법</h3>
      {FIELDS.map(({ field, label }) => (
        <div key={field} className={form.field}>
          <label className={form.label} htmlFor={`detail-${field}`}>
            {label}
          </label>
          <AutoTextarea
            id={`detail-${field}`}
            value={draft[field]}
            onChange={(v) => onText(field, v)}
            minRows={3}
          />
        </div>
      ))}
    </section>
  );
}

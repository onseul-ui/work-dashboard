import type { WorkTextField } from '../../types';
import { AutoTextarea } from '../AutoTextarea';
import type { TextDraft } from './DetailPanel';
import section from './Section.module.css';

type Props = {
  draft: TextDraft;
  onText: (field: WorkTextField, value: string) => void;
};

export function NotesSection({ draft, onText }: Props) {
  return (
    <section className={section.section}>
      <h3 className={section.heading}>주의사항</h3>
      <AutoTextarea
        ariaLabel="주의사항"
        value={draft.notes}
        onChange={(v) => onText('notes', v)}
        placeholder="자주 발생하는 문제 / 예외 처리 방법 / 관련 정책 / 기타 참고사항"
        minRows={3}
      />
    </section>
  );
}

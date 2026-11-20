import type { WorkItem, WorkTextField, WorkType } from '../../types';
import { CategorySelect } from '../CategorySelect';
import { TypeRadio } from '../TypeRadio';
import { AutoTextarea } from '../AutoTextarea';
import type { TextDraft } from './DetailPanel';
import form from '../Form.module.css';
import section from './Section.module.css';

type Props = {
  item: WorkItem;
  draft: TextDraft;
  onText: (field: WorkTextField, value: string) => void;
  onTitleBlur: () => void;
  onCategory: (categoryId: string | null) => void;
  onType: (type: WorkType) => void;
};

export function OverviewSection({ item, draft, onText, onTitleBlur, onCategory, onType }: Props) {
  return (
    <section className={section.section}>
      <h3 className={section.heading}>업무 개요</h3>
      <div className={form.field}>
        <label className={form.label} htmlFor="detail-title">
          업무명
        </label>
        <input
          id="detail-title"
          className="input"
          value={draft.title}
          onChange={(e) => onText('title', e.target.value)}
          onBlur={onTitleBlur}
        />
      </div>
      <div className={form.field}>
        <label className={form.label} htmlFor="detail-category">
          업무 분야
        </label>
        <CategorySelect id="detail-category" value={item.categoryId} onChange={onCategory} />
      </div>
      <div className={form.field}>
        <span className={form.label}>업무 구분</span>
        <TypeRadio name="detail-type" value={item.type} onChange={onType} />
      </div>
      <div className={form.field}>
        <label className={form.label} htmlFor="detail-description">
          업무 설명
        </label>
        <AutoTextarea
          id="detail-description"
          value={draft.description}
          onChange={(v) => onText('description', v)}
        />
      </div>
      <div className={form.field}>
        <label className={form.label} htmlFor="detail-frequency">
          수행 주기
        </label>
        <input
          id="detail-frequency"
          className="input"
          placeholder="예: 매주 월요일, 월말"
          value={draft.frequency}
          onChange={(e) => onText('frequency', e.target.value)}
        />
      </div>
    </section>
  );
}

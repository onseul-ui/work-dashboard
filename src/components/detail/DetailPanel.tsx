import { useCallback, useEffect, useRef, useState } from 'react';
import type { WorkItem, WorkTextField } from '../../types';
import { useData } from '../../state/DataContext';
import type { ItemPatch } from '../../state/reducer';
import { TypeBadge } from '../Badges';
import { OverviewSection } from './OverviewSection';
import { MethodSection } from './MethodSection';
import { NotesSection } from './NotesSection';
import { LinksSection } from './LinksSection';
import { HandoverSection } from './HandoverSection';
import styles from './DetailPanel.module.css';

const SAVE_DELAY_MS = 500;

export type TextDraft = Record<WorkTextField, string>;

function toDraft(item: WorkItem): TextDraft {
  return {
    title: item.title,
    description: item.description,
    frequency: item.frequency,
    prerequisites: item.prerequisites,
    procedures: item.procedures,
    tools: item.tools,
    validation: item.validation,
    notes: item.notes,
  };
}

type Props = {
  item: WorkItem;
  onClose: () => void;
};

/**
 * 상세 패널. 업무가 바뀌면 key로 다시 마운트된다.
 * 텍스트는 500ms 디바운스로 저장하고, 언마운트(다른 행 선택·닫기)나 입력칸을 벗어날 때
 * 대기 중인 저장을 즉시 반영한다. (패널을 연 채 [백업]을 눌러도 최신 내용이 들어가도록)
 */
export function DetailPanel({ item, onClose }: Props) {
  const { dispatch } = useData();
  const [draft, setDraft] = useState<TextDraft>(() => toDraft(item));
  const [pending, setPending] = useState(false);

  const itemId = item.id;
  const draftRef = useRef(draft);
  const dirtyRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const flush = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    const { title, ...rest } = draftRef.current;
    const patch: ItemPatch = { ...rest };
    if (title.trim() !== '') patch.title = title.trim();
    dispatch({ type: 'updateItem', id: itemId, patch });
    setPending(false);
  }, [dispatch, itemId]);

  // 언마운트 시 대기 중인 저장 반영
  useEffect(() => flush, [flush]);

  function changeText(field: WorkTextField, value: string) {
    const next = { ...draftRef.current, [field]: value };
    draftRef.current = next;
    dirtyRef.current = true;
    setDraft(next);
    setPending(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(flush, SAVE_DELAY_MS);
  }

  /** 업무명을 비운 채 벗어나면 이전 값으로 되돌린다. */
  function handleTitleBlur() {
    if (draftRef.current.title.trim() === '') {
      const next = { ...draftRef.current, title: item.title };
      draftRef.current = next;
      setDraft(next);
    }
  }

  function updateNow(patch: ItemPatch) {
    flush();
    dispatch({ type: 'updateItem', id: itemId, patch });
  }

  const shownTitle = draft.title.trim() === '' ? item.title : draft.title;

  return (
    <div className={styles.panel} onBlur={flush}>
      <div className={styles.head}>
        <div className={styles.headTitle}>
          <h2 className={styles.title}>{shownTitle}</h2>
          <TypeBadge type={item.type} />
        </div>
        <div className={styles.headActions}>
          <span className={`muted ${styles.saved}`} aria-live="polite">
            {pending ? '' : '저장됨'}
          </span>
          <button type="button" className="btn btn-small" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <OverviewSection
          item={item}
          draft={draft}
          onText={changeText}
          onTitleBlur={handleTitleBlur}
          onCategory={(categoryId) => updateNow({ categoryId })}
          onType={(type) => updateNow({ type })}
        />
        <MethodSection draft={draft} onText={changeText} />
        <NotesSection draft={draft} onText={changeText} />
        <LinksSection item={item} />
        {item.type === 'handover' && <HandoverSection item={item} />}
      </div>
    </div>
  );
}

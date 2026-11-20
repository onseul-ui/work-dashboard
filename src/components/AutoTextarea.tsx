import { useLayoutEffect, useRef } from 'react';
import { applyNumberedListEnter } from '../lib/text';

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  minRows?: number;
};

/** 일반 textarea. 내용 길이에 맞춰 높이가 늘어나고, 번호 목록 Enter 보조를 제공한다. */
export function AutoTextarea({ id, value, onChange, onBlur, placeholder, ariaLabel, minRows = 2 }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const pendingCursor = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
    if (pendingCursor.current !== null) {
      el.setSelectionRange(pendingCursor.current, pendingCursor.current);
      pendingCursor.current = null;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      id={id}
      className="textarea"
      rows={minRows}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey) return;
        if (e.nativeEvent.isComposing) return;
        const el = e.currentTarget;
        const edit = applyNumberedListEnter(el.value, el.selectionStart, el.selectionEnd);
        if (!edit) return;
        e.preventDefault();
        pendingCursor.current = edit.cursor;
        onChange(edit.value);
      }}
    />
  );
}

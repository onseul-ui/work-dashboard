import { useState } from 'react';
import { useData } from '../state/DataContext';
import { validateCategoryName } from '../lib/category';
import { UNCATEGORIZED_LABEL } from '../lib/labels';
import form from './Form.module.css';

const NONE = '__none__';
const NEW = '__new__';

type Props = {
  id?: string;
  value: string | null;
  onChange: (categoryId: string | null) => void;
};

/** 분야 선택 + 드롭다운 안의 "+ 새 분야 추가" (선택하면 아래에 입력칸이 나타난다) */
export function CategorySelect({ id, value, onChange }: Props) {
  const { data, dispatch } = useData();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function cancel() {
    setAdding(false);
    setName('');
    setError(null);
  }

  function add() {
    const problem = validateCategoryName(name, data.categories);
    if (problem) {
      setError(problem);
      return;
    }
    const category = { id: crypto.randomUUID(), name: name.trim() };
    dispatch({ type: 'addCategory', category });
    onChange(category.id);
    cancel();
  }

  return (
    <div className={form.stack}>
      <select
        id={id}
        className="select"
        value={value ?? NONE}
        onChange={(e) => {
          const next = e.target.value;
          if (next === NEW) {
            setAdding(true);
            return;
          }
          onChange(next === NONE ? null : next);
        }}
      >
        <option value={NONE}>{UNCATEGORIZED_LABEL}</option>
        {data.categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
        <option value={NEW}>+ 새 분야 추가</option>
      </select>
      {adding && (
        <>
          <div className={form.inline}>
            <input
              className="input"
              autoFocus
              placeholder="새 분야 이름"
              aria-label="새 분야 이름"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  add();
                } else if (e.key === 'Escape') {
                  e.stopPropagation();
                  cancel();
                }
              }}
            />
            <button type="button" className="btn" onClick={add}>
              추가
            </button>
            <button type="button" className="btn" onClick={cancel}>
              취소
            </button>
          </div>
          {error && <p className={form.error}>{error}</p>}
        </>
      )}
    </div>
  );
}

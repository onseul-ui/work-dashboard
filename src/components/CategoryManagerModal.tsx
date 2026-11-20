import { useState, type KeyboardEvent } from 'react';
import { useData } from '../state/DataContext';
import { validateCategoryName } from '../lib/category';
import { Modal } from './Modal';
import form from './Form.module.css';
import styles from './CategoryManagerModal.module.css';

export function CategoryManagerModal({ onClose }: { onClose: () => void }) {
  const { data, dispatch } = useData();
  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  function add() {
    const problem = validateCategoryName(newName, data.categories);
    if (problem) {
      setAddError(problem);
      return;
    }
    dispatch({ type: 'addCategory', category: { id: crypto.randomUUID(), name: newName.trim() } });
    setNewName('');
    setAddError(null);
  }

  function startEdit(id: string, name: string) {
    setEditingId(id);
    setEditName(name);
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError(null);
  }

  function saveEdit() {
    if (editingId === null) return;
    const problem = validateCategoryName(editName, data.categories, editingId);
    if (problem) {
      setEditError(problem);
      return;
    }
    dispatch({ type: 'renameCategory', id: editingId, name: editName.trim() });
    cancelEdit();
  }

  function remove(id: string, name: string) {
    const affected = data.items.filter((item) => item.categoryId === id).length;
    const message =
      affected > 0
        ? `'${name}' 분야를 삭제할까요? 이 분야의 업무 ${affected}개는 '미분류'로 바뀝니다.`
        : `'${name}' 분야를 삭제할까요? 이 분야에 속한 업무는 없습니다.`;
    if (!window.confirm(message)) return;
    if (editingId === id) cancelEdit();
    dispatch({ type: 'deleteCategory', id });
  }

  function keyHandler(onEnter: () => void, onEscape?: () => void) {
    return (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.nativeEvent.isComposing) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        onEnter();
      } else if (e.key === 'Escape' && onEscape) {
        e.stopPropagation();
        onEscape();
      }
    };
  }

  return (
    <Modal
      title="분야 관리"
      width={440}
      footer={
        <button type="button" className="btn" onClick={onClose}>
          닫기
        </button>
      }
    >
      <div className={form.field}>
        <div className={form.inline}>
          <input
            className="input"
            autoFocus
            placeholder="새 분야 이름"
            aria-label="새 분야 이름"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setAddError(null);
            }}
            onKeyDown={keyHandler(add)}
          />
          <button type="button" className="btn btn-primary" onClick={add}>
            추가
          </button>
        </div>
        {addError && <p className={form.error}>{addError}</p>}
      </div>

      {data.categories.length === 0 ? (
        <p className="muted">등록된 분야가 없습니다.</p>
      ) : (
        <ul className={styles.list}>
          {data.categories.map((category) => {
            const count = data.items.filter((item) => item.categoryId === category.id).length;
            return (
              <li key={category.id} className={styles.row}>
                {editingId === category.id ? (
                  <div className={styles.edit}>
                    <div className={form.inline}>
                      <input
                        className="input"
                        autoFocus
                        aria-label="분야 이름"
                        value={editName}
                        onChange={(e) => {
                          setEditName(e.target.value);
                          setEditError(null);
                        }}
                        onKeyDown={keyHandler(saveEdit, cancelEdit)}
                      />
                      <button type="button" className="btn" onClick={saveEdit}>
                        저장
                      </button>
                      <button type="button" className="btn" onClick={cancelEdit}>
                        취소
                      </button>
                    </div>
                    {editError && <p className={form.error}>{editError}</p>}
                  </div>
                ) : (
                  <>
                    <span className={styles.name}>{category.name}</span>
                    <span className="muted">업무 {count}개</span>
                    <button
                      type="button"
                      className="btn btn-small"
                      onClick={() => startEdit(category.id, category.name)}
                    >
                      이름 변경
                    </button>
                    <button
                      type="button"
                      className="btn btn-small"
                      onClick={() => remove(category.id, category.name)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}

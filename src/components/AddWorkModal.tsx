import { useState } from 'react';
import type { WorkItem, WorkType } from '../types';
import { createWorkItem } from '../lib/data';
import { Modal } from './Modal';
import { CategorySelect } from './CategorySelect';
import { TypeRadio } from './TypeRadio';
import { AutoTextarea } from './AutoTextarea';
import form from './Form.module.css';

type Props = {
  onSubmit: (item: WorkItem) => void;
  onCancel: () => void;
};

export function AddWorkModal({ onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [type, setType] = useState<WorkType>('mine');
  const [description, setDescription] = useState('');

  const canSubmit = title.trim() !== '';

  function submit() {
    if (!canSubmit) return;
    onSubmit(createWorkItem({ title: title.trim(), categoryId, type, description }));
  }

  return (
    <Modal
      title="업무 추가"
      footer={
        <>
          <button type="button" className="btn" onClick={onCancel}>
            취소
          </button>
          <button type="button" className="btn btn-primary" onClick={submit} disabled={!canSubmit}>
            등록
          </button>
        </>
      }
    >
      <div className={form.field}>
        <label className={form.label} htmlFor="add-title">
          업무명<span className={form.required}>*</span>
        </label>
        <input
          id="add-title"
          className="input"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
        />
      </div>
      <div className={form.field}>
        <label className={form.label} htmlFor="add-category">
          업무 분야
        </label>
        <CategorySelect id="add-category" value={categoryId} onChange={setCategoryId} />
      </div>
      <div className={form.field}>
        <span className={form.label}>업무 구분</span>
        <TypeRadio name="add-type" value={type} onChange={setType} />
      </div>
      <div className={form.field}>
        <label className={form.label} htmlFor="add-description">
          업무 설명
        </label>
        <AutoTextarea id="add-description" value={description} onChange={setDescription} minRows={3} />
      </div>
    </Modal>
  );
}

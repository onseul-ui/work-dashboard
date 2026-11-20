import { useRef } from 'react';
import styles from './Header.module.css';

type Props = {
  onBackup: () => void;
  /** [복원] 클릭 직후 (파일 선택창을 열기 전) */
  onRestoreStart: () => void;
  onRestoreFile: (file: File) => void;
  onAdd: () => void;
};

export function Header({ onBackup, onRestoreStart, onRestoreFile, onAdd }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>오늘고PLUS 업무관리</h1>
      <div className={styles.actions}>
        <button type="button" className="btn" onClick={onBackup}>
          백업
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            onRestoreStart();
            fileRef.current?.click();
          }}
        >
          복원
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) onRestoreFile(file);
          }}
        />
        <button type="button" className="btn btn-primary" onClick={onAdd}>
          + 업무 추가
        </button>
      </div>
    </header>
  );
}

import type { ReactNode } from 'react';
import styles from './Modal.module.css';

type Props = {
  title: string;
  width?: number;
  children: ReactNode;
  footer?: ReactNode;
};

/** 공통 모달 틀. Esc 닫기는 App에서 처리한다. */
export function Modal({ title, width = 480, children, footer }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={title} style={{ width }}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.content}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}

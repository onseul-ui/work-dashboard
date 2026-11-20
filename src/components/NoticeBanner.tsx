import styles from './NoticeBanner.module.css';

export type Notice = { id: string; message: string };

type Props = {
  notices: Notice[];
  onClose: (id: string) => void;
};

export function NoticeBanner({ notices, onClose }: Props) {
  if (notices.length === 0) return null;
  return (
    <div className={styles.wrap}>
      {notices.map((notice) => (
        <div key={notice.id} className={styles.notice} role="alert">
          <span>{notice.message}</span>
          <button type="button" className="btn btn-small" onClick={() => onClose(notice.id)}>
            닫기
          </button>
        </div>
      ))}
    </div>
  );
}

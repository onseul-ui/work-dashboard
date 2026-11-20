import { useState, type KeyboardEvent } from 'react';
import type { WorkItem } from '../../types';
import { useData } from '../../state/DataContext';
import { normalizeUrl } from '../../lib/text';
import form from '../Form.module.css';
import section from './Section.module.css';
import styles from './LinksSection.module.css';

export function LinksSection({ item }: { item: WorkItem }) {
  const { dispatch } = useData();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  function add() {
    if (url.trim() === '') {
      setError('URL을 입력하세요.');
      return;
    }
    const normalized = normalizeUrl(url);
    if (normalized === null) {
      setError('올바른 URL이 아닙니다.');
      return;
    }
    dispatch({
      type: 'addLink',
      itemId: item.id,
      link: { id: crypto.randomUUID(), title: title.trim() === '' ? normalized : title.trim(), url: normalized },
    });
    setTitle('');
    setUrl('');
    setError(null);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      add();
    }
  }

  return (
    <section className={section.section}>
      <h3 className={section.heading}>참고 링크</h3>
      {item.links.length > 0 && (
        <ul className={styles.list}>
          {item.links.map((link) => (
            <li key={link.id} className={styles.row}>
              <a
                className={styles.link}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.url}
              >
                {link.title}
              </a>
              <button
                type="button"
                className="btn btn-small"
                onClick={() => dispatch({ type: 'deleteLink', itemId: item.id, linkId: link.id })}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.form}>
        <input
          className="input"
          placeholder="제목 (비우면 URL로 표시)"
          aria-label="링크 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className={form.inline}>
          <input
            className="input"
            placeholder="URL"
            aria-label="링크 URL"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            onKeyDown={onKeyDown}
          />
          <button type="button" className="btn" onClick={add}>
            추가
          </button>
        </div>
        {error && <p className={form.error}>{error}</p>}
      </div>
    </section>
  );
}

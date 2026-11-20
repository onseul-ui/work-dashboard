import { useEffect, useMemo, useState } from 'react';
import type { WorkItem } from './types';
import { useData } from './state/DataContext';
import { getSummaryCounts } from './lib/status';
import { downloadBackup, readBackupFile } from './lib/storage';
import { CATEGORY_ALL, CATEGORY_NONE, filterItems, INITIAL_FILTERS, type Filters } from './lib/filter';
import { Header } from './components/Header';
import { NoticeBanner, type Notice } from './components/NoticeBanner';
import { SummaryCards } from './components/SummaryCards';
import { Toolbar } from './components/Toolbar';
import { WorkTable } from './components/WorkTable';
import { AddWorkModal } from './components/AddWorkModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { DetailPanel } from './components/detail/DetailPanel';
import styles from './App.module.css';

type ModalKind = 'add' | 'categories' | null;

export default function App() {
  const { data, dispatch, loadedCorrupted, saveFailed } = useData();
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [notices, setNotices] = useState<Notice[]>(() =>
    loadedCorrupted
      ? [
          {
            id: 'corrupted',
            message:
              '저장된 데이터를 읽지 못해 빈 상태로 시작했습니다. 기존 원본은 브라우저 저장소의 "onulgo-work-dashboard:v1:corrupted" 항목에 보관되어 있습니다.',
          },
        ]
      : [],
  );

  // 삭제된 분야로 필터 중이면 "전체"로 본다.
  const effectiveFilters = useMemo<Filters>(() => {
    const { category } = filters;
    if (category === CATEGORY_ALL || category === CATEGORY_NONE) return filters;
    return data.categories.some((c) => c.id === category)
      ? filters
      : { ...filters, category: CATEGORY_ALL };
  }, [filters, data.categories]);

  const counts = useMemo(() => getSummaryCounts(data.items), [data.items]);
  const visibleItems = useMemo(
    () => filterItems(data.items, effectiveFilters),
    [data.items, effectiveFilters],
  );
  const selectedItem = data.items.find((item) => item.id === selectedId) ?? null;

  // Esc: 모달이 열려 있으면 모달을, 아니면 상세 패널을 닫는다.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape' || e.isComposing) return;
      if (modal !== null) setModal(null);
      else if (selectedId !== null) setSelectedId(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modal, selectedId]);

  function handleDelete(item: WorkItem) {
    if (!window.confirm(`'${item.title}' 업무를 삭제할까요? 매뉴얼과 링크도 함께 삭제됩니다.`)) return;
    if (selectedId === item.id) setSelectedId(null);
    dispatch({ type: 'deleteItem', id: item.id });
  }

  function showNotice(notice: Notice) {
    setNotices((prev) => [...prev.filter((n) => n.id !== notice.id), notice]);
  }

  async function handleRestoreFile(file: File) {
    const result = await readBackupFile(file);
    if (!result.ok) {
      showNotice({
        id: 'restore',
        message: `복원하지 못했습니다. ${result.error} 기존 데이터는 그대로입니다.`,
      });
      return;
    }
    const message = `현재 데이터(업무 ${data.items.length}개)를 백업 파일(업무 ${result.data.items.length}개)로 전체 교체합니다. 계속할까요?`;
    if (!window.confirm(message)) return;
    setSelectedId(null);
    setNotices((prev) => prev.filter((n) => n.id !== 'restore'));
    dispatch({ type: 'replaceAll', data: result.data });
  }

  const allNotices: Notice[] = saveFailed
    ? [
        ...notices,
        {
          id: 'saveFailed',
          message: '브라우저 저장소에 저장하지 못했습니다. [백업]으로 데이터를 내려받아 두세요.',
        },
      ]
    : notices;

  return (
    <div className={styles.app}>
      <Header
        onBackup={() => downloadBackup(data)}
        onRestoreStart={() => setSelectedId(null)}
        onRestoreFile={(file) => void handleRestoreFile(file)}
        onAdd={() => setModal('add')}
      />
      <NoticeBanner
        notices={allNotices}
        onClose={(id) => setNotices((prev) => prev.filter((n) => n.id !== id))}
      />
      <SummaryCards counts={counts} />
      <div className={styles.body}>
        <section className={styles.list}>
          <Toolbar
            filters={effectiveFilters}
            categories={data.categories}
            onChange={setFilters}
            onManageCategories={() => setModal('categories')}
          />
          <WorkTable
            items={visibleItems}
            categories={data.categories}
            hasAnyItem={data.items.length > 0}
            selectedId={selectedItem?.id ?? null}
            onSelect={setSelectedId}
            onDelete={handleDelete}
          />
        </section>
        {selectedItem && (
          <aside className={styles.panel} aria-label="업무 상세">
            <DetailPanel key={selectedItem.id} item={selectedItem} onClose={() => setSelectedId(null)} />
          </aside>
        )}
      </div>
      {modal === 'add' && (
        <AddWorkModal
          onCancel={() => setModal(null)}
          onSubmit={(item) => {
            dispatch({ type: 'addItem', item });
            setModal(null);
            setSelectedId(item.id);
          }}
        />
      )}
      {modal === 'categories' && <CategoryManagerModal onClose={() => setModal(null)} />}
    </div>
  );
}

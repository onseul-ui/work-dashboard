import { createContext, useContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from 'react';
import type { AppData } from '../types';
import { loadData, saveData } from '../lib/storage';
import { reducer, type Action } from './reducer';

type DataContextValue = {
  data: AppData;
  dispatch: Dispatch<Action>;
  /** 저장 데이터가 손상되어 빈 데이터로 시작했는지 */
  loadedCorrupted: boolean;
  /** 마지막 localStorage 저장이 실패했는지 */
  saveFailed: boolean;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(loadData);
  const [data, dispatch] = useReducer(reducer, initial.data);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    setSaveFailed(!saveData(data));
  }, [data]);

  return (
    <DataContext.Provider
      value={{ data, dispatch, loadedCorrupted: initial.corrupted, saveFailed }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const value = useContext(DataContext);
  if (value === null) throw new Error('useData는 DataProvider 안에서만 사용할 수 있습니다.');
  return value;
}

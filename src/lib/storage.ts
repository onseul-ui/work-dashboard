import type { AppData } from '../types';
import { createEmptyData, parseAppData, type ParseResult } from './data';

export const STORAGE_KEY = 'onulgo-work-dashboard:v1';
export const CORRUPTED_KEY = `${STORAGE_KEY}:corrupted`;

export type LoadResult = { data: AppData; corrupted: boolean };

/** localStorage에서 읽는다. 손상되었으면 원본을 :corrupted 키에 보관하고 빈 데이터로 시작한다. */
export function loadData(): LoadResult {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return { data: createEmptyData(), corrupted: false };
  }
  if (raw === null) return { data: createEmptyData(), corrupted: false };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return keepCorrupted(raw);
  }
  const result = parseAppData(parsed);
  if (!result.ok) return keepCorrupted(raw);
  return { data: result.data, corrupted: false };
}

function keepCorrupted(raw: string): LoadResult {
  try {
    localStorage.setItem(CORRUPTED_KEY, raw);
  } catch {
    // 보관 실패해도 빈 데이터로 시작한다.
  }
  return { data: createEmptyData(), corrupted: true };
}

/** 저장 성공 여부를 반환한다. */
export function saveData(data: AppData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function getBackupFileName(date: Date = new Date()): string {
  const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  const hm = `${pad(date.getHours())}${pad(date.getMinutes())}`;
  return `오늘고PLUS_업무관리_백업_${ymd}-${hm}.json`;
}

/** AppData를 그대로 JSON 파일로 내려받는다. */
export function downloadBackup(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = getBackupFileName();
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** 복원용 백업 파일을 읽고 검증한다. */
export async function readBackupFile(file: File): Promise<ParseResult> {
  let text: string;
  try {
    text = await file.text();
  } catch {
    return { ok: false, error: '파일을 읽지 못했습니다.' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'JSON 형식이 아닙니다.' };
  }
  return parseAppData(parsed);
}

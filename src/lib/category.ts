import type { WorkCategory } from '../types';

/** 분야 이름 검증. 문제가 있으면 오류 문구, 없으면 null. (앞뒤 공백 제거, 영문 대소문자 무시) */
export function validateCategoryName(
  name: string,
  categories: WorkCategory[],
  exceptId?: string,
): string | null {
  const trimmed = name.trim();
  if (trimmed === '') return '분야 이름을 입력하세요.';
  const key = trimmed.toLowerCase();
  const duplicate = categories.some(
    (c) => c.id !== exceptId && c.name.trim().toLowerCase() === key,
  );
  return duplicate ? '같은 이름의 분야가 이미 있습니다.' : null;
}

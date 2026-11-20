import type { AppData, ReferenceLink, WorkCategory, WorkItem, WorkType } from '../types';

export const TEXT_FIELDS = [
  'description',
  'frequency',
  'prerequisites',
  'procedures',
  'tools',
  'validation',
  'notes',
] as const;

export function createEmptyData(): AppData {
  return { version: 1, categories: [], items: [] };
}

export function createWorkItem(input: {
  title: string;
  categoryId: string | null;
  type: WorkType;
  description: string;
}): WorkItem {
  return {
    id: crypto.randomUUID(),
    title: input.title,
    categoryId: input.categoryId,
    type: input.type,
    description: input.description,
    frequency: '',
    prerequisites: '',
    procedures: '',
    tools: '',
    validation: '',
    notes: '',
    links: [],
    handoverPrepared: false,
    handoverCompleted: false,
  };
}

export type ParseResult = { ok: true; data: AppData } | { ok: false; error: string };

class ValidationError extends Error {}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  throw new ValidationError(message);
}

function requireString(obj: Record<string, unknown>, key: string, where: string): string {
  const value = obj[key];
  if (typeof value !== 'string') fail(`${where}: '${key}' 값이 없거나 문자열이 아닙니다.`);
  return value;
}

function optionalString(obj: Record<string, unknown>, key: string, where: string): string {
  const value = obj[key];
  if (value === undefined) return '';
  if (typeof value !== 'string') fail(`${where}: '${key}' 값이 문자열이 아닙니다.`);
  return value;
}

function optionalBoolean(obj: Record<string, unknown>, key: string, where: string): boolean {
  const value = obj[key];
  if (value === undefined) return false;
  if (typeof value !== 'boolean') fail(`${where}: '${key}' 값이 true/false가 아닙니다.`);
  return value;
}

function parseCategory(raw: unknown, index: number): WorkCategory {
  const where = `분야 ${index + 1}번째`;
  if (!isObject(raw)) fail(`${where}: 형식이 올바르지 않습니다.`);
  const id = requireString(raw, 'id', where);
  const name = requireString(raw, 'name', where).trim();
  if (id === '') fail(`${where}: 'id'가 비어 있습니다.`);
  if (name === '') fail(`${where}: 'name'이 비어 있습니다.`);
  return { id, name };
}

function parseLink(raw: unknown, where: string): ReferenceLink {
  if (!isObject(raw)) fail(`${where}: 링크 형식이 올바르지 않습니다.`);
  const id = requireString(raw, 'id', `${where} 링크`);
  const url = requireString(raw, 'url', `${where} 링크`);
  const title = optionalString(raw, 'title', `${where} 링크`);
  if (id === '' || url.trim() === '') fail(`${where}: 링크의 id 또는 url이 비어 있습니다.`);
  return { id, title: title.trim() === '' ? url : title, url };
}

function parseItem(raw: unknown, index: number): WorkItem {
  const where = `업무 ${index + 1}번째`;
  if (!isObject(raw)) fail(`${where}: 형식이 올바르지 않습니다.`);

  const id = requireString(raw, 'id', where);
  if (id === '') fail(`${where}: 'id'가 비어 있습니다.`);
  const title = requireString(raw, 'title', where).trim();
  if (title === '') fail(`${where}: 'title'이 비어 있습니다.`);

  const type = raw.type;
  if (type !== 'mine' && type !== 'handover') {
    fail(`${where}: 'type' 값은 "mine" 또는 "handover"여야 합니다.`);
  }

  const rawCategoryId = raw.categoryId;
  let categoryId: string | null;
  if (rawCategoryId === undefined || rawCategoryId === null) categoryId = null;
  else if (typeof rawCategoryId === 'string') categoryId = rawCategoryId;
  else fail(`${where}: 'categoryId' 값이 올바르지 않습니다.`);

  const rawLinks = raw.links;
  let links: ReferenceLink[] = [];
  if (rawLinks !== undefined) {
    if (!Array.isArray(rawLinks)) fail(`${where}: 'links'가 배열이 아닙니다.`);
    links = rawLinks.map((link) => parseLink(link, where));
  }

  const item: WorkItem = {
    id,
    title,
    categoryId,
    type,
    description: '',
    frequency: '',
    prerequisites: '',
    procedures: '',
    tools: '',
    validation: '',
    notes: '',
    links,
    handoverPrepared: optionalBoolean(raw, 'handoverPrepared', where),
    handoverCompleted: optionalBoolean(raw, 'handoverCompleted', where),
  };
  for (const field of TEXT_FIELDS) {
    item[field] = optionalString(raw, field, where);
  }
  return item;
}

function assertUniqueIds(list: { id: string }[], label: string): void {
  const seen = new Set<string>();
  for (const { id } of list) {
    if (seen.has(id)) fail(`${label} id가 중복됩니다: ${id}`);
    seen.add(id);
  }
}

/**
 * 저장소·백업 파일에서 읽은 값을 검증하고 보정한다.
 * - 필수: version === 1, categories·items 배열, 업무의 id·title·type
 * - 없으면 기본값: 텍스트 "", links [], 체크 false, categoryId null
 * - 보정: 존재하지 않는 categoryId → null, 준비 ✘ + 완료 ✔ → 완료 false
 */
export function parseAppData(raw: unknown): ParseResult {
  try {
    if (!isObject(raw)) fail('데이터 형식이 올바르지 않습니다.');
    if (raw.version !== 1) fail(`지원하지 않는 버전입니다. (version: ${String(raw.version)})`);
    if (!Array.isArray(raw.categories)) fail("'categories'가 배열이 아닙니다.");
    if (!Array.isArray(raw.items)) fail("'items'가 배열이 아닙니다.");

    const categories = raw.categories.map(parseCategory);
    const items = raw.items.map(parseItem);
    assertUniqueIds(categories, '분야');
    assertUniqueIds(items, '업무');

    const categoryIds = new Set(categories.map((c) => c.id));
    for (const item of items) {
      if (item.categoryId !== null && !categoryIds.has(item.categoryId)) item.categoryId = null;
      if (!item.handoverPrepared && item.handoverCompleted) item.handoverCompleted = false;
    }

    return { ok: true, data: { version: 1, categories, items } };
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, error: error.message };
    throw error;
  }
}

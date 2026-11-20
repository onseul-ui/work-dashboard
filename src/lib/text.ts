/**
 * 참고 링크 URL 보정.
 * 앞뒤 공백 제거 → http(s)://가 없으면 https://를 붙임 → 올바른 주소가 아니면 null.
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed === '') return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (url.hostname === '') return null;
    return withProtocol;
  } catch {
    return null;
  }
}

const NUMBERED_LINE = /^(\s*)(\d+)\.[ \t]/;

export type TextEdit = { value: string; cursor: number };

/**
 * 번호 목록 보조. Enter 입력 시 호출한다.
 * - "숫자. "로 시작하는 줄에서 Enter → 다음 줄에 "다음숫자. " 입력
 * - 내용 없는 번호 줄에서 Enter → 번호를 지움
 * 처리할 상황이 아니면 null (기본 Enter 동작 유지)
 */
export function applyNumberedListEnter(
  value: string,
  selectionStart: number,
  selectionEnd: number,
): TextEdit | null {
  if (selectionStart !== selectionEnd) return null;
  const cursor = selectionStart;
  const lineStart = value.lastIndexOf('\n', cursor - 1) + 1;
  const nextBreak = value.indexOf('\n', cursor);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;
  const line = value.slice(lineStart, lineEnd);

  const match = NUMBERED_LINE.exec(line);
  if (!match) return null;
  const prefix = match[0];
  const indent = match[1] ?? '';
  const number = Number(match[2]);
  if (cursor < lineStart + prefix.length) return null;

  if (line.slice(prefix.length).trim() === '') {
    return {
      value: value.slice(0, lineStart) + value.slice(lineEnd),
      cursor: lineStart,
    };
  }

  const insert = `\n${indent}${number + 1}. `;
  return {
    value: value.slice(0, cursor) + insert + value.slice(cursor),
    cursor: cursor + insert.length,
  };
}

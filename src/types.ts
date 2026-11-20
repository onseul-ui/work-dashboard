export type WorkType = 'mine' | 'handover';

export type WorkCategory = {
  id: string;
  name: string;
};

export type ReferenceLink = {
  id: string;
  title: string;
  url: string;
};

export type WorkItem = {
  id: string;
  title: string;
  categoryId: string | null;
  type: WorkType;
  description: string;

  frequency: string;
  prerequisites: string;
  procedures: string;
  tools: string;
  validation: string;
  notes: string;

  links: ReferenceLink[];

  handoverPrepared: boolean;
  handoverCompleted: boolean;
};

export type AppData = {
  version: 1;
  categories: WorkCategory[];
  /** 배열 순서 = 화면 표시 순서 (새 업무는 맨 앞에 추가) */
  items: WorkItem[];
};

/** 상세 패널에서 텍스트로 편집하는 필드 */
export type WorkTextField =
  | 'title'
  | 'description'
  | 'frequency'
  | 'prerequisites'
  | 'procedures'
  | 'tools'
  | 'validation'
  | 'notes';

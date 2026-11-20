import type { AppData, ReferenceLink, WorkCategory, WorkItem, WorkTextField } from '../types';

export type ItemPatch = Partial<Pick<WorkItem, WorkTextField | 'categoryId' | 'type'>>;

export type Action =
  | { type: 'addItem'; item: WorkItem }
  | { type: 'updateItem'; id: string; patch: ItemPatch }
  | { type: 'deleteItem'; id: string }
  | { type: 'addLink'; itemId: string; link: ReferenceLink }
  | { type: 'deleteLink'; itemId: string; linkId: string }
  | { type: 'setHandover'; id: string; prepared: boolean; completed: boolean }
  | { type: 'addCategory'; category: WorkCategory }
  | { type: 'renameCategory'; id: string; name: string }
  | { type: 'deleteCategory'; id: string }
  | { type: 'replaceAll'; data: AppData };

function mapItem(state: AppData, id: string, fn: (item: WorkItem) => WorkItem): AppData {
  return { ...state, items: state.items.map((item) => (item.id === id ? fn(item) : item)) };
}

export function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'addItem':
      return { ...state, items: [action.item, ...state.items] };

    case 'updateItem':
      return mapItem(state, action.id, (item) => ({ ...item, ...action.patch }));

    case 'deleteItem':
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };

    case 'addLink':
      return mapItem(state, action.itemId, (item) => ({
        ...item,
        links: [...item.links, action.link],
      }));

    case 'deleteLink':
      return mapItem(state, action.itemId, (item) => ({
        ...item,
        links: item.links.filter((link) => link.id !== action.linkId),
      }));

    case 'setHandover':
      // 준비 ✘ + 완료 ✔ 조합은 만들지 않는다.
      return mapItem(state, action.id, (item) => ({
        ...item,
        handoverPrepared: action.prepared,
        handoverCompleted: action.prepared && action.completed,
      }));

    case 'addCategory':
      return { ...state, categories: [...state.categories, action.category] };

    case 'renameCategory':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.id ? { ...c, name: action.name } : c,
        ),
      };

    case 'deleteCategory':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.id),
        items: state.items.map((item) =>
          item.categoryId === action.id ? { ...item, categoryId: null } : item,
        ),
      };

    case 'replaceAll':
      return action.data;
  }
}

import type { WorkType } from '../types';
import { TYPE_LABEL } from '../lib/labels';
import form from './Form.module.css';

type Props = {
  name: string;
  value: WorkType;
  onChange: (type: WorkType) => void;
};

const TYPES: WorkType[] = ['mine', 'handover'];

export function TypeRadio({ name, value, onChange }: Props) {
  return (
    <div className={form.radios} role="radiogroup">
      {TYPES.map((type) => (
        <label key={type} className={form.radio}>
          <input
            type="radio"
            name={name}
            value={type}
            checked={value === type}
            onChange={() => onChange(type)}
          />
          {TYPE_LABEL[type]}
        </label>
      ))}
    </div>
  );
}

import { Input } from '../Input';

interface DateSelectorProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  'aria-label'?: string;
}
export function DateSelector({ value, onChange, min, max, 'aria-label': ariaLabel }: DateSelectorProps) {
  return (
    <Input
      type="date"
      value={value}
      min={min}
      max={max}
      onChange={e => onChange(e.target.value)}
      aria-label={ariaLabel}
    />
  );
}

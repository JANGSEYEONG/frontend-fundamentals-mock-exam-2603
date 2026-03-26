import { Select } from '_tosslib/components';

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  start: string;
  end: string;
  step?: number;
  placeholder?: string;
  'aria-label'?: string;
}

export function TimeSelector({
  value,
  onChange,
  start,
  end,
  step = 30,
  placeholder = '선택',
  'aria-label': ariaLabel,
}: TimeSelectorProps) {
  const timeSlots = generateTimeSlots(start, end, step);

  return (
    <Select value={value} onChange={e => onChange(e.target.value)} aria-label={ariaLabel}>
      <option value="">{placeholder}</option>
      {timeSlots.map(time => (
        <option key={time} value={time}>
          {time}
        </option>
      ))}
    </Select>
  );
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function toTimeString(minutes: number): string {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  return `${h}:${m}`;
}

function generateTimeSlots(start: string, end: string, step: number): string[] {
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  const slots: string[] = [];

  for (let min = startMin; min <= endMin; min += step) {
    slots.push(toTimeString(min));
  }

  return slots;
}

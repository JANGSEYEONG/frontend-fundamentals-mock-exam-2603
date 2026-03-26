import { Select } from '_tosslib/components';

import { useQuery } from '@tanstack/react-query';
import { uniq } from 'es-toolkit';
import { getRoomsQueryOptions } from 'pages/reservation/queries';

interface PreferredFloorSelectorProps {
  value: number | null;
  onChange: (floor: number | null) => void;
}

export function PreferredFloorSelector({ value, onChange }: PreferredFloorSelectorProps) {
  const { data: rooms = [] } = useQuery(getRoomsQueryOptions());
  const floors = uniq(rooms.map(room => room.floor)).sort((a, b) => a - b);

  return (
    <Select
      value={value ?? ''}
      onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
      aria-label="선호 층"
    >
      <option value="">전체</option>
      {floors.map(f => (
        <option key={f} value={f}>
          {f}층
        </option>
      ))}
    </Select>
  );
}

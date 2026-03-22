import { Select, Spacing } from '_tosslib/components';
import { format } from 'date-fns';
import {
  ALL_EQUIPMENT,
  EQUIPMENT_LABELS,
  RESERVATION_TIMELINE_END,
  RESERVATION_TIMELINE_START,
} from 'pages/reservation/models';
import { ChipToggle } from 'shared/components/ChipToggle';
import { FormField } from 'shared/components/FormField';
import { Input } from 'shared/components/Input';

import { useQuery } from '@tanstack/react-query';
import { range, uniq } from 'es-toolkit';
import { getRoomsQueryOptions } from 'pages/reservation/queries';
import { BookingFilter } from '../../RoomBookingPage.schema';
import * as styles from './BookingFilterForm.styles';

interface BookingFilterFormProps {
  filter: BookingFilter;
  onChange: (patch: Partial<BookingFilter>) => void;
}

export function BookingFilterForm({ filter, onChange }: BookingFilterFormProps) {
  const { data: rooms = [] } = useQuery(getRoomsQueryOptions());
  const floors = uniq(rooms.map(room => room.floor)).sort((a, b) => a - b);

  return (
    <>
      {/* 날짜 */}
      <FormField label="날짜">
        <Input
          type="date"
          value={filter.date}
          min={format(new Date(), 'yyyy-MM-dd')}
          onChange={e => onChange({ date: e.target.value })}
          aria-label="날짜"
        />
      </FormField>

      <Spacing size={14} />

      {/* 시간 */}
      <div css={styles.rowStyle}>
        <FormField label="시작 시간" css={styles.flexOne}>
          <Select
            value={filter.startTime}
            onChange={e => onChange({ startTime: e.target.value })}
            aria-label="시작 시간"
          >
            <option value="">선택</option>
            {RESERVATION_TIME_SLOTS.slice(0, -1).map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="종료 시간" css={styles.flexOne}>
          <Select value={filter.endTime} onChange={e => onChange({ endTime: e.target.value })} aria-label="종료 시간">
            <option value="">선택</option>
            {RESERVATION_TIME_SLOTS.slice(1).map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <Spacing size={14} />

      {/* 참석 인원 + 선호 층 */}
      <div css={styles.rowStyle}>
        <FormField label="참석 인원" css={styles.flexOne}>
          <Input
            type="number"
            min={1}
            value={filter.attendees}
            onChange={e => onChange({ attendees: Math.max(1, Number(e.target.value)) })}
            aria-label="참석 인원"
          />
        </FormField>

        <FormField label="선호 층" css={styles.flexOne}>
          <Select
            value={filter.floor ?? ''}
            onChange={e => onChange({ floor: e.target.value === '' ? null : Number(e.target.value) })}
            aria-label="선호 층"
          >
            <option value="">전체</option>
            {floors.map(f => (
              <option key={f} value={f}>
                {f}층
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <Spacing size={14} />

      {/* 장비 */}
      <div>
        <FormField label="필요 장비" css={styles.flexOne}>
          <div css={styles.chipRowStyle}>
            {ALL_EQUIPMENT.map(eq => (
              <ChipToggle
                key={eq}
                selected={filter.equipment.includes(eq)}
                label={EQUIPMENT_LABELS[eq]}
                onClick={() => {
                  const next = filter.equipment.includes(eq)
                    ? filter.equipment.filter(e => e !== eq)
                    : [...filter.equipment, eq];
                  onChange({ equipment: next });
                }}
              />
            ))}
          </div>
        </FormField>
      </div>
    </>
  );
}

const RESERVATION_TIME_SLOTS = range(RESERVATION_TIMELINE_START, RESERVATION_TIMELINE_END)
  .flatMap(h => [`${String(h).padStart(2, '0')}:00`, `${String(h).padStart(2, '0')}:30`])
  .concat(`${String(RESERVATION_TIMELINE_END).padStart(2, '0')}:00`);

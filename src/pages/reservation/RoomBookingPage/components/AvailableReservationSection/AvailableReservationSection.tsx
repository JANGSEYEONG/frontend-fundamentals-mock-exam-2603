import { ListRow, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

import { useQueries } from '@tanstack/react-query';
import { isNil } from 'es-toolkit';
import { getReservationsQueryOptions, getRoomsQueryOptions } from 'pages/reservation/queries';
import { EmptyState } from 'shared/components/EmptyState';
import { Section } from 'shared/components/Section';
import { EQUIPMENT_LABELS, Reservation, Room } from '../../../models';
import { BookingFilter } from '../../RoomBookingPage.schema';
import * as styles from './AvailableReservationSection.styles';
import { useBookingFilter } from '../../hooks/useBookingFilter';
import { useSelectedRoomId } from '../../hooks/useSelectedRoomId';

interface AvailableReservationSectionProps {
  onSelect: (roomId: string) => void;
}
export function AvailableReservationSection({ onSelect }: AvailableReservationSectionProps) {
  const [filter] = useBookingFilter();
  const [selectedRoomId] = useSelectedRoomId();

  const [{ data: rooms = [] }, { data: reservations = [] }] = useQueries({
    queries: [
      getRoomsQueryOptions(),
      {
        ...getReservationsQueryOptions(filter.date),
        enabled: !!filter.date,
      },
    ],
  });

  const availableRooms = getAvailableRooms(rooms, reservations, filter);

  if (availableRooms.length === 0) return <EmptyState message="조건에 맞는 회의실이 없습니다." />;

  return (
    <Section
      label="예약 가능 회의실"
      right={
        <Text typography="t7" fontWeight="medium" color={colors.grey500}>
          {availableRooms.length}개
        </Text>
      }
    >
      <div css={styles.list}>
        {availableRooms.map((room: Room) => {
          const selected = selectedRoomId === room.id;
          return (
            <div
              key={room.id}
              onClick={() => onSelect(room.id)}
              role="button"
              aria-pressed={selected}
              aria-label={room.name}
              css={styles.item(selected)}
            >
              <ListRow
                contents={
                  <ListRow.Text2Rows
                    top={room.name}
                    topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                    bottom={`${room.floor}층 · ${room.capacity}명 · ${room.equipment
                      .map((e: string) => EQUIPMENT_LABELS[e])
                      .join(', ')}`}
                    bottomProps={{ typography: 't7', color: colors.grey600 }}
                  />
                }
                right={
                  selected ? (
                    <Text typography="t7" fontWeight="bold" color={colors.blue500}>
                      선택됨
                    </Text>
                  ) : undefined
                }
              />
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function getAvailableRooms(rooms: Room[], reservations: Reservation[], filter: BookingFilter): Room[] {
  return rooms
    .filter(hasCapacity(filter.attendees))
    .filter(hasEquipment(filter.equipment))
    .filter(matchesFloor(filter.floor))
    .filter(isReservationAvailable(reservations, filter.date, filter.startTime, filter.endTime))
    .sort((a, b) => a.floor - b.floor || a.name.localeCompare(b.name));
}
const hasCapacity = (min: number) => (room: Room) => room.capacity >= min;

const hasEquipment = (required: string[]) => (room: Room) =>
  required.every(equipment => room.equipment.includes(equipment));

const matchesFloor = (floor: number | null) => (room: Room) => isNil(floor) || room.floor === floor;

const isReservationAvailable =
  (reservations: Reservation[], date: string, startTime: string, endTime: string) => (room: Room) =>
    !reservations.some(
      reservation =>
        reservation.roomId === room.id &&
        reservation.date === date &&
        reservation.start < endTime &&
        reservation.end > startTime
    );

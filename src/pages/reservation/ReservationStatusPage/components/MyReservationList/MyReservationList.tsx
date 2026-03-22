import { useQueries } from '@tanstack/react-query';
import { ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS, Reservation, Room } from 'pages/reservation/models';
import { getMyReservationsQueryOptions, getRoomsQueryOptions } from 'pages/reservation/queries';
import React from 'react';
import { EmptyState } from 'shared/components/EmptyState';
import * as styles from './MyReservationList.styles';

interface MyReservationListProps {
  renderRight: (reservation: Reservation) => React.ReactNode;
}

export function MyReservationList({ renderRight }: MyReservationListProps) {
  const [{ data: rooms = [] }, { data: myReservationList = [] }] = useQueries({
    queries: [getRoomsQueryOptions(), getMyReservationsQueryOptions()],
  });

  if (myReservationList.length === 0) {
    return <EmptyState message="예약 내역이 없습니다." />;
  }

  return (
    <div css={styles.list}>
      {myReservationList.map(reservation => (
        <div key={reservation.id} css={styles.item}>
          <ListRow
            contents={
              <ListRow.Text2Rows
                top={getRoomName(rooms, reservation.roomId)}
                topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${
                  reservation.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'
                }`}
                bottomProps={{ typography: 't7', color: colors.grey600 }}
              />
            }
            right={renderRight(reservation)}
          />
        </div>
      ))}
    </div>
  );
}

const getRoomName = (rooms: Room[], roomId: string): string => {
  return rooms.find((room: Room) => room.id === roomId)?.name ?? roomId;
};

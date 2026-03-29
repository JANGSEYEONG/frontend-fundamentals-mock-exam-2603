import { useQueries } from '@tanstack/react-query';
import { EQUIPMENT_LABELS, Reservation } from 'pages/reservation/models';
import { getReservationsQueryOptions, getRoomsQueryOptions } from 'pages/reservation/queries';
import { useState } from 'react';

import { TimelineGrid } from 'shared/components/TimelineGrid';
import * as styles from './DailyReservationTimeline.styles';

interface DailyReservationTimelineProps {
  date: string;
}

export function DailyReservationTimeline({ date }: DailyReservationTimelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [{ data: rooms = [] }, { data: reservations = [] }] = useQueries({
    queries: [
      getRoomsQueryOptions(),
      {
        ...getReservationsQueryOptions(date),
        enabled: !!date,
      },
    ],
  });

  return (
    <TimelineGrid start={9} end={20}>
      <TimelineGrid.Header />
      {rooms.map((room, index) => {
        const roomReservations = reservations.filter(reservation => reservation.roomId === room.id);
        return (
          <TimelineGrid.Row key={room.id} label={room.name} isFirst={index === 0}>
            {roomReservations.map(reservation => {
              const isActive = activeId === reservation.id;

              return (
                <TimelineGrid.Block
                  key={reservation.id}
                  start={reservation.start}
                  end={reservation.end}
                  ariaLabel={`${room.name} ${reservation.start}-${reservation.end} 예약 상세`}
                  active={isActive}
                  onClick={() => setActiveId(isActive ? null : reservation.id)}
                >
                  {isActive && <ReservationTooltip reservation={reservation} />}
                </TimelineGrid.Block>
              );
            })}
          </TimelineGrid.Row>
        );
      })}
    </TimelineGrid>
  );
}

function ReservationTooltip({ reservation }: { reservation: Reservation }) {
  return (
    <div role="tooltip" css={styles.tooltip}>
      <div>
        {reservation.start} ~ {reservation.end}
      </div>
      <div>{reservation.attendees}명</div>
      {reservation.equipment.length > 0 && (
        <div>{reservation.equipment.map((equipment: string) => EQUIPMENT_LABELS[equipment]).join(', ')}</div>
      )}
    </div>
  );
}

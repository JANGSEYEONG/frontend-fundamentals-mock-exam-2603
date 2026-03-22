import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { Button, ListRow, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getMyReservations, getRooms } from 'pages/remotes';
import { EQUIPMENT_LABELS } from 'pages/reservation/constants';

interface MyReservationListProps {
  onCancel: (id: string) => void;
}
export function MyReservationList({ onCancel }: MyReservationListProps) {
  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });

  const { data: myReservationList = [] } = useQuery({ queryKey: ['myReservations'], queryFn: getMyReservations });
  const getRoomName = (roomId: string) =>
    rooms.find((r: { id: string; name: string }) => r.id === roomId)?.name ?? roomId;

  return myReservationList.length === 0 ? (
    <div
      css={css`
        padding: 40px 0;
        text-align: center;
        background: ${colors.grey50};
        border-radius: 14px;
      `}
    >
      <Text typography="t6" color={colors.grey500}>
        예약 내역이 없습니다.
      </Text>
    </div>
  ) : (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 10px;
      `}
    >
      {myReservationList.map(
        (res: {
          id: string;
          roomId: string;
          date: string;
          start: string;
          end: string;
          attendees: number;
          equipment: string[];
        }) => (
          <div
            key={res.id}
            css={css`
              padding: 14px 16px;
              border-radius: 14px;
              background: ${colors.grey50};
              border: 1px solid ${colors.grey200};
            `}
          >
            <ListRow
              contents={
                <ListRow.Text2Rows
                  top={getRoomName(res.roomId)}
                  topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                  bottom={`${res.date} ${res.start}~${res.end} · ${res.attendees}명 · ${
                    res.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'
                  }`}
                  bottomProps={{ typography: 't7', color: colors.grey600 }}
                />
              }
              right={
                <Button
                  type="danger"
                  style="weak"
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    if (window.confirm('정말 취소하시겠습니까?')) {
                      onCancel(res.id);
                    }
                  }}
                >
                  취소
                </Button>
              }
            />
          </div>
        )
      )}
    </div>
  );
}

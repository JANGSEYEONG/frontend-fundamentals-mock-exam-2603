import { ListRow, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

import { EQUIPMENT_LABELS } from '../../../models';
import * as styles from './RoomList.styles';
import { EmptyState } from 'shared/components/EmptyState';
interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: string[];
}

interface RoomListProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelect: (roomId: string) => void;
}
export function RoomList({ rooms, selectedRoomId, onSelect }: RoomListProps) {
  if (rooms.length === 0) return <EmptyState message="조건에 맞는 회의실이 없습니다." />;

  return (
    <div css={styles.list}>
      {rooms.map((room: Room) => {
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
  );
}

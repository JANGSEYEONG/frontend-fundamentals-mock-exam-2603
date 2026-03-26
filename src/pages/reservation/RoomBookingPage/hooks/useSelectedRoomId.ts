import { parseAsString, useQueryState } from 'nuqs';

export function useSelectedRoomId(): [string | null, (roomId: string | null) => void] {
  const [selectedRoomId, setSelectedRoomId] = useQueryState(
    'selectedRoomId',
    parseAsString.withOptions({
      history: 'replace',
    })
  );

  return [selectedRoomId, setSelectedRoomId];
}

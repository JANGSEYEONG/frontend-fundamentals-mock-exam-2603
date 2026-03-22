import { css } from '@emotion/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Border, Button, Select, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import axios from 'axios';
import { format } from 'date-fns';
import { range } from 'es-toolkit';
import { createReservation } from 'pages/remotes';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChipToggle } from 'shared/components/ChipToggle';
import { ErrorText } from 'shared/components/ErrorText';
import { FormField } from 'shared/components/FormField';
import { Input } from 'shared/components/Input';
import { MessageBanner } from 'shared/components/MessageBanner';
import { PageLayout } from 'shared/components/PageLayout';
import * as pageStyles from 'shared/components/PageLayout/PageLayout.styles';
import { Section } from 'shared/components/Section';
import {
  ALL_EQUIPMENT,
  EQUIPMENT_LABELS,
  Reservation,
  RESERVATION_TIMELINE_END,
  RESERVATION_TIMELINE_START,
} from '../models';
import { getMyReservationsQueryOptions, getReservationsQueryOptions, getRoomsQueryOptions } from '../queries';
import { RoomList } from './components/RoomList';
import * as styles from './RoomBookingPage.styles';
import { createLocationMessageState } from 'shared/hooks/useLocationMessage';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, setDate] = useState(searchParams.get('date') || format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(searchParams.get('startTime') || '');
  const [endTime, setEndTime] = useState(searchParams.get('endTime') || '');
  const [attendees, setAttendees] = useState(Number(searchParams.get('attendees')) || 1);
  const [equipment, setEquipment] = useState<string[]>(
    searchParams.get('equipment') ? searchParams.get('equipment')!.split(',').filter(Boolean) : []
  );
  const [preferredFloor, setPreferredFloor] = useState<number | null>(
    searchParams.get('floor') ? Number(searchParams.get('floor')) : null
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // URL 쿼리 파라미터 동기화
  useEffect(() => {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (attendees > 1) params.attendees = String(attendees);
    if (equipment.length > 0) params.equipment = equipment.join(',');
    if (preferredFloor !== null) params.floor = String(preferredFloor);
    setSearchParams(params, { replace: true });
  }, [date, startTime, endTime, attendees, equipment, preferredFloor, setSearchParams]);

  const { data: rooms = [] } = useQuery(getRoomsQueryOptions());
  const { data: reservations = [] } = useQuery({
    ...getReservationsQueryOptions(date),
    enabled: !!date,
  });

  const createMutation = useMutation((data: Omit<Reservation, 'id'>) => createReservation(data), {
    onSuccess: (data, variables) => {
      if (data.ok) {
        navigate('/', {
          state: createLocationMessageState({ message: '예약이 완료되었습니다!' }),
        });

        return;
      }

      setErrorMessage(data.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);

      queryClient.invalidateQueries({ queryKey: getReservationsQueryOptions(variables.date).queryKey });
      queryClient.invalidateQueries({ queryKey: getMyReservationsQueryOptions().queryKey });
    },
    onError: (error: unknown) => {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    },
  });

  // 필터 변경 시 선택 초기화
  const handleFilterChange = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  // 입력 검증
  let validationError: string | null = null;
  const hasTimeInputs = startTime !== '' && endTime !== '';
  if (hasTimeInputs) {
    if (endTime <= startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }
  const isFilterComplete = hasTimeInputs && !validationError;

  // 필터링
  const floors = [...new Set(rooms.map((r: { floor: number }) => r.floor))].sort((a: number, b: number) => a - b);

  const availableRooms = isFilterComplete
    ? rooms
        .filter((room: { id: string; capacity: number; equipment: string[]; floor: number }) => {
          if (room.capacity < attendees) return false;
          if (!equipment.every(eq => room.equipment.includes(eq))) return false;
          if (preferredFloor !== null && room.floor !== preferredFloor) return false;
          const hasConflict = reservations.some(
            (r: { roomId: string; date: string; start: string; end: string }) =>
              r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
          );
          if (hasConflict) return false;
          return true;
        })
        .sort((a: { floor: number; name: string }, b: { floor: number; name: string }) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return a.name.localeCompare(b.name);
        })
    : [];

  // TODO: 유효성 체크는 zod + hook form에서 처리?
  const handleBook = () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!startTime || !endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    createMutation.mutate({
      roomId: selectedRoomId,
      date,
      start: startTime,
      end: endTime,
      attendees,
      equipment,
    });
  };

  return (
    <div>
      <div css={styles.backArea}>
        <button type="button" onClick={() => navigate('/')} aria-label="뒤로가기" css={styles.backButton}>
          ← 예약 현황으로
        </button>
      </div>
      <PageLayout title="예약하기">
        {errorMessage && (
          <div css={pageStyles.inset}>
            <Spacing size={12} />
            <MessageBanner message={{ type: 'error', text: errorMessage }} />
          </div>
        )}

        <Spacing size={24} />

        {/* 예약 조건 입력 */}
        <Section label="예약 조건">
          {/* 날짜 */}
          <FormField label="날짜">
            <Input
              type="date"
              value={date}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={e => {
                setDate(e.target.value);
                handleFilterChange();
              }}
              aria-label="날짜"
            />
          </FormField>

          <Spacing size={14} />

          {/* 시간 */}
          <div
            css={css`
              display: flex;
              gap: 12px;
            `}
          >
            <FormField
              label="시작 시간"
              css={css`
                flex: 1;
              `}
            >
              <Select
                value={startTime}
                onChange={e => {
                  setStartTime(e.target.value);
                  handleFilterChange();
                }}
                aria-label="시작 시간"
              >
                <option value="">선택</option>
                {RESERVATION_TIME_SLOTS.slice(0, -1).map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField
              label="종료 시간"
              css={css`
                flex: 1;
              `}
            >
              <Select
                value={endTime}
                onChange={e => {
                  setEndTime(e.target.value);
                  handleFilterChange();
                }}
                aria-label="종료 시간"
              >
                <option value="">선택</option>
                {RESERVATION_TIME_SLOTS.slice(1).map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
          <Spacing size={14} />

          {/* 참석 인원 + 선호 층 */}
          <div
            css={css`
              display: flex;
              gap: 12px;
            `}
          >
            <FormField
              label="참석 인원"
              css={css`
                flex: 1;
              `}
            >
              <Input
                type="number"
                min={1}
                value={attendees}
                onChange={e => {
                  setAttendees(Math.max(1, Number(e.target.value)));
                  handleFilterChange();
                }}
                aria-label="참석 인원"
              />
            </FormField>

            <FormField
              label="선호 층"
              css={css`
                flex: 1;
              `}
            >
              <Select
                value={preferredFloor ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setPreferredFloor(val === '' ? null : Number(val));
                  handleFilterChange();
                }}
                aria-label="선호 층"
              >
                <option value="">전체</option>
                {floors.map((f: number) => (
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
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
              필요 장비
            </Text>
            <Spacing size={8} />
            <div
              css={css`
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
              `}
            >
              {ALL_EQUIPMENT.map(eq => {
                const selected = equipment.includes(eq);
                return (
                  <ChipToggle
                    key={eq}
                    selected={selected}
                    label={EQUIPMENT_LABELS[eq]}
                    onClick={() => {
                      const next = selected ? equipment.filter(e => e !== eq) : [...equipment, eq];
                      setEquipment(next);
                      handleFilterChange();
                    }}
                  />
                );
              })}
            </div>
          </div>
        </Section>

        {validationError && (
          <div css={pageStyles.inset}>
            <Spacing size={8} />
            <ErrorText message={validationError} />
          </div>
        )}

        <Spacing size={24} />
        <Border size={8} />
        <Spacing size={24} />

        {/* 예약 가능 회의실 목록 */}
        {isFilterComplete && (
          <>
            <Section
              label="예약 가능 회의실"
              right={
                <Text typography="t7" fontWeight="medium" color={colors.grey500}>
                  {availableRooms.length}개
                </Text>
              }
            >
              <RoomList
                rooms={availableRooms}
                selectedRoomId={selectedRoomId}
                onSelect={roomId => {
                  setSelectedRoomId(roomId);
                }}
              />
            </Section>

            <Spacing size={16} />

            <div css={pageStyles.inset}>
              <Button display="full" onClick={handleBook} disabled={createMutation.isPending}>
                {createMutation.isPending ? '예약 중...' : '확정'}
              </Button>
            </div>
          </>
        )}
      </PageLayout>
    </div>
  );
}

const RESERVATION_TIME_SLOTS = range(RESERVATION_TIMELINE_START, RESERVATION_TIMELINE_END)
  .flatMap(h => [`${String(h).padStart(2, '0')}:00`, `${String(h).padStart(2, '0')}:30`])
  .concat(`${String(RESERVATION_TIMELINE_END).padStart(2, '0')}:00`);

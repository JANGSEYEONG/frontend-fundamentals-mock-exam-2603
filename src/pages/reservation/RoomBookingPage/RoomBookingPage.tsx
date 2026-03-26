import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Border, Button, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import axios from 'axios';
import { format } from 'date-fns';
import { isNil } from 'es-toolkit';
import { createReservation } from 'pages/remotes';
import qs from 'qs';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorText } from 'shared/components/ErrorText';
import { FormField } from 'shared/components/FormField';
import { Input } from 'shared/components/Input';
import { MessageBanner } from 'shared/components/MessageBanner';
import { PageLayout } from 'shared/components/PageLayout';
import * as pageStyles from 'shared/components/PageLayout/PageLayout.styles';
import { Section } from 'shared/components/Section';
import { createLocationStateMessage } from 'shared/hooks/useLocationStateMessage';
import { Reservation, Room } from '../models';
import { getMyReservationsQueryOptions, getReservationsQueryOptions, getRoomsQueryOptions } from '../queries';
import { RoomList } from './components/RoomList';
import { BookingFilter, bookingFilterSchema } from './RoomBookingPage.schema';
import * as styles from './RoomBookingPage.styles';

import { DateSelector } from 'shared/components/DateSelector';
import { TimeSelector } from 'shared/components/TimeSelector';
import { EquipmentSelector } from './components/EquipmentSelector';
import { PreferredFloorSelector } from './components/PreferredFloorSelector';
export function RoomBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState<BookingFilter>(() => parseFilterFromQs(searchParams.toString()));
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: rooms = [] } = useQuery(getRoomsQueryOptions());
  const { data: reservations = [] } = useQuery({
    ...getReservationsQueryOptions(filter.date),
    enabled: !!filter.date,
  });

  const createMutation = useMutation((data: Omit<Reservation, 'id'>) => createReservation(data), {
    onSuccess: (data, variables) => {
      if (data.ok) {
        navigate('/', { state: createLocationStateMessage({ text: '예약이 완료되었습니다!' }) });
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

  const handleFilterChange = (patch: Partial<BookingFilter>) => {
    setFilter(prev => {
      const next = { ...prev, ...patch };
      setSearchParams(stringifyFilterToQs(next), { replace: true });
      return next;
    });
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  // 입력 검증
  const hasTimeInputs = filter.startTime !== '' && filter.endTime !== '';
  let validationError: string | null = null;
  if (hasTimeInputs) {
    if (filter.endTime <= filter.startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (filter.attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }
  const isFilterComplete = hasTimeInputs && !validationError;

  const availableRooms = isFilterComplete ? getAvailableRooms(rooms, reservations, filter) : [];

  const handleBook = () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!filter.startTime || !filter.endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }
    createMutation.mutate({
      roomId: selectedRoomId,
      date: filter.date,
      start: filter.startTime,
      end: filter.endTime,
      attendees: filter.attendees,
      equipment: filter.equipment,
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

        <Section label="예약 조건">
          <FormField label="날짜">
            <DateSelector
              value={filter.date}
              onChange={value => handleFilterChange({ date: value })}
              min={format(new Date(), 'yyyy-MM-dd')}
              aria-label="날짜"
            />
          </FormField>

          <Spacing size={14} />

          <div css={styles.filterRowStyle}>
            <FormField label="시작 시간">
              <TimeSelector
                aria-label="시작 시간"
                value={filter.startTime}
                onChange={value => handleFilterChange({ startTime: value })}
                start="09:00"
                end="19:30"
                step={30}
              />
            </FormField>

            <FormField label="종료 시간">
              <TimeSelector
                aria-label="종료 시간"
                value={filter.endTime}
                onChange={value => handleFilterChange({ endTime: value })}
                start="09:30"
                end="20:00"
                step={30}
              />
            </FormField>
          </div>

          <Spacing size={14} />

          <div css={styles.filterRowStyle}>
            <FormField label="참석 인원">
              <Input
                type="number"
                min={1}
                value={filter.attendees}
                onChange={e => handleFilterChange({ attendees: Math.max(1, Number(e.target.value)) })}
                aria-label="참석 인원"
              />
            </FormField>

            <FormField label="선호 층">
              <PreferredFloorSelector value={filter.floor} onChange={floor => handleFilterChange({ floor })} />
            </FormField>
          </div>

          <Spacing size={14} />

          <div>
            <FormField label="필요 장비">
              <EquipmentSelector
                value={filter.equipment}
                onChange={equipment => {
                  handleFilterChange({ equipment });
                }}
              />
            </FormField>
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

export function parseFilterFromQs(search: string): BookingFilter {
  const raw = qs.parse(search, { ignoreQueryPrefix: true });
  return bookingFilterSchema.parse(raw);
}

export function stringifyFilterToQs(filter: BookingFilter): string {
  const params: Record<string, string> = {};

  if (filter.date) params.date = filter.date;
  if (filter.startTime) params.startTime = filter.startTime;
  if (filter.endTime) params.endTime = filter.endTime;
  if (filter.attendees > 1) params.attendees = String(filter.attendees);
  if (filter.equipment.length > 0) params.equipment = filter.equipment.join(',');
  if (filter.floor != null) params.floor = String(filter.floor);

  return qs.stringify(params);
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

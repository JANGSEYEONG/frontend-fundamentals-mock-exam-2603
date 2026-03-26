import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Border, Button, Spacing } from '_tosslib/components';
import axios from 'axios';
import { format } from 'date-fns';
import { createReservation } from 'pages/remotes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorText } from 'shared/components/ErrorText';
import { FormField } from 'shared/components/FormField';
import { Input } from 'shared/components/Input';
import { MessageBanner } from 'shared/components/MessageBanner';
import { PageLayout } from 'shared/components/PageLayout';
import * as pageStyles from 'shared/components/PageLayout/PageLayout.styles';
import { Section } from 'shared/components/Section';
import { createLocationStateMessage } from 'shared/hooks/useLocationStateMessage';
import { Reservation } from '../models';
import { getMyReservationsQueryOptions, getReservationsQueryOptions } from '../queries';
import { AvailableReservationSection } from './components/AvailableReservationSection';
import { BookingFilter, bookingFilterValidationSchema } from './RoomBookingPage.schema';
import * as styles from './RoomBookingPage.styles';

import { DateSelector } from 'shared/components/DateSelector';
import { TimeSelector } from 'shared/components/TimeSelector';
import { EquipmentSelector } from './components/EquipmentSelector';
import { PreferredFloorSelector } from './components/PreferredFloorSelector';
import { useBookingFilter } from './hooks/useBookingFilter';
import { useSelectedRoomId } from './hooks/useSelectedRoomId';
export function RoomBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [bookingFilter, setBookingFilter] = useBookingFilter();
  const [selectedRoomId, setSelectedRoomId] = useSelectedRoomId();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleBook = () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!bookingFilter.startTime || !bookingFilter.endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }
    createMutation.mutate({
      roomId: selectedRoomId,
      date: bookingFilter.date,
      start: bookingFilter.startTime,
      end: bookingFilter.endTime,
      attendees: bookingFilter.attendees,
      equipment: bookingFilter.equipment,
    });
  };

  const handleFilterChange = (patch: Partial<BookingFilter>) => {
    setBookingFilter(patch);
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const filterComplete = bookingFilterValidationSchema.safeParse(bookingFilter);

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
              value={bookingFilter.date}
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
                value={bookingFilter.startTime}
                onChange={value => handleFilterChange({ startTime: value })}
                start="09:00"
                end="19:30"
                step={30}
              />
            </FormField>

            <FormField label="종료 시간">
              <TimeSelector
                aria-label="종료 시간"
                value={bookingFilter.endTime}
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
                value={bookingFilter.attendees}
                onChange={e => handleFilterChange({ attendees: Math.max(1, Number(e.target.value)) })}
                aria-label="참석 인원"
              />
            </FormField>

            <FormField label="선호 층">
              <PreferredFloorSelector value={bookingFilter.floor} onChange={floor => handleFilterChange({ floor })} />
            </FormField>
          </div>

          <Spacing size={14} />

          <div>
            <FormField label="필요 장비">
              <EquipmentSelector
                value={bookingFilter.equipment}
                onChange={equipment => {
                  handleFilterChange({ equipment });
                }}
              />
            </FormField>
          </div>
        </Section>

        {!filterComplete.success && (
          <div css={pageStyles.inset}>
            <Spacing size={8} />
            <ErrorText message={filterComplete.error.issues[0]?.message} />
          </div>
        )}

        <Spacing size={24} />
        <Border size={8} />
        <Spacing size={24} />

        {filterComplete.success && (
          <>
            <AvailableReservationSection
              filter={bookingFilter}
              selectedRoomId={selectedRoomId}
              onSelect={roomId => {
                setSelectedRoomId(roomId);
              }}
            />

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

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Border, Button, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { cancelReservation } from 'pages/remotes';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from 'shared/components/Input';
import { MessageBanner } from 'shared/components/MessageBanner';
import { PageLayout } from 'shared/components/PageLayout';
import * as pageStyles from 'shared/components/PageLayout/PageLayout.styles';
import { Section } from 'shared/components/Section';
import { formatDate } from '../models';
import { myReservationsQueryOptions } from '../queries';
import { MyReservationList } from './components/MyReservationList';
import { ReservationTimeline } from './components/ReservationTimeline';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [date, setDate] = useState(formatDate(new Date()));

  const locationState = location.state as { message?: string } | null;
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    locationState?.message ? { type: 'success', text: locationState.message } : null
  );

  const queryClient = useQueryClient();

  const cancelMutation = useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });

  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  const { data: myReservationList = [] } = useQuery(myReservationsQueryOptions());

  return (
    <PageLayout title="회의실 예약">
      <Spacing size={24} />

      {/* 날짜 선택 */}
      <Section label="날짜 선택">
        <Input
          type="date"
          value={date}
          min={formatDate(new Date())}
          onChange={e => setDate(e.target.value)}
          aria-label="날짜"
        />
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <Section label="예약 현황">
        <ReservationTimeline date={date} />
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      {message && (
        <div css={pageStyles.inset}>
          <MessageBanner message={message} />
          <Spacing size={12} />
        </div>
      )}

      {/* 내 예약 목록 */}
      <Section
        label="내 예약"
        right={
          myReservationList.length > 0 && (
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {myReservationList.length}건
            </Text>
          )
        }
      >
        <MyReservationList
          onCancel={async id => {
            try {
              await cancelMutation.mutateAsync(id);
              setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
            } catch {
              setMessage({ type: 'error', text: '취소에 실패했습니다.' });
            }
          }}
        />
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <div css={pageStyles.inset}>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
    </PageLayout>
  );
}

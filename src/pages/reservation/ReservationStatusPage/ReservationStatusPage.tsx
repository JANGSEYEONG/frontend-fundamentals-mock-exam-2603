import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Border, Button, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { format } from 'date-fns';
import { cancelReservation } from 'pages/remotes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from 'shared/components/Input';
import { MessageBanner } from 'shared/components/MessageBanner';
import { Message } from 'shared/components/MessageBanner/MessageBanner';
import { PageLayout } from 'shared/components/PageLayout';
import * as pageStyles from 'shared/components/PageLayout/PageLayout.styles';
import { Section } from 'shared/components/Section';
import { useLocationStateMessage } from 'shared/hooks/useLocationStateMessage';
import { Reservation } from '../models';
import { getMyReservationsQueryOptions } from '../queries';
import { MyReservationList } from './components/MyReservationList';
import { ReservationTimeline } from './components/ReservationTimeline';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  return (
    <PageLayout title="회의실 예약">
      <Spacing size={24} />

      <Section label="날짜 선택">
        <Input
          type="date"
          value={date}
          min={format(new Date(), 'yyyy-MM-dd')}
          onChange={e => setDate(e.target.value)}
          aria-label="날짜"
        />
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <Section label="예약 현황">
        <ReservationTimeline date={date} />
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <MyReservationSection />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <div css={pageStyles.inset}>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
    </PageLayout>
  );
}

function MyReservationSection() {
  const { data: myReservationList = [] } = useQuery(getMyReservationsQueryOptions());

  const locationMessage = useLocationStateMessage();
  const [message, setMessage] = useState<Message | null>(null);

  const queryClient = useQueryClient();
  const cancelMutation = useMutation(cancelReservation, {
    onSuccess: () => {
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });

      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: getMyReservationsQueryOptions().queryKey });
    },
    onError: () => {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    },
  });

  return (
    <>
      <div css={pageStyles.inset}>
        {(() => {
          if (message) return <MessageBanner message={message} />;
          if (locationMessage) return <MessageBanner message={{ type: 'success', text: locationMessage.text }} />;
        })()}
        <Spacing size={12} />
      </div>
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
          renderRight={(reservation: Reservation) => {
            return (
              <Button
                type="danger"
                style="weak"
                size="small"
                disabled={cancelMutation.isPending}
                onClick={async e => {
                  e.stopPropagation();
                  if (window.confirm('정말 취소하시겠습니까?')) {
                    cancelMutation.mutate(reservation.id);
                  }
                }}
              >
                취소
              </Button>
            );
          }}
        />
      </Section>
    </>
  );
}

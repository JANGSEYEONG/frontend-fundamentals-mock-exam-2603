import { Mutation } from '@suspensive/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { cancelReservation } from 'pages/remotes';
import { Reservation } from 'pages/reservation/models';
import { getMyReservationsQueryOptions } from 'pages/reservation/queries';
import { useState } from 'react';
import { MessageBanner } from 'shared/components/MessageBanner';
import { Message } from 'shared/components/MessageBanner/MessageBanner';
import * as pageStyles from 'shared/components/PageLayout/PageLayout.styles';
import { Section } from 'shared/components/Section';
import { useLocationStateMessage } from 'shared/hooks/useLocationStateMessage';
import { MyReservationList } from '../MyReservationList';

export function MyReservationSection() {
  const { data: myReservationList = [] } = useQuery(getMyReservationsQueryOptions());

  const locationMessage = useLocationStateMessage();
  const [message, setMessage] = useState<Message | null>(() =>
    locationMessage ? { type: 'success', text: locationMessage.text } : null
  );

  const queryClient = useQueryClient();

  return (
    <>
      {message && (
        <div css={pageStyles.inset}>
          <MessageBanner message={message} />
          <Spacing size={12} />
        </div>
      )}
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
              <Mutation mutationFn={cancelReservation}>
                {cancelMutation => (
                  <Button
                    type="danger"
                    style="weak"
                    size="small"
                    disabled={cancelMutation.isPending}
                    onClick={async event => {
                      event.stopPropagation();
                      if (window.confirm('정말 취소하시겠습니까?')) {
                        try {
                          await cancelMutation.mutateAsync(reservation.id);

                          setMessage({ type: 'success', text: '예약이 취소되었습니다.' });

                          queryClient.invalidateQueries({ queryKey: ['reservations'] });
                          queryClient.invalidateQueries({ queryKey: getMyReservationsQueryOptions().queryKey });
                        } catch {
                          setMessage({ type: 'error', text: '취소에 실패했습니다.' });
                        }
                      }
                    }}
                  >
                    취소
                  </Button>
                )}
              </Mutation>
            );
          }}
        />
      </Section>
    </>
  );
}

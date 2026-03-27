import { Border, Button, Spacing } from '_tosslib/components';
import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateSelector } from 'shared/components/DateSelector';
import { PageLayout } from 'shared/components/PageLayout';
import * as pageStyles from 'shared/components/PageLayout/PageLayout.styles';
import { Section } from 'shared/components/Section';
import { MyReservationSection } from './components/MyReservationSection';
import { ReservationTimeline } from './components/ReservationTimeline';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  return (
    <PageLayout title="회의실 예약">
      <Spacing size={24} />

      <Section label="날짜 선택">
        <DateSelector
          value={date}
          onChange={value => setDate(value)}
          min={format(new Date(), 'yyyy-MM-dd')}
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

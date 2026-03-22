import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { range } from 'es-toolkit';
import React from 'react';
import * as styles from './TimelineGrid.styles';

interface TimelineGridProps {
  start: number;
  end: number;
  children: React.ReactNode;
}

function TimelineGrid({ start, end, children }: TimelineGridProps) {
  return (
    <div css={styles.container}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          __startHour: start,
          __endHour: end,
          __totalMinutes: (end - start) * 60,
        });
      })}
    </div>
  );
}

interface HeaderProps {
  /** @internal */ __startHour?: number;
  /** @internal */ __endHour?: number;
  /** @internal */ __totalMinutes?: number;
}

function Header({
  __startHour: startHour = 9,
  __endHour: endHour = 20,
  __totalMinutes: totalMinutes = (endHour - startHour) * 60,
}: HeaderProps) {
  const hours = range(startHour, endHour + 1).map(hour => `${String(hour).padStart(2, '0')}:00`);
  return (
    <div css={styles.headerRow}>
      <div css={styles.labelColumn} />
      <div css={styles.headerTimeline}>
        {hours.map(hour => {
          const position = (toMinutes(hour, startHour) / totalMinutes) * 100;
          return (
            <Text
              key={hour}
              typography="t7"
              fontWeight="regular"
              color={colors.grey400}
              css={styles.hourLabel({ position })}
            >
              {hour.slice(0, 2)}
            </Text>
          );
        })}
      </div>
    </div>
  );
}

interface RowProps {
  label: string;
  isFirst: boolean;
  children: React.ReactNode;
  /** @internal */ __startHour?: number;
  /** @internal */ __totalMinutes?: number;
}

function Row({ label, isFirst, children, __startHour, __totalMinutes }: RowProps) {
  return (
    <div css={styles.roomRow({ isFirst })}>
      <div css={styles.labelColumn}>
        <Text typography="t7" fontWeight="medium" color={colors.grey700} ellipsisAfterLines={1} css={styles.roomName}>
          {label}
        </Text>
      </div>
      <div css={styles.timelineTrack}>
        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child, {
            __startHour,
            __totalMinutes,
          });
        })}
      </div>
    </div>
  );
}

interface BlockProps {
  start: string;
  end: string;
  active?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  /** @internal */ __startHour?: number;
  /** @internal */ __totalMinutes?: number;
}

function Block({
  start,
  end,
  active = false,
  ariaLabel,
  onClick,
  children,
  __startHour: startHour = 9,
  __totalMinutes: totalMinutes = 780,
}: BlockProps) {
  const left = (toMinutes(start, startHour) / totalMinutes) * 100;
  const width = ((toMinutes(end, startHour) - toMinutes(start, startHour)) / totalMinutes) * 100;

  return (
    <div css={styles.reservationSlot({ left, width })}>
      <div role="button" aria-label={ariaLabel} onClick={onClick} css={styles.reservationBar({ isActive: active })} />
      {children}
    </div>
  );
}

// TODO:  parse('02:30', 'HH:mm', new Date()); 사용해서 서버에서 내려온 시간 데이터를 Date 객체로 다루게 하기, 구분자 ":"와의 의존성 끊기 위함
function toMinutes(time: string, startHour: number) {
  const [h, m] = time.split(':').map(Number);
  return (h - startHour) * 60 + m;
}

TimelineGrid.Header = Header;
TimelineGrid.Row = Row;
TimelineGrid.Block = Block;

export { TimelineGrid };

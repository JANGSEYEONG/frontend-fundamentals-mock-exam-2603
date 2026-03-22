import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

export const container = css`
  background: ${colors.grey50};
  border-radius: 14px;
  padding: 16px;
`;

export const headerRow = css`
  display: flex;
  align-items: flex-end;
  margin-bottom: 8px;
`;

export const labelColumn = css`
  width: 80px;
  flex-shrink: 0;
  padding-right: 8px;
`;

export const headerTimeline = css`
  flex: 1;
  position: relative;
  height: 18px;
`;

export const hourLabel = ({ position }: { position: number }) => css`
  position: absolute;
  left: ${position}%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: -0.3px;
`;

export const roomRow = ({ isFirst }: { isFirst: boolean }) => css`
  display: flex;
  align-items: center;
  height: 32px;
  ${!isFirst ? 'margin-top: 4px;' : ''}
`;

export const roomName = css`
  font-size: 12px;
`;

export const timelineTrack = css`
  flex: 1;
  height: 24px;
  background: ${colors.white};
  border-radius: 6px;
  position: relative;
  overflow: visible;
`;

export const reservationSlot = ({ left, width }: { left: number; width: number }) => css`
  position: absolute;
  left: ${left}%;
  width: ${width}%;
  height: 100%;
`;

export const reservationBar = ({ isActive }: { isActive: boolean }) => css`
  width: 100%;
  height: 100%;
  background: ${colors.blue400};
  border-radius: 4px;
  opacity: ${isActive ? 1 : 0.75};
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 1;
  }
`;

export const tooltip = css`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 6px;
  background: ${colors.grey900};
  color: ${colors.white};
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  line-height: 1.6;
`;

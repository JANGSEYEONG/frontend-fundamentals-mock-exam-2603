import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

export const list = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const item = (selected: boolean) => css`
  cursor: pointer;
  padding: 14px 16px;
  border-radius: 14px;
  border: 2px solid ${selected ? colors.blue500 : colors.grey200};
  background: ${selected ? colors.blue50 : colors.white};
  transition: all 0.15s;
  &:hover {
    border-color: ${selected ? colors.blue500 : colors.grey300};
  }
`;

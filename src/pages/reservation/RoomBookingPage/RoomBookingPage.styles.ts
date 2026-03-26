import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

export const backArea = css`
  padding: 12px 24px 0;
`;
export const backButton = css`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  color: ${colors.grey600};
  &:hover {
    color: ${colors.grey900};
  }
`;

export const filterRowStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

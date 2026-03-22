import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

export const list = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const item = css`
  padding: 14px 16px;
  border-radius: 14px;
  background: ${colors.grey50};
  border: 1px solid ${colors.grey200};
`;

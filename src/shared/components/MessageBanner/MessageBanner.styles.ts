import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

export const banner = (type: 'success' | 'error') => css`
  padding: 10px 14px;
  border-radius: 10px;
  background: ${type === 'success' ? colors.blue50 : colors.red50};
  display: flex;
  align-items: center;
  gap: 8px;
`;

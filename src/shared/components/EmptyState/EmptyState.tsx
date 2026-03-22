import { Text } from '_tosslib/components';
import * as styles from './EmptyState.styles';
import { colors } from '_tosslib/constants/colors';

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div css={styles.emptyState}>
      <Text typography="t6" color={colors.grey500}>
        {message}
      </Text>
    </div>
  );
}

import { Text } from '_tosslib/components';
import * as styles from './MessageBanner.styles';
import { colors } from '_tosslib/constants/colors';

export interface Message {
  type: 'success' | 'error';
  text: string;
}

interface MessageBannerProps {
  message: Message;
}
export function MessageBanner({ message }: MessageBannerProps) {
  return (
    <div css={styles.banner(message.type)}>
      <Text typography="t7" fontWeight="medium" color={message.type === 'success' ? colors.blue600 : colors.red500}>
        {message.text}
      </Text>
    </div>
  );
}

import { Text } from '_tosslib/components';
import * as styles from './MessageBanner.styles';

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
      <Text typography="t7" fontWeight="medium" css={styles.text(message.type)}>
        {message.text}
      </Text>
    </div>
  );
}

import * as styles from './ErrorText.styles';

interface ErrorTextProps {
  message: string;
}

export function ErrorText({ message }: ErrorTextProps) {
  return (
    <span css={styles.text} role="alert">
      {message}
    </span>
  );
}

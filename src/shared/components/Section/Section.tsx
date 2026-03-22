import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import * as styles from './Section.styles';
interface SectionProps {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}

export function Section({ label, right, children }: SectionProps) {
  return (
    <div css={styles.wrapper}>
      <div css={styles.header}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          {label}
        </Text>
        {right}
      </div>
      <Spacing size={16} />
      {children}
    </div>
  );
}

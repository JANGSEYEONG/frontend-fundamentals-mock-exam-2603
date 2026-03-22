import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import * as styles from './FormField.styles';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div css={styles.wrapper} className={className}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        {label}
      </Text>
      {children}
    </div>
  );
}

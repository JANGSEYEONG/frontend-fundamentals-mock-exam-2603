import { forwardRef, type ComponentPropsWithRef } from 'react';
import * as styles from './Input.styles';

interface InputProps extends ComponentPropsWithRef<'input'> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  return <input ref={ref} css={styles.input} {...props} />;
});

// shared/components/ChipToggle/ChipToggle.tsx
import type { ReactNode } from 'react';
import * as styles from './ChipToggle.styles';

interface ChipToggleProps {
  selected: boolean;
  onClick: () => void;
  label: string;
}

export function ChipToggle({ selected, onClick, label }: ChipToggleProps) {
  return (
    <button type="button" onClick={onClick} aria-label={label} aria-pressed={selected} css={styles.chip(selected)}>
      {label}
    </button>
  );
}

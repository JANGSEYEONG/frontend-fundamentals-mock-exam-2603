import { ALL_EQUIPMENT, EQUIPMENT_LABELS } from 'pages/reservation/models';
import * as styles from './EquipmentSelector.styles';
import { ChipToggle } from 'shared/components/ChipToggle';
import { xor } from 'es-toolkit';

interface EquipmentSelectorProps {
  value: string[];
  onChange: (equipment: string[]) => void;
}

export function EquipmentSelector({ value, onChange }: EquipmentSelectorProps) {
  return (
    <div css={styles.chipRowStyle}>
      {ALL_EQUIPMENT.map(equipment => (
        <ChipToggle
          key={equipment}
          selected={value.includes(equipment)}
          label={EQUIPMENT_LABELS[equipment]}
          onClick={() => onChange(xor(value, [equipment]))}
        />
      ))}
    </div>
  );
}

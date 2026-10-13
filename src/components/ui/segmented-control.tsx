import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Chip } from '@/components/ui/chip';
import { spacing } from '@/theme';

type SegmentedControlProps<T extends string> = {
  label?: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

/** Grupo de chips con etiqueta, medido en Figma (gap 8 entre chips). */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {label ? (
        <AppText variant="label">{label}</AppText>
      ) : null}
      <View style={styles.row}>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={option === value}
            onPress={() => onChange(option)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});

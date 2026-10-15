import { Pressable, View } from 'react-native';
import { AppText } from '@/components/ui/app-text';
import type { PlaceCategory } from '@/types';
import { allCategories, categoryLabels } from '../data/route-planner';
import { colors } from '@/theme';
export function CategoryPicker({ value, onChange }: { value: PlaceCategory[]; onChange: (categories: PlaceCategory[]) => void }) {
  return <>
    <AppText variant="label">Categorías · Puedes elegir varias</AppText>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {allCategories.map((category) => {
        const selected = value.includes(category);
        return <Pressable key={category} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} accessibilityLabel={categoryLabels[category]} onPress={() => onChange(selected ? value.filter((item) => item !== category) : [...value, category])} style={{ padding: 12, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, borderRadius: 8, backgroundColor: selected ? colors.surfaceGreen : colors.surface }}>
          <AppText variant="label">{selected ? '✓ ' : ''}{categoryLabels[category]}</AppText>
        </Pressable>;
      })}
    </View>
  </>;
}

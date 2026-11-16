import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { allCategories, categoryLabels } from '../data/route-planner';

import { AppText } from '@/components/ui/app-text';
import {
  fetchCategoriesCatalog,
  mapCategorySlugToPlaceCategory,
} from '@/services/catalogos.service';
import { colors } from '@/theme';
import type { PlaceCategory } from '@/types';

export function CategoryPicker({
  value,
  onChange,
}: {
  value: PlaceCategory[];
  onChange: (categories: PlaceCategory[]) => void;
}) {
  const [labelsByCategory, setLabelsByCategory] =
    useState<Record<PlaceCategory, string>>(categoryLabels);

  useEffect(() => {
    let active = true;
    fetchCategoriesCatalog().then((cats) => {
      if (!active || !cats.length) return;
      const next: Record<PlaceCategory, string> = { ...categoryLabels };
      for (const cat of cats) {
        const key = mapCategorySlugToPlaceCategory(cat.slug || cat.name);
        if (cat.name && !next[key]) {
          next[key] = cat.name;
        }
      }
      setLabelsByCategory(next);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <AppText variant="label">Categorías · Puedes elegir varias</AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {allCategories.map((category) => {
          const selected = value.includes(category);
          const label = labelsByCategory[category] ?? categoryLabels[category];
          return (
            <Pressable
              key={category}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={label}
              onPress={() =>
                onChange(
                  selected
                    ? value.filter((item) => item !== category)
                    : [...value, category],
                )
              }
              style={{
                padding: 12,
                borderWidth: 1,
                borderColor: selected ? colors.primary : colors.border,
                borderRadius: 8,
                backgroundColor: selected ? colors.surfaceGreen : colors.surface,
              }}
            >
              <AppText variant="label">
                {selected ? '✓ ' : ''}
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

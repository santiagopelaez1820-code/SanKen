import { Pressable, ScrollView, StyleSheet } from 'react-native';
import type { ProductCategory } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  protein: 'Proteínas',
  creatine: 'Creatinas',
  pre_workout: 'Pre-entrenos',
  amino_acids: 'Aminoácidos',
  vitamins: 'Vitaminas',
  other: 'Otros',
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[];

interface CategoryChipsProps {
  value: ProductCategory | null;
  onChange: (value: ProductCategory | null) => void;
}

export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Chip label="Todas" active={value === null} onPress={() => onChange(null)} />
      {CATEGORIES.map((category) => (
        <Chip
          key={category}
          label={CATEGORY_LABELS[category]}
          active={value === category}
          onPress={() => onChange(category)}
        />
      ))}
    </ScrollView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.accent : theme.backgroundElement,
          borderColor: active ? theme.accent : theme.border,
        },
      ]}>
      <ThemedText type="small" style={{ color: active ? '#050505' : theme.text, fontWeight: active ? '700' : '500' }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.two, paddingVertical: Spacing.one },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    borderWidth: 1,
  },
});

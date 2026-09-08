import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { FoodItem, MealType } from '@sanken/core';
import { foodCategoryIcon, formatFoodQuantity } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MEAL_TYPE_LABELS, MEAL_TYPE_ORDER } from '@/lib/nutrition-grouping';
import { useNutritionStore } from '@/store/nutrition-store';

interface LogMealFormProps {
  food: FoodItem;
  onLogged: () => void;
}

export function LogMealForm({ food, onLogged }: LogMealFormProps) {
  const theme = useTheme();
  const logMeal = useNutritionStore((s) => s.logMeal);
  const hasServing = Boolean(food.serving_size_grams && food.serving_unit_singular);
  const step = hasServing ? (food.serving_size_grams as number) / 2 : 10;

  const [grams, setGrams] = useState(hasServing ? String(food.serving_size_grams) : '100');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [isLogging, setIsLogging] = useState(false);

  const gramsNumber = Number(grams) || 0;
  const display = formatFoodQuantity(food, gramsNumber);

  const adjust = (delta: number) => {
    setGrams((prev) => {
      const next = Math.max(step, (Number(prev) || 0) + delta);
      return String(Math.round(next * 10) / 10);
    });
  };

  const confirmLog = async () => {
    setIsLogging(true);
    try {
      await logMeal(food.id, mealType, gramsNumber);
      onLogged();
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">
        {foodCategoryIcon(food.category)} {food.name}
      </ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        Cantidad
      </ThemedText>
      <View style={styles.quantityRow}>
        <Pressable
          onPress={() => adjust(-step)}
          hitSlop={8}
          style={[styles.stepButton, { borderColor: theme.backgroundSelected }]}>
          <ThemedText type="smallBold">−</ThemedText>
        </Pressable>

        <View style={styles.quantityCenter}>
          <TextInput
            value={grams}
            onChangeText={setGrams}
            keyboardType="numeric"
            textAlign="center"
            style={[styles.gramsInput, { borderColor: theme.backgroundSelected, color: theme.text }]}
          />
          <ThemedText type="small" themeColor="textSecondary" style={styles.quantityHint}>
            {display.servings ? `${display.servings} · ${display.grams}` : display.grams}
          </ThemedText>
        </View>

        <Pressable
          onPress={() => adjust(step)}
          hitSlop={8}
          style={[styles.stepButton, { borderColor: theme.backgroundSelected }]}>
          <ThemedText type="smallBold">+</ThemedText>
        </Pressable>
      </View>

      <ThemedText type="small" themeColor="textSecondary">
        Comida
      </ThemedText>
      <View style={styles.mealTypeRow}>
        {MEAL_TYPE_ORDER.map((type) => {
          const selected = type === mealType;
          return (
            <Pressable
              key={type}
              onPress={() => setMealType(type)}
              style={[
                styles.mealTypeChip,
                { borderColor: theme.backgroundSelected },
                selected && { backgroundColor: theme.backgroundSelected },
              ]}>
              <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                {MEAL_TYPE_LABELS[type]}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton label="Registrar" loading={isLogging} disabled={gramsNumber <= 0} onPress={confirmLog} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  quantityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityCenter: { alignItems: 'center', gap: Spacing.half, minWidth: 96 },
  gramsInput: {
    minWidth: 96,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 20,
    fontWeight: '600',
  },
  quantityHint: { textAlign: 'center' },
  mealTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  mealTypeChip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
});

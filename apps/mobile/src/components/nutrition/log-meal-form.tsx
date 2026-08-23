import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { FoodItem, MealType } from '@sanken/core';

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
  const [grams, setGrams] = useState('100');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [isLogging, setIsLogging] = useState(false);

  const confirmLog = async () => {
    setIsLogging(true);
    try {
      await logMeal(food.id, mealType, Number(grams));
      onLogged();
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">{food.name}</ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        Gramos
      </ThemedText>
      <TextInput
        value={grams}
        onChangeText={setGrams}
        keyboardType="numeric"
        style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
      />

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

      <PrimaryButton label="Registrar" loading={isLogging} onPress={confirmLog} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  mealTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  mealTypeChip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
});

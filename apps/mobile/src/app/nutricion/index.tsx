import { useEffect } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { StatTile } from '@/components/ui/stat-tile';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { MEAL_TYPE_LABELS, MEAL_TYPE_ORDER, groupMealsByType } from '@/lib/nutrition-grouping';
import { useNutritionStore } from '@/store/nutrition-store';

export default function NutricionScreen() {
  const {
    targets,
    isLoadingTargets,
    profileIncomplete,
    meals,
    summary,
    isLoadingMeals,
    loadTargets,
    loadMeals,
    deleteMeal,
  } = useNutritionStore();

  useEffect(() => {
    loadTargets();
    loadMeals();
  }, [loadTargets, loadMeals]);

  const groups = groupMealsByType(meals);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Nutrición
          </ThemedText>

          {profileIncomplete && (
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="small" themeColor="textSecondary">
                Completá tu perfil (edad, sexo, peso, altura) y el onboarding para ver tus objetivos de nutrición.
              </ThemedText>
            </ThemedView>
          )}

          {!isLoadingTargets && targets && (
            <ThemedView style={styles.tileGrid}>
              <StatTile label="Calorías" value={`${targets.calories} kcal`} />
              <StatTile label="Proteína" value={`${targets.protein_g} g`} />
              <StatTile label="Carbohidratos" value={`${targets.carbs_g} g`} />
              <StatTile label="Grasas" value={`${targets.fat_g} g`} />
              <StatTile label="Agua" value={`${(targets.water_ml / 1000).toFixed(1)} L`} />
            </ThemedView>
          )}

          {summary && (
            <ThemedText type="small" themeColor="textSecondary">
              Hoy llevás {summary.calories} kcal · {summary.protein_g}g proteína · {summary.carbs_g}g carbos ·{' '}
              {summary.fat_g}g grasas
            </ThemedText>
          )}

          <View style={styles.actionsRow}>
            <View style={styles.actionButton}>
              <PrimaryButton label="Buscar alimento" onPress={() => router.push('/nutricion/buscar')} />
            </View>
            <View style={styles.actionButton}>
              <PrimaryButton
                label="Escanear código"
                variant="ghost"
                onPress={() => router.push('/nutricion/escanear')}
              />
            </View>
          </View>

          {isLoadingMeals && (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando…
            </ThemedText>
          )}

          {MEAL_TYPE_ORDER.map((type) => (
            <ThemedView key={type} type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">{MEAL_TYPE_LABELS[type]}</ThemedText>
              {groups[type].length === 0 && (
                <ThemedText type="small" themeColor="textSecondary">
                  Sin registros.
                </ThemedText>
              )}
              {groups[type].map((meal) => (
                <ThemedView key={meal.id} style={styles.mealRow}>
                  <ThemedText type="small">
                    {meal.food_item.name} · {meal.quantity_grams}g · {meal.calories} kcal
                  </ThemedText>
                  <Pressable onPress={() => deleteMeal(meal.id)}>
                    <ThemedText type="small" themeColor="textSecondary">
                      Eliminar
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              ))}
            </ThemedView>
          ))}

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 28, lineHeight: 34 },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionButton: { flex: 1 },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
});

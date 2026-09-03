import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { StatTile } from '@/components/ui/stat-tile';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MEAL_TYPE_LABELS, MEAL_TYPE_ORDER, groupMealsByType } from '@/lib/nutrition-grouping';
import { useNutritionStore } from '@/store/nutrition-store';
import { Skeleton } from '@/components/ui/skeleton';

export default function NutricionScreen() {
  const theme = useTheme();
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
    plan,
    planMissing,
    isLoadingPlan,
    isGeneratingPlan,
    planError,
    loadPlan,
    generatePlan,
    substituteResults,
    isSearchingSubstitutes,
    searchSubstitutes,
    substituteItem,
    clearSubstitutes,
  } = useNutritionStore();

  const [substitutingItemId, setSubstitutingItemId] = useState<number | null>(null);
  const [substituteQuery, setSubstituteQuery] = useState('');

  useEffect(() => {
    loadTargets();
    loadMeals();
    loadPlan();
  }, [loadTargets, loadMeals, loadPlan]);

  const groups = groupMealsByType(meals);

  const startSubstituting = (itemId: number) => {
    setSubstitutingItemId(itemId);
    setSubstituteQuery('');
    clearSubstitutes();
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
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

          {!profileIncomplete && (
            <ThemedView type="backgroundElement" style={styles.card}>
              <View style={styles.planHeaderRow}>
                <ThemedText type="smallBold">Plan alimenticio personalizado</ThemedText>
                {plan && (
                  <Pressable onPress={() => generatePlan()} disabled={isGeneratingPlan}>
                    <ThemedText type="small" themeColor="textSecondary">
                      {isGeneratingPlan ? 'Generando…' : 'Regenerar'}
                    </ThemedText>
                  </Pressable>
                )}
              </View>

              {isLoadingPlan && (
                <Skeleton height={72} borderRadius={Spacing.three} />
              )}

              {!isLoadingPlan && planError && (
                <View style={styles.planErrorBlock}>
                  <ThemedText type="small" style={styles.error}>
                    {planError}
                  </ThemedText>
                  <PrimaryButton label="Reintentar" variant="ghost" onPress={() => loadPlan()} />
                </View>
              )}

              {plan && planError && (
                <ThemedText type="small" style={styles.error}>
                  {planError}
                </ThemedText>
              )}

              {!isLoadingPlan && !planError && planMissing && !plan && (
                <>
                  <ThemedText type="small" themeColor="textSecondary">
                    ¿Querés que armemos un plan de comidas para tus objetivos de hoy?
                  </ThemedText>
                  <PrimaryButton
                    label={isGeneratingPlan ? 'Generando…' : 'Sí, generar mi plan'}
                    onPress={() => generatePlan()}
                  />
                </>
              )}

              {plan?.meals.map((meal) => (
                <ThemedView key={meal.id} style={styles.planMealBlock}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {MEAL_TYPE_LABELS[meal.meal_type]} · {meal.target_calories} kcal
                  </ThemedText>
                  {meal.items.map((item) => (
                    <ThemedView key={item.id} style={styles.planItemBlock}>
                      <ThemedView style={styles.mealRow}>
                        <ThemedText type="small">
                          {item.food_item.name} · {item.quantity_grams}g · {item.calories} kcal
                        </ThemedText>
                        <Pressable onPress={() => startSubstituting(item.id)}>
                          <ThemedText type="small" themeColor="textSecondary">
                            Sustituir
                          </ThemedText>
                        </Pressable>
                      </ThemedView>

                      {substitutingItemId === item.id && (
                        <View style={styles.substituteBox}>
                          <View style={styles.searchRow}>
                            <TextInput
                              value={substituteQuery}
                              onChangeText={setSubstituteQuery}
                              onSubmitEditing={() => searchSubstitutes(substituteQuery, item.food_item.category)}
                              placeholder={`Alternativa a ${item.food_item.name}…`}
                              placeholderTextColor={theme.textSecondary}
                              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                            />
                            <Pressable
                              disabled={!substituteQuery.trim() || isSearchingSubstitutes}
                              onPress={() => searchSubstitutes(substituteQuery, item.food_item.category)}
                              style={[
                                styles.searchButton,
                                { backgroundColor: theme.accent },
                                (!substituteQuery.trim() || isSearchingSubstitutes) && styles.disabled,
                              ]}>
                              <ThemedText type="smallBold" style={{ color: '#050505' }}>
                                Buscar
                              </ThemedText>
                            </Pressable>
                          </View>

                          {substituteResults.length === 0 && substituteQuery.trim() !== '' && !isSearchingSubstitutes && (
                            <ThemedText type="small" themeColor="textSecondary">
                              Sin alternativas de la misma categoría.
                            </ThemedText>
                          )}

                          {substituteResults.map((food) => (
                            <Pressable
                              key={food.id}
                              onPress={() => {
                                substituteItem(item.id, food.id);
                                setSubstitutingItemId(null);
                              }}>
                              <ThemedText type="small">
                                {food.name} · {food.calories_per_100g} kcal/100g
                              </ThemedText>
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </ThemedView>
                  ))}
                </ThemedView>
              ))}
            </ThemedView>
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
            <Skeleton height={72} borderRadius={Spacing.three} />
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
  scrollView: { alignSelf: 'stretch' },
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
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  planMealBlock: {
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  planItemBlock: {
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  substituteBox: {
    gap: Spacing.one,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingLeft: Spacing.two,
  },
  searchRow: { flexDirection: 'row', gap: Spacing.two },
  input: { flex: 1, borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  searchButton: { borderRadius: Spacing.two, paddingHorizontal: Spacing.three, justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  planErrorBlock: { gap: Spacing.two, alignItems: 'flex-start', backgroundColor: 'transparent' },
  error: { color: '#FF4D5E' },
});

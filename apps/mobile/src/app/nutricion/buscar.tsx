import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { FoodItem } from '@sanken/core';

import { LogMealForm } from '@/components/nutrition/log-meal-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useNutritionStore } from '@/store/nutrition-store';

export default function BuscarAlimentoScreen() {
  const theme = useTheme();
  const { searchResults, isSearching, searchError, search, clearSearch } = useNutritionStore();
  const [query, setQuery] = useState('');
  const [pendingFood, setPendingFood] = useState<FoodItem | null>(null);

  const runSearch = () => {
    setPendingFood(null);
    search(query);
  };

  const handleLogged = () => {
    clearSearch();
    router.back();
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Buscar alimento
          </ThemedText>

          <View style={styles.searchRow}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={runSearch}
              placeholder="Ej: banana, arroz, pollo…"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />
            <Pressable
              disabled={!query.trim() || isSearching}
              onPress={runSearch}
              style={[styles.searchButton, { backgroundColor: theme.accent }, (!query.trim() || isSearching) && styles.disabled]}>
              <ThemedText type="smallBold" style={{ color: '#0A0A09' }}>
                Buscar
              </ThemedText>
            </Pressable>
          </View>

          {isSearching && (
            <ThemedText type="small" themeColor="textSecondary">
              Buscando…
            </ThemedText>
          )}
          {searchError && (
            <ThemedText type="small" style={styles.error}>
              {searchError}
            </ThemedText>
          )}
          {!isSearching && searchResults.length === 0 && query.trim() !== '' && (
            <ThemedText type="small" themeColor="textSecondary">
              Sin resultados.
            </ThemedText>
          )}

          {searchResults.map((food) => (
            <Pressable key={food.id} onPress={() => setPendingFood(food)}>
              <ThemedView type="backgroundElement" style={styles.resultRow}>
                <ThemedText type="small">{food.name}</ThemedText>
                {food.brand && (
                  <ThemedText type="small" themeColor="textSecondary">
                    {food.brand}
                  </ThemedText>
                )}
                <ThemedText type="small" themeColor="textSecondary">
                  {food.calories_per_100g} kcal/100g
                </ThemedText>
              </ThemedView>
            </Pressable>
          ))}

          {pendingFood && <LogMealForm food={pendingFood} onLogged={handleLogged} />}

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
  searchRow: { flexDirection: 'row', gap: Spacing.two },
  input: { flex: 1, borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  searchButton: { borderRadius: Spacing.two, paddingHorizontal: Spacing.three, justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  resultRow: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.half },
  error: { color: '#C9564A' },
});

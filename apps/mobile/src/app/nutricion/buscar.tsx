// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, TextInput, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «FoodItem» desde «@sanken/core».
import type { FoodItem } from '@sanken/core';
// Esta línea sirve para importar «foodCategoryIcon, formatFoodQuantity» desde «@sanken/core».
import { foodCategoryIcon, formatFoodQuantity } from '@sanken/core';

// Esta línea sirve para importar «LogMealForm» desde «@/components/nutrition/log-meal-form».
import { LogMealForm } from '@/components/nutrition/log-meal-form';
// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useNutritionStore» desde «@/store/nutrition-store».
import { useNutritionStore } from '@/store/nutrition-store';

// Esta línea sirve para declarar la función «BuscarAlimentoScreen».
export default function BuscarAlimentoScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «searchResults, isSearching, searchError, search, clearSearch» con el hook «useNutritionStore».
  const { searchResults, isSearching, searchError, search, clearSearch } = useNutritionStore();
  // Esta línea sirve para crear el estado «query» y su función «setQuery».
  const [query, setQuery] = useState('');
  // Esta línea sirve para crear el estado «pendingFood» y su función «setPendingFood».
  const [pendingFood, setPendingFood] = useState<FoodItem | null>(null);

  // Esta línea sirve para extraer «unSearc» de «() => {».
  const runSearch = () => {
    // Esta línea sirve para guardar en el estado con «setPendingFood» el valor «null)…».
    setPendingFood(null);
    // Esta línea sirve para llamar a «search» con «query».
    search(query);
  };

  // Esta línea sirve para extraer «andleLogge» de «() => {».
  const handleLogged = () => {
    // Esta línea sirve para llamar a «clearSearch».
    clearSearch();
    // Esta línea sirve para llamar a «router.back».
    router.back();
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el texto «Buscar alimento». */}
            Buscar alimento
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.searchRow}>
            {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
            <TextInput allowFontScaling={false}
              // Esta línea sirve para pasar la propiedad «value» con el valor «query}».
              value={query}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={setQuery}
              // Esta línea sirve para asignar el manejador del evento «onSubmitEditing».
              onSubmitEditing={runSearch}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Ej: banana, arroz, pollo…».
              placeholder="Ej: banana, arroz, pollo…"
              // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
              placeholderTextColor={theme.textSecondary}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «!query.trim() || isSearching}».
              disabled={!query.trim() || isSearching}
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={runSearch}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.searchButton, { backgroundColor: them».
              style={[styles.searchButton, { backgroundColor: theme.accent }, (!query.trim() || isSearching) && styles.disabled]}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="smallBold" style={{ color: '#050505' }}>
                {/* Esta línea sirve para mostrar el texto «Buscar». */}
                Buscar
              </ThemedText>
            </Pressable>
          </View>

          {/* Esta línea sirve para mostrar el bloque solo si «isSearching». */}
          {isSearching && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Buscando…». */}
              Buscando…
            </ThemedText>
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «searchError». */}
          {searchError && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={styles.error}>
              {/* Esta línea sirve para mostrar el valor «searchError». */}
              {searchError}
            </ThemedText>
          )}
          {/* Esta línea sirve para mostrar el aviso de sin resultados cuando se buscó algo y no hay nada. */}
          {!isSearching && searchResults.length === 0 && query.trim() !== '' && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Sin resultados.». */}
              Sin resultados.
            </ThemedText>
          )}

          {/* Esta línea sirve para recorrer «searchResults» y calcular qué mostrar por elemento. */}
          {searchResults.map((food) => {
            // Esta línea sirve para extraer «ervin» de «food.serving_size_grams ? formatFoodQuan».
            const serving = food.serving_size_grams ? formatFoodQuantity(food, food.serving_size_grams) : null;
            // Esta línea sirve para devolver la interfaz del componente.
            return (
              // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
              <Pressable key={food.id} onPress={() => setPendingFood(food)}>
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView type="backgroundElement" style={styles.resultRow}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{foodCategoryIcon(food.category)} {food.name}». */}
                    {foodCategoryIcon(food.category)} {food.name}
                  </ThemedText>
                  {/* Esta línea sirve para mostrar el bloque solo si «food.brand». */}
                  {food.brand && (
                    // Esta línea sirve para abrir el componente «ThemedText».
                    <ThemedText type="small" themeColor="textSecondary">
                      {/* Esta línea sirve para mostrar el valor «food.brand». */}
                      {food.brand}
                    </ThemedText>
                  )}
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{food.calories_per_100g} kcal/100g». */}
                    {food.calories_per_100g} kcal/100g
                    {/* Esta línea sirve para mostrar las porciones y los gramos si hay tamaño de porción. */}
                    {serving?.servings ? ` · ${serving.servings} ≈ ${serving.grams}` : ''}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            );
          })}

          {/* Esta línea sirve para mostrar el elemento solo si «pendingFood». */}
          {pendingFood && <LogMealForm food={pendingFood} onLogged={handleLogged} />}

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  // Esta línea sirve para declarar la propiedad «scrollView» con el valor o tipo «{ alignSelf: 'stretch' }».
  scrollView: { alignSelf: 'stretch' },
  // Esta línea sirve para declarar la propiedad «content» con el valor o tipo «{».
  content: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.three».
    paddingTop: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para declarar la propiedad «searchRow» con el valor o tipo «{ flexDirection: 'row', gap: Spacing.two }».
  searchRow: { flexDirection: 'row', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «input» con «flex: 1, borderWidth: 1, borderRadius: Spacing.two…».
  input: { flex: 1, borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  // Esta línea sirve para definir el estilo «searchButton» con «borderRadius: Spacing.two, paddingHorizontal: Spac…».
  searchButton: { borderRadius: Spacing.two, paddingHorizontal: Spacing.three, justifyContent: 'center' },
  // Esta línea sirve para declarar la propiedad «disabled» con el valor o tipo «{ opacity: 0.5 }».
  disabled: { opacity: 0.5 },
  // Esta línea sirve para definir el estilo «resultRow» con «borderRadius: Spacing.three, padding: Spacing.thre…».
  resultRow: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.half },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});

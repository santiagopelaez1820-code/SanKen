// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «Pressable, StyleSheet, TextInput, View» desde «react-native».
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
// Esta línea sirve para importar los tipos «FoodItem, MealType» desde «@sanken/core».
import type { FoodItem, MealType } from '@sanken/core';
// Esta línea sirve para importar «foodCategoryIcon, formatFoodQuantity» desde «@sanken/core».
import { foodCategoryIcon, formatFoodQuantity } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «MEAL_TYPE_LABELS, MEAL_TYPE_ORDER» desde «@/lib/nutrition-grouping».
import { MEAL_TYPE_LABELS, MEAL_TYPE_ORDER } from '@/lib/nutrition-grouping';
// Esta línea sirve para importar «useNutritionStore» desde «@/store/nutrition-store».
import { useNutritionStore } from '@/store/nutrition-store';

// Esta línea sirve para declarar la interfaz «LogMealFormProps».
interface LogMealFormProps {
  // Esta línea sirve para declarar la propiedad «food» con el valor o tipo «FoodItem».
  food: FoodItem;
  // Esta línea sirve para declarar la propiedad «onLogged» con el valor o tipo «() => void».
  onLogged: () => void;
}

// Esta línea sirve para declarar la función «LogMealForm».
export function LogMealForm({ food, onLogged }: LogMealFormProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «logMeal» con el hook «useNutritionStore».
  const logMeal = useNutritionStore((s) => s.logMeal);
  // Esta línea sirve para extraer «asServin» de «Boolean(food.serving_size_grams && food.».
  const hasServing = Boolean(food.serving_size_grams && food.serving_unit_singular);
  // Esta línea sirve para extraer «te» de «hasServing ? (food.serving_size_grams as».
  const step = hasServing ? (food.serving_size_grams as number) / 2 : 10;

  // Esta línea sirve para crear el estado «grams» y su función «setGrams».
  const [grams, setGrams] = useState(hasServing ? String(food.serving_size_grams) : '100');
  // Esta línea sirve para crear el estado «mealType» y su función «setMealType».
  const [mealType, setMealType] = useState<MealType>('lunch');
  // Esta línea sirve para crear el estado «isLogging» y su función «setIsLogging».
  const [isLogging, setIsLogging] = useState(false);

  // Esta línea sirve para extraer «ramsNumbe» de «Number(grams) || 0».
  const gramsNumber = Number(grams) || 0;
  // Esta línea sirve para extraer «ispla» de «formatFoodQuantity(food, gramsNumber)».
  const display = formatFoodQuantity(food, gramsNumber);

  // Esta línea sirve para extraer «djus» de «(delta: number) => {».
  const adjust = (delta: number) => {
    // Esta línea sirve para guardar en el estado con «setGrams» el valor «(prev) => {…».
    setGrams((prev) => {
      // Esta línea sirve para extraer «ex» de «Math.max(step, (Number(prev) || 0) + del».
      const next = Math.max(step, (Number(prev) || 0) + delta);
      // Esta línea sirve para devolver «String(Math.round(next * 10) / 10)».
      return String(Math.round(next * 10) / 10);
    });
  };

  // Esta línea sirve para extraer «onfirmLo» de «async () => {».
  const confirmLog = async () => {
    // Esta línea sirve para guardar en el estado con «setIsLogging» el valor «true)…».
    setIsLogging(true);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «logMeal».
      await logMeal(food.id, mealType, gramsNumber);
      // Esta línea sirve para llamar a «onLogged».
      onLogged();
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsLogging» el valor «false)…».
      setIsLogging(false);
    }
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.card}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="smallBold">
        {/* Esta línea sirve para mostrar el contenido dinámico «{foodCategoryIcon(food.category)} {food.name}». */}
        {foodCategoryIcon(food.category)} {food.name}
      </ThemedText>

      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary">
        {/* Esta línea sirve para mostrar el texto «Cantidad». */}
        Cantidad
      </ThemedText>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={styles.quantityRow}>
        {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
        <Pressable
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={() => adjust(-step)}
          // Esta línea sirve para pasar la propiedad «hitSlop» con el valor «8}».
          hitSlop={8}
          // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.stepButton, { borderColor: theme.back».
          style={[styles.stepButton, { borderColor: theme.backgroundSelected }]}>
          {/* Esta línea sirve para mostrar el texto «−» dentro de «ThemedText». */}
          <ThemedText type="smallBold">−</ThemedText>
        </Pressable>

        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={styles.quantityCenter}>
          {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
          <TextInput allowFontScaling={false}
            // Esta línea sirve para pasar la propiedad «value» con el valor «grams}».
            value={grams}
            // Esta línea sirve para asignar el manejador del evento «onChangeText».
            onChangeText={setGrams}
            // Esta línea sirve para definir el atributo «keyboardType» con el valor «numeric».
            keyboardType="numeric"
            // Esta línea sirve para definir el atributo «textAlign» con el valor «center».
            textAlign="center"
            // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.gramsInput, { borderColor: theme.back».
            style={[styles.gramsInput, { borderColor: theme.backgroundSelected, color: theme.text }]}
          />
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary" style={styles.quantityHint}>
            {/* Esta línea sirve para mostrar las porciones y los gramos, o solo los gramos. */}
            {display.servings ? `${display.servings} · ${display.grams}` : display.grams}
          </ThemedText>
        </View>

        {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
        <Pressable
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={() => adjust(step)}
          // Esta línea sirve para pasar la propiedad «hitSlop» con el valor «8}».
          hitSlop={8}
          // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.stepButton, { borderColor: theme.back».
          style={[styles.stepButton, { borderColor: theme.backgroundSelected }]}>
          {/* Esta línea sirve para mostrar el texto «+» dentro de «ThemedText». */}
          <ThemedText type="smallBold">+</ThemedText>
        </Pressable>
      </View>

      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary">
        {/* Esta línea sirve para mostrar el texto «Comida». */}
        Comida
      </ThemedText>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={styles.mealTypeRow}>
        {/* Esta línea sirve para recorrer «MEAL_TYPE_ORDER» y calcular qué mostrar por elemento. */}
        {MEAL_TYPE_ORDER.map((type) => {
          // Esta línea sirve para extraer «electe» de «type === mealType».
          const selected = type === mealType;
          // Esta línea sirve para devolver la interfaz del componente.
          return (
            // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
            <Pressable
              // Esta línea sirve para identificar el elemento de la lista con «type}».
              key={type}
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => setMealType(type)}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[».
              style={[
                // Esta línea sirve para agregar el estilo «styles.mealTypeChip».
                styles.mealTypeChip,
                // Esta línea sirve para agregar un elemento cuyo «borderColor» es «theme.backgroundSelected },…».
                { borderColor: theme.backgroundSelected },
                // Esta línea sirve para aplicar el estilo «backgroundColor: theme.backgroundSelecte…» solo si «selected».
                selected && { backgroundColor: theme.backgroundSelected },
              ]}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                {/* Esta línea sirve para mostrar el contenido dinámico «{MEAL_TYPE_LABELS[type]}». */}
                {MEAL_TYPE_LABELS[type]}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
      <PrimaryButton label="Registrar" loading={isLogging} disabled={gramsNumber <= 0} onPress={confirmLog} />
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.four, padding: Spacing.three…».
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  // Esta línea sirve para definir el estilo «quantityRow» con «flexDirection: 'row', alignItems: 'center', justif…».
  quantityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  // Esta línea sirve para declarar la propiedad «stepButton» con el valor o tipo «{».
  stepButton: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «40».
    width: 40,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «40».
    height: 40,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «20».
    borderRadius: 20,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para definir el estilo «quantityCenter» con «alignItems: 'center', gap: Spacing.half, minWidth:…».
  quantityCenter: { alignItems: 'center', gap: Spacing.half, minWidth: 96 },
  // Esta línea sirve para declarar la propiedad «gramsInput» con el valor o tipo «{».
  gramsInput: {
    // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «96».
    minWidth: 96,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.two».
    borderRadius: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.two».
    paddingHorizontal: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «20».
    fontSize: 20,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'600'».
    fontWeight: '600',
  },
  // Esta línea sirve para declarar la propiedad «quantityHint» con el valor o tipo «{ textAlign: 'center' }».
  quantityHint: { textAlign: 'center' },
  // Esta línea sirve para definir el estilo «mealTypeRow» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  mealTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «mealTypeChip» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  mealTypeChip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
});

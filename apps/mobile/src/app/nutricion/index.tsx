// Esta línea sirve para importar «useEffect, useRef, useState» desde «react».
import { useEffect, useRef, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, TextInput, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «StatTile» desde «@/components/ui/stat-tile».
import { StatTile } from '@/components/ui/stat-tile';
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/tutorial-overlay».
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from '@/hooks/use-tutorial';
// Esta línea sirve para importar «foodCategoryIcon, formatFoodQuantityLabel» desde «@sanken/core».
import { foodCategoryIcon, formatFoodQuantityLabel } from '@sanken/core';
// Esta línea sirve para importar «MEAL_TYPE_LABELS, MEAL_TYPE_ORDER, groupMealsByType» desde «@/lib/nutrition-grouping».
import { MEAL_TYPE_LABELS, MEAL_TYPE_ORDER, groupMealsByType } from '@/lib/nutrition-grouping';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useNutritionStore» desde «@/store/nutrition-store».
import { useNutritionStore } from '@/store/nutrition-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar la función «NutricionScreen».
export default function NutricionScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id);
  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «targets» en la lista.
    targets,
    // Esta línea sirve para incluir el valor «isLoadingTargets» en la lista.
    isLoadingTargets,
    // Esta línea sirve para incluir el valor «profileIncomplete» en la lista.
    profileIncomplete,
    // Esta línea sirve para incluir el valor «meals» en la lista.
    meals,
    // Esta línea sirve para incluir el valor «summary» en la lista.
    summary,
    // Esta línea sirve para incluir el valor «isLoadingMeals» en la lista.
    isLoadingMeals,
    // Esta línea sirve para incluir el valor «loadTargets» en la lista.
    loadTargets,
    // Esta línea sirve para incluir el valor «loadMeals» en la lista.
    loadMeals,
    // Esta línea sirve para incluir el valor «deleteMeal» en la lista.
    deleteMeal,
    // Esta línea sirve para incluir el valor «plan» en la lista.
    plan,
    // Esta línea sirve para incluir el valor «planMissing» en la lista.
    planMissing,
    // Esta línea sirve para incluir el valor «isLoadingPlan» en la lista.
    isLoadingPlan,
    // Esta línea sirve para incluir el valor «isGeneratingPlan» en la lista.
    isGeneratingPlan,
    // Esta línea sirve para incluir el valor «planError» en la lista.
    planError,
    // Esta línea sirve para incluir el valor «loadPlan» en la lista.
    loadPlan,
    // Esta línea sirve para incluir el valor «generatePlan» en la lista.
    generatePlan,
    // Esta línea sirve para incluir el valor «substituteResults» en la lista.
    substituteResults,
    // Esta línea sirve para incluir el valor «isSearchingSubstitutes» en la lista.
    isSearchingSubstitutes,
    // Esta línea sirve para incluir el valor «searchSubstitutes» en la lista.
    searchSubstitutes,
    // Esta línea sirve para incluir el valor «substituteItem» en la lista.
    substituteItem,
    // Esta línea sirve para incluir el valor «clearSubstitutes» en la lista.
    clearSubstitutes,
  // Esta línea sirve para cerrar la desestructuración con «useNutritionStore()».
  } = useNutritionStore();

  // Esta línea sirve para crear el estado «substitutingItemId» y su función «setSubstitutingItemId».
  const [substitutingItemId, setSubstitutingItemId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «substituteQuery» y su función «setSubstituteQuery».
  const [substituteQuery, setSubstituteQuery] = useState('');

  // Esta línea sirve para crear la referencia «tileGridRef».
  const tileGridRef = useRef<View>(null);
  // Esta línea sirve para crear la referencia «planCardRef».
  const planCardRef = useRef<View>(null);
  // Esta línea sirve para crear la referencia «actionsRowRef».
  const actionsRowRef = useRef<View>(null);
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «nutricion…».
    'nutricion',
    [
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «tileGridRef».
        ref: tileGridRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Tus objetivos diarios'».
        title: 'Tus objetivos diarios',
        // Esta línea sirve para definir la propiedad «description» con «Calculamos tus calorías y macros según t…».
        description: 'Calculamos tus calorías y macros según tu perfil y tus objetivos de entrenamiento.',
      },
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «planCardRef».
        ref: planCardRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Plan de comidas personalizado'».
        title: 'Plan de comidas personalizado',
        // Esta línea sirve para definir la propiedad «description» con «Te armamos un plan con porciones en unid…».
        description: 'Te armamos un plan con porciones en unidades reales, como "2 huevos" en vez de solo gramos.',
      },
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «actionsRowRef».
        ref: actionsRowRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Registrá lo que comés'».
        title: 'Registrá lo que comés',
        // Esta línea sirve para definir la propiedad «description» con «Buscá el alimento por nombre o escaneá s…».
        description: 'Buscá el alimento por nombre o escaneá su código de barras para sumarlo a tu día.',
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoadingTargets,
    // Esta línea sirve para incluir el valor «userId» en la lista.
    userId,
  );

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadTargets».
    loadTargets();
    // Esta línea sirve para llamar a «loadMeals».
    loadMeals();
    // Esta línea sirve para llamar a «loadPlan».
    loadPlan();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadTargets, loadMeals, loadPlan».
  }, [loadTargets, loadMeals, loadPlan]);

  // Esta línea sirve para extraer «roup» de «groupMealsByType(meals)».
  const groups = groupMealsByType(meals);

  // Esta línea sirve para extraer «tartSubstitutin» de «(itemId: number) => {».
  const startSubstituting = (itemId: number) => {
    // Esta línea sirve para guardar en el estado con «setSubstitutingItemId» el valor «itemId)…».
    setSubstitutingItemId(itemId);
    // Esta línea sirve para guardar en el estado con «setSubstituteQuery» el valor «'')…».
    setSubstituteQuery('');
    // Esta línea sirve para llamar a «clearSubstitutes».
    clearSubstitutes();
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
            {/* Esta línea sirve para mostrar el texto «Nutrición». */}
            Nutrición
          </ThemedText>

          {/* Esta línea sirve para mostrar el bloque solo si «profileIncomplete». */}
          {profileIncomplete && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para explicar que hay que completar el perfil y el onboarding. */}
                Completá tu perfil (edad, sexo, peso, altura) y el onboarding para ver tus objetivos de nutrición.
              </ThemedText>
            </ThemedView>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingTargets && targets». */}
          {!isLoadingTargets && targets && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView ref={tileGridRef} style={styles.tileGrid}>
              {/* Esta línea sirve para abrir el componente «StatTile». */}
              <StatTile label="Calorías" value={`${targets.calories} kcal`} />
              {/* Esta línea sirve para abrir el componente «StatTile». */}
              <StatTile label="Proteína" value={`${targets.protein_g} g`} />
              {/* Esta línea sirve para abrir el componente «StatTile». */}
              <StatTile label="Carbohidratos" value={`${targets.carbs_g} g`} />
              {/* Esta línea sirve para abrir el componente «StatTile». */}
              <StatTile label="Grasas" value={`${targets.fat_g} g`} />
              {/* Esta línea sirve para abrir el componente «StatTile». */}
              <StatTile label="Agua" value={`${(targets.water_ml / 1000).toFixed(1)} L`} />
            </ThemedView>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «summary». */}
          {summary && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar las calorías y los macros consumidos hoy. */}
              Hoy llevás {summary.calories} kcal · {summary.protein_g}g proteína · {summary.carbs_g}g carbos ·{' '}
              {/* Esta línea sirve para mostrar el contenido dinámico «{summary.fat_g}g grasas». */}
              {summary.fat_g}g grasas
            </ThemedText>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «!profileIncomplete». */}
          {!profileIncomplete && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView ref={planCardRef} type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para abrir el componente «View». */}
              <View style={styles.planHeaderRow}>
                {/* Esta línea sirve para mostrar el texto «Plan alimenticio personalizado» dentro de «ThemedText». */}
                <ThemedText type="smallBold">Plan alimenticio personalizado</ThemedText>
                {/* Esta línea sirve para mostrar el bloque solo si «plan». */}
                {plan && (
                  // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
                  <Pressable onPress={() => generatePlan()} disabled={isGeneratingPlan}>
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="small" themeColor="textSecondary">
                      {/* Esta línea sirve para mostrar el contenido dinámico «{isGeneratingPlan ? 'Generando…' : 'Regenerar'}». */}
                      {isGeneratingPlan ? 'Generando…' : 'Regenerar'}
                    </ThemedText>
                  </Pressable>
                )}
              </View>

              {/* Esta línea sirve para mostrar el bloque solo si «isLoadingPlan». */}
              {isLoadingPlan && (
                // Esta línea sirve para abrir el componente «Skeleton».
                <Skeleton height={72} borderRadius={Spacing.three} />
              )}

              {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingPlan && planError». */}
              {!isLoadingPlan && planError && (
                // Esta línea sirve para abrir el componente «View».
                <View style={styles.planErrorBlock}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" style={styles.error}>
                    {/* Esta línea sirve para mostrar el valor «planError». */}
                    {planError}
                  </ThemedText>
                  {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
                  <PrimaryButton label="Reintentar" variant="ghost" onPress={() => loadPlan()} />
                </View>
              )}

              {/* Esta línea sirve para mostrar el bloque solo si «plan && planError». */}
              {plan && planError && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" style={styles.error}>
                  {/* Esta línea sirve para mostrar el valor «planError». */}
                  {planError}
                </ThemedText>
              )}

              {/* Esta línea sirve para mostrar el contenido dinámico «{!isLoadingPlan && !planError && planMissing && !plan && (». */}
              {!isLoadingPlan && !planError && planMissing && !plan && (
                // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
                <>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para preguntar si se quiere generar un plan de comidas. */}
                    ¿Querés que armemos un plan de comidas para tus objetivos de hoy?
                  </ThemedText>
                  {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                  <PrimaryButton
                    // Esta línea sirve para pasar la propiedad «label» con el valor «isGeneratingPlan ? 'Generando…' : 'Sí, genera».
                    label={isGeneratingPlan ? 'Generando…' : 'Sí, generar mi plan'}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => generatePlan()}
                  />
                </>
              )}

              {/* Esta línea sirve para recorrer «plan?.meals» y mostrar un bloque por elemento. */}
              {plan?.meals.map((meal) => (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView key={meal.id} style={styles.planMealBlock}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el tipo de comida y sus calorías objetivo. */}
                    {MEAL_TYPE_LABELS[meal.meal_type]} · {meal.target_calories} kcal
                  </ThemedText>
                  {/* Esta línea sirve para recorrer «meal.items» y mostrar un bloque por elemento. */}
                  {meal.items.map((item) => (
                    // Esta línea sirve para abrir el componente «ThemedView».
                    <ThemedView key={item.id} style={styles.planItemBlock}>
                      {/* Esta línea sirve para abrir el componente «ThemedView». */}
                      <ThemedView style={styles.mealRow}>
                        {/* Esta línea sirve para abrir el componente «ThemedText». */}
                        <ThemedText type="small" style={styles.mealRowText}>
                          {/* Esta línea sirve para mostrar el ícono, el nombre y el alimento del plan. */}
                          {foodCategoryIcon(item.food_item.category)} {item.food_item.name} ·{' '}
                          {/* Esta línea sirve para mostrar la cantidad y las calorías del alimento. */}
                          {formatFoodQuantityLabel(item.food_item, item.quantity_grams)} · {item.calories} kcal
                        </ThemedText>
                        {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
                        <Pressable onPress={() => startSubstituting(item.id)} hitSlop={8}>
                          {/* Esta línea sirve para abrir el componente «ThemedText». */}
                          <ThemedText type="small" themeColor="textSecondary">
                            {/* Esta línea sirve para mostrar el texto «Sustituir». */}
                            Sustituir
                          </ThemedText>
                        </Pressable>
                      </ThemedView>

                      {/* Esta línea sirve para mostrar el bloque solo si «substitutingItemId === item.id». */}
                      {substitutingItemId === item.id && (
                        // Esta línea sirve para abrir el componente «View».
                        <View style={styles.substituteBox}>
                          {/* Esta línea sirve para abrir el componente «View». */}
                          <View style={styles.searchRow}>
                            {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
                            <TextInput
                              // Esta línea sirve para pasar la propiedad «value» con el valor «substituteQuery}».
                              value={substituteQuery}
                              // Esta línea sirve para asignar el manejador del evento «onChangeText».
                              onChangeText={setSubstituteQuery}
                              // Esta línea sirve para asignar el manejador del evento «onSubmitEditing».
                              onSubmitEditing={() => searchSubstitutes(substituteQuery, item.food_item.category)}
                              // Esta línea sirve para pasar la propiedad «placeholder» con el valor «`Alternativa a ${item.food_item.name}…`}».
                              placeholder={`Alternativa a ${item.food_item.name}…`}
                              // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
                              placeholderTextColor={theme.textSecondary}
                              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
                              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                            />
                            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
                            <Pressable
                              // Esta línea sirve para pasar la propiedad «disabled» con el valor «!substituteQuery.trim() || isSearchingSubstit».
                              disabled={!substituteQuery.trim() || isSearchingSubstitutes}
                              // Esta línea sirve para asignar el manejador del evento «onPress».
                              onPress={() => searchSubstitutes(substituteQuery, item.food_item.category)}
                              // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                              style={[
                                // Esta línea sirve para agregar el estilo «styles.searchButton».
                                styles.searchButton,
                                // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «theme.accent },…».
                                { backgroundColor: theme.accent },
                                // Esta línea sirve para atenuar el botón mientras no hay búsqueda o está buscando.
                                (!substituteQuery.trim() || isSearchingSubstitutes) && styles.disabled,
                              ]}>
                              {/* Esta línea sirve para abrir el componente «ThemedText». */}
                              <ThemedText type="smallBold" style={{ color: '#050505' }}>
                                {/* Esta línea sirve para mostrar el texto «Buscar». */}
                                Buscar
                              </ThemedText>
                            </Pressable>
                          </View>

                          {/* Esta línea sirve para mostrar el aviso de sin resultados de la sustitución. */}
                          {substituteResults.length === 0 && substituteQuery.trim() !== '' && !isSearchingSubstitutes && (
                            // Esta línea sirve para abrir el componente «ThemedText».
                            <ThemedText type="small" themeColor="textSecondary">
                              {/* Esta línea sirve para mostrar el texto «Sin alternativas de la misma categoría.». */}
                              Sin alternativas de la misma categoría.
                            </ThemedText>
                          )}

                          {/* Esta línea sirve para recorrer «substituteResults» y mostrar un bloque por elemento. */}
                          {substituteResults.map((food) => (
                            // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
                            <Pressable
                              // Esta línea sirve para identificar el elemento de la lista con «food.id}».
                              key={food.id}
                              // Esta línea sirve para asignar el manejador del evento «onPress».
                              onPress={() => {
                                // Esta línea sirve para llamar a «substituteItem» con «item.id, food.id».
                                substituteItem(item.id, food.id);
                                // Esta línea sirve para guardar en el estado con «setSubstitutingItemId» el valor «null)…».
                                setSubstitutingItemId(null);
                              }}>
                              {/* Esta línea sirve para abrir el componente «ThemedText». */}
                              <ThemedText type="small">
                                {/* Esta línea sirve para mostrar el ícono, el nombre y las calorías del alimento. */}
                                {foodCategoryIcon(food.category)} {food.name} · {food.calories_per_100g} kcal/100g
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

          {/* Esta línea sirve para abrir el componente «View». */}
          <View ref={actionsRowRef} style={styles.actionsRow}>
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.actionButton}>
              {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
              <PrimaryButton label="Buscar alimento" onPress={() => router.push('/nutricion/buscar')} />
            </View>
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.actionButton}>
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para definir el atributo «label» con el valor «Escanear código».
                label="Escanear código"
                // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                variant="ghost"
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => router.push('/nutricion/escanear')}
              />
            </View>
          </View>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadingMeals». */}
          {isLoadingMeals && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={72} borderRadius={Spacing.three} />
          )}

          {/* Esta línea sirve para recorrer «MEAL_TYPE_ORDER» y mostrar un bloque por elemento. */}
          {MEAL_TYPE_ORDER.map((type) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={type} type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para mostrar el valor «MEAL_TYPE_LABELS[type]» dentro de «ThemedText». */}
              <ThemedText type="smallBold">{MEAL_TYPE_LABELS[type]}</ThemedText>
              {/* Esta línea sirve para mostrar el bloque solo si «groups[type].length === 0». */}
              {groups[type].length === 0 && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «Sin registros.». */}
                  Sin registros.
                </ThemedText>
              )}
              {/* Esta línea sirve para recorrer «groups[type]» y mostrar un bloque por elemento. */}
              {groups[type].map((meal) => (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView key={meal.id} style={styles.mealRow}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" style={styles.mealRowText}>
                    {/* Esta línea sirve para mostrar el ícono y el nombre del alimento registrado. */}
                    {foodCategoryIcon(meal.food_item.category)} {meal.food_item.name} ·{' '}
                    {/* Esta línea sirve para mostrar la cantidad y las calorías del alimento registrado. */}
                    {formatFoodQuantityLabel(meal.food_item, meal.quantity_grams)} · {meal.calories} kcal
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
                  <Pressable onPress={() => deleteMeal(meal.id)} hitSlop={8}>
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="small" themeColor="textSecondary">
                      {/* Esta línea sirve para mostrar el texto «Eliminar». */}
                      Eliminar
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              ))}
            </ThemedView>
          ))}

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
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
  // Esta línea sirve para declarar la propiedad «tileGrid» con el valor o tipo «{».
  tileGrid: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «flexWrap» con el valor o tipo «'wrap'».
    flexWrap: 'wrap',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «actionsRow» con el valor o tipo «{».
  actionsRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «actionButton» con el valor o tipo «{ flex: 1 }».
  actionButton: { flex: 1 },
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «mealRow» con el valor o tipo «{».
  mealRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «flexWrap» con el valor o tipo «'wrap'».
    flexWrap: 'wrap',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «mealRowText» con el valor o tipo «{ flex: 1, flexShrink: 1, minWidth: 160 }».
  mealRowText: { flex: 1, flexShrink: 1, minWidth: 160 },
  // Esta línea sirve para declarar la propiedad «planHeaderRow» con el valor o tipo «{».
  planHeaderRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «planMealBlock» con el valor o tipo «{».
  planMealBlock: {
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «planItemBlock» con el valor o tipo «{».
  planItemBlock: {
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «substituteBox» con el valor o tipo «{».
  substituteBox: {
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.two».
    borderRadius: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «borderColor» con el valor o tipo «'transparent'».
    borderColor: 'transparent',
    // Esta línea sirve para declarar la propiedad «paddingLeft» con el valor o tipo «Spacing.two».
    paddingLeft: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «searchRow» con el valor o tipo «{ flexDirection: 'row', gap: Spacing.two }».
  searchRow: { flexDirection: 'row', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «input» con «flex: 1, borderWidth: 1, borderRadius: Spacing.two…».
  input: { flex: 1, borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  // Esta línea sirve para definir el estilo «searchButton» con «borderRadius: Spacing.two, paddingHorizontal: Spac…».
  searchButton: { borderRadius: Spacing.two, paddingHorizontal: Spacing.three, justifyContent: 'center' },
  // Esta línea sirve para declarar la propiedad «disabled» con el valor o tipo «{ opacity: 0.5 }».
  disabled: { opacity: 0.5 },
  // Esta línea sirve para definir el estilo «planErrorBlock» con «gap: Spacing.two, alignItems: 'flex-start', backgr…».
  planErrorBlock: { gap: Spacing.two, alignItems: 'flex-start', backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});

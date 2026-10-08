// Esta línea sirve para importar «useRef, useState» desde «react».
import { useRef, useState } from "react"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para abrir la importación de tipos de nutrición.
import type {
  // Esta línea sirve para incluir el valor «DailyNutritionSummary» en la lista.
  DailyNutritionSummary,
  // Esta línea sirve para incluir el valor «FoodItem» en la lista.
  FoodItem,
  // Esta línea sirve para incluir el valor «MealLog» en la lista.
  MealLog,
  // Esta línea sirve para incluir el valor «MealType» en la lista.
  MealType,
  // Esta línea sirve para incluir el valor «NutritionPlan» en la lista.
  NutritionPlan,
  // Esta línea sirve para incluir el valor «NutritionTargets» en la lista.
  NutritionTargets,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar las utilidades de nutrición del núcleo.
import { ApiError, foodCategoryIcon, formatFoodQuantity, formatFoodQuantityLabel } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «StatTile» desde «@/components/dashboard/StatTile».
import { StatTile } from "@/components/dashboard/StatTile"
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/TutorialOverlay».
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay"
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from "@/hooks/use-tutorial"
// Esta línea sirve para importar «MEAL_TYPE_LABELS, MEAL_TYPE_ORDER, groupMealsByType» desde «@/lib/nutrition-grouping».
import { MEAL_TYPE_LABELS, MEAL_TYPE_ORDER, groupMealsByType } from "@/lib/nutrition-grouping"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la función «NutritionPage».
export function NutritionPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id)
  // Esta línea sirve para crear el estado «query» y su función «setQuery».
  const [query, setQuery] = useState("")
  // Esta línea sirve para crear el estado «searchResults» y su función «setSearchResults».
  const [searchResults, setSearchResults] = useState<FoodItem[] | null>(null)
  // Esta línea sirve para crear el estado «isSearching» y su función «setIsSearching».
  const [isSearching, setIsSearching] = useState(false)
  // Esta línea sirve para crear el estado «pendingFood» y su función «setPendingFood».
  const [pendingFood, setPendingFood] = useState<FoodItem | null>(null)
  // Esta línea sirve para crear el estado «grams» y su función «setGrams».
  const [grams, setGrams] = useState("100")
  // Esta línea sirve para crear el estado «mealType» y su función «setMealType».
  const [mealType, setMealType] = useState<MealType>("lunch")

  // Esta línea sirve para obtener «data: targets, error: targetsError» con el hook «useQuery».
  const { data: targets, error: targetsError } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["nutrition", "targets"]».
    queryKey: ["nutrition", "targets"],
    // Esta línea sirve para pedir a la API los datos de «/nutrition/targets».
    queryFn: () => api.get<NutritionTargets>("/nutrition/targets"),
    // Esta línea sirve para declarar la propiedad «retry» con el valor o tipo «false».
    retry: false,
  })

  // Esta línea sirve para obtener «data: meals, isLoading: isLoadingMeals» con el hook «useQuery».
  const { data: meals, isLoading: isLoadingMeals } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["nutrition", "meals"]».
    queryKey: ["nutrition", "meals"],
    // Esta línea sirve para pedir a la API los datos de «/nutrition/meals».
    queryFn: () => api.getWithMeta<MealLog[]>("/nutrition/meals"),
  })

  // Esta línea sirve para abrir la desestructuración de los resultados de la consulta.
  const {
    // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «plan».
    data: plan,
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «planError».
    error: planError,
    // Esta línea sirve para declarar la propiedad «refetch» con el valor o tipo «refetchPlan».
    refetch: refetchPlan,
  // Esta línea sirve para cerrar la desestructuración y pedir los objetivos.
  } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["nutrition", "plan"]».
    queryKey: ["nutrition", "plan"],
    // Esta línea sirve para pedir a la API los datos de «/nutrition/plan».
    queryFn: () => api.get<NutritionPlan>("/nutrition/plan"),
    // Esta línea sirve para declarar la propiedad «retry» con el valor o tipo «false».
    retry: false,
    // Esta línea sirve para deshabilitar la consulta si los objetivos no existen (404).
    enabled: !(targetsError instanceof ApiError && targetsError.status === 404),
  })
  // Esta línea sirve para extraer «lanMissin» de «planError instanceof ApiError && planErr».
  const planMissing = planError instanceof ApiError && planError.status === 404
  // Esta línea sirve para extraer «lanLoadFaile» de «Boolean(planError) && !planMissing».
  const planLoadFailed = Boolean(planError) && !planMissing

  // Esta línea sirve para crear la referencia «tileGridRef».
  const tileGridRef = useRef<HTMLElement>(null)
  // Esta línea sirve para crear la referencia «planCardRef».
  const planCardRef = useRef<HTMLElement>(null)
  // Esta línea sirve para crear la referencia «addFoodRef».
  const addFoodRef = useRef<HTMLElement>(null)
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «nutricion…».
    "nutricion",
    [
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «tileGridRef».
        target: tileGridRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Tus objetivos diarios"».
        title: "Tus objetivos diarios",
        // Esta línea sirve para definir la propiedad «description» con «Calculamos tus calorías y macros según t…».
        description: "Calculamos tus calorías y macros según tu perfil y tus objetivos de entrenamiento.",
      },
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «planCardRef».
        target: planCardRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Plan de comidas personalizado"».
        title: "Plan de comidas personalizado",
        // Esta línea sirve para definir la propiedad «description» con «Te armamos un plan con porciones en unid…».
        description: 'Te armamos un plan con porciones en unidades reales, como "2 huevos" en vez de solo gramos.',
      },
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «addFoodRef».
        target: addFoodRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Registrá lo que comés"».
        title: "Registrá lo que comés",
        // Esta línea sirve para definir la propiedad «description» con «Buscá el alimento por nombre para sumarl…».
        description: "Buscá el alimento por nombre para sumarlo a tu día.",
      },
    ],
    // Esta línea sirve para indicar que ya hay objetivos.
    !!targets,
    // Esta línea sirve para pasar el id del usuario.
    userId
  )

  // Esta línea sirve para obtener «generatePlanMutation» con el hook «useMutation».
  const generatePlanMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/nutrition/plan».
    mutationFn: () => api.post<NutritionPlan>("/nutrition/plan"),
    // Esta línea sirve para guardar el plan generado en la caché.
    onSuccess: (data) => queryClient.setQueryData(["nutrition", "plan"], data),
  })

  // Esta línea sirve para crear el estado «substitutingItemId» y su función «setSubstitutingItemId».
  const [substitutingItemId, setSubstitutingItemId] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «substituteQuery» y su función «setSubstituteQuery».
  const [substituteQuery, setSubstituteQuery] = useState("")
  // Esta línea sirve para crear el estado «substituteResults» y su función «setSubstituteResults».
  const [substituteResults, setSubstituteResults] = useState<FoodItem[] | null>(null)
  // Esta línea sirve para crear el estado «isSearchingSubstitutes» y su función «setIsSearchingSubstitutes».
  const [isSearchingSubstitutes, setIsSearchingSubstitutes] = useState(false)

  // Esta línea sirve para obtener «substituteMutation» con el hook «useMutation».
  const substituteMutation = useMutation({
    // Esta línea sirve para declarar la mutación que sustituye un alimento del plan.
    mutationFn: ({ itemId, foodItemId }: { itemId: number; foodItemId: number }) =>
      // Esta línea sirve para enviar a la API el alimento sustituto.
      api.patch(`/nutrition/plan/items/${itemId}`, { food_item_id: foodItemId }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["nutrition", "plan"] }».
      queryClient.invalidateQueries({ queryKey: ["nutrition", "plan"] })
      // Esta línea sirve para llamar a «setSubstitutingItemId» con «null».
      setSubstitutingItemId(null)
      // Esta línea sirve para llamar a «setSubstituteResults» con «null».
      setSubstituteResults(null)
      // Esta línea sirve para llamar a «setSubstituteQuery» con «""».
      setSubstituteQuery("")
    },
  })

  // Esta línea sirve para extraer «earchSubstitute» de «async (category: string | null) => {».
  const searchSubstitutes = async (category: string | null) => {
    // Esta línea sirve para salir de la función si «!substituteQuery.trim()».
    if (!substituteQuery.trim()) return
    // Esta línea sirve para llamar a «setIsSearchingSubstitutes» con «true».
    setIsSearchingSubstitutes(true)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<FoodItem[]>(`/nutrition/foods?q=${encodeUR» y guardar el resultado en «results».
      const results = await api.get<FoodItem[]>(`/nutrition/foods?q=${encodeURIComponent(substituteQuery.trim())}`)
      // Esta línea sirve para quedarse con los alimentos de la misma categoría.
      setSubstituteResults(results.filter((food) => food.category === category))
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para llamar a «setIsSearchingSubstitutes» con «false».
      setIsSearchingSubstitutes(false)
    }
  }

  // Esta línea sirve para extraer «tartSubstitutin» de «(itemId: number) => {».
  const startSubstituting = (itemId: number) => {
    // Esta línea sirve para llamar a «setSubstitutingItemId» con «itemId».
    setSubstitutingItemId(itemId)
    // Esta línea sirve para llamar a «setSubstituteQuery» con «""».
    setSubstituteQuery("")
    // Esta línea sirve para llamar a «setSubstituteResults» con «null».
    setSubstituteResults(null)
  }

  // Esta línea sirve para obtener «logMutation» con el hook «useMutation».
  const logMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «() =>».
    mutationFn: () =>
      // Esta línea sirve para enviar la comida registrada a la API.
      api.post("/nutrition/meals", {
        // Esta línea sirve para declarar la propiedad «food_item_id» con el valor o tipo «pendingFood!.id».
        food_item_id: pendingFood!.id,
        // Esta línea sirve para declarar la propiedad «meal_type» con el valor o tipo «mealType».
        meal_type: mealType,
        // Esta línea sirve para declarar la propiedad «quantity_grams» con el valor o tipo «Number(grams)».
        quantity_grams: Number(grams),
      }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["nutrition", "meals"] }».
      queryClient.invalidateQueries({ queryKey: ["nutrition", "meals"] })
      // Esta línea sirve para llamar a «setPendingFood» con «null».
      setPendingFood(null)
      // Esta línea sirve para llamar a «setSearchResults» con «null».
      setSearchResults(null)
      // Esta línea sirve para llamar a «setQuery» con «""».
      setQuery("")
    },
  })

  // Esta línea sirve para obtener «deleteMutation» con el hook «useMutation».
  const deleteMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «delete» hacia «/nutrition/meals/${id}».
    mutationFn: (id: number) => api.delete(`/nutrition/meals/${id}`),
    // Esta línea sirve para refrescar la lista de comidas al terminar.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["nutrition", "meals"] }),
  })

  // Esta línea sirve para extraer «electFoo» de «(food: FoodItem) => {».
  const selectFood = (food: FoodItem) => {
    // Esta línea sirve para llamar a «setPendingFood» con «food».
    setPendingFood(food)
    // Esta línea sirve para usar la porción del alimento o 100 gramos.
    setGrams(food.serving_size_grams ? String(food.serving_size_grams) : "100")
  }

  // Esta línea sirve para extraer «djustGram» de «(delta: number) => {».
  const adjustGrams = (delta: number) => {
    // Esta línea sirve para actualizar los gramos a partir del valor anterior.
    setGrams((prev) => {
      // Esta línea sirve para extraer «te» de «pendingFood?.serving_size_grams ? pendin».
      const step = pendingFood?.serving_size_grams ? pendingFood.serving_size_grams / 2 : 10
      // Esta línea sirve para extraer «ex» de «Math.max(step, (Number(prev) || 0) + del».
      const next = Math.max(step, (Number(prev) || 0) + delta)
      // Esta línea sirve para devolver «String(Math.round(next * 10) / 10)».
      return String(Math.round(next * 10) / 10)
    })
  }

  // Esta línea sirve para extraer «earc» de «async () => {».
  const search = async () => {
    // Esta línea sirve para salir de la función si «!query.trim()».
    if (!query.trim()) return
    // Esta línea sirve para llamar a «setIsSearching» con «true».
    setIsSearching(true)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<FoodItem[]>(`/nutrition/foods?q=${encodeUR» y guardar el resultado en «results».
      const results = await api.get<FoodItem[]>(`/nutrition/foods?q=${encodeURIComponent(query.trim())}`)
      // Esta línea sirve para llamar a «setSearchResults» con «results».
      setSearchResults(results)
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para llamar a «setIsSearching» con «false».
      setIsSearching(false)
    }
  }

  // Esta línea sirve para extraer «roup» de «groupMealsByType(meals?.data ?? [])».
  const groups = groupMealsByType(meals?.data ?? [])
  // Esta línea sirve para extraer «ummar» de «meals?.meta?.summary as DailyNutritionSu».
  const summary = meals?.meta?.summary as DailyNutritionSummary | undefined
  // Esta línea sirve para extraer «rofileIncomplet» de «targetsError instanceof ApiError && targ».
  const profileIncomplete = targetsError instanceof ApiError && targetsError.status === 404

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-2xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Nutrición» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Nutrición</h1>

        {/* Esta línea sirve para mostrar el bloque solo si «profileIncomplete». */}
        {profileIncomplete && (
          // Esta línea sirve para abrir el elemento «p» con las clases «rounded-xl border border-border bg-card ».
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            {/* Esta línea sirve para explicar que hay que completar el perfil y el onboarding. */}
            Completá tu perfil (edad, sexo, peso, altura) y el onboarding para ver tus objetivos de nutrición.
          </p>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «targets». */}
        {targets && (
          // Esta línea sirve para abrir el elemento «section».
          <section ref={tileGridRef} className="grid grid-cols-2 gap-4 sm:grid-cols-5">
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
          </section>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «summary». */}
        {summary && (
          // Esta línea sirve para abrir el elemento «p» con las clases «text-sm text-muted-foreground».
          <p className="text-sm text-muted-foreground">
            {/* Esta línea sirve para mostrar las calorías consumidas hoy. */}
            Hoy llevás <span className="font-medium text-foreground">{summary.calories} kcal</span> ·{" "}
            {/* Esta línea sirve para mostrar los gramos de proteína, carbohidratos y grasas. */}
            {summary.protein_g}g proteína · {summary.carbs_g}g carbos · {summary.fat_g}g grasas
          </p>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «!profileIncomplete». */}
        {!profileIncomplete && (
          // Esta línea sirve para abrir el elemento «section».
          <section ref={planCardRef} className="rounded-xl border border-border bg-card p-5">
            {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center justify-between». */}
            <div className="flex items-center justify-between">
              {/* Esta línea sirve para mostrar el texto «Plan alimenticio personalizado» dentro de un «h2». */}
              <h2 className="font-heading text-sm font-medium">Plan alimenticio personalizado</h2>
              {/* Esta línea sirve para mostrar el bloque solo si «plan». */}
              {plan && (
                // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
                <Button
                  // Esta línea sirve para definir el atributo «size» con el valor «sm».
                  size="sm"
                  // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                  variant="outline"
                  // Esta línea sirve para asignar el manejador del evento «onClick».
                  onClick={() => generatePlanMutation.mutate()}
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «generatePlanMutation.isPending}».
                  disabled={generatePlanMutation.isPending}
                >
                  {/* Esta línea sirve para mostrar el texto «Regenerar». */}
                  Regenerar
                </Button>
              )}
            </div>

            {/* Esta línea sirve para mostrar el bloque solo si «planMissing && !plan». */}
            {planMissing && !plan && (
              // Esta línea sirve para abrir el elemento «div» con las clases «mt-2 flex flex-col items-start gap-2».
              <div className="mt-2 flex flex-col items-start gap-2">
                {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm text-muted-foreground». */}
                <p className="text-sm text-muted-foreground">
                  {/* Esta línea sirve para preguntar si se quiere generar un plan de comidas. */}
                  ¿Querés que armemos un plan de comidas para tus objetivos de hoy?
                </p>
                {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
                <Button size="sm" onClick={() => generatePlanMutation.mutate()} disabled={generatePlanMutation.isPending}>
                  {/* Esta línea sirve para mostrar el texto según si se está generando el plan. */}
                  {generatePlanMutation.isPending ? "Generando…" : "Sí, generar mi plan"}
                </Button>
              </div>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «planLoadFailed». */}
            {planLoadFailed && (
              // Esta línea sirve para abrir el elemento «div» con las clases «mt-2 flex flex-col items-start gap-2».
              <div className="mt-2 flex flex-col items-start gap-2">
                {/* Esta línea sirve para mostrar el texto «No se pudo cargar tu plan alimenticio.» dentro de un «p». */}
                <p className="text-sm text-destructive">No se pudo cargar tu plan alimenticio.</p>
                {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
                <Button size="sm" variant="outline" onClick={() => refetchPlan()}>
                  {/* Esta línea sirve para mostrar el texto «Reintentar». */}
                  Reintentar
                </Button>
              </div>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «generatePlanMutation.isError». */}
            {generatePlanMutation.isError && (
              // Esta línea sirve para mostrar el valor «generatePlanMutation.error.message» dentro de un «p».
              <p className="mt-2 text-sm text-destructive">{generatePlanMutation.error.message}</p>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «plan». */}
            {plan && (
              // Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex flex-col gap-4».
              <div className="mt-3 flex flex-col gap-4">
                {/* Esta línea sirve para recorrer «plan.meals» y mostrar un bloque por elemento. */}
                {plan.meals.map((meal) => (
                  // Esta línea sirve para abrir el elemento «div».
                  <div key={meal.id}>
                    {/* Esta línea sirve para abrir el elemento «h3» con las clases «text-xs font-medium uppercase text-muted». */}
                    <h3 className="text-xs font-medium uppercase text-muted-foreground">
                      {/* Esta línea sirve para mostrar el tipo de comida y sus calorías objetivo. */}
                      {MEAL_TYPE_LABELS[meal.meal_type]} · {meal.target_calories} kcal
                    </h3>
                    {/* Esta línea sirve para abrir el elemento «ul» con las clases «mt-1 flex flex-col gap-1». */}
                    <ul className="mt-1 flex flex-col gap-1">
                      {/* Esta línea sirve para recorrer «meal.items» y mostrar un bloque por elemento. */}
                      {meal.items.map((item) => (
                        // Esta línea sirve para abrir el elemento «li».
                        <li key={item.id} className="text-sm">
                          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap items-center justify-betw». */}
                          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                            {/* Esta línea sirve para abrir el elemento «span» con las clases «min-w-0 flex-1». */}
                            <span className="min-w-0 flex-1">
                              {/* Esta línea sirve para mostrar el ícono, el nombre y el alimento del plan. */}
                              {foodCategoryIcon(item.food_item.category)} {item.food_item.name} ·{" "}
                              {/* Esta línea sirve para mostrar la cantidad y las calorías del alimento. */}
                              {formatFoodQuantityLabel(item.food_item, item.quantity_grams)} · {item.calories} kcal
                            </span>
                            {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
                            <button
                              // Esta línea sirve para asignar el manejador del evento «onClick».
                              onClick={() => startSubstituting(item.id)}
                              // Esta línea sirve para aplicar las clases de estilo «shrink-0 text-xs text-muted-foreground hover:».
                              className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
                            >
                              {/* Esta línea sirve para mostrar el texto «Sustituir». */}
                              Sustituir
                            </button>
                          </div>

                          {/* Esta línea sirve para mostrar el bloque solo si «substitutingItemId === item.id». */}
                          {substitutingItemId === item.id && (
                            // Esta línea sirve para abrir el elemento «div» con las clases «mt-1 rounded-lg border border-dashed bor».
                            <div className="mt-1 rounded-lg border border-dashed border-border p-2">
                              {/* Esta línea sirve para abrir el elemento «div» con las clases «flex gap-2». */}
                              <div className="flex gap-2">
                                {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                                <input
                                  // Esta línea sirve para pasar la propiedad «value» con el valor «substituteQuery}».
                                  value={substituteQuery}
                                  // Esta línea sirve para asignar el manejador del evento «onChange».
                                  onChange={(e) => setSubstituteQuery(e.target.value)}
                                  // Esta línea sirve para asignar el manejador del evento «onKeyDown».
                                  onKeyDown={(e) => e.key === "Enter" && searchSubstitutes(item.food_item.category)}
                                  // Esta línea sirve para pasar la propiedad «placeholder» con el valor «`Buscar alternativa a ${item.food_item.name}…».
                                  placeholder={`Buscar alternativa a ${item.food_item.name}…`}
                                  // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                                  className="w-full rounded-lg border border-input bg-background px-2 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                />
                                {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                                <Button
                                  // Esta línea sirve para definir el atributo «size» con el valor «sm».
                                  size="sm"
                                  // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                                  variant="outline"
                                  // Esta línea sirve para asignar el manejador del evento «onClick».
                                  onClick={() => searchSubstitutes(item.food_item.category)}
                                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «isSearchingSubstitutes || !substituteQuery.tr».
                                  disabled={isSearchingSubstitutes || !substituteQuery.trim()}
                                >
                                  {/* Esta línea sirve para mostrar el texto «Buscar». */}
                                  Buscar
                                </Button>
                                {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
                                <Button size="sm" variant="outline" onClick={() => setSubstitutingItemId(null)}>
                                  {/* Esta línea sirve para mostrar el texto «Cancelar». */}
                                  Cancelar
                                </Button>
                              </div>

                              {/* Esta línea sirve para mostrar el bloque solo si «substituteMutation.isError». */}
                              {substituteMutation.isError && (
                                // Esta línea sirve para mostrar el valor «substituteMutation.error.message» dentro de un «p».
                                <p className="mt-1 text-xs text-destructive">{substituteMutation.error.message}</p>
                              )}

                              {/* Esta línea sirve para mostrar el contenido dinámico «{substituteResults && substituteResults.length === 0 && (». */}
                              {substituteResults && substituteResults.length === 0 && (
                                // Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-xs text-muted-foreground».
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {/* Esta línea sirve para mostrar el texto «Sin alternativas de la misma categoría.». */}
                                  Sin alternativas de la misma categoría.
                                </p>
                              )}

                              {/* Esta línea sirve para mostrar el bloque solo si «substituteResults && substituteResults.length > 0». */}
                              {substituteResults && substituteResults.length > 0 && (
                                // Esta línea sirve para abrir el elemento «ul» con las clases «mt-1 flex flex-col gap-1».
                                <ul className="mt-1 flex flex-col gap-1">
                                  {/* Esta línea sirve para recorrer «substituteResults» y mostrar un bloque por elemento. */}
                                  {substituteResults.map((food) => (
                                    // Esta línea sirve para abrir el elemento «li».
                                    <li key={food.id}>
                                      {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
                                      <button
                                        // Esta línea sirve para asignar el manejador del evento «onClick».
                                        onClick={() =>
                                          // Esta línea sirve para llamar a «substituteMutation.mutate» con «{ itemId: item.id, foodItemId: food.id }».
                                          substituteMutation.mutate({ itemId: item.id, foodItemId: food.id })
                                        }
                                        // Esta línea sirve para pasar la propiedad «disabled» con el valor «substituteMutation.isPending}».
                                        disabled={substituteMutation.isPending}
                                        // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg p-1 text-left text-xs hover».
                                        className="w-full rounded-lg p-1 text-left text-xs hover:bg-muted"
                                      >
                                        {/* Esta línea sirve para mostrar el ícono, el nombre y las calorías del alimento. */}
                                        {foodCategoryIcon(food.category)} {food.name} · {food.calories_per_100g}{" "}
                                        {/* Esta línea sirve para mostrar el texto «kcal/100g». */}
                                        kcal/100g
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Esta línea sirve para abrir el elemento «section». */}
        <section ref={addFoodRef} className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Agregar comida» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium">Agregar comida</h2>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-2 flex gap-2». */}
          <div className="mt-2 flex gap-2">
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para pasar la propiedad «value» con el valor «query}».
              value={query}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setQuery(e.target.value)}
              // Esta línea sirve para asignar el manejador del evento «onKeyDown».
              onKeyDown={(e) => e.key === "Enter" && search()}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Buscar alimento…».
              placeholder="Buscar alimento…"
              // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {/* Esta línea sirve para abrir el componente «Button». */}
            <Button size="sm" onClick={search} disabled={isSearching || !query.trim()}>
              {/* Esta línea sirve para mostrar el texto «Buscar». */}
              Buscar
            </Button>
          </div>

          {/* Esta línea sirve para mostrar el elemento solo si «isSearching». */}
          {isSearching && <p className="mt-2 text-sm text-muted-foreground">Buscando…</p>}

          {/* Esta línea sirve para mostrar el bloque solo si «searchResults && searchResults.length === 0». */}
          {searchResults && searchResults.length === 0 && (
            // Esta línea sirve para mostrar el texto «Sin resultados.» dentro de un «p».
            <p className="mt-2 text-sm text-muted-foreground">Sin resultados.</p>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «searchResults && searchResults.length > 0». */}
          {searchResults && searchResults.length > 0 && (
            // Esta línea sirve para abrir el elemento «ul» con las clases «mt-2 flex flex-col gap-1».
            <ul className="mt-2 flex flex-col gap-1">
              {/* Esta línea sirve para recorrer «searchResults» y mostrar un bloque por elemento. */}
              {searchResults.map((food) => (
                // Esta línea sirve para abrir el elemento «li».
                <li key={food.id}>
                  {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
                  <button
                    // Esta línea sirve para asignar el manejador del evento «onClick».
                    onClick={() => selectFood(food)}
                    // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg p-2 text-left text-sm hover».
                    className="w-full rounded-lg p-2 text-left text-sm hover:bg-muted"
                  >
                    {/* Esta línea sirve para abrir el elemento «span» con las clases «font-medium». */}
                    <span className="font-medium">
                      {/* Esta línea sirve para mostrar el contenido dinámico «{foodCategoryIcon(food.category)} {food.name}». */}
                      {foodCategoryIcon(food.category)} {food.name}
                    </span>
                    {/* Esta línea sirve para mostrar el elemento solo si «food.brand». */}
                    {food.brand && <span className="text-muted-foreground"> · {food.brand}</span>}
                    {/* Esta línea sirve para abrir el elemento «span» con las clases «block text-xs text-muted-foreground». */}
                    <span className="block text-xs text-muted-foreground">
                      {/* Esta línea sirve para mostrar el contenido dinámico «{food.calories_per_100g} kcal/100g». */}
                      {food.calories_per_100g} kcal/100g
                      {/* Esta línea sirve para mostrar el contenido dinámico «{food.serving_size_grams». */}
                      {food.serving_size_grams
                        // Esta línea sirve para mostrar las porciones y los gramos si hay tamaño de porción.
                        ? ` · ${formatFoodQuantity(food, food.serving_size_grams).servings} ≈ ${
                            // Esta línea sirve para formatear los gramos de la porción.
                            formatFoodQuantity(food, food.serving_size_grams).grams
                          // Esta línea sirve para cerrar el texto de la cantidad.
                          }`
                        // Esta línea sirve para dejar vacío si no hay tamaño de porción.
                        : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «pendingFood». */}
          {pendingFood && (
            // Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex flex-wrap items-end gap-4 roun».
            <div className="mt-3 flex flex-wrap items-end gap-4 rounded-lg border border-dashed border-border p-3">
              {/* Esta línea sirve para abrir el elemento «div». */}
              <div>
                {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm font-medium». */}
                <p className="text-sm font-medium">
                  {/* Esta línea sirve para mostrar el contenido dinámico «{foodCategoryIcon(pendingFood.category)} {pendingFood.name}». */}
                  {foodCategoryIcon(pendingFood.category)} {pendingFood.name}
                </p>
                {/* Esta línea sirve para mostrar el texto «Cantidad» dentro de un «span». */}
                <span className="text-xs text-muted-foreground">Cantidad</span>
                {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-1 flex items-center gap-2». */}
                <div className="mt-1 flex items-center gap-2">
                  {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
                  <button
                    // Esta línea sirve para definir el atributo «type» con el valor «button».
                    type="button"
                    // Esta línea sirve para asignar el manejador del evento «onClick».
                    onClick={() => adjustGrams(-(pendingFood.serving_size_grams ? pendingFood.serving_size_grams / 2 : 10))}
                    // Esta línea sirve para aplicar las clases de estilo «flex h-8 w-8 items-center justify-center roun».
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-input text-sm hover:bg-muted"
                    // Esta línea sirve para definir el atributo «aria-label» con el valor «Reducir cantidad».
                    aria-label="Reducir cantidad"
                  >
                    {/* Esta línea sirve para mostrar el contenido dinámico «−». */}
                    −
                  </button>
                  {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                  <input
                    // Esta línea sirve para definir el atributo «id» con el valor «grams».
                    id="grams"
                    // Esta línea sirve para definir el atributo «type» con el valor «number».
                    type="number"
                    // Esta línea sirve para pasar la propiedad «value» con el valor «grams}».
                    value={grams}
                    // Esta línea sirve para asignar el manejador del evento «onChange».
                    onChange={(e) => setGrams(e.target.value)}
                    // Esta línea sirve para aplicar las clases de estilo «w-20 rounded-lg border border-input bg-backgr».
                    className="w-20 rounded-lg border border-input bg-background px-2 py-1 text-center text-sm"
                  />
                  {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
                  <button
                    // Esta línea sirve para definir el atributo «type» con el valor «button».
                    type="button"
                    // Esta línea sirve para asignar el manejador del evento «onClick».
                    onClick={() => adjustGrams(pendingFood.serving_size_grams ? pendingFood.serving_size_grams / 2 : 10)}
                    // Esta línea sirve para aplicar las clases de estilo «flex h-8 w-8 items-center justify-center roun».
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-input text-sm hover:bg-muted"
                    // Esta línea sirve para definir el atributo «aria-label» con el valor «Aumentar cantidad».
                    aria-label="Aumentar cantidad"
                  >
                    {/* Esta línea sirve para mostrar el contenido dinámico «+». */}
                    +
                  </button>
                </div>
                {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-xs text-muted-foreground». */}
                <p className="mt-1 text-xs text-muted-foreground">
                  {/* Esta línea sirve para mostrar el contenido dinámico «{formatFoodQuantityLabel(pendingFood, Number(grams) || 0)}». */}
                  {formatFoodQuantityLabel(pendingFood, Number(grams) || 0)}
                </p>
              </div>
              {/* Esta línea sirve para abrir el elemento «div». */}
              <div>
                {/* Esta línea sirve para abrir el elemento «label» con las clases «text-xs text-muted-foreground». */}
                <label className="text-xs text-muted-foreground" htmlFor="meal-type">
                  {/* Esta línea sirve para mostrar el texto «Comida». */}
                  Comida
                </label>
                {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
                <select
                  // Esta línea sirve para definir el atributo «id» con el valor «meal-type».
                  id="meal-type"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «mealType}».
                  value={mealType}
                  // Esta línea sirve para asignar el manejador del evento «onChange».
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  // Esta línea sirve para aplicar las clases de estilo «block rounded-lg border border-input bg-backg».
                  className="block rounded-lg border border-input bg-background px-2 py-1 text-sm"
                >
                  {/* Esta línea sirve para recorrer «MEAL_TYPE_ORDER» y mostrar un bloque por elemento. */}
                  {MEAL_TYPE_ORDER.map((type) => (
                    // Esta línea sirve para abrir el elemento «option».
                    <option key={type} value={type}>
                      {/* Esta línea sirve para mostrar el contenido dinámico «{MEAL_TYPE_LABELS[type]}». */}
                      {MEAL_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
              {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
              <Button size="sm" onClick={() => logMutation.mutate()} disabled={logMutation.isPending}>
                {/* Esta línea sirve para mostrar el texto «Registrar». */}
                Registrar
              </Button>
              {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
              <Button size="sm" variant="outline" onClick={() => setPendingFood(null)}>
                {/* Esta línea sirve para mostrar el texto «Cancelar». */}
                Cancelar
              </Button>
            </div>
          )}
        </section>

        {/* Esta línea sirve para mostrar el elemento solo si «isLoadingMeals». */}
        {isLoadingMeals && <Skeleton className="h-20 w-full" />}

        {/* Esta línea sirve para recorrer «MEAL_TYPE_ORDER» y mostrar un bloque por elemento. */}
        {MEAL_TYPE_ORDER.map((type) => (
          // Esta línea sirve para abrir el elemento «section».
          <section key={type} className="rounded-xl border border-border bg-card p-5">
            {/* Esta línea sirve para mostrar el valor «MEAL_TYPE_LABELS[type]» dentro de un «h2». */}
            <h2 className="font-heading text-sm font-medium">{MEAL_TYPE_LABELS[type]}</h2>
            {/* Esta línea sirve para mostrar el bloque solo si «groups[type].length === 0». */}
            {groups[type].length === 0 && (
              // Esta línea sirve para mostrar el texto «Sin registros.» dentro de un «p».
              <p className="mt-1 text-sm text-muted-foreground">Sin registros.</p>
            )}
            {/* Esta línea sirve para abrir el elemento «ul» con las clases «mt-2 flex flex-col gap-1». */}
            <ul className="mt-2 flex flex-col gap-1">
              {/* Esta línea sirve para recorrer «groups[type]» y mostrar un bloque por elemento. */}
              {groups[type].map((meal) => (
                // Esta línea sirve para abrir el elemento «li».
                <li key={meal.id} className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-sm">
                  {/* Esta línea sirve para abrir el elemento «span» con las clases «min-w-0 flex-1». */}
                  <span className="min-w-0 flex-1">
                    {/* Esta línea sirve para mostrar el ícono y el nombre del alimento registrado. */}
                    {foodCategoryIcon(meal.food_item.category)} {meal.food_item.name} ·{" "}
                    {/* Esta línea sirve para mostrar la cantidad y las calorías del alimento registrado. */}
                    {formatFoodQuantityLabel(meal.food_item, meal.quantity_grams)} · {meal.calories} kcal
                  </span>
                  {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
                  <button
                    // Esta línea sirve para asignar el manejador del evento «onClick».
                    onClick={() => deleteMutation.mutate(meal.id)}
                    // Esta línea sirve para aplicar las clases de estilo «shrink-0 text-xs text-muted-foreground hover:».
                    className="shrink-0 text-xs text-muted-foreground hover:text-destructive"
                  >
                    {/* Esta línea sirve para mostrar el texto «Eliminar». */}
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
    </main>
  )
}

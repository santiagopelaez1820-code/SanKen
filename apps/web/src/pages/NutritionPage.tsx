import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  DailyNutritionSummary,
  FoodItem,
  MealLog,
  MealType,
  NutritionPlan,
  NutritionTargets,
} from "@sanken/core"
import { ApiError } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { StatTile } from "@/components/dashboard/StatTile"
import { MEAL_TYPE_LABELS, MEAL_TYPE_ORDER, groupMealsByType } from "@/lib/nutrition-grouping"

export function NutritionPage() {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<FoodItem[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [pendingFood, setPendingFood] = useState<FoodItem | null>(null)
  const [grams, setGrams] = useState("100")
  const [mealType, setMealType] = useState<MealType>("lunch")

  const { data: targets, error: targetsError } = useQuery({
    queryKey: ["nutrition", "targets"],
    queryFn: () => api.get<NutritionTargets>("/nutrition/targets"),
    retry: false,
  })

  const { data: meals, isLoading: isLoadingMeals } = useQuery({
    queryKey: ["nutrition", "meals"],
    queryFn: () => api.getWithMeta<MealLog[]>("/nutrition/meals"),
  })

  const { data: plan, error: planError } = useQuery({
    queryKey: ["nutrition", "plan"],
    queryFn: () => api.get<NutritionPlan>("/nutrition/plan"),
    retry: false,
    enabled: !(targetsError instanceof ApiError && targetsError.status === 404),
  })
  const planMissing = planError instanceof ApiError && planError.status === 404

  const generatePlanMutation = useMutation({
    mutationFn: () => api.post<NutritionPlan>("/nutrition/plan"),
    onSuccess: (data) => queryClient.setQueryData(["nutrition", "plan"], data),
  })

  const [substitutingItemId, setSubstitutingItemId] = useState<number | null>(null)
  const [substituteQuery, setSubstituteQuery] = useState("")
  const [substituteResults, setSubstituteResults] = useState<FoodItem[] | null>(null)
  const [isSearchingSubstitutes, setIsSearchingSubstitutes] = useState(false)

  const substituteMutation = useMutation({
    mutationFn: ({ itemId, foodItemId }: { itemId: number; foodItemId: number }) =>
      api.patch(`/nutrition/plan/items/${itemId}`, { food_item_id: foodItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition", "plan"] })
      setSubstitutingItemId(null)
      setSubstituteResults(null)
      setSubstituteQuery("")
    },
  })

  const searchSubstitutes = async (category: string | null) => {
    if (!substituteQuery.trim()) return
    setIsSearchingSubstitutes(true)
    try {
      const results = await api.get<FoodItem[]>(`/nutrition/foods?q=${encodeURIComponent(substituteQuery.trim())}`)
      setSubstituteResults(results.filter((food) => food.category === category))
    } finally {
      setIsSearchingSubstitutes(false)
    }
  }

  const startSubstituting = (itemId: number) => {
    setSubstitutingItemId(itemId)
    setSubstituteQuery("")
    setSubstituteResults(null)
  }

  const logMutation = useMutation({
    mutationFn: () =>
      api.post("/nutrition/meals", {
        food_item_id: pendingFood!.id,
        meal_type: mealType,
        quantity_grams: Number(grams),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition", "meals"] })
      setPendingFood(null)
      setSearchResults(null)
      setQuery("")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/nutrition/meals/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["nutrition", "meals"] }),
  })

  const search = async () => {
    if (!query.trim()) return
    setIsSearching(true)
    try {
      const results = await api.get<FoodItem[]>(`/nutrition/foods?q=${encodeURIComponent(query.trim())}`)
      setSearchResults(results)
    } finally {
      setIsSearching(false)
    }
  }

  const groups = groupMealsByType(meals?.data ?? [])
  const summary = meals?.meta?.summary as DailyNutritionSummary | undefined
  const profileIncomplete = targetsError instanceof ApiError && targetsError.status === 404

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Nutrición</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Volver</Link>
          </Button>
        </header>

        {profileIncomplete && (
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Completá tu perfil (edad, sexo, peso, altura) y el onboarding para ver tus objetivos de nutrición.
          </p>
        )}

        {targets && (
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <StatTile label="Calorías" value={`${targets.calories} kcal`} />
            <StatTile label="Proteína" value={`${targets.protein_g} g`} />
            <StatTile label="Carbohidratos" value={`${targets.carbs_g} g`} />
            <StatTile label="Grasas" value={`${targets.fat_g} g`} />
            <StatTile label="Agua" value={`${(targets.water_ml / 1000).toFixed(1)} L`} />
          </section>
        )}

        {summary && (
          <p className="text-sm text-muted-foreground">
            Hoy llevás <span className="font-medium text-foreground">{summary.calories} kcal</span> ·{" "}
            {summary.protein_g}g proteína · {summary.carbs_g}g carbos · {summary.fat_g}g grasas
          </p>
        )}

        {!profileIncomplete && (
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-sm font-medium">Plan alimenticio personalizado</h2>
              {plan && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generatePlanMutation.mutate()}
                  disabled={generatePlanMutation.isPending}
                >
                  Regenerar
                </Button>
              )}
            </div>

            {planMissing && !plan && (
              <div className="mt-2 flex flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">
                  ¿Querés que armemos un plan de comidas para tus objetivos de hoy?
                </p>
                <Button size="sm" onClick={() => generatePlanMutation.mutate()} disabled={generatePlanMutation.isPending}>
                  {generatePlanMutation.isPending ? "Generando…" : "Sí, generar mi plan"}
                </Button>
              </div>
            )}

            {plan && (
              <div className="mt-3 flex flex-col gap-4">
                {plan.meals.map((meal) => (
                  <div key={meal.id}>
                    <h3 className="text-xs font-medium uppercase text-muted-foreground">
                      {MEAL_TYPE_LABELS[meal.meal_type]} · {meal.target_calories} kcal
                    </h3>
                    <ul className="mt-1 flex flex-col gap-1">
                      {meal.items.map((item) => (
                        <li key={item.id} className="text-sm">
                          <div className="flex items-center justify-between">
                            <span>
                              {item.food_item.name} · {item.quantity_grams}g · {item.calories} kcal
                            </span>
                            <button
                              onClick={() => startSubstituting(item.id)}
                              className="text-xs text-muted-foreground hover:text-foreground"
                            >
                              Sustituir
                            </button>
                          </div>

                          {substitutingItemId === item.id && (
                            <div className="mt-1 rounded-lg border border-dashed border-border p-2">
                              <div className="flex gap-2">
                                <input
                                  value={substituteQuery}
                                  onChange={(e) => setSubstituteQuery(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && searchSubstitutes(item.food_item.category)}
                                  placeholder={`Buscar alternativa a ${item.food_item.name}…`}
                                  className="w-full rounded-lg border border-input bg-background px-2 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => searchSubstitutes(item.food_item.category)}
                                  disabled={isSearchingSubstitutes || !substituteQuery.trim()}
                                >
                                  Buscar
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setSubstitutingItemId(null)}>
                                  Cancelar
                                </Button>
                              </div>

                              {substituteResults && substituteResults.length === 0 && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Sin alternativas de la misma categoría.
                                </p>
                              )}

                              {substituteResults && substituteResults.length > 0 && (
                                <ul className="mt-1 flex flex-col gap-1">
                                  {substituteResults.map((food) => (
                                    <li key={food.id}>
                                      <button
                                        onClick={() =>
                                          substituteMutation.mutate({ itemId: item.id, foodItemId: food.id })
                                        }
                                        disabled={substituteMutation.isPending}
                                        className="w-full rounded-lg p-1 text-left text-xs hover:bg-muted"
                                      >
                                        {food.name} · {food.calories_per_100g} kcal/100g
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

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium">Agregar comida</h2>
          <div className="mt-2 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Buscar alimento…"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <Button size="sm" onClick={search} disabled={isSearching || !query.trim()}>
              Buscar
            </Button>
          </div>

          {isSearching && <p className="mt-2 text-sm text-muted-foreground">Buscando…</p>}

          {searchResults && searchResults.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">Sin resultados.</p>
          )}

          {searchResults && searchResults.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1">
              {searchResults.map((food) => (
                <li key={food.id}>
                  <button
                    onClick={() => setPendingFood(food)}
                    className="w-full rounded-lg p-2 text-left text-sm hover:bg-muted"
                  >
                    <span className="font-medium">{food.name}</span>
                    {food.brand && <span className="text-muted-foreground"> · {food.brand}</span>}
                    <span className="block text-xs text-muted-foreground">{food.calories_per_100g} kcal/100g</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {pendingFood && (
            <div className="mt-3 flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-border p-3">
              <div>
                <p className="text-sm font-medium">{pendingFood.name}</p>
                <label className="text-xs text-muted-foreground" htmlFor="grams">
                  Gramos
                </label>
                <input
                  id="grams"
                  type="number"
                  value={grams}
                  onChange={(e) => setGrams(e.target.value)}
                  className="block w-24 rounded-lg border border-input bg-background px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground" htmlFor="meal-type">
                  Comida
                </label>
                <select
                  id="meal-type"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  className="block rounded-lg border border-input bg-background px-2 py-1 text-sm"
                >
                  {MEAL_TYPE_ORDER.map((type) => (
                    <option key={type} value={type}>
                      {MEAL_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
              <Button size="sm" onClick={() => logMutation.mutate()} disabled={logMutation.isPending}>
                Registrar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPendingFood(null)}>
                Cancelar
              </Button>
            </div>
          )}
        </section>

        {isLoadingMeals && <p className="text-sm text-muted-foreground">Cargando…</p>}

        {MEAL_TYPE_ORDER.map((type) => (
          <section key={type} className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-heading text-sm font-medium">{MEAL_TYPE_LABELS[type]}</h2>
            {groups[type].length === 0 && (
              <p className="mt-1 text-sm text-muted-foreground">Sin registros.</p>
            )}
            <ul className="mt-2 flex flex-col gap-1">
              {groups[type].map((meal) => (
                <li key={meal.id} className="flex items-center justify-between text-sm">
                  <span>
                    {meal.food_item.name} · {meal.quantity_grams}g · {meal.calories} kcal
                  </span>
                  <button
                    onClick={() => deleteMutation.mutate(meal.id)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}

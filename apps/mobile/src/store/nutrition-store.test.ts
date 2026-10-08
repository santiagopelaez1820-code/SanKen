// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «FoodItem, MealLog, NutritionPlan, NutritionTargets» desde «@sanken/core».
import type { FoodItem, MealLog, NutritionPlan, NutritionTargets } from '@sanken/core';
// Esta línea sirve para importar «ApiError» desde «@sanken/core».
import { ApiError } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useNutritionStore» desde «./nutrition-store».
import { useNutritionStore } from './nutrition-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «get: jest.fn(), post: jest.fn(), patch: jest.fn(),…».
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn(), getWithMeta: jest.fn() },
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;

// Esta línea sirve para extraer «argets: NutritionTarget» de «{ calories: 3000, protein_g: 160, carbs_».
const targets: NutritionTargets = { calories: 3000, protein_g: 160, carbs_g: 400, fat_g: 85, water_ml: 2800 };

// Esta línea sirve para declarar el dato de ejemplo «food» de tipo «FoodItem».
const food: FoodItem = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «barcode» con el valor o tipo «'3017620422003'».
  barcode: '3017620422003',
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «'Nutella'».
  name: 'Nutella',
  // Esta línea sirve para declarar la propiedad «brand» con el valor o tipo «'Ferrero'».
  brand: 'Ferrero',
  // Esta línea sirve para declarar la propiedad «category» con el valor o tipo «null».
  category: null,
  // Esta línea sirve para declarar la propiedad «calories_per_100g» con el valor o tipo «539».
  calories_per_100g: 539,
  // Esta línea sirve para declarar la propiedad «protein_per_100g» con el valor o tipo «6.3».
  protein_per_100g: 6.3,
  // Esta línea sirve para declarar la propiedad «carbs_per_100g» con el valor o tipo «57.5».
  carbs_per_100g: 57.5,
  // Esta línea sirve para declarar la propiedad «fat_per_100g» con el valor o tipo «30.9».
  fat_per_100g: 30.9,
  // Esta línea sirve para declarar la propiedad «serving_size_grams» con el valor o tipo «null».
  serving_size_grams: null,
  // Esta línea sirve para declarar la propiedad «serving_unit_singular» con el valor o tipo «null».
  serving_unit_singular: null,
  // Esta línea sirve para declarar la propiedad «serving_unit_plural» con el valor o tipo «null».
  serving_unit_plural: null,
};

// Esta línea sirve para declarar el dato de ejemplo «proteinFood» de tipo «FoodItem».
const proteinFood: FoodItem = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «2».
  id: 2,
  // Esta línea sirve para declarar la propiedad «barcode» con el valor o tipo «null».
  barcode: null,
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «'Pechuga de pollo'».
  name: 'Pechuga de pollo',
  // Esta línea sirve para declarar la propiedad «brand» con el valor o tipo «null».
  brand: null,
  // Esta línea sirve para declarar la propiedad «category» con el valor o tipo «'protein'».
  category: 'protein',
  // Esta línea sirve para declarar la propiedad «calories_per_100g» con el valor o tipo «165».
  calories_per_100g: 165,
  // Esta línea sirve para declarar la propiedad «protein_per_100g» con el valor o tipo «31».
  protein_per_100g: 31,
  // Esta línea sirve para declarar la propiedad «carbs_per_100g» con el valor o tipo «0».
  carbs_per_100g: 0,
  // Esta línea sirve para declarar la propiedad «fat_per_100g» con el valor o tipo «3.6».
  fat_per_100g: 3.6,
  // Esta línea sirve para declarar la propiedad «serving_size_grams» con el valor o tipo «150».
  serving_size_grams: 150,
  // Esta línea sirve para declarar la propiedad «serving_unit_singular» con el valor o tipo «'pechuga'».
  serving_unit_singular: 'pechuga',
  // Esta línea sirve para declarar la propiedad «serving_unit_plural» con el valor o tipo «'pechugas'».
  serving_unit_plural: 'pechugas',
};

// Esta línea sirve para declarar el dato de ejemplo «plan» de tipo «NutritionPlan».
const plan: NutritionPlan = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «calories» con el valor o tipo «2500».
  calories: 2500,
  // Esta línea sirve para declarar la propiedad «protein_g» con el valor o tipo «180».
  protein_g: 180,
  // Esta línea sirve para declarar la propiedad «carbs_g» con el valor o tipo «250».
  carbs_g: 250,
  // Esta línea sirve para declarar la propiedad «fat_g» con el valor o tipo «70».
  fat_g: 70,
  // Esta línea sirve para declarar la propiedad «generated_at» con el valor o tipo «'2026-08-19T00:00:00Z'».
  generated_at: '2026-08-19T00:00:00Z',
  // Esta línea sirve para declarar la propiedad «meals» con el valor o tipo «[».
  meals: [
    {
      // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
      id: 1,
      // Esta línea sirve para declarar la propiedad «meal_type» con el valor o tipo «'lunch'».
      meal_type: 'lunch',
      // Esta línea sirve para declarar la propiedad «order» con el valor o tipo «1».
      order: 1,
      // Esta línea sirve para declarar la propiedad «target_calories» con el valor o tipo «700».
      target_calories: 700,
      // Esta línea sirve para declarar la propiedad «target_protein_g» con el valor o tipo «50».
      target_protein_g: 50,
      // Esta línea sirve para declarar la propiedad «target_carbs_g» con el valor o tipo «70».
      target_carbs_g: 70,
      // Esta línea sirve para declarar la propiedad «target_fat_g» con el valor o tipo «20».
      target_fat_g: 20,
      // Esta línea sirve para declarar la propiedad «items» con el valor o tipo «[».
      items: [
        // Esta línea sirve para agregar un elemento cuyo «id» es «10, food_item: proteinFood, quantity_gra…».
        { id: 10, food_item: proteinFood, quantity_grams: 200, calories: 330, protein_g: 62, carbs_g: 0, fat_g: 7.2 },
      ],
    },
  ],
};

// Esta línea sirve para declarar el dato de ejemplo «meal» de tipo «MealLog».
const meal: MealLog = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «food_item» con el valor o tipo «food».
  food_item: food,
  // Esta línea sirve para declarar la propiedad «meal_type» con el valor o tipo «'lunch'».
  meal_type: 'lunch',
  // Esta línea sirve para declarar la propiedad «quantity_grams» con el valor o tipo «100».
  quantity_grams: 100,
  // Esta línea sirve para declarar la propiedad «logged_at» con el valor o tipo «'2026-08-13'».
  logged_at: '2026-08-13',
  // Esta línea sirve para declarar la propiedad «calories» con el valor o tipo «539».
  calories: 539,
  // Esta línea sirve para declarar la propiedad «protein_g» con el valor o tipo «6.3».
  protein_g: 6.3,
  // Esta línea sirve para declarar la propiedad «carbs_g» con el valor o tipo «57.5».
  carbs_g: 57.5,
  // Esta línea sirve para declarar la propiedad «fat_g» con el valor o tipo «30.9».
  fat_g: 30.9,
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useNutritionStore.setState({
    // Esta línea sirve para declarar la propiedad «targets» con el valor o tipo «null».
    targets: null,
    // Esta línea sirve para declarar la propiedad «isLoadingTargets» con el valor o tipo «false».
    isLoadingTargets: false,
    // Esta línea sirve para declarar la propiedad «profileIncomplete» con el valor o tipo «false».
    profileIncomplete: false,
    // Esta línea sirve para declarar la propiedad «targetsError» con el valor o tipo «null».
    targetsError: null,
    // Esta línea sirve para declarar la propiedad «meals» con el valor o tipo «[]».
    meals: [],
    // Esta línea sirve para declarar la propiedad «summary» con el valor o tipo «null».
    summary: null,
    // Esta línea sirve para declarar la propiedad «isLoadingMeals» con el valor o tipo «false».
    isLoadingMeals: false,
    // Esta línea sirve para declarar la propiedad «searchResults» con el valor o tipo «[]».
    searchResults: [],
    // Esta línea sirve para declarar la propiedad «isSearching» con el valor o tipo «false».
    isSearching: false,
    // Esta línea sirve para declarar la propiedad «searchError» con el valor o tipo «null».
    searchError: null,
    // Esta línea sirve para declarar la propiedad «plan» con el valor o tipo «null».
    plan: null,
    // Esta línea sirve para declarar la propiedad «planMissing» con el valor o tipo «false».
    planMissing: false,
    // Esta línea sirve para declarar la propiedad «isLoadingPlan» con el valor o tipo «false».
    isLoadingPlan: false,
    // Esta línea sirve para declarar la propiedad «isGeneratingPlan» con el valor o tipo «false».
    isGeneratingPlan: false,
    // Esta línea sirve para declarar la propiedad «planError» con el valor o tipo «null».
    planError: null,
    // Esta línea sirve para declarar la propiedad «substituteResults» con el valor o tipo «[]».
    substituteResults: [],
    // Esta línea sirve para declarar la propiedad «isSearchingSubstitutes» con el valor o tipo «false».
    isSearchingSubstitutes: false,
    // Esta línea sirve para declarar la propiedad «isSubstituting» con el valor o tipo «false».
    isSubstituting: false,
    // Esta línea sirve para declarar la propiedad «substituteError» con el valor o tipo «null».
    substituteError: null,
  });
});

// Esta línea sirve para agrupar las pruebas de «loadTargets».
describe('loadTargets', () => {
  // Esta línea sirve para declarar la prueba que verifica que «stores the fetched targets».
  it('stores the fetched targets', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(targets);

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().loadTargets();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/nutrition/targets');
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «targets».
    expect(useNutritionStore.getState().targets).toEqual(targets);
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «profileIncomplete».
    expect(useNutritionStore.getState().profileIncomplete).toBe(false);
  });

  // Esta línea sirve para declarar la prueba que verifica que «flags an incomplete profile on 404 instead of setting a generic error».
  it('flags an incomplete profile on 404 instead of setting a generic error', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new ApiError(404, { message: 'Completá tu perfil.' }));

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().loadTargets();

    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «profileIncomplete».
    expect(useNutritionStore.getState().profileIncomplete).toBe(true);
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «targets».
    expect(useNutritionStore.getState().targets).toBeNull();
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «targetsError».
    expect(useNutritionStore.getState().targetsError).toBeNull();
  });
});

// Esta línea sirve para agrupar las pruebas de «loadMeals».
describe('loadMeals', () => {
  // Esta línea sirve para declarar la prueba que verifica que «stores the meals and the daily summary from meta».
  it('stores the meals and the daily summary from meta', async () => {
    // Esta línea sirve para extraer «ummar» de «{ calories: 539, protein_g: 6.3, carbs_g».
    const summary = { calories: 539, protein_g: 6.3, carbs_g: 57.5, fat_g: 30.9 };
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.getWithMeta».
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [meal], meta: { date: '2026-08-13', summary } });

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().loadMeals();

    // Esta línea sirve para verificar que «mockedApi.getWithMeta» cumple «toHaveBeenCalledWith».
    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/nutrition/meals');
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «meals».
    expect(useNutritionStore.getState().meals).toEqual([meal]);
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «summary».
    expect(useNutritionStore.getState().summary).toEqual(summary);
  });
});

// Esta línea sirve para agrupar las pruebas de «search».
describe('search', () => {
  // Esta línea sirve para declarar la prueba que verifica que «fetches matching foods for a non-empty query».
  it('fetches matching foods for a non-empty query', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([food]);

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().search('nutella');

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/nutrition/foods?q=nutella');
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «searchResults».
    expect(useNutritionStore.getState().searchResults).toEqual([food]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «clears results without calling the API for a blank query».
  it('clears results without calling the API for a blank query', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useNutritionStore.setState({ searchResults: [food] });

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().search('   ');

    // Esta línea sirve para verificar que «mockedApi.get» no cumple «toHaveBeenCalled».
    expect(mockedApi.get).not.toHaveBeenCalled();
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «searchResults».
    expect(useNutritionStore.getState().searchResults).toEqual([]);
  });
});

// Esta línea sirve para agrupar las pruebas de «findByBarcode».
describe('findByBarcode', () => {
  // Esta línea sirve para declarar la prueba que verifica que «returns the matching food item».
  it('returns the matching food item', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(food);

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «result».
    const result = await useNutritionStore.getState().findByBarcode('3017620422003');

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/nutrition/foods?barcode=3017620422003');
    // Esta línea sirve para verificar que «result» cumple «toEqual».
    expect(result).toEqual(food);
  });

  // Esta línea sirve para declarar la prueba que verifica que «returns null when the barcode is not found».
  it('returns null when the barcode is not found', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new ApiError(404, { message: 'not found' }));

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «result».
    const result = await useNutritionStore.getState().findByBarcode('0000000000000');

    // Esta línea sirve para verificar que «result» cumple «toBeNull».
    expect(result).toBeNull();
  });
});

// Esta línea sirve para agrupar las pruebas de «logMeal / deleteMeal».
describe('logMeal / deleteMeal', () => {
  // Esta línea sirve para declarar la prueba que verifica que «posts a new meal log and reloads the meals list».
  it('posts a new meal log and reloads the meals list', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.getWithMeta».
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [meal], meta: { date: '2026-08-13', summary: {} } });

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().logMeal(food.id, 'lunch', 100);

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/nutrition/meals', {
      // Esta línea sirve para declarar la propiedad «food_item_id» con el valor o tipo «food.id».
      food_item_id: food.id,
      // Esta línea sirve para declarar la propiedad «meal_type» con el valor o tipo «'lunch'».
      meal_type: 'lunch',
      // Esta línea sirve para declarar la propiedad «quantity_grams» con el valor o tipo «100».
      quantity_grams: 100,
    });
    // Esta línea sirve para verificar que «mockedApi.getWithMeta» cumple «toHaveBeenCalledWith».
    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/nutrition/meals');
  });

  // Esta línea sirve para declarar la prueba que verifica que «deletes a meal log and reloads the meals list».
  it('deletes a meal log and reloads the meals list', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.delete».
    mockedApi.delete.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.getWithMeta».
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [], meta: { date: '2026-08-13', summary: {} } });

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().deleteMeal(meal.id);

    // Esta línea sirve para verificar que «mockedApi.delete» cumple «toHaveBeenCalledWith».
    expect(mockedApi.delete).toHaveBeenCalledWith(`/nutrition/meals/${meal.id}`);
    // Esta línea sirve para verificar que «mockedApi.getWithMeta» cumple «toHaveBeenCalledWith».
    expect(mockedApi.getWithMeta).toHaveBeenCalledWith('/nutrition/meals');
  });
});

// Esta línea sirve para agrupar las pruebas de «loadPlan».
describe('loadPlan', () => {
  // Esta línea sirve para declarar la prueba que verifica que «stores the fetched plan».
  it('stores the fetched plan', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(plan);

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().loadPlan();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/nutrition/plan');
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «plan».
    expect(useNutritionStore.getState().plan).toEqual(plan);
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «planMissing».
    expect(useNutritionStore.getState().planMissing).toBe(false);
  });

  // Esta línea sirve para declarar la prueba que verifica que «flags a missing plan on 404 without throwing».
  it('flags a missing plan on 404 without throwing', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new ApiError(404, { message: 'Todavía no generaste tu plan.' }));

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().loadPlan();

    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «plan».
    expect(useNutritionStore.getState().plan).toBeNull();
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «planMissing».
    expect(useNutritionStore.getState().planMissing).toBe(true);
  });

  // Esta línea sirve para declarar la prueba que verifica que «stores an error message on a non-404 failure instead of leaving the pl».
  it('stores an error message on a non-404 failure instead of leaving the plan card blank', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new Error('Network request failed'));

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().loadPlan();

    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «planMissing».
    expect(useNutritionStore.getState().planMissing).toBe(false);
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «planError».
    expect(useNutritionStore.getState().planError).toBe('Network request failed');
  });
});

// Esta línea sirve para agrupar las pruebas de «generatePlan».
describe('generatePlan', () => {
  // Esta línea sirve para declarar la prueba que verifica que «stores the generated plan and clears planMissing».
  it('stores the generated plan and clears planMissing', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useNutritionStore.setState({ planMissing: true });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(plan);

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().generatePlan();

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/nutrition/plan');
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «plan».
    expect(useNutritionStore.getState().plan).toEqual(plan);
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «planMissing».
    expect(useNutritionStore.getState().planMissing).toBe(false);
  });

  // Esta línea sirve para declarar la prueba que verifica que «stores the error (e.g. incomplete profile) instead of leaving an unhan».
  it('stores the error (e.g. incomplete profile) instead of leaving an unhandled rejection', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new ApiError(422, { message: 'Completá tu perfil.' }));

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().generatePlan();

    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «isGeneratingPlan».
    expect(useNutritionStore.getState().isGeneratingPlan).toBe(false);
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «planError».
    expect(useNutritionStore.getState().planError).toBe('Completá tu perfil.');
  });
});

// Esta línea sirve para agrupar las pruebas de «searchSubstitutes».
describe('searchSubstitutes', () => {
  // Esta línea sirve para declarar la prueba que verifica que «keeps only results matching the requested category».
  it('keeps only results matching the requested category', async () => {
    // Esta línea sirve para extraer «egetable: FoodIte» de «{ ...food, id: 3, name: 'Brócoli', categ».
    const vegetable: FoodItem = { ...food, id: 3, name: 'Brócoli', category: 'vegetable' };
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([proteinFood, vegetable]);

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().searchSubstitutes('pollo', 'protein');

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/nutrition/foods?q=pollo');
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «substituteResults».
    expect(useNutritionStore.getState().substituteResults).toEqual([proteinFood]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «clears results without calling the API for a blank query».
  it('clears results without calling the API for a blank query', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useNutritionStore.setState({ substituteResults: [proteinFood] });

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().searchSubstitutes('   ', 'protein');

    // Esta línea sirve para verificar que «mockedApi.get» no cumple «toHaveBeenCalled».
    expect(mockedApi.get).not.toHaveBeenCalled();
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «substituteResults».
    expect(useNutritionStore.getState().substituteResults).toEqual([]);
  });
});

// Esta línea sirve para agrupar las pruebas de «substituteItem».
describe('substituteItem', () => {
  // Esta línea sirve para declarar la prueba que verifica que «patches the item and reloads the plan».
  it('patches the item and reloads the plan', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.patch».
    mockedApi.patch.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(plan);

    // Esta línea sirve para esperar el resultado de «useNutritionStore.getState».
    await useNutritionStore.getState().substituteItem(10, proteinFood.id);

    // Esta línea sirve para verificar que «mockedApi.patch» cumple «toHaveBeenCalledWith».
    expect(mockedApi.patch).toHaveBeenCalledWith('/nutrition/plan/items/10', { food_item_id: proteinFood.id });
    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/nutrition/plan');
    // Esta línea sirve para verificar que «useNutritionStore.getState(» cumple «plan».
    expect(useNutritionStore.getState().plan).toEqual(plan);
  });
});

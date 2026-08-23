export interface ExerciseMuscleGroup {
  id: number;
  name: string;
  slug: string;
}

/** GET /exercises — catálogo completo, usado por el editor de rutinas del entrenador. */
export interface ExerciseCatalogItem {
  id: number;
  name: string;
  primary_muscle: ExerciseMuscleGroup;
  equipment: string;
  level: string;
  type: string;
}

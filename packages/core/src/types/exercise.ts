// Esta línea sirve para declarar la interfaz «ExerciseMuscleGroup».
export interface ExerciseMuscleGroup {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
  // Esta línea sirve para declarar el campo «slug» de tipo «string».
  slug: string;
}

/** GET /exercises — catálogo completo, usado por el editor de rutinas del entrenador. */
// Esta línea sirve para declarar la interfaz «ExerciseCatalogItem».
export interface ExerciseCatalogItem {
  // Esta línea sirve para declarar el campo «id» de tipo «number».
  id: number;
  // Esta línea sirve para declarar el campo «name» de tipo «string».
  name: string;
  // Esta línea sirve para declarar el campo «primary_muscle» de tipo «ExerciseMuscleGroup».
  primary_muscle: ExerciseMuscleGroup;
  // Esta línea sirve para declarar el campo «equipment» de tipo «string».
  equipment: string;
  // Esta línea sirve para declarar el campo «level» de tipo «string».
  level: string;
  // Esta línea sirve para declarar el campo «type» de tipo «string».
  type: string;
}

// Esta línea sirve para importar el tipo de nivel de plantilla.
import type { RoutineTemplateLevel } from '../types/admin';

/**
 * Única fuente de verdad para las etiquetas/lista de nivel de plantilla de
 * rutina en el frontend — antes vivía copiada por separado en
 * apps/web/src/pages/AdminRoutineTemplatesPage.tsx y
 * apps/mobile/src/components/admin/routine-template-form-types.ts. Debe
 * coincidir con `config('onboarding.levels')` (backend, no se puede
 * compartir directo entre PHP y TS).
 */
// Esta línea sirve para declarar la etiqueta de cada nivel de plantilla.
export const ROUTINE_TEMPLATE_LEVEL_LABELS: Record<RoutineTemplateLevel, string> = {
  // Esta línea sirve para definir la etiqueta de principiante.
  beginner: 'Principiante',
  // Esta línea sirve para definir la etiqueta de intermedio.
  intermediate: 'Intermedio',
  // Esta línea sirve para definir la etiqueta de avanzado.
  advanced: 'Avanzado',
};

// Esta línea sirve para declarar la lista de niveles disponibles.
export const ROUTINE_TEMPLATE_LEVELS = Object.keys(ROUTINE_TEMPLATE_LEVEL_LABELS) as RoutineTemplateLevel[];

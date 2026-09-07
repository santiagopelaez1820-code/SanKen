import type { RoutineTemplateLevel } from '../types/admin';

/**
 * Única fuente de verdad para las etiquetas/lista de nivel de plantilla de
 * rutina en el frontend — antes vivía copiada por separado en
 * apps/web/src/pages/AdminRoutineTemplatesPage.tsx y
 * apps/mobile/src/components/admin/routine-template-form-types.ts. Debe
 * coincidir con `config('onboarding.levels')` (backend, no se puede
 * compartir directo entre PHP y TS).
 */
export const ROUTINE_TEMPLATE_LEVEL_LABELS: Record<RoutineTemplateLevel, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

export const ROUTINE_TEMPLATE_LEVELS = Object.keys(ROUTINE_TEMPLATE_LEVEL_LABELS) as RoutineTemplateLevel[];

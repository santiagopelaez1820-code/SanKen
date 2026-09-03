import { useLocalSearchParams } from 'expo-router';

import { RoutineEditorForm } from '@/components/trainer/routine-editor-form';

/**
 * Una sola pantalla para asignar o reemplazar la rutina personalizada de un
 * usuario — a diferencia de trainer (create/edit separados por URL), acá el
 * formulario carga la rutina existente (si hay) y decide POST/PATCH solo,
 * mismo criterio que apps/web RoutineEditorPage scope="admin".
 */
export default function AdminUserRoutineScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  return <RoutineEditorForm scope="admin" mode="edit" userId={Number(userId)} />;
}

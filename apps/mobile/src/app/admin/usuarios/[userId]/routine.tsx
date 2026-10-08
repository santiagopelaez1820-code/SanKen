// Esta línea sirve para importar «useLocalSearchParams» desde «expo-router».
import { useLocalSearchParams } from 'expo-router';

// Esta línea sirve para importar «RoutineEditorForm» desde «@/components/trainer/routine-editor-form».
import { RoutineEditorForm } from '@/components/trainer/routine-editor-form';

/**
 * Una sola pantalla para asignar o reemplazar la rutina personalizada de un
 * usuario — a diferencia de trainer (create/edit separados por URL), acá el
 * formulario carga la rutina existente (si hay) y decide POST/PATCH solo,
 * mismo criterio que apps/web RoutineEditorPage scope="admin".
 */
// Esta línea sirve para declarar la función «AdminUserRoutineScreen».
export default function AdminUserRoutineScreen() {
  // Esta línea sirve para extraer «userId» de «useLocalSearchParams<{ userId: string }>».
  const { userId } = useLocalSearchParams<{ userId: string }>();

  // Esta línea sirve para mostrar el editor de rutina en modo edición para el usuario.
  return <RoutineEditorForm scope="admin" mode="edit" userId={Number(userId)} />;
}

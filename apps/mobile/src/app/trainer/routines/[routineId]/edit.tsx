// Esta línea sirve para importar «useLocalSearchParams» desde «expo-router».
import { useLocalSearchParams } from 'expo-router';

// Esta línea sirve para importar «RoutineEditorForm» desde «@/components/trainer/routine-editor-form».
import { RoutineEditorForm } from '@/components/trainer/routine-editor-form';

// Esta línea sirve para declarar la función «EditRoutineScreen».
export default function EditRoutineScreen() {
  // Esta línea sirve para extraer «routineId» de «useLocalSearchParams<{ routineId: string».
  const { routineId } = useLocalSearchParams<{ routineId: string }>();

  // Esta línea sirve para mostrar el editor de rutina en modo edición.
  return <RoutineEditorForm mode="edit" routineId={Number(routineId)} />;
}

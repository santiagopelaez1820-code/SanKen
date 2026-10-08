// Esta línea sirve para importar «useLocalSearchParams» desde «expo-router».
import { useLocalSearchParams } from 'expo-router';

// Esta línea sirve para importar «RoutineEditorForm» desde «@/components/trainer/routine-editor-form».
import { RoutineEditorForm } from '@/components/trainer/routine-editor-form';

// Esta línea sirve para declarar la función «NewClientRoutineScreen».
export default function NewClientRoutineScreen() {
  // Esta línea sirve para extraer «trainerClientId» de «useLocalSearchParams<{ trainerClientId: ».
  const { trainerClientId } = useLocalSearchParams<{ trainerClientId: string }>();

  // Esta línea sirve para mostrar el editor de rutina en modo creación para el cliente.
  return <RoutineEditorForm mode="create" trainerClientId={Number(trainerClientId)} />;
}

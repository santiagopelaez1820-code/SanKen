import { useLocalSearchParams } from 'expo-router';

import { RoutineEditorForm } from '@/components/trainer/routine-editor-form';

export default function EditRoutineScreen() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();

  return <RoutineEditorForm mode="edit" routineId={Number(routineId)} />;
}

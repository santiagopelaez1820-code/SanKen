import { useLocalSearchParams } from 'expo-router';

import { RoutineEditorForm } from '@/components/trainer/routine-editor-form';

export default function NewClientRoutineScreen() {
  const { trainerClientId } = useLocalSearchParams<{ trainerClientId: string }>();

  return <RoutineEditorForm mode="create" trainerClientId={Number(trainerClientId)} />;
}

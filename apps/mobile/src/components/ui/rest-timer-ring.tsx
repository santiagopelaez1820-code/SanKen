import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Spacing } from '@/constants/theme';

interface RestTimerRingProps {
  /** Timestamp (ms) hasta el que se descansa, o null si no hay descanso activo. */
  restingUntil: number | null;
  /** Duración total del descanso en segundos — define el 100% del ring. */
  totalSeconds: number;
  onSkip: () => void;
}

export function RestTimerRing({ restingUntil, totalSeconds, onSkip }: RestTimerRingProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (restingUntil === null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [restingUntil]);

  if (restingUntil === null) return null;

  const remaining = Math.max(0, Math.round((restingUntil - now) / 1000));
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ProgressRing
        value={remaining}
        max={totalSeconds}
        color="accentSecondary"
        size={140}
        strokeWidth={10}
        label="Descanso"
        valueLabel={`${minutes}:${seconds.toString().padStart(2, '0')}`}
      />
      <PrimaryButton label="Saltar descanso" variant="ghost" onPress={onSkip} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.three,
    padding: Spacing.four,
  },
});

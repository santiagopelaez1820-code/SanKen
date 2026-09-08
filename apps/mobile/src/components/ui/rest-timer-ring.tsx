import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Pause, Play } from 'lucide-react-native';

import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Spacing } from '@/constants/theme';

interface RestTimerRingProps {
  /** Timestamp (ms) hasta el que se descansa, o null si no hay descanso activo. Un valor nuevo reinicia el conteo (otra serie, u otro ejercicio). */
  restingUntil: number | null;
  /** Duración total del descanso en segundos — define el 100% del ring. */
  totalSeconds: number;
  onSkip: () => void;
  /** Se dispara una sola vez cuando el conteo llega a 0 sin haber sido salteado antes. */
  onFinish?: () => void;
}

/**
 * El conteo vive en segundos locales (no en la diferencia contra
 * `restingUntil`) para poder pausarlo: un timestamp objetivo no se puede
 * "congelar" sin recalcularlo, así que pausar simplemente detiene el
 * `setInterval` que decrementa `remaining`.
 */
export function RestTimerRing({ restingUntil, totalSeconds, onSkip, onFinish }: RestTimerRingProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);

  // Siempre la versión más nueva de onFinish, sin que el interval de abajo
  // tenga que reprogramarse si su identidad cambia entre renders.
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    if (restingUntil === null) return;
    setRemaining(totalSeconds);
    setIsPaused(false);
  }, [restingUntil, totalSeconds]);

  useEffect(() => {
    if (restingUntil === null || isPaused) return;
    // `remaining` NO va en las deps a propósito: si lo estuviera, el efecto
    // se reprograma en cada tick (cada segundo) porque `remaining` cambia,
    // destruyendo y recreando el interval en vez de dejarlo correr una sola
    // vez por período de descanso.
    //
    // onFinish se dispara ACÁ ADENTRO (no en un efecto aparte que mira
    // `remaining`) a propósito: un efecto separado que compara `remaining`
    // contra 0 lee ese estado ANTES de que el reset de arriba (setRemaining)
    // se aplique de verdad (setState es asíncrono) — al arrancar el
    // descanso de la serie 2, ese efecto veía el `remaining` viejo, todavía
    // en 0 desde que terminó el descanso de la serie 1, y llamaba a
    // onFinish() de nuevo al instante, cortando el timer nuevo antes de que
    // se llegara a ver (confirmado probando la app: el conteo solo aparecía
    // después de la primera serie). Acá adentro `prev` es siempre el valor
    // real y actual, no hay lectura cruzada entre efectos.
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          onFinishRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [restingUntil, isPaused]);

  if (restingUntil === null) return null;

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
        label={isPaused ? 'En pausa' : 'Descanso'}
        valueLabel={`${minutes}:${seconds.toString().padStart(2, '0')}`}
      />
      <ThemedView style={styles.actions}>
        <ThemedView style={styles.actionHalf}>
          <PrimaryButton
            label={isPaused ? 'Reanudar' : 'Pausar'}
            icon={isPaused ? Play : Pause}
            variant="neutral"
            disabled={remaining === 0}
            onPress={() => setIsPaused((p) => !p)}
          />
        </ThemedView>
        <ThemedView style={styles.actionHalf}>
          <PrimaryButton label="Saltar descanso" variant="ghost" onPress={onSkip} />
        </ThemedView>
      </ThemedView>
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
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  actionHalf: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

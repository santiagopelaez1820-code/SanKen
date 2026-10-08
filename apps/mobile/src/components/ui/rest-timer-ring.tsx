// Esta línea sirve para importar «useEffect, useRef, useState» desde «react».
import { useEffect, useRef, useState } from 'react';
// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';
// Esta línea sirve para importar «Pause, Play» desde «lucide-react-native».
import { Pause, Play } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «ProgressRing» desde «@/components/ui/progress-ring».
import { ProgressRing } from '@/components/ui/progress-ring';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';

// Esta línea sirve para declarar la interfaz «RestTimerRingProps».
interface RestTimerRingProps {
  /** Timestamp (ms) hasta el que se descansa, o null si no hay descanso activo. Un valor nuevo reinicia el conteo (otra serie, u otro ejercicio). */
  // Esta línea sirve para declarar la propiedad «restingUntil» con el valor o tipo «number | null».
  restingUntil: number | null;
  /** Duración total del descanso en segundos — define el 100% del ring. */
  // Esta línea sirve para declarar la propiedad «totalSeconds» con el valor o tipo «number».
  totalSeconds: number;
  // Esta línea sirve para declarar la propiedad «onSkip» con el valor o tipo «() => void».
  onSkip: () => void;
  /** Se dispara una sola vez cuando el conteo llega a 0 sin haber sido salteado antes. */
  // Esta línea sirve para declarar la propiedad «onFinish» con el valor o tipo «() => void».
  onFinish?: () => void;
}

/**
 * El conteo vive en segundos locales (no en la diferencia contra
 * `restingUntil`) para poder pausarlo: un timestamp objetivo no se puede
 * "congelar" sin recalcularlo, así que pausar simplemente detiene el
 * `setInterval` que decrementa `remaining`.
 */
// Esta línea sirve para declarar la función «RestTimerRing».
export function RestTimerRing({ restingUntil, totalSeconds, onSkip, onFinish }: RestTimerRingProps) {
  // Esta línea sirve para crear el estado «remaining» y su función «setRemaining».
  const [remaining, setRemaining] = useState(totalSeconds);
  // Esta línea sirve para crear el estado «isPaused» y su función «setIsPaused».
  const [isPaused, setIsPaused] = useState(false);

  // Siempre la versión más nueva de onFinish, sin que el interval de abajo
  // tenga que reprogramarse si su identidad cambia entre renders.
  // Esta línea sirve para crear la referencia «onFinishRef».
  const onFinishRef = useRef(onFinish);
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para asignar «onFinish» a «onFinishRef.current».
    onFinishRef.current = onFinish;
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «onFinish».
  }, [onFinish]);

  // Reinicia el conteo cuando arranca un nuevo descanso (restingUntil o
  // totalSeconds cambian) -- ajuste de estado durante el render en vez de
  // un efecto aparte (mismo patrón que "Adjusting state when a prop
  // changes" en la doc de React): evita el frame de más donde se vería el
  // valor del descanso anterior antes de que un efecto disparara. El
  // efecto de abajo (el que corre el setInterval, con el fix ya
  // documentado del orden de lecturas de `remaining`) queda intacto, no
  // se toca acá.
  // Esta línea sirve para extraer «estKe» de «`${restingUntil}:${totalSeconds}`».
  const restKey = `${restingUntil}:${totalSeconds}`;
  // Esta línea sirve para crear el estado «prevRestKey» y su función «setPrevRestKey».
  const [prevRestKey, setPrevRestKey] = useState(restKey);
  // Esta línea sirve para revisar si «restKey !== prevRestKey».
  if (restKey !== prevRestKey) {
    // Esta línea sirve para guardar en el estado con «setPrevRestKey» el valor «restKey)…».
    setPrevRestKey(restKey);
    // Esta línea sirve para revisar si «restingUntil !== null».
    if (restingUntil !== null) {
      // Esta línea sirve para guardar en el estado con «setRemaining» el valor «totalSeconds)…».
      setRemaining(totalSeconds);
      // Esta línea sirve para guardar en el estado con «setIsPaused» el valor «false)…».
      setIsPaused(false);
    }
  }

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «restingUntil === null || isPaused».
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
    // Esta línea sirve para extraer «» de «setInterval(() => {».
    const id = setInterval(() => {
      // Esta línea sirve para guardar en el estado con «setRemaining» el valor «(prev) => {…».
      setRemaining((prev) => {
        // Esta línea sirve para revisar si «prev <= 1».
        if (prev <= 1) {
          // Esta línea sirve para llamar a «clearInterval» con «id».
          clearInterval(id);
          // Esta línea sirve para avisar que terminó el descanso.
          onFinishRef.current?.();
          // Esta línea sirve para devolver «0».
          return 0;
        }
        // Esta línea sirve para devolver «prev - 1».
        return prev - 1;
      });
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «00».
    }, 1000);
    // Esta línea sirve para devolver «() => clearInterval(id)».
    return () => clearInterval(id);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «restingUntil, isPaused».
  }, [restingUntil, isPaused]);

  // Esta línea sirve para devolver null si «restingUntil === null».
  if (restingUntil === null) return null;

  // Esta línea sirve para extraer «inute» de «Math.floor(remaining / 60)».
  const minutes = Math.floor(remaining / 60);
  // Esta línea sirve para extraer «econd» de «remaining % 60».
  const seconds = remaining % 60;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.container}>
      {/* Esta línea sirve para abrir el elemento «ProgressRing» con sus atributos en varias líneas. */}
      <ProgressRing
        // Esta línea sirve para pasar la propiedad «value» con el valor «remaining}».
        value={remaining}
        // Esta línea sirve para pasar la propiedad «max» con el valor «totalSeconds}».
        max={totalSeconds}
        // Esta línea sirve para definir el atributo «color» con el valor «accentSecondary».
        color="accentSecondary"
        // Esta línea sirve para pasar la propiedad «size» con el valor «140}».
        size={140}
        // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «10}».
        strokeWidth={10}
        // Esta línea sirve para pasar la propiedad «label» con el valor «isPaused ? 'En pausa' : 'Descanso'}».
        label={isPaused ? 'En pausa' : 'Descanso'}
        // Esta línea sirve para pasar la propiedad «valueLabel» con el valor «`${minutes}:${seconds.toString().padStart(2, ».
        valueLabel={`${minutes}:${seconds.toString().padStart(2, '0')}`}
      />
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.actions}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={styles.actionHalf}>
          {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
          <PrimaryButton
            // Esta línea sirve para pasar la propiedad «label» con el valor «isPaused ? 'Reanudar' : 'Pausar'}».
            label={isPaused ? 'Reanudar' : 'Pausar'}
            // Esta línea sirve para pasar la propiedad «icon» con el valor «isPaused ? Play : Pause}».
            icon={isPaused ? Play : Pause}
            // Esta línea sirve para definir el atributo «variant» con el valor «neutral».
            variant="neutral"
            // Esta línea sirve para pasar la propiedad «disabled» con el valor «remaining === 0}».
            disabled={remaining === 0}
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => setIsPaused((p) => !p)}
          />
        </ThemedView>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={styles.actionHalf}>
          {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
          <PrimaryButton label="Saltar descanso" variant="ghost" onPress={onSkip} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.four».
    padding: Spacing.four,
  },
  // Esta línea sirve para declarar la propiedad «actions» con el valor o tipo «{».
  actions: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'stretch'».
    alignSelf: 'stretch',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «actionHalf» con el valor o tipo «{».
  actionHalf: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
});

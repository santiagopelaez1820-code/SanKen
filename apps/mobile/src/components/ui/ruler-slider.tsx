// Esta línea sirve para importar «memo, useEffect, useRef, useState» desde «react».
import { memo, useEffect, useRef, useState } from 'react';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «ScrollView» en la lista.
  ScrollView,
  // Esta línea sirve para incluir el valor «StyleSheet» en la lista.
  StyleSheet,
  // Esta línea sirve para incluir el valor «View» en la lista.
  View,
  // Esta línea sirve para importar el tipo «LayoutChangeEvent».
  type LayoutChangeEvent,
  // Esta línea sirve para importar el tipo «NativeScrollEvent».
  type NativeScrollEvent,
  // Esta línea sirve para importar el tipo «NativeSyntheticEvent».
  type NativeSyntheticEvent,
// Esta línea sirve para terminar la importación desde «react-native».
} from 'react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «RulerSliderProps».
interface RulerSliderProps {
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «number | null».
  value: number | null;
  // Esta línea sirve para declarar la propiedad «onChange» con el valor o tipo «(value: number) => void».
  onChange: (value: number) => void;
  // Esta línea sirve para declarar la propiedad «min» con el valor o tipo «number».
  min?: number;
  // Esta línea sirve para declarar la propiedad «max» con el valor o tipo «number».
  max?: number;
  // Esta línea sirve para declarar la propiedad «step» con el valor o tipo «number».
  step?: number;
  // Esta línea sirve para declarar la propiedad «unit» con el valor o tipo «string».
  unit?: string;
  /** Cada cuántos pasos va una marca larga con número (10 × 0.5 kg = cada 5 kg). */
  // Esta línea sirve para declarar la propiedad «labelEvery» con el valor o tipo «number».
  labelEvery?: number;
}

/** Separación en px entre marcas — 8px por paso deja 0.5 kg fáciles de apuntar con el dedo. */
// Esta línea sirve para declarar «TICK_SPACING» con el valor «8».
const TICK_SPACING = 8;
// Esta línea sirve para declarar «RULER_HEIGHT» con el valor «56».
const RULER_HEIGHT = 56;

// Esta línea sirve para declarar la función «roundToStep».
function roundToStep(n: number, step: number) {
  // Esta línea sirve para devolver «Math.round(n / step) * step».
  return Math.round(n / step) * step;
}

// Esta línea sirve para declarar la función «formatValue».
function formatValue(n: number) {
  // Esta línea sirve para devolver el valor como entero o con un decimal sin el .0 final.
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, '');
}

/**
 * Regla horizontal deslizable para cargar un valor numérico (peso de la
 * serie) — reemplaza los botones −/+ del Stepper en entrenamiento a pedido
 * del tester: con botones, pasar de 20 a 80 kg eran 24 toques. Arrastrando
 * la regla se llega en un gesto y el snap deja el valor exacto en el paso.
 *
 * Es un ScrollView con snapToInterval, no un slider nativo: funciona igual
 * en Android, iOS y la vista web sin sumar dependencias nativas nuevas.
 */
// Esta línea sirve para declarar la función «RulerSlider».
export function RulerSlider({
  // Esta línea sirve para incluir el valor «value» en la lista.
  value,
  // Esta línea sirve para incluir el valor «onChange» en la lista.
  onChange,
  // Esta línea sirve para incluir el valor «min» en la lista.
  min = 0,
  // Esta línea sirve para incluir el valor «max» en la lista.
  max = 300,
  // Esta línea sirve para incluir el valor «step» en la lista.
  step = 0.5,
  // Esta línea sirve para incluir el valor «unit» en la lista.
  unit,
  // Esta línea sirve para incluir el valor «labelEvery» en la lista.
  labelEvery = 10,
// Esta línea sirve para cerrar los parámetros con el tipo «RulerSliderProps» y abrir el cuerpo.
}: RulerSliderProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para crear la referencia «scrollRef».
  const scrollRef = useRef<ScrollView>(null);
  // Esta línea sirve para crear el estado «width» y su función «setWidth».
  const [width, setWidth] = useState(0);
  // Esta línea sirve para crear la referencia «isUserScrolling».
  const isUserScrolling = useRef(false);
  // Esta línea sirve para crear la referencia «lastEmitted».
  const lastEmitted = useRef<number | null>(value);
  // Esta línea sirve para crear la referencia «positionedForWidth».
  const positionedForWidth = useRef(0);

  // Esta línea sirve para extraer «urren» de «Math.min(max, Math.max(min, roundToStep(».
  const current = Math.min(max, Math.max(min, roundToStep(value ?? min, step)));
  // Esta línea sirve para extraer «ickCoun» de «Math.round((max - min) / step) + 1».
  const tickCount = Math.round((max - min) / step) + 1;
  // Esta línea sirve para extraer «ffsetFo» de «(v: number) => ((v - min) / step) * TICK».
  const offsetFor = (v: number) => ((v - min) / step) * TICK_SPACING;

  // Valor cambiado desde afuera (sugerencia al pasar de ejercicio, etc.):
  // mover la regla hasta ahí. Si el cambio vino del propio arrastre, no se
  // toca — si no, el scroll "pelearía" con el dedo del usuario.
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!width || isUserScrolling.current».
    if (!width || isUserScrolling.current) return;
    // Primer layout (o cambio de ancho): posicionar siempre — contentOffset
    // inicial no es confiable en Android.
    // Esta línea sirve para extraer «irstPositio» de «positionedForWidth.current !== width».
    const firstPosition = positionedForWidth.current !== width;
    // Esta línea sirve para salir de la función si «!firstPosition && lastEmitted.current === current».
    if (!firstPosition && lastEmitted.current === current) return;
    // Esta línea sirve para asignar «width» a «positionedForWidth.current».
    positionedForWidth.current = width;
    // Esta línea sirve para asignar «current» a «lastEmitted.current».
    lastEmitted.current = current;
    // Esta línea sirve para declarar «x» con el valor «offsetFor(current)».
    const x = offsetFor(current);
    // Esta línea sirve para desplazar la regla al valor actual en el siguiente cuadro.
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ x, animated: false }));
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «current, width».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, width]);

  // Esta línea sirve para extraer «alueFromOffse» de «(x: number) => {».
  const valueFromOffset = (x: number) => {
    // Esta línea sirve para extraer «nde» de «Math.round(x / TICK_SPACING)».
    const index = Math.round(x / TICK_SPACING);
    // Esta línea sirve para devolver el valor limitado al rango y al paso.
    return Math.min(max, Math.max(min, roundToStep(min + index * step, step)));
  };

  // Esta línea sirve para extraer «andleScrol» de «(e: NativeSyntheticEvent<NativeScrollEve».
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Esta línea sirve para extraer «ex» de «valueFromOffset(e.nativeEvent.contentOff».
    const next = valueFromOffset(e.nativeEvent.contentOffset.x);
    // Esta línea sirve para revisar si «next !== lastEmitted.current».
    if (next !== lastEmitted.current) {
      // Esta línea sirve para asignar «next» a «lastEmitted.current».
      lastEmitted.current = next;
      // Esta línea sirve para llamar a «onChange» con «next».
      onChange(next);
    }
  };

  // Esta línea sirve para extraer «andleScrollEn» de «(e: NativeSyntheticEvent<NativeScrollEve».
  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Esta línea sirve para llamar a «handleScroll» con «e».
    handleScroll(e);
    // Esta línea sirve para asignar «false» a «isUserScrolling.current».
    isUserScrolling.current = false;
  };

  // Esta línea sirve para extraer «andleLayou» de «(e: LayoutChangeEvent) => setWidth(e.nat».
  const handleLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.container}>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={styles.valueRow}>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="stat" style={styles.value}>
          {/* Esta línea sirve para mostrar el contenido dinámico «{formatValue(current)}». */}
          {formatValue(current)}
        </ThemedText>
        {/* Esta línea sirve para mostrar el bloque solo si «unit». */}
        {unit && (
          // Esta línea sirve para abrir el componente «ThemedText».
          <ThemedText type="small" themeColor="textSecondary" style={styles.unit}>
            {/* Esta línea sirve para mostrar el valor «unit». */}
            {unit}
          </ThemedText>
        )}
      </View>

      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={styles.rulerWrap} onLayout={handleLayout}>
        {/* Esta línea sirve para mostrar el bloque solo si «width > 0». */}
        {width > 0 && (
          // Esta línea sirve para abrir el elemento «ScrollView» con sus atributos en varias líneas.
          <ScrollView
            // Esta línea sirve para conectar la referencia «scrollRef}» con el elemento.
            ref={scrollRef}
            // Esta línea sirve para activar la opción «horizontal».
            horizontal
            // Esta línea sirve para pasar la propiedad «showsHorizontalScrollIndicator» con el valor «false}».
            showsHorizontalScrollIndicator={false}
            // Esta línea sirve para pasar la propiedad «snapToInterval» con el valor «TICK_SPACING}».
            snapToInterval={TICK_SPACING}
            // Esta línea sirve para definir el atributo «decelerationRate» con el valor «fast».
            decelerationRate="fast"
            // Esta línea sirve para pasar la propiedad «scrollEventThrottle» con el valor «16}».
            scrollEventThrottle={16}
            // Centro de la marca i (no su borde) bajo el indicador cuando x = i × TICK_SPACING.
            // Esta línea sirve para pasar la propiedad «contentContainerStyle» con el valor «{ paddingHorizontal: width / 2 - TICK_SPACING».
            contentContainerStyle={{ paddingHorizontal: width / 2 - TICK_SPACING / 2 }}
            // Esta línea sirve para pasar la propiedad «contentOffset» con el valor «{ x: offsetFor(current), y: 0 }}».
            contentOffset={{ x: offsetFor(current), y: 0 }}
            // Esta línea sirve para asignar el manejador del evento «onScrollBeginDrag».
            onScrollBeginDrag={() => {
              // Esta línea sirve para asignar «true» a «isUserScrolling.current».
              isUserScrolling.current = true;
            }}
            // Esta línea sirve para asignar el manejador del evento «onScroll».
            onScroll={handleScroll}
            // Esta línea sirve para asignar el manejador del evento «onMomentumScrollEnd».
            onMomentumScrollEnd={handleScrollEnd}
            // Esta línea sirve para asignar el manejador del evento «onScrollEndDrag».
            onScrollEndDrag={(e) => {
              // Sin inercia (soltó el dedo quieto) no llega onMomentumScrollEnd.
              // Esta línea sirve para llamar a «handleScroll» con «e».
              handleScroll(e);
              // Esta línea sirve para ignorar el evento si la velocidad es casi nula.
              if (!e.nativeEvent.velocity || Math.abs(e.nativeEvent.velocity.x) < 0.01) {
                // Esta línea sirve para asignar «false» a «isUserScrolling.current».
                isUserScrolling.current = false;
              }
            }}
            // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «adjustable».
            accessibilityRole="adjustable"
            // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «unit ? `Valor en ${unit}` : 'Valor'}».
            accessibilityLabel={unit ? `Valor en ${unit}` : 'Valor'}
            // Esta línea sirve para pasar la propiedad «accessibilityValue» con el valor «{ min, max, now: current, text: `${formatValu».
            accessibilityValue={{ min, max, now: current, text: `${formatValue(current)} ${unit ?? ''}`.trim() }}
            // Esta línea sirve para pasar la propiedad «accessibilityActions» con el valor «[{ name: 'increment' }, { name: 'decrement' }».
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            // Esta línea sirve para asignar el manejador del evento «onAccessibilityAction».
            onAccessibilityAction={(e) => {
              // Esta línea sirve para extraer «elt» de «e.nativeEvent.actionName === 'increment'».
              const delta = e.nativeEvent.actionName === 'increment' ? step : -step;
              // Esta línea sirve para mover el valor sumando el desplazamiento.
              onChange(Math.min(max, Math.max(min, roundToStep(current + delta, step))));
            }}>
            {/* Esta línea sirve para abrir el componente «Ticks». */}
            <Ticks count={tickCount} min={min} step={step} labelEvery={labelEvery} color={theme.textSecondary} />
          </ScrollView>
        )}
        {/* Esta línea sirve para abrir el componente «View». */}
        <View pointerEvents="none" style={[styles.indicator, { backgroundColor: theme.accent }]} />
      </View>
    </ThemedView>
  );
}

/** Memoizado: son cientos de marcas y no dependen del valor actual. */
// Esta línea sirve para declarar «Ticks» con el valor «memo(function Ticks({».
const Ticks = memo(function Ticks({
  // Esta línea sirve para incluir el valor «count» en la lista.
  count,
  // Esta línea sirve para incluir el valor «min» en la lista.
  min,
  // Esta línea sirve para incluir el valor «step» en la lista.
  step,
  // Esta línea sirve para incluir el valor «labelEvery» en la lista.
  labelEvery,
  // Esta línea sirve para incluir el valor «color» en la lista.
  color,
// Esta línea sirve para cerrar la desestructuración y abrir los tipos.
}: {
  // Esta línea sirve para declarar la propiedad «count» con el valor o tipo «number».
  count: number;
  // Esta línea sirve para declarar la propiedad «min» con el valor o tipo «number».
  min: number;
  // Esta línea sirve para declarar la propiedad «step» con el valor o tipo «number».
  step: number;
  // Esta línea sirve para declarar la propiedad «labelEvery» con el valor o tipo «number».
  labelEvery: number;
  // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «string».
  color: string;
// Esta línea sirve para cerrar los parámetros y abrir el cuerpo.
}) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={styles.ticks}>
      {/* Esta línea sirve para crear una marca por cada posición. */}
      {Array.from({ length: count }, (_, i) => {
        // Esta línea sirve para extraer «sMajo» de «i % labelEvery === 0».
        const isMajor = i % labelEvery === 0;
        // Esta línea sirve para extraer «sMi» de «!isMajor && i % (labelEvery / 2) === 0».
        const isMid = !isMajor && i % (labelEvery / 2) === 0;
        // Esta línea sirve para devolver la interfaz del componente.
        return (
          // Esta línea sirve para abrir el componente «View».
          <View key={i} style={styles.tickSlot}>
            {/* Esta línea sirve para abrir el elemento «View» con sus atributos en varias líneas. */}
            <View
              // Esta línea sirve para pasar la propiedad «style» con el valor «[».
              style={[
                // Esta línea sirve para agregar el estilo «styles.tick».
                styles.tick,
                // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «color, height: isMajor ? 24 : isMid ? 16…».
                { backgroundColor: color, height: isMajor ? 24 : isMid ? 16 : 10, opacity: isMajor ? 0.9 : 0.45 },
              ]}
            />
            {/* Esta línea sirve para mostrar el bloque solo si «isMajor». */}
            {isMajor && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={[styles.tickLabel, { color }]} numberOfLines={1}>
                {/* Esta línea sirve para mostrar el contenido dinámico «{formatValue(min + i * step)}». */}
                {formatValue(min + i * step)}
              </ThemedText>
            )}
          </View>
        );
      })}
    </View>
  );
});

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.two».
    paddingTop: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «Spacing.one».
    paddingBottom: Spacing.one,
    // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «'hidden'».
    overflow: 'hidden',
  },
  // Esta línea sirve para declarar la propiedad «valueRow» con el valor o tipo «{».
  valueRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'baseline'».
    alignItems: 'baseline',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «{».
  value: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «30».
    fontSize: 30,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «34».
    lineHeight: 34,
  },
  // Esta línea sirve para declarar la propiedad «unit» con el valor o tipo «{».
  unit: {
    // Esta línea sirve para declarar la propiedad «textTransform» con el valor o tipo «'uppercase'».
    textTransform: 'uppercase',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.5».
    letterSpacing: 0.5,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'600'».
    fontWeight: '600',
  },
  // Esta línea sirve para declarar la propiedad «rulerWrap» con el valor o tipo «{».
  rulerWrap: {
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «RULER_HEIGHT».
    height: RULER_HEIGHT,
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'flex-start'».
    justifyContent: 'flex-start',
  },
  // Esta línea sirve para declarar la propiedad «ticks» con el valor o tipo «{».
  ticks: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'flex-start'».
    alignItems: 'flex-start',
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «RULER_HEIGHT».
    height: RULER_HEIGHT,
  },
  // Esta línea sirve para declarar la propiedad «tickSlot» con el valor o tipo «{».
  tickSlot: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «TICK_SPACING».
    width: TICK_SPACING,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «'visible'».
    overflow: 'visible',
  },
  // Esta línea sirve para declarar la propiedad «tick» con el valor o tipo «{».
  tick: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «2».
    width: 2,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «1».
    borderRadius: 1,
  },
  // Esta línea sirve para declarar la propiedad «tickLabel» con el valor o tipo «{».
  tickLabel: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «26».
    top: 26,
    // Esta línea sirve para declarar la propiedad «left» con el valor o tipo «(TICK_SPACING - 40) / 2».
    left: (TICK_SPACING - 40) / 2,
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «40».
    width: 40,
    // Esta línea sirve para declarar la propiedad «textAlign» con el valor o tipo «'center'».
    textAlign: 'center',
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «11».
    fontSize: 11,
  },
  // Esta línea sirve para declarar la propiedad «indicator» con el valor o tipo «{».
  indicator: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «left» con el valor o tipo «'50%'».
    left: '50%',
    // Esta línea sirve para declarar la propiedad «marginLeft» con el valor o tipo «-1.5».
    marginLeft: -1.5,
    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «0».
    top: 0,
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «3».
    width: 3,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «30».
    height: 30,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «2».
    borderRadius: 2,
  },
});

import { memo, useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface RulerSliderProps {
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** Cada cuántos pasos va una marca larga con número (10 × 0.5 kg = cada 5 kg). */
  labelEvery?: number;
}

/** Separación en px entre marcas — 8px por paso deja 0.5 kg fáciles de apuntar con el dedo. */
const TICK_SPACING = 8;
const RULER_HEIGHT = 56;

function roundToStep(n: number, step: number) {
  return Math.round(n / step) * step;
}

function formatValue(n: number) {
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
export function RulerSlider({
  value,
  onChange,
  min = 0,
  max = 300,
  step = 0.5,
  unit,
  labelEvery = 10,
}: RulerSliderProps) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [width, setWidth] = useState(0);
  const isUserScrolling = useRef(false);
  const lastEmitted = useRef<number | null>(value);
  const positionedForWidth = useRef(0);

  const current = Math.min(max, Math.max(min, roundToStep(value ?? min, step)));
  const tickCount = Math.round((max - min) / step) + 1;
  const offsetFor = (v: number) => ((v - min) / step) * TICK_SPACING;

  // Valor cambiado desde afuera (sugerencia al pasar de ejercicio, etc.):
  // mover la regla hasta ahí. Si el cambio vino del propio arrastre, no se
  // toca — si no, el scroll "pelearía" con el dedo del usuario.
  useEffect(() => {
    if (!width || isUserScrolling.current) return;
    // Primer layout (o cambio de ancho): posicionar siempre — contentOffset
    // inicial no es confiable en Android.
    const firstPosition = positionedForWidth.current !== width;
    if (!firstPosition && lastEmitted.current === current) return;
    positionedForWidth.current = width;
    lastEmitted.current = current;
    const x = offsetFor(current);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ x, animated: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, width]);

  const valueFromOffset = (x: number) => {
    const index = Math.round(x / TICK_SPACING);
    return Math.min(max, Math.max(min, roundToStep(min + index * step, step)));
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = valueFromOffset(e.nativeEvent.contentOffset.x);
    if (next !== lastEmitted.current) {
      lastEmitted.current = next;
      onChange(next);
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScroll(e);
    isUserScrolling.current = false;
  };

  const handleLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <View style={styles.valueRow}>
        <ThemedText type="stat" style={styles.value}>
          {formatValue(current)}
        </ThemedText>
        {unit && (
          <ThemedText type="small" themeColor="textSecondary" style={styles.unit}>
            {unit}
          </ThemedText>
        )}
      </View>

      <View style={styles.rulerWrap} onLayout={handleLayout}>
        {width > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={TICK_SPACING}
            decelerationRate="fast"
            scrollEventThrottle={16}
            // Centro de la marca i (no su borde) bajo el indicador cuando x = i × TICK_SPACING.
            contentContainerStyle={{ paddingHorizontal: width / 2 - TICK_SPACING / 2 }}
            contentOffset={{ x: offsetFor(current), y: 0 }}
            onScrollBeginDrag={() => {
              isUserScrolling.current = true;
            }}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={(e) => {
              // Sin inercia (soltó el dedo quieto) no llega onMomentumScrollEnd.
              handleScroll(e);
              if (!e.nativeEvent.velocity || Math.abs(e.nativeEvent.velocity.x) < 0.01) {
                isUserScrolling.current = false;
              }
            }}
            accessibilityRole="adjustable"
            accessibilityLabel={unit ? `Valor en ${unit}` : 'Valor'}
            accessibilityValue={{ min, max, now: current, text: `${formatValue(current)} ${unit ?? ''}`.trim() }}
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={(e) => {
              const delta = e.nativeEvent.actionName === 'increment' ? step : -step;
              onChange(Math.min(max, Math.max(min, roundToStep(current + delta, step))));
            }}>
            <Ticks count={tickCount} min={min} step={step} labelEvery={labelEvery} color={theme.textSecondary} />
          </ScrollView>
        )}
        <View pointerEvents="none" style={[styles.indicator, { backgroundColor: theme.accent }]} />
      </View>
    </ThemedView>
  );
}

/** Memoizado: son cientos de marcas y no dependen del valor actual. */
const Ticks = memo(function Ticks({
  count,
  min,
  step,
  labelEvery,
  color,
}: {
  count: number;
  min: number;
  step: number;
  labelEvery: number;
  color: string;
}) {
  return (
    <View style={styles.ticks}>
      {Array.from({ length: count }, (_, i) => {
        const isMajor = i % labelEvery === 0;
        const isMid = !isMajor && i % (labelEvery / 2) === 0;
        return (
          <View key={i} style={styles.tickSlot}>
            <View
              style={[
                styles.tick,
                { backgroundColor: color, height: isMajor ? 24 : isMid ? 16 : 10, opacity: isMajor ? 0.9 : 0.45 },
              ]}
            />
            {isMajor && (
              <ThemedText type="small" style={[styles.tickLabel, { color }]} numberOfLines={1}>
                {formatValue(min + i * step)}
              </ThemedText>
            )}
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
    overflow: 'hidden',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  value: {
    fontSize: 30,
    lineHeight: 34,
  },
  unit: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  rulerWrap: {
    height: RULER_HEIGHT,
    justifyContent: 'flex-start',
  },
  ticks: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: RULER_HEIGHT,
  },
  tickSlot: {
    width: TICK_SPACING,
    alignItems: 'center',
    overflow: 'visible',
  },
  tick: {
    width: 2,
    borderRadius: 1,
  },
  tickLabel: {
    position: 'absolute',
    top: 26,
    left: (TICK_SPACING - 40) / 2,
    width: 40,
    textAlign: 'center',
    fontSize: 11,
  },
  indicator: {
    position: 'absolute',
    left: '50%',
    marginLeft: -1.5,
    top: 0,
    width: 3,
    height: 30,
    borderRadius: 2,
  },
});

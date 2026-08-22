import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface StepperProps {
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const HOLD_REPEAT_MS = 120;
const HOLD_DELAY_MS = 400;

export function Stepper({ value, onChange, min = 0, max = 999, step = 1, unit }: StepperProps) {
  const theme = useTheme();
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = value ?? 0;
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const apply = (delta: number) => onChange(clamp(Math.round((current + delta) / step) * step));

  const startHold = (delta: number) => {
    apply(delta);
    holdTimeout.current = setTimeout(() => {
      holdInterval.current = setInterval(() => apply(delta), HOLD_REPEAT_MS);
    }, HOLD_DELAY_MS);
  };

  const stopHold = () => {
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
    holdTimeout.current = null;
    holdInterval.current = null;
  };

  useEffect(() => stopHold, []);

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <Pressable
        onPressIn={() => startHold(-step)}
        onPressOut={stopHold}
        style={[styles.button, { backgroundColor: theme.backgroundSelected }]}>
        <Minus size={20} color={theme.text} />
      </Pressable>

      <ThemedView style={styles.valueWrap}>
        <ThemedText type="stat" style={styles.value}>
          {current}
        </ThemedText>
        {unit && (
          <ThemedText type="small" themeColor="textSecondary" style={styles.unit}>
            {unit}
          </ThemedText>
        )}
      </ThemedView>

      <Pressable onPressIn={() => startHold(step)} onPressOut={stopHold} style={[styles.button, { backgroundColor: theme.accent }]}>
        <Plus size={20} color="#050505" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Spacing.three,
    padding: Spacing.two,
    gap: Spacing.three,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueWrap: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
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
});

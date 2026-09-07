import { StyleSheet } from 'react-native';
import type { OrderStatus } from '@sanken/core';
import { getOrderTimeline } from '@sanken/core';
import { AlertTriangle, Check, XCircle } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface OrderTimelineProps {
  status: OrderStatus;
}

/**
 * Progreso visual del pedido: pending → confirming → processing → shipped →
 * delivered, con check en los pasos completados y el paso actual resaltado.
 * `problem` y `cancelled` son estados especiales fuera de esa secuencia — se
 * muestran como un aviso aparte, nunca como "paso N de 5" (ver Fase 3).
 * El cálculo de qué mostrar vive en @sanken/core (getOrderTimeline) — este
 * componente solo se encarga del marcado, igual que sus equivalentes web.
 */
export function OrderTimeline({ status }: OrderTimelineProps) {
  const theme = useTheme();
  const timeline = getOrderTimeline(status);

  if (timeline.kind === 'special') {
    const color = theme.error;
    return (
      <ThemedView style={[styles.alert, { backgroundColor: `${color}1A`, borderColor: color }]}>
        <Icon icon={timeline.isProblem ? AlertTriangle : XCircle} size={20} color={color} />
        <ThemedText type="smallBold" style={{ color }}>
          {timeline.label}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {timeline.steps.map(({ step, label, isDone, isCurrent, isLast }) => (
        <ThemedView key={step} style={styles.stepRow}>
          <ThemedView style={styles.indicatorCol}>
            <ThemedView
              style={[
                styles.dot,
                {
                  backgroundColor: isDone ? theme.accent : 'transparent',
                  borderColor: isDone || isCurrent ? theme.accent : theme.border,
                },
              ]}>
              {isDone && <Icon icon={Check} size={12} color="#050505" strokeWidth={3} />}
            </ThemedView>
            {!isLast && (
              <ThemedView style={[styles.line, { backgroundColor: isDone ? theme.accent : theme.border }]} />
            )}
          </ThemedView>
          <ThemedText
            type={isCurrent ? 'smallBold' : 'small'}
            themeColor={isDone || isCurrent ? 'text' : 'textSecondary'}
            style={styles.stepLabel}>
            {label}
          </ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent' },
  stepRow: { flexDirection: 'row', backgroundColor: 'transparent' },
  indicatorCol: { alignItems: 'center', width: 24, backgroundColor: 'transparent' },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: { width: 2, flex: 1, minHeight: Spacing.three, marginVertical: Spacing.half },
  stepLabel: { flex: 1, marginLeft: Spacing.two, paddingTop: Spacing.half, paddingBottom: Spacing.three },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
});

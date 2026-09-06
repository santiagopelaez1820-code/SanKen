import { StyleSheet } from 'react-native';
import type { OrderStatus } from '@sanken/core';
import { AlertTriangle, Check, XCircle } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from '@/constants/order-status';
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
 */
export function OrderTimeline({ status }: OrderTimelineProps) {
  const theme = useTheme();

  if (status === 'problem' || status === 'cancelled') {
    const isProblem = status === 'problem';
    const color = theme.error;
    return (
      <ThemedView style={[styles.alert, { backgroundColor: `${color}1A`, borderColor: color }]}>
        <Icon icon={isProblem ? AlertTriangle : XCircle} size={20} color={color} />
        <ThemedText type="smallBold" style={{ color }}>
          {ORDER_STATUS_LABELS[status]}
        </ThemedText>
      </ThemedView>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <ThemedView style={styles.container}>
      {ORDER_STATUS_FLOW.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === ORDER_STATUS_FLOW.length - 1;

        return (
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
              {ORDER_STATUS_LABELS[step]}
            </ThemedText>
          </ThemedView>
        );
      })}
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

import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { TrendingDown, TrendingUp } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon, type LucideIcon } from '@/components/ui/icon';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Tono del KPI — siempre un color de la paleta del tema, nunca uno suelto. */
export type StatTone = 'accent' | 'accentSecondary' | 'success' | 'warning' | 'error';

interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  trend?: { delta: string; direction: 'up' | 'down' };
  /** Da identidad visual al KPI (chip del ícono, borde y lavado sutil). Default: accent. */
  tone?: StatTone;
}

/**
 * KPI compacto: chip de ícono teñido + valor + etiqueta en una sola fila.
 * Antes era una tarjeta alta (valor de 34px + etiqueta debajo) donde todos
 * los KPI se veían iguales; ahora cada uno lleva su tono y ocupa ~la mitad
 * de altura. Sin `icon` (usos de admin/nutrición) cae a valor + etiqueta.
 */
export function StatTile({ label, value, hint, icon, trend, tone = 'accent' }: StatTileProps) {
  const theme = useTheme();
  const toneColor = theme[tone];

  return (
    <ThemedView type="backgroundElement" style={[styles.tile, { borderColor: `${toneColor}26` }]}>
      <LinearGradient
        colors={[`${toneColor}14`, `${toneColor}00`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {icon && (
        <Animated.View entering={ZoomIn.duration(260)}>
          <View style={[styles.iconChip, { backgroundColor: `${toneColor}1F` }]}>
            <Icon icon={icon} size={16} color={toneColor} strokeWidth={2.3} />
          </View>
        </Animated.View>
      )}
      <View style={styles.body}>
        <View style={styles.valueRow}>
          <ThemedText type="stat" style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
            {value}
          </ThemedText>
          {trend && (
            <View style={styles.trend}>
              <Icon
                icon={trend.direction === 'up' ? TrendingUp : TrendingDown}
                size={12}
                color={trend.direction === 'up' ? theme.success : theme.textSecondary}
              />
              <ThemedText type="caption" themeColor={trend.direction === 'up' ? 'success' : 'textSecondary'}>
                {trend.delta}
              </ThemedText>
            </View>
          )}
        </View>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.label} numberOfLines={1}>
          {label}
        </ThemedText>
        {hint && (
          <ThemedText type="caption" style={{ color: toneColor }} numberOfLines={1}>
            {hint}
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    borderRadius: Spacing.three,
    borderWidth: 1,
    paddingHorizontal: Spacing.two + 4,
    paddingVertical: Spacing.two + 2,
    overflow: 'hidden',
  },
  iconChip: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  value: {
    fontSize: 20,
    lineHeight: 24,
    flexShrink: 1,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  label: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

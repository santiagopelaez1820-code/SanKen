// Esta línea sirve para importar «StyleSheet, View» desde «react-native».
import { StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «LinearGradient» desde «expo-linear-gradient».
import { LinearGradient } from 'expo-linear-gradient';
// Esta línea sirve para importar «Animated» y «ZoomIn» desde «react-native-reanimated».
import Animated, { ZoomIn } from 'react-native-reanimated';
// Esta línea sirve para importar «TrendingDown, TrendingUp» desde «lucide-react-native».
import { TrendingDown, TrendingUp } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Icon, type LucideIcon» desde «@/components/ui/icon».
import { Icon, type LucideIcon } from '@/components/ui/icon';
// Esta línea sirve para importar «Spacing, Typography» desde «@/constants/theme».
import { Spacing, Typography } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

/** Tono del KPI — siempre un color de la paleta del tema, nunca uno suelto. */
// Esta línea sirve para declarar los tonos de color disponibles para la ficha.
export type StatTone = 'accent' | 'accentSecondary' | 'success' | 'warning' | 'error';

// Esta línea sirve para declarar la interfaz «StatTileProps».
interface StatTileProps {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «string».
  value: string;
  // Esta línea sirve para declarar la propiedad «hint» con el valor o tipo «string».
  hint?: string;
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «LucideIcon».
  icon?: LucideIcon;
  // Esta línea sirve para declarar la propiedad «trend» con el valor o tipo «{ delta: string; direction: 'up' | 'down' }».
  trend?: { delta: string; direction: 'up' | 'down' };
  /** Da identidad visual al KPI (chip del ícono, borde y lavado sutil). Default: accent. */
  // Esta línea sirve para declarar la propiedad «tone» con el valor o tipo «StatTone».
  tone?: StatTone;
}

/**
 * KPI compacto: chip de ícono teñido + valor + etiqueta en una sola fila.
 * Antes era una tarjeta alta (valor de 34px + etiqueta debajo) donde todos
 * los KPI se veían iguales; ahora cada uno lleva su tono y ocupa ~la mitad
 * de altura. Sin `icon` (usos de admin/nutrición) cae a valor + etiqueta.
 */
// Esta línea sirve para declarar la función «StatTile».
export function StatTile({ label, value, hint, icon, trend, tone = 'accent' }: StatTileProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «oneColo» de «theme[tone]».
  const toneColor = theme[tone];

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={[styles.tile, { borderColor: `${toneColor}26` }]}>
      {/* Esta línea sirve para abrir el elemento «LinearGradient» con sus atributos en varias líneas. */}
      <LinearGradient
        // Esta línea sirve para pasar la propiedad «colors» con el valor «[`${toneColor}14`, `${toneColor}00`]}».
        colors={[`${toneColor}14`, `${toneColor}00`]}
        // Esta línea sirve para pasar la propiedad «start» con el valor «{ x: 0, y: 0 }}».
        start={{ x: 0, y: 0 }}
        // Esta línea sirve para pasar la propiedad «end» con el valor «{ x: 1, y: 1 }}».
        end={{ x: 1, y: 1 }}
        // Esta línea sirve para pasar la propiedad «style» con el valor «StyleSheet.absoluteFill}».
        style={StyleSheet.absoluteFill}
        // Esta línea sirve para definir el atributo «pointerEvents» con el valor «none».
        pointerEvents="none"
      />
      {/* Esta línea sirve para mostrar el bloque solo si «icon». */}
      {icon && (
        // Esta línea sirve para abrir el componente «Animated.View».
        <Animated.View entering={ZoomIn.duration(260)}>
          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={[styles.iconChip, { backgroundColor: `${toneColor}1F` }]}>
            {/* Esta línea sirve para abrir el componente «Icon». */}
            <Icon icon={icon} size={16} color={toneColor} strokeWidth={2.3} />
          </View>
        </Animated.View>
      )}
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={styles.body}>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={styles.valueRow}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="stat" style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
            {/* Esta línea sirve para mostrar el valor «value». */}
            {value}
          </ThemedText>
          {/* Esta línea sirve para mostrar el bloque solo si «trend». */}
          {trend && (
            // Esta línea sirve para abrir el componente «View».
            <View style={styles.trend}>
              {/* Esta línea sirve para abrir el elemento «Icon» con sus atributos en varias líneas. */}
              <Icon
                // Esta línea sirve para pasar la propiedad «icon» con el valor «trend.direction === 'up' ? TrendingUp : Trend».
                icon={trend.direction === 'up' ? TrendingUp : TrendingDown}
                // Esta línea sirve para pasar la propiedad «size» con el valor «12}».
                size={12}
                // Esta línea sirve para pasar la propiedad «color» con el valor «trend.direction === 'up' ? theme.success : th».
                color={trend.direction === 'up' ? theme.success : theme.textSecondary}
              />
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="caption" themeColor={trend.direction === 'up' ? 'success' : 'textSecondary'}>
                {/* Esta línea sirve para mostrar el valor «trend.delta». */}
                {trend.delta}
              </ThemedText>
            </View>
          )}
        </View>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="caption" themeColor="textSecondary" style={styles.label} numberOfLines={1}>
          {/* Esta línea sirve para mostrar el valor «label». */}
          {label}
        </ThemedText>
        {/* Esta línea sirve para mostrar el bloque solo si «hint». */}
        {hint && (
          // Esta línea sirve para abrir el componente «ThemedText».
          <ThemedText type="caption" style={{ color: toneColor }} numberOfLines={1}>
            {/* Esta línea sirve para mostrar el valor «hint». */}
            {hint}
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «tile» con el valor o tipo «{».
  tile: {
    // Esta línea sirve para declarar la propiedad «flexBasis» con el valor o tipo «'47%'».
    flexBasis: '47%',
    // Esta línea sirve para declarar la propiedad «flexGrow» con el valor o tipo «1».
    flexGrow: 1,
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two + 2».
    gap: Spacing.two + 2,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.two + 4».
    paddingHorizontal: Spacing.two + 4,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two + 2».
    paddingVertical: Spacing.two + 2,
    // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «'hidden'».
    overflow: 'hidden',
  },
  // Esta línea sirve para declarar la propiedad «iconChip» con el valor o tipo «{».
  iconChip: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «32».
    width: 32,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «32».
    height: 32,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «10».
    borderRadius: 10,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «body» con el valor o tipo «{».
  body: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «0».
    minWidth: 0,
  },
  // Esta línea sirve para declarar la propiedad «valueRow» con el valor o tipo «{».
  valueRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «{».
  value: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «20».
    fontSize: 20,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «24».
    lineHeight: 24,
    // Esta línea sirve para declarar la propiedad «flexShrink» con el valor o tipo «1».
    flexShrink: 1,
  },
  // Esta línea sirve para declarar la propiedad «trend» con el valor o tipo «{».
  trend: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «2».
    gap: 2,
  },
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «{».
  label: {
    // Esta línea sirve para copiar las propiedades de «Typography».
    ...Typography.caption,
    // Esta línea sirve para declarar la propiedad «textTransform» con el valor o tipo «'uppercase'».
    textTransform: 'uppercase',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.5».
    letterSpacing: 0.5,
  },
});

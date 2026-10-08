// Esta línea sirve para importar «useEffect, useState, type ReactNode» desde «react».
import { useEffect, useState, type ReactNode } from 'react';
// Esta línea sirve para importar «Animated, StyleSheet, View» desde «react-native».
import { Animated, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «Svg» y «Circle» desde «react-native-svg».
import Svg, { Circle } from 'react-native-svg';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar «AnimatedCircle» con el valor «Animated.createAnimatedComponent(Circle)».
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Esta línea sirve para declarar la interfaz «ProgressRingProps».
interface ProgressRingProps {
  /** Progreso actual, 0..max */
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «number».
  value: number;
  // Esta línea sirve para declarar la propiedad «max» con el valor o tipo «number».
  max: number;
  /** Color del trazo — lima (progreso) o cyan (entrenamiento/actividad) */
  // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «'accent' | 'accentSecondary'».
  color?: 'accent' | 'accentSecondary';
  // Esta línea sirve para declarar la propiedad «size» con el valor o tipo «number».
  size?: number;
  // Esta línea sirve para declarar la propiedad «strokeWidth» con el valor o tipo «number».
  strokeWidth?: number;
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label?: string;
  // Esta línea sirve para declarar la propiedad «valueLabel» con el valor o tipo «string».
  valueLabel?: string;
  /** Reemplaza el texto central por otro contenido (ej. avatar) — el ring sigue midiendo `value/max`. */
  // Esta línea sirve para declarar la propiedad «centerContent» con el valor o tipo «ReactNode».
  centerContent?: ReactNode;
}

// Esta línea sirve para declarar la función «ProgressRing».
export function ProgressRing({
  // Esta línea sirve para incluir el valor «value» en la lista.
  value,
  // Esta línea sirve para incluir el valor «max» en la lista.
  max,
  // Esta línea sirve para incluir el valor «color» en la lista.
  color = 'accent',
  // Esta línea sirve para incluir el valor «size» en la lista.
  size = 120,
  // Esta línea sirve para incluir el valor «strokeWidth» en la lista.
  strokeWidth = 10,
  // Esta línea sirve para incluir el valor «label» en la lista.
  label,
  // Esta línea sirve para incluir el valor «valueLabel» en la lista.
  valueLabel,
  // Esta línea sirve para incluir el valor «centerContent» en la lista.
  centerContent,
// Esta línea sirve para cerrar los parámetros con el tipo «ProgressRingProps» y abrir el cuerpo.
}: ProgressRingProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «c» de «max > 0 ? Math.min(1, Math.max(0, value ».
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  // Esta línea sirve para extraer «adiu» de «(size - strokeWidth) / 2».
  const radius = (size - strokeWidth) / 2;
  // Esta línea sirve para extraer «ircumferenc» de «2 * Math.PI * radius».
  const circumference = 2 * Math.PI * radius;
  // Esta línea sirve para extraer «trokeColo» de «color === 'accent' ? theme.accent : them».
  const strokeColor = color === 'accent' ? theme.accent : theme.accentSecondary;

  // Esta línea sirve para extraer «animated» de «useState(() => new Animated.Value(0))».
  const [animated] = useState(() => new Animated.Value(0));

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para animar el valor del anillo.
    Animated.timing(animated, {
      // Esta línea sirve para declarar la propiedad «toValue» con el valor o tipo «pct».
      toValue: pct,
      // Esta línea sirve para declarar la propiedad «duration» con el valor o tipo «700».
      duration: 700,
      // Esta línea sirve para declarar la propiedad «useNativeDriver» con el valor o tipo «false».
      useNativeDriver: false,
    // Esta línea sirve para iniciar la animación.
    }).start();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «animated, pct».
  }, [animated, pct]);

  // Esta línea sirve para extraer «trokeDashoffse» de «animated.interpolate({».
  const strokeDashoffset = animated.interpolate({
    // Esta línea sirve para declarar la propiedad «inputRange» con el valor o tipo «[0, 1]».
    inputRange: [0, 1],
    // Esta línea sirve para declarar la propiedad «outputRange» con el valor o tipo «[circumference, 0]».
    outputRange: [circumference, 0],
  });

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={styles.container}>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={{ width: size, height: size }}>
        {/* Esta línea sirve para abrir el componente «Svg». */}
        <Svg width={size} height={size} style={styles.svg}>
          {/* Esta línea sirve para abrir el elemento «Circle» con sus atributos en varias líneas. */}
          <Circle
            // Esta línea sirve para pasar la propiedad «cx» con el valor «size / 2}».
            cx={size / 2}
            // Esta línea sirve para pasar la propiedad «cy» con el valor «size / 2}».
            cy={size / 2}
            // Esta línea sirve para pasar la propiedad «r» con el valor «radius}».
            r={radius}
            // Esta línea sirve para definir el atributo «fill» con el valor «none».
            fill="none"
            // Esta línea sirve para pasar la propiedad «stroke» con el valor «theme.border}».
            stroke={theme.border}
            // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «strokeWidth}».
            strokeWidth={strokeWidth}
          />
          {/* Esta línea sirve para abrir el elemento «AnimatedCircle» con sus atributos en varias líneas. */}
          <AnimatedCircle
            // Esta línea sirve para pasar la propiedad «cx» con el valor «size / 2}».
            cx={size / 2}
            // Esta línea sirve para pasar la propiedad «cy» con el valor «size / 2}».
            cy={size / 2}
            // Esta línea sirve para pasar la propiedad «r» con el valor «radius}».
            r={radius}
            // Esta línea sirve para definir el atributo «fill» con el valor «none».
            fill="none"
            // Esta línea sirve para pasar la propiedad «stroke» con el valor «strokeColor}».
            stroke={strokeColor}
            // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «strokeWidth}».
            strokeWidth={strokeWidth}
            // Esta línea sirve para definir el atributo «strokeLinecap» con el valor «round».
            strokeLinecap="round"
            // Esta línea sirve para pasar la propiedad «strokeDasharray» con el valor «circumference}».
            strokeDasharray={circumference}
            // Esta línea sirve para pasar la propiedad «strokeDashoffset» con el valor «strokeDashoffset}».
            strokeDashoffset={strokeDashoffset}
            // Esta línea sirve para pasar la propiedad «originX» con el valor «size / 2}».
            originX={size / 2}
            // Esta línea sirve para pasar la propiedad «originY» con el valor «size / 2}».
            originY={size / 2}
            // Esta línea sirve para pasar la propiedad «rotation» con el valor «-90}».
            rotation={-90}
          />
        </Svg>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={styles.centerLabel}>
          {/* Esta línea sirve para mostrar el contenido dinámico «{centerContent ?? (». */}
          {centerContent ?? (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="smallBold" style={styles.value}>
              {/* Esta línea sirve para mostrar el valor «valueLabel». */}
              {valueLabel}
            </ThemedText>
          )}
        </View>
      </View>
      {/* Esta línea sirve para mostrar el bloque solo si «!!label». */}
      {!!label && (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
          {/* Esta línea sirve para mostrar el valor «label». */}
          {label}
        </ThemedText>
      )}
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «8».
    gap: 8,
  },
  // Esta línea sirve para declarar la propiedad «svg» con el valor o tipo «{».
  svg: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
  },
  // Esta línea sirve para declarar la propiedad «centerLabel» con el valor o tipo «{».
  centerLabel: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «{».
  value: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «18».
    fontSize: 18,
    // Esta línea sirve para declarar la propiedad «fontVariant» con el valor o tipo «['tabular-nums']».
    fontVariant: ['tabular-nums'],
  },
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «{».
  label: {
    // Esta línea sirve para declarar la propiedad «textTransform» con el valor o tipo «'uppercase'».
    textTransform: 'uppercase',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.5».
    letterSpacing: 0.5,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'600'».
    fontWeight: '600',
  },
});

// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «Animated, StyleSheet» desde «react-native».
import { Animated, StyleSheet } from 'react-native';

// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar «PARTICLE_COUNT» con el valor «8».
const PARTICLE_COUNT = 8;
// Esta línea sirve para declarar «PARTICLE_OFFSETS» con el valor «Array.from({ length: PARTICLE_COUNT }, (_, i) => {».
const PARTICLE_OFFSETS = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  // Esta línea sirve para extraer «ngl» de «(i / PARTICLE_COUNT) * 2 * Math.PI».
  const angle = (i / PARTICLE_COUNT) * 2 * Math.PI;
  // Esta línea sirve para devolver la posición de cada pieza de confeti según su ángulo.
  return { x: Math.cos(angle) * 70, y: Math.sin(angle) * 50 };
});

// Esta línea sirve para declarar la interfaz «CelebrationOverlayProps».
interface CelebrationOverlayProps {
  // Esta línea sirve para declarar la propiedad «show» con el valor o tipo «boolean».
  show: boolean;
  // Esta línea sirve para declarar la propiedad «children» con el valor o tipo «React.ReactNode».
  children: React.ReactNode;
}

/**
 * Envuelve un banner inline (PR, serie completada) con una entrada de
 * celebración liviana: scale-in + un pequeño estallido de partículas en los
 * colores de marca. Para el momento "full-screen" (subir de nivel) se usa
 * LevelUpCelebration, que ya tiene su propio confetti a pantalla completa.
 */
// Esta línea sirve para declarar la función «CelebrationOverlay».
export function CelebrationOverlay({ show, children }: CelebrationOverlayProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «cardAnim» de «useState(() => new Animated.Value(0))».
  const [cardAnim] = useState(() => new Animated.Value(0));

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!show».
    if (!show) return;
    // Esta línea sirve para llamar a «cardAnim.setValue» con «0».
    cardAnim.setValue(0);
    // Esta línea sirve para animar la tarjeta con un resorte.
    Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 220 }).start();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «show, cardAnim».
  }, [show, cardAnim]);

  // Esta línea sirve para devolver null si «!show».
  if (!show) return null;

  // Esta línea sirve para extraer «articleColor» de «[theme.accent, theme.accentSecondary, th».
  const particleColors = [theme.accent, theme.accentSecondary, theme.text];

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el contenedor animado de la celebración.
    <Animated.View
      // Esta línea sirve para pasar la propiedad «style» con el valor «[».
      style={[
        // Esta línea sirve para agregar el estilo «styles.container».
        styles.container,
        {
          // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «cardAnim».
          opacity: cardAnim,
          // Esta línea sirve para definir «transform» con «[{ scale: cardAnim.interpolate({ inputRa…».
          transform: [{ scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
        },
      ]}>
      {/* Esta línea sirve para recorrer «PARTICLE_OFFSETS» y mostrar un bloque por elemento. */}
      {PARTICLE_OFFSETS.map((offset, i) => (
        // Esta línea sirve para abrir cada pieza animada de confeti.
        <Animated.View
          // Esta línea sirve para identificar el elemento de la lista con «i}».
          key={i}
          // Esta línea sirve para pasar la propiedad «style» con el valor «[».
          style={[
            // Esta línea sirve para agregar el estilo «styles.particle».
            styles.particle,
            // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «particleColors[i % particleColors.length…».
            { backgroundColor: particleColors[i % particleColors.length] },
            {
              // Esta línea sirve para definir «opacity» con «cardAnim.interpolate({ inputRange: [0, 1…».
              opacity: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              // Esta línea sirve para declarar la propiedad «transform» con el valor o tipo «[».
              transform: [
                // Esta línea sirve para agregar un elemento cuyo «translateX» es «cardAnim.interpolate({ inputRange: [0, 1…».
                { translateX: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0, offset.x] }) },
                // Esta línea sirve para agregar un elemento cuyo «translateY» es «cardAnim.interpolate({ inputRange: [0, 1…».
                { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0, offset.y] }) },
              ],
            },
          ]}
        />
      ))}
      {/* Esta línea sirve para mostrar el valor «children». */}
      {children}
    </Animated.View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'relative'».
    position: 'relative',
  },
  // Esta línea sirve para declarar la propiedad «particle» con el valor o tipo «{».
  particle: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «'50%'».
    top: '50%',
    // Esta línea sirve para declarar la propiedad «left» con el valor o tipo «'50%'».
    left: '50%',
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «6».
    width: 6,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «6».
    height: 6,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «3».
    borderRadius: 3,
  },
});

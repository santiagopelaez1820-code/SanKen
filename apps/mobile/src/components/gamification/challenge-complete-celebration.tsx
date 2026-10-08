// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «Animated, Modal, StyleSheet» desde «react-native».
import { Animated, Modal, StyleSheet } from 'react-native';
// Esta línea sirve para importar «Trophy» desde «lucide-react-native».
import { Trophy } from 'lucide-react-native';
// Esta línea sirve para importar los tipos «Challenge» desde «@sanken/core».
import type { Challenge } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «ChallengeCompleteCelebrationProps».
interface ChallengeCompleteCelebrationProps {
  // Esta línea sirve para declarar la propiedad «challenge» con el valor o tipo «Challenge | null».
  challenge: Challenge | null;
  // Esta línea sirve para declarar la propiedad «onDismiss» con el valor o tipo «() => void».
  onDismiss: () => void;
}

/**
 * Mismo lenguaje visual que level-up-celebration.tsx (Animated nativo, no
 * Reanimated, por la misma razón: evitar el riesgo de SSR/Metro dentro de un
 * <Modal>). No muestra XP: a diferencia de subir de nivel o desbloquear un
 * logro, completar un reto hoy NO otorga bonus de XP en el backend
 * (RecalculateChallengeProgressAction solo marca `completed`, sin disparar
 * ningún award) — inventar un número acá violaría la regla de no fabricar
 * datos que no vienen del servidor.
 */
// Esta línea sirve para declarar la función «ChallengeCompleteCelebration».
export function ChallengeCompleteCelebration({ challenge, onDismiss }: ChallengeCompleteCelebrationProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «isibl» de «Boolean(challenge)».
  const visible = Boolean(challenge);

  // Esta línea sirve para extraer «cardAnim» de «useState(() => new Animated.Value(0))».
  const [cardAnim] = useState(() => new Animated.Value(0));

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!visible».
    if (!visible) return;
    // Esta línea sirve para llamar a «cardAnim.setValue» con «0».
    cardAnim.setValue(0);
    // Esta línea sirve para animar la tarjeta con un resorte.
    Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 180 }).start();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «visible, cardAnim».
  }, [visible, cardAnim]);

  // Esta línea sirve para devolver null si «!challenge».
  if (!challenge) return null;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Modal».
    <Modal transparent visible animationType="fade" onRequestClose={onDismiss}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.backdrop}>
        {/* Esta línea sirve para abrir el contenedor animado de la celebración. */}
        <Animated.View
          // Esta línea sirve para pasar la propiedad «style» con el valor «[».
          style={[
            // Esta línea sirve para agregar el estilo «styles.card».
            styles.card,
            // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «theme.background, borderColor: theme.bac…».
            { backgroundColor: theme.background, borderColor: theme.backgroundSelected },
            // Esta línea sirve para agregar un elemento cuyo «opacity» es «cardAnim, transform: [{ scale: cardAnim.…».
            { opacity: cardAnim, transform: [{ scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] },
          ]}>
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={[styles.iconCircle, { backgroundColor: `${theme.accent}22` }]}>
            {/* Esta línea sirve para abrir el componente «Trophy». */}
            <Trophy size={32} color={theme.accent} />
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el texto «¡RETO COMPLETADO!». */}
            ¡RETO COMPLETADO!
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" themeColor="accent" style={styles.title}>
            {/* Esta línea sirve para mostrar el valor «challenge.title». */}
            {challenge.title}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            {/* Esta línea sirve para mostrar el valor «challenge.description». */}
            {challenge.description}
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.button}>
            {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
            <PrimaryButton label="Continuar" onPress={onDismiss} />
          </ThemedView>
        </Animated.View>
      </ThemedView>
    </Modal>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «backdrop» con el valor o tipo «{».
  backdrop: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'rgba(0,0,0,0.6)'».
    backgroundColor: 'rgba(0,0,0,0.6)',
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.four».
    padding: Spacing.four,
  },
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «360».
    maxWidth: 360,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.four * 2».
    paddingVertical: Spacing.four * 2,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
  },
  // Esta línea sirve para declarar la propiedad «iconCircle» con el valor o tipo «{».
  iconCircle: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «64».
    width: 64,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «64».
    height: 64,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «32».
    borderRadius: 32,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.two».
    marginBottom: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «title» con «fontSize: 24, lineHeight: 30, textAlign: 'center' …».
  title: { fontSize: 24, lineHeight: 30, textAlign: 'center' },
  // Esta línea sirve para definir el estilo «subtitle» con «textAlign: 'center', marginTop: Spacing.one },…».
  subtitle: { textAlign: 'center', marginTop: Spacing.one },
  // Esta línea sirve para declarar la propiedad «button» con el valor o tipo «{».
  button: {
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'stretch'».
    alignSelf: 'stretch',
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.three».
    marginTop: Spacing.three,
  },
});

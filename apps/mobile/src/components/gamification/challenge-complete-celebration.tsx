import { useEffect, useState } from 'react';
import { Animated, Modal, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';
import type { Challenge } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ChallengeCompleteCelebrationProps {
  challenge: Challenge | null;
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
export function ChallengeCompleteCelebration({ challenge, onDismiss }: ChallengeCompleteCelebrationProps) {
  const theme = useTheme();
  const visible = Boolean(challenge);

  const [cardAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) return;
    cardAnim.setValue(0);
    Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 180 }).start();
  }, [visible, cardAnim]);

  if (!challenge) return null;

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onDismiss}>
      <ThemedView style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: theme.background, borderColor: theme.backgroundSelected },
            { opacity: cardAnim, transform: [{ scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] },
          ]}>
          <ThemedView style={[styles.iconCircle, { backgroundColor: `${theme.accent}22` }]}>
            <Trophy size={32} color={theme.accent} />
          </ThemedView>

          <ThemedText type="small" themeColor="textSecondary">
            ¡RETO COMPLETADO!
          </ThemedText>
          <ThemedText type="title" themeColor="accent" style={styles.title}>
            {challenge.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            {challenge.description}
          </ThemedText>

          <ThemedView style={styles.button}>
            <PrimaryButton label="Continuar" onPress={onDismiss} />
          </ThemedView>
        </Animated.View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: Spacing.four,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Spacing.four,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.four * 2,
    paddingHorizontal: Spacing.four,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  title: { fontSize: 26, lineHeight: 32, textAlign: 'center' },
  subtitle: { textAlign: 'center', marginTop: Spacing.one },
  button: {
    alignSelf: 'stretch',
    marginTop: Spacing.three,
  },
});

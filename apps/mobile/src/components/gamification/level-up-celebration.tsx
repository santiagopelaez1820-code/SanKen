import { useEffect, useState } from 'react';
import { Animated, Modal, StyleSheet } from 'react-native';
import type { GamificationEventResult } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const CONFETTI_COLORS = ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#ec4899'];
const CONFETTI_COUNT = 12;
// Dispersión radial determinística — evita depender de Math.random() (que el
// linter marca impuro durante el render) para algo puramente decorativo.
const CONFETTI_OFFSETS = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
  const angle = (i / CONFETTI_COUNT) * 2 * Math.PI;
  const radius = 90 + (i % 3) * 20;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
});

interface LevelUpCelebrationProps {
  result: GamificationEventResult | null;
  onDismiss: () => void;
}

export function LevelUpCelebration({ result, onDismiss }: LevelUpCelebrationProps) {
  const theme = useTheme();
  const visible = Boolean(result?.leveled_up);

  // API Animated nativa de RN (no Reanimated/Moti): esas dependencias
  // arrastran una resolución web/SSR que rompe el render de expo-router en
  // este entorno (ver metro/tslib) — Animated no tiene ese riesgo.
  const [cardAnim] = useState(() => new Animated.Value(0));
  const [confettiAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) return;
    cardAnim.setValue(0);
    confettiAnim.setValue(0);
    Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 180 }).start();
    Animated.timing(confettiAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [visible, cardAnim, confettiAnim]);

  if (!visible || !result) return null;

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onDismiss}>
      <ThemedView style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: theme.background, borderColor: theme.backgroundSelected },
            { opacity: cardAnim, transform: [{ scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] },
          ]}>
          {CONFETTI_OFFSETS.map((offset, i) => (
            <Animated.View
              key={i}
              style={[
                styles.confetti,
                { backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length] },
                {
                  opacity: confettiAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                  transform: [
                    { translateX: confettiAnim.interpolate({ inputRange: [0, 1], outputRange: [0, offset.x] }) },
                    { translateY: confettiAnim.interpolate({ inputRange: [0, 1], outputRange: [0, offset.y] }) },
                  ],
                },
              ]}
            />
          ))}

          <ThemedText type="small" themeColor="textSecondary">
            ¡SUBISTE DE NIVEL!
          </ThemedText>
          <ThemedText type="title" themeColor="accent" style={styles.level}>
            Nivel {result.new_level}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            +{result.xp_awarded} XP
          </ThemedText>

          {result.achievements_unlocked.length > 0 && (
            <ThemedView style={styles.achievements}>
              {result.achievements_unlocked.map((achievement) => (
                <ThemedView key={achievement.code} style={[styles.achievementRow, { borderColor: theme.backgroundSelected }]}>
                  <ThemedText type="small">{achievement.name}</ThemedText>
                  <ThemedText type="smallBold" themeColor="accent">
                    +{achievement.xp_bonus} XP
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}

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
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  level: { fontSize: 36, lineHeight: 42 },
  achievements: {
    alignSelf: 'stretch',
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  achievementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: Spacing.three,
  },
});

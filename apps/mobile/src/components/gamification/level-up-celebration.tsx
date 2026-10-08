// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «Animated, Modal, StyleSheet» desde «react-native».
import { Animated, Modal, StyleSheet } from 'react-native';
// Esta línea sirve para importar los tipos «GamificationEventResult» desde «@sanken/core».
import type { GamificationEventResult } from '@sanken/core';

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

// Esta línea sirve para extraer «ONFETTI_COLOR» de «['#f59e0b', '#ef4444', '#3b82f6', '#22c5».
const CONFETTI_COLORS = ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#ec4899'];
// Esta línea sirve para declarar «CONFETTI_COUNT» con el valor «12».
const CONFETTI_COUNT = 12;
// Dispersión radial determinística — evita depender de Math.random() (que el
// linter marca impuro durante el render) para algo puramente decorativo.
// Esta línea sirve para declarar «CONFETTI_OFFSETS» con el valor «Array.from({ length: CONFETTI_COUNT }, (_, i) => {».
const CONFETTI_OFFSETS = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
  // Esta línea sirve para extraer «ngl» de «(i / CONFETTI_COUNT) * 2 * Math.PI».
  const angle = (i / CONFETTI_COUNT) * 2 * Math.PI;
  // Esta línea sirve para extraer «adiu» de «90 + (i % 3) * 20».
  const radius = 90 + (i % 3) * 20;
  // Esta línea sirve para devolver la posición de cada pieza de confeti según su ángulo.
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
});

// Esta línea sirve para declarar la interfaz «LevelUpCelebrationProps».
interface LevelUpCelebrationProps {
  // Esta línea sirve para declarar la propiedad «result» con el valor o tipo «GamificationEventResult | null».
  result: GamificationEventResult | null;
  // Esta línea sirve para declarar la propiedad «onDismiss» con el valor o tipo «() => void».
  onDismiss: () => void;
}

/**
 * Pese al nombre, también cubre "desbloqueaste un logro sin subir de nivel"
 * (ej. el logro de cantidad de entrenamientos o de PRs, cuyo bonus de XP no
 * alcanza para cruzar el próximo nivel) — antes esta celebración solo se
 * mostraba con `leveled_up=true`, así que esos logros quedaban desbloqueados
 * en el backend (con su XP ya otorgado) pero invisibles para el usuario.
 */
// Esta línea sirve para declarar la función «LevelUpCelebration».
export function LevelUpCelebration({ result, onDismiss }: LevelUpCelebrationProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «asAchievement» de «(result?.achievements_unlocked.length ??».
  const hasAchievements = (result?.achievements_unlocked.length ?? 0) > 0;
  // Esta línea sirve para extraer «isibl» de «Boolean(result?.leveled_up || hasAchieve».
  const visible = Boolean(result?.leveled_up || hasAchievements);

  // API Animated nativa de RN (no Reanimated/Moti): esas dependencias
  // arrastran una resolución web/SSR que rompe el render de expo-router en
  // este entorno (ver metro/tslib) — Animated no tiene ese riesgo.
  // Esta línea sirve para extraer «cardAnim» de «useState(() => new Animated.Value(0))».
  const [cardAnim] = useState(() => new Animated.Value(0));
  // Esta línea sirve para extraer «confettiAnim» de «useState(() => new Animated.Value(0))».
  const [confettiAnim] = useState(() => new Animated.Value(0));

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!visible».
    if (!visible) return;
    // Esta línea sirve para llamar a «cardAnim.setValue» con «0».
    cardAnim.setValue(0);
    // Esta línea sirve para llamar a «confettiAnim.setValue» con «0».
    confettiAnim.setValue(0);
    // Esta línea sirve para animar la tarjeta con un resorte.
    Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 180 }).start();
    // Esta línea sirve para animar el confeti durante 800 milisegundos.
    Animated.timing(confettiAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «visible, cardAnim, confettiAnim».
  }, [visible, cardAnim, confettiAnim]);

  // Esta línea sirve para devolver null si «!visible || !result».
  if (!visible || !result) return null;

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
          {/* Esta línea sirve para recorrer «CONFETTI_OFFSETS» y mostrar un bloque por elemento. */}
          {CONFETTI_OFFSETS.map((offset, i) => (
            // Esta línea sirve para abrir cada pieza animada de confeti.
            <Animated.View
              // Esta línea sirve para identificar el elemento de la lista con «i}».
              key={i}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[».
              style={[
                // Esta línea sirve para agregar el estilo «styles.confetti».
                styles.confetti,
                // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «CONFETTI_COLORS[i % CONFETTI_COLORS.leng…».
                { backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length] },
                {
                  // Esta línea sirve para definir «opacity» con «confettiAnim.interpolate({ inputRange: […».
                  opacity: confettiAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                  // Esta línea sirve para declarar la propiedad «transform» con el valor o tipo «[».
                  transform: [
                    // Esta línea sirve para agregar un elemento cuyo «translateX» es «confettiAnim.interpolate({ inputRange: […».
                    { translateX: confettiAnim.interpolate({ inputRange: [0, 1], outputRange: [0, offset.x] }) },
                    // Esta línea sirve para agregar un elemento cuyo «translateY» es «confettiAnim.interpolate({ inputRange: […».
                    { translateY: confettiAnim.interpolate({ inputRange: [0, 1], outputRange: [0, offset.y] }) },
                  ],
                },
              ]}
            />
          ))}

          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar si subió de nivel o desbloqueó un logro. */}
            {result.leveled_up ? '¡SUBISTE DE NIVEL!' : '¡LOGRO DESBLOQUEADO!'}
          </ThemedText>
          {/* Esta línea sirve para elegir entre dos bloques según «result.leveled_up». */}
          {result.leveled_up ? (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="title" themeColor="accent" style={styles.level}>
              {/* Esta línea sirve para mostrar el contenido dinámico «Nivel {result.new_level}». */}
              Nivel {result.new_level}
            </ThemedText>
          // Esta línea sirve para mostrar el bloque alternativo.
          ) : (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="subtitle" themeColor="accent" style={styles.achievementTitle}>
              {/* Esta línea sirve para mostrar el contenido dinámico «{result.achievements_unlocked.length === 1». */}
              {result.achievements_unlocked.length === 1
                // Esta línea sirve para mostrar el nombre del logro si fue uno solo.
                ? result.achievements_unlocked[0].name
                // Esta línea sirve para mostrar la cantidad de logros si fueron varios.
                : `${result.achievements_unlocked.length} logros nuevos`}
            </ThemedText>
          )}
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el contenido dinámico «+{result.xp_awarded} XP». */}
            +{result.xp_awarded} XP
          </ThemedText>

          {/* Esta línea sirve para mostrar el bloque solo si «hasAchievements». */}
          {hasAchievements && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView style={styles.achievements}>
              {/* Esta línea sirve para recorrer «result.achievements_unlocked» y mostrar un bloque por elemento. */}
              {result.achievements_unlocked.map((achievement) => (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView key={achievement.code} style={[styles.achievementRow, { borderColor: theme.backgroundSelected }]}>
                  {/* Esta línea sirve para mostrar el valor «achievement.name» dentro de «ThemedText». */}
                  <ThemedText type="small">{achievement.name}</ThemedText>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="smallBold" themeColor="accent">
                    {/* Esta línea sirve para mostrar el contenido dinámico «+{achievement.xp_bonus} XP». */}
                    +{achievement.xp_bonus} XP
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}

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
    // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «'hidden'».
    overflow: 'hidden',
  },
  // Esta línea sirve para declarar la propiedad «confetti» con el valor o tipo «{».
  confetti: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «'50%'».
    top: '50%',
    // Esta línea sirve para declarar la propiedad «left» con el valor o tipo «'50%'».
    left: '50%',
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «8».
    width: 8,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «8».
    height: 8,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «4».
    borderRadius: 4,
  },
  // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «{ fontSize: 36, lineHeight: 42 }».
  level: { fontSize: 36, lineHeight: 42 },
  // Esta línea sirve para definir el estilo «achievementTitle» con «fontSize: 24, lineHeight: 30, textAlign: 'center' …».
  achievementTitle: { fontSize: 24, lineHeight: 30, textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «achievements» con el valor o tipo «{».
  achievements: {
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'stretch'».
    alignSelf: 'stretch',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.two».
    marginTop: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «achievementRow» con el valor o tipo «{».
  achievementRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.two».
    borderRadius: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.one».
    paddingVertical: Spacing.one,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.two».
    paddingHorizontal: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «button» con el valor o tipo «{».
  button: {
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'stretch'».
    alignSelf: 'stretch',
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.three».
    marginTop: Spacing.three,
  },
});

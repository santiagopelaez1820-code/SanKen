import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TutorialStep } from '@/hooks/use-tutorial';

interface SpotlightOverlayProps {
  visible: boolean;
  steps: TutorialStep[];
  stepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const PADDING = 8;
const CARD_MAX_WIDTH = 320;

/**
 * Motor genérico de "coach marks" (tutorial guiado con recuadro que ilumina
 * un elemento real de la pantalla + tooltip). Recorte del overlay vía
 * react-native-svg Mask (rect blanco de pantalla completa menos un rect
 * negro redondeado en la posición medida del target — el negro "perfora" el
 * mask). Si el paso no tiene `ref` o el elemento no está montado, se
 * muestra como tarjeta centrada sin recorte (pantallas con contenido
 * condicional, ver useTutorial). Modal nativo para garantizar que cubre
 * TODO — incluida la tab bar — sin pelear con el stacking de cada pantalla.
 */
export function SpotlightOverlay({ visible, steps, stepIndex, onNext, onPrev, onSkip }: SpotlightOverlayProps) {
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [rect, setRect] = useState<TargetRect | null>(null);
  const step = steps[stepIndex];

  useEffect(() => {
    if (!visible || !step?.ref?.current) {
      setRect(null);
      return;
    }
    const node = step.ref.current;
    const timer = setTimeout(() => {
      node.measureInWindow((x, y, width, height) => {
        if (width === 0 && height === 0) {
          setRect(null);
          return;
        }
        setRect({
          x: x - PADDING,
          y: y - PADDING,
          width: width + PADDING * 2,
          height: height + PADDING * 2,
        });
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [visible, step, screenWidth, screenHeight]);

  if (!visible || !step) return null;

  const cardWidth = Math.min(CARD_MAX_WIDTH, screenWidth - Spacing.four * 2);

  let cardTop: number;
  if (rect && rect.y + rect.height + 200 < screenHeight) {
    cardTop = rect.y + rect.height + Spacing.three;
  } else if (rect) {
    cardTop = Math.max(Spacing.six, rect.y - 190);
  } else {
    cardTop = screenHeight / 2 - 110;
  }

  let cardLeft = rect ? rect.x + rect.width / 2 - cardWidth / 2 : screenWidth / 2 - cardWidth / 2;
  cardLeft = Math.min(Math.max(Spacing.four, cardLeft), screenWidth - cardWidth - Spacing.four);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onSkip}>
      <View style={StyleSheet.absoluteFill}>
        <Svg width={screenWidth} height={screenHeight} style={StyleSheet.absoluteFill}>
          <Defs>
            <Mask id="spotlight-mask">
              <Rect x={0} y={0} width={screenWidth} height={screenHeight} fill="white" />
              {rect && <Rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx={16} fill="black" />}
            </Mask>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={screenWidth}
            height={screenHeight}
            fill="rgba(3, 7, 12, 0.82)"
            mask="url(#spotlight-mask)"
          />
        </Svg>

        {rect && (
          <View
            pointerEvents="none"
            style={[
              styles.ring,
              { left: rect.x, top: rect.y, width: rect.width, height: rect.height, borderColor: theme.accent },
            ]}
          />
        )}

        <Pressable style={StyleSheet.absoluteFill} onPress={onNext} accessibilityLabel="Continuar tutorial" />

        <View
          style={[
            styles.card,
            { top: cardTop, left: cardLeft, width: cardWidth, backgroundColor: theme.card, borderColor: theme.border },
          ]}>
          <ThemedText type="smallBold">{step.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            {step.description}
          </ThemedText>

          <View style={styles.footer}>
            <View style={styles.dots}>
              {steps.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, { backgroundColor: i === stepIndex ? theme.accent : theme.backgroundSelected }]}
                />
              ))}
            </View>
            <View style={styles.actions}>
              <Pressable onPress={onSkip} hitSlop={8}>
                <ThemedText type="small" themeColor="textSecondary">
                  Saltar
                </ThemedText>
              </Pressable>
              {stepIndex > 0 && (
                <Pressable onPress={onPrev} hitSlop={8}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Atrás
                  </ThemedText>
                </Pressable>
              )}
              <Pressable
                onPress={onNext}
                hitSlop={8}
                style={[styles.nextButton, { backgroundColor: theme.accent }]}>
                <ThemedText type="smallBold" style={styles.nextButtonLabel}>
                  {stepIndex === steps.length - 1 ? 'Entendido' : 'Siguiente'}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 16,
  },
  card: {
    position: 'absolute',
    borderRadius: Spacing.four,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  description: { lineHeight: 18 },
  footer: {
    marginTop: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  dots: { flexDirection: 'row', gap: Spacing.one },
  dot: { width: 6, height: 6, borderRadius: 3 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  nextButton: { borderRadius: Spacing.two, paddingVertical: Spacing.one + 2, paddingHorizontal: Spacing.three },
  nextButtonLabel: { color: '#050505' },
});

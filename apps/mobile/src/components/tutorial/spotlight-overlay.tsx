// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «Modal, Pressable, StyleSheet, View, useWindowDimensions» desde «react-native».
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
// Esta línea sirve para importar «Svg» y «Defs, Mask, Rect» desde «react-native-svg».
import Svg, { Defs, Mask, Rect } from 'react-native-svg';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar los tipos «TutorialStep» desde «@/hooks/use-tutorial».
import type { TutorialStep } from '@/hooks/use-tutorial';

// Esta línea sirve para declarar la interfaz «SpotlightOverlayProps».
interface SpotlightOverlayProps {
  // Esta línea sirve para declarar la propiedad «visible» con el valor o tipo «boolean».
  visible: boolean;
  // Esta línea sirve para declarar la propiedad «steps» con el valor o tipo «TutorialStep[]».
  steps: TutorialStep[];
  // Esta línea sirve para declarar la propiedad «stepIndex» con el valor o tipo «number».
  stepIndex: number;
  // Esta línea sirve para declarar la propiedad «onNext» con el valor o tipo «() => void».
  onNext: () => void;
  // Esta línea sirve para declarar la propiedad «onPrev» con el valor o tipo «() => void».
  onPrev: () => void;
  // Esta línea sirve para declarar la propiedad «onSkip» con el valor o tipo «() => void».
  onSkip: () => void;
}

// Esta línea sirve para declarar la interfaz «TargetRect».
interface TargetRect {
  // Esta línea sirve para declarar la propiedad «x» con el valor o tipo «number».
  x: number;
  // Esta línea sirve para declarar la propiedad «y» con el valor o tipo «number».
  y: number;
  // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «number».
  width: number;
  // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «number».
  height: number;
}

// Esta línea sirve para declarar «PADDING» con el valor «8».
const PADDING = 8;
// Esta línea sirve para declarar «CARD_MAX_WIDTH» con el valor «320».
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
// Esta línea sirve para declarar la función «SpotlightOverlay».
export function SpotlightOverlay({ visible, steps, stepIndex, onNext, onPrev, onSkip }: SpotlightOverlayProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «width: screenWidth, height: screenHeight» con el hook «useWindowDimensions».
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  // Esta línea sirve para crear el estado «rect» y su función «setRect».
  const [rect, setRect] = useState<TargetRect | null>(null);
  // Esta línea sirve para extraer «te» de «steps[stepIndex]».
  const step = steps[stepIndex];

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!visible || !step?.ref?.current».
    if (!visible || !step?.ref?.current) return;
    // Esta línea sirve para extraer «od» de «step.ref.current».
    const node = step.ref.current;
    // Esta línea sirve para extraer «ime» de «setTimeout(() => {».
    const timer = setTimeout(() => {
      // Esta línea sirve para medir la posición y el tamaño del elemento en la ventana.
      node.measureInWindow((x, y, width, height) => {
        // Esta línea sirve para revisar si «width === 0 && height === 0».
        if (width === 0 && height === 0) {
          // Esta línea sirve para guardar en el estado con «setRect» el valor «null)…».
          setRect(null);
          // Esta línea sirve para terminar la función sin devolver nada.
          return;
        }
        // Esta línea sirve para guardar en el estado con «setRect» el valor «{…».
        setRect({
          // Esta línea sirve para declarar la propiedad «x» con el valor o tipo «x - PADDING».
          x: x - PADDING,
          // Esta línea sirve para declarar la propiedad «y» con el valor o tipo «y - PADDING».
          y: y - PADDING,
          // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «width + PADDING * 2».
          width: width + PADDING * 2,
          // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «height + PADDING * 2».
          height: height + PADDING * 2,
        });
      });
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
    }, 80);
    // Esta línea sirve para devolver «() => clearTimeout(timer)».
    return () => clearTimeout(timer);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «visible, step, screenWidth, screenHeight».
  }, [visible, step, screenWidth, screenHeight]);

  // Esta línea sirve para devolver null si «!visible || !step».
  if (!visible || !step) return null;

  // El rect medido queda obsoleto un instante al cambiar de paso (el efecto
  // de arriba todavía no volvió a medir el nuevo target) -- se anula acá
  // en vez de resetear `rect` sincrónicamente en el efecto, así no se ve
  // el recorte/aro del paso anterior mientras el nuevo target todavía no
  // está montado.
  // Esta línea sirve para extraer «ffectiveRec» de «step.ref?.current ? rect : null».
  const effectiveRect = step.ref?.current ? rect : null;

  // Esta línea sirve para extraer «ardWidt» de «Math.min(CARD_MAX_WIDTH, screenWidth - S».
  const cardWidth = Math.min(CARD_MAX_WIDTH, screenWidth - Spacing.four * 2);

  // Esta línea sirve para declarar la variable «cardTop» sin valor inicial.
  let cardTop: number;
  // Esta línea sirve para revisar si la tarjeta cabe debajo del elemento resaltado.
  if (effectiveRect && effectiveRect.y + effectiveRect.height + 200 < screenHeight) {
    // Esta línea sirve para colocar la tarjeta debajo del elemento.
    cardTop = effectiveRect.y + effectiveRect.height + Spacing.three;
  // Esta línea sirve para revisar si «effectiveRect» cuando lo anterior no aplica.
  } else if (effectiveRect) {
    // Esta línea sirve para asignar «Math.max(Spacing.six, effectiveRect.y - 190)» a «cardTop».
    cardTop = Math.max(Spacing.six, effectiveRect.y - 190);
  // Esta línea sirve para ejecutar este bloque en el caso contrario.
  } else {
    // Esta línea sirve para asignar «screenHeight / 2 - 110» a «cardTop».
    cardTop = screenHeight / 2 - 110;
  }

  // Esta línea sirve para extraer «ardLef» de «effectiveRect ? effectiveRect.x + effect».
  let cardLeft = effectiveRect ? effectiveRect.x + effectiveRect.width / 2 - cardWidth / 2 : screenWidth / 2 - cardWidth / 2;
  // Esta línea sirve para limitar la posición horizontal de la tarjeta a los bordes de la pantalla.
  cardLeft = Math.min(Math.max(Spacing.four, cardLeft), screenWidth - cardWidth - Spacing.four);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Modal».
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onSkip}>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={StyleSheet.absoluteFill}>
        {/* Esta línea sirve para abrir el componente «Svg». */}
        <Svg width={screenWidth} height={screenHeight} style={StyleSheet.absoluteFill}>
          {/* Esta línea sirve para abrir el componente «Defs». */}
          <Defs>
            {/* Esta línea sirve para abrir el componente «Mask». */}
            <Mask id="spotlight-mask">
              {/* Esta línea sirve para abrir el componente «Rect». */}
              <Rect x={0} y={0} width={screenWidth} height={screenHeight} fill="white" />
              {/* Esta línea sirve para mostrar el bloque solo si «effectiveRect». */}
              {effectiveRect && (
                // Esta línea sirve para abrir el componente «Rect».
                <Rect x={effectiveRect.x} y={effectiveRect.y} width={effectiveRect.width} height={effectiveRect.height} rx={16} fill="black" />
              )}
            </Mask>
          </Defs>
          {/* Esta línea sirve para abrir el elemento «Rect» con sus atributos en varias líneas. */}
          <Rect
            // Esta línea sirve para pasar la propiedad «x» con el valor «0}».
            x={0}
            // Esta línea sirve para pasar la propiedad «y» con el valor «0}».
            y={0}
            // Esta línea sirve para pasar la propiedad «width» con el valor «screenWidth}».
            width={screenWidth}
            // Esta línea sirve para pasar la propiedad «height» con el valor «screenHeight}».
            height={screenHeight}
            // Esta línea sirve para definir el atributo «fill» con el valor «rgba(3, 7, 12, 0.82)».
            fill="rgba(3, 7, 12, 0.82)"
            // Esta línea sirve para definir el atributo «mask» con el valor «url(#spotlight-mask)».
            mask="url(#spotlight-mask)"
          />
        </Svg>

        {/* Esta línea sirve para mostrar el bloque solo si «effectiveRect». */}
        {effectiveRect && (
          // Esta línea sirve para abrir el elemento «View» con sus atributos en varias líneas.
          <View
            // Esta línea sirve para definir el atributo «pointerEvents» con el valor «none».
            pointerEvents="none"
            // Esta línea sirve para pasar la propiedad «style» con el valor «[».
            style={[
              // Esta línea sirve para agregar el estilo «styles.ring».
              styles.ring,
              // Esta línea sirve para agregar un elemento cuyo «left» es «effectiveRect.x, top: effectiveRect.y, w…».
              { left: effectiveRect.x, top: effectiveRect.y, width: effectiveRect.width, height: effectiveRect.height, borderColor: theme.accent },
            ]}
          />
        )}

        {/* Esta línea sirve para abrir el componente «Pressable». */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onNext} accessibilityLabel="Continuar tutorial" />

        {/* Esta línea sirve para abrir el elemento «View» con sus atributos en varias líneas. */}
        <View
          // Esta línea sirve para pasar la propiedad «style» con el valor «[».
          style={[
            // Esta línea sirve para agregar el estilo «styles.card».
            styles.card,
            // Esta línea sirve para agregar un elemento cuyo «top» es «cardTop, left: cardLeft, width: cardWidt…».
            { top: cardTop, left: cardLeft, width: cardWidth, backgroundColor: theme.card, borderColor: theme.border },
          ]}>
          {/* Esta línea sirve para mostrar el valor «step.title» dentro de «ThemedText». */}
          <ThemedText type="smallBold">{step.title}</ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            {/* Esta línea sirve para mostrar el valor «step.description». */}
            {step.description}
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.footer}>
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.dots}>
              {/* Esta línea sirve para recorrer «steps» y mostrar un bloque por elemento. */}
              {steps.map((_, i) => (
                // Esta línea sirve para abrir el elemento «View» con sus atributos en varias líneas.
                <View
                  // Esta línea sirve para identificar el elemento de la lista con «i}».
                  key={i}
                  // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.dot, { backgroundColor: i === stepInd».
                  style={[styles.dot, { backgroundColor: i === stepIndex ? theme.accent : theme.backgroundSelected }]}
                />
              ))}
            </View>
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.actions}>
              {/* Esta línea sirve para abrir el componente «Pressable». */}
              <Pressable onPress={onSkip} hitSlop={8}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «Saltar». */}
                  Saltar
                </ThemedText>
              </Pressable>
              {/* Esta línea sirve para mostrar el bloque solo si «stepIndex > 0». */}
              {stepIndex > 0 && (
                // Esta línea sirve para abrir el componente «Pressable».
                <Pressable onPress={onPrev} hitSlop={8}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el texto «Atrás». */}
                    Atrás
                  </ThemedText>
                </Pressable>
              )}
              {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
              <Pressable
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={onNext}
                // Esta línea sirve para pasar la propiedad «hitSlop» con el valor «8}».
                hitSlop={8}
                // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.nextButton, { backgroundColor: theme.».
                style={[styles.nextButton, { backgroundColor: theme.accent }]}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold" style={styles.nextButtonLabel}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{stepIndex === steps.length - 1 ? 'Entendido' : 'Siguiente'}». */}
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

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «ring» con el valor o tipo «{».
  ring: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «2».
    borderWidth: 2,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «16».
    borderRadius: 16,
  },
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «{ lineHeight: 18 }».
  description: { lineHeight: 18 },
  // Esta línea sirve para declarar la propiedad «footer» con el valor o tipo «{».
  footer: {
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.two».
    marginTop: Spacing.two,
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «dots» con el valor o tipo «{ flexDirection: 'row', gap: Spacing.one }».
  dots: { flexDirection: 'row', gap: Spacing.one },
  // Esta línea sirve para declarar la propiedad «dot» con el valor o tipo «{ width: 6, height: 6, borderRadius: 3 }».
  dot: { width: 6, height: 6, borderRadius: 3 },
  // Esta línea sirve para definir el estilo «actions» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  actions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  // Esta línea sirve para definir el estilo «nextButton» con «borderRadius: Spacing.two, paddingVertical: Spacin…».
  nextButton: { borderRadius: Spacing.two, paddingVertical: Spacing.one + 2, paddingHorizontal: Spacing.three },
  // Esta línea sirve para declarar la propiedad «nextButtonLabel» con el valor o tipo «{ color: '#050505' }».
  nextButtonLabel: { color: '#050505' },
});

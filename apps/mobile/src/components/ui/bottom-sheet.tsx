// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «Modal, Pressable, StyleSheet, useWindowDimensions» desde «react-native».
import { Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «Gesture, GestureDetector, GestureHandlerRootView» desde «react-native-gesture-handler».
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
// Esta línea sirve para abrir la importación de utilidades de animación de Reanimated.
import Animated, {
  // Esta línea sirve para incluir el valor «runOnJS» en la lista.
  runOnJS,
  // Esta línea sirve para incluir el valor «useAnimatedStyle» en la lista.
  useAnimatedStyle,
  // Esta línea sirve para incluir el valor «useSharedValue» en la lista.
  useSharedValue,
  // Esta línea sirve para incluir el valor «withSpring» en la lista.
  withSpring,
// Esta línea sirve para terminar la importación desde «react-native-reanimated».
} from 'react-native-reanimated';

// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «BottomSheetProps».
interface BottomSheetProps {
  // Esta línea sirve para declarar la propiedad «visible» con el valor o tipo «boolean».
  visible: boolean;
  // Esta línea sirve para declarar la propiedad «onClose» con el valor o tipo «() => void».
  onClose: () => void;
  // Esta línea sirve para declarar la propiedad «children» con el valor o tipo «React.ReactNode».
  children: React.ReactNode;
}

// Esta línea sirve para declarar «DISMISS_THRESHOLD» con el valor «120».
const DISMISS_THRESHOLD = 120;
// Esta línea sirve para declarar «SHEET_SPRING» con el valor «{ damping: 26, stiffness: 280, mass: 0.9 }».
const SHEET_SPRING = { damping: 26, stiffness: 280, mass: 0.9 };

// Esta línea sirve para declarar la función «BottomSheet».
export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «height» con el hook «useWindowDimensions».
  const { height } = useWindowDimensions();
  // Esta línea sirve para obtener «translateY» con el hook «useSharedValue».
  const translateY = useSharedValue(height);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para asignar «withSpring(visible ? 0 : height, SHEET_SPRING)» a «translateY.value».
    translateY.value = withSpring(visible ? 0 : height, SHEET_SPRING);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «visible, height, translateY».
  }, [visible, height, translateY]);

  // Esta línea sirve para extraer «a» de «Gesture.Pan()».
  const pan = Gesture.Pan()
    // Esta línea sirve para encadenar la operación «onUpdate».
    .onUpdate((e) => {
      // Esta línea sirve para mover el panel solo cuando se arrastra hacia abajo.
      // eslint-disable-next-line react-hooks/immutability -- mutar .value es la API real de Reanimated para shared values, no un valor de React state
      if (e.translationY > 0) translateY.value = e.translationY;
    })
    // Esta línea sirve para encadenar la operación «onEnd».
    .onEnd((e) => {
      // Esta línea sirve para revisar si «e.translationY > DISMISS_THRESHOLD».
      if (e.translationY > DISMISS_THRESHOLD) {
        // Esta línea sirve para asignar «withSpring(height, SHEET_SPRING, (finished) => {» a «translateY.value».
        // eslint-disable-next-line react-hooks/immutability -- mutar .value es la API real de Reanimated para shared values, no un valor de React state
        translateY.value = withSpring(height, SHEET_SPRING, (finished) => {
          // Esta línea sirve para llamar a «runOnJS» si «finished».
          if (finished) runOnJS(onClose)();
        });
      // Esta línea sirve para ejecutar este bloque en el caso contrario.
      } else {
        // Esta línea sirve para asignar «withSpring(0, SHEET_SPRING)» a «translateY.value».
        translateY.value = withSpring(0, SHEET_SPRING);
      }
    });

  // Esta línea sirve para obtener «sheetStyle» con el hook «useAnimatedStyle».
  const sheetStyle = useAnimatedStyle(() => ({
    // Esta línea sirve para declarar la propiedad «transform» con el valor o tipo «[{ translateY: translateY.value }]».
    transform: [{ translateY: translateY.value }],
  }));

  // Esta línea sirve para devolver null si «!visible».
  if (!visible) return null;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Modal».
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      {/* Esta línea sirve para abrir el componente «GestureHandlerRootView». */}
      <GestureHandlerRootView style={styles.root}>
        {/* Esta línea sirve para abrir el componente «Pressable». */}
        <Pressable style={styles.backdrop} onPress={onClose} />
        {/* Esta línea sirve para abrir el componente «GestureDetector». */}
        <GestureDetector gesture={pan}>
          {/* Esta línea sirve para abrir el panel animado de la hoja inferior. */}
          <Animated.View
            // Esta línea sirve para pasar la propiedad «style» con el valor «[».
            style={[
              // Esta línea sirve para agregar el estilo «styles.sheet».
              styles.sheet,
              // Esta línea sirve para incluir el valor «sheetStyle» en la lista.
              sheetStyle,
              // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «theme.background, borderColor: theme.bor…».
              { backgroundColor: theme.background, borderColor: theme.border },
            ]}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={[styles.handle, { backgroundColor: theme.backgroundSelected }]} />
            {/* Esta línea sirve para mostrar el valor «children» dentro de «SafeAreaView». */}
            <SafeAreaView edges={['bottom']}>{children}</SafeAreaView>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{».
  root: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
  },
  // Esta línea sirve para declarar la propiedad «backdrop» con el valor o tipo «{».
  backdrop: {
    // Esta línea sirve para copiar las propiedades de «StyleSheet».
    ...StyleSheet.absoluteFill,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'rgba(0,0,0,0.55)'».
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  // Esta línea sirve para declarar la propiedad «sheet» con el valor o tipo «{».
  sheet: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «left» con el valor o tipo «0».
    left: 0,
    // Esta línea sirve para declarar la propiedad «right» con el valor o tipo «0».
    right: 0,
    // Esta línea sirve para declarar la propiedad «bottom» con el valor o tipo «0».
    bottom: 0,
    // Esta línea sirve para declarar la propiedad «borderTopWidth» con el valor o tipo «1».
    borderTopWidth: 1,
    // Esta línea sirve para declarar la propiedad «borderTopLeftRadius» con el valor o tipo «Spacing.four».
    borderTopLeftRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «borderTopRightRadius» con el valor o tipo «Spacing.four».
    borderTopRightRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.two».
    paddingTop: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «handle» con el valor o tipo «{».
  handle: {
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'center'».
    alignSelf: 'center',
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «36».
    width: 36,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «4».
    height: 4,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «2».
    borderRadius: 2,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.two».
    marginBottom: Spacing.two,
  },
});

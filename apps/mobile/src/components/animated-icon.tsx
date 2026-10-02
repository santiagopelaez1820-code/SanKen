import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandIntro } from '@/components/brand-intro';

/**
 * Segunda etapa de la apertura (la primera es el splash nativo de
 * expo-splash-screen). Se monta en el layout raíz recién cuando la sesión
 * terminó de hidratarse, por encima del Stack — que ya está renderizando
 * Login o Inicio debajo —, así que al terminar la intro no navega a ningún
 * lado: solo se desmonta y deja ver la pantalla que corresponde.
 *
 * El primer frame de BrandIntro es idéntico al splash nativo (mismo fondo,
 * logo, tamaño y posición): recién después de que ese frame está en
 * pantalla (onLayout) se oculta el splash nativo y arranca la animación,
 * para que las dos etapas se sientan una sola.
 */
export function AnimatedSplashOverlay() {
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [laidOut, setLaidOut] = useState(false);

  useEffect(() => {
    if (!laidOut) return;
    let cancelled = false;
    const start = () => {
      if (!cancelled) setStarted(true);
    };
    SplashScreen.hideAsync().catch(() => {}).finally(start);
    // Si hideAsync nunca resolviera, la intro arranca igual: nunca un splash infinito.
    const fallback = setTimeout(start, 1200);
    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, [laidOut]);

  if (!visible) return null;

  return (
    <View style={styles.overlay} onLayout={() => setLaidOut(true)}>
      <BrandIntro started={started} onFinish={() => setVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, zIndex: 1000 },
});

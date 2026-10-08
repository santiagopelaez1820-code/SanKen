// Esta línea sirve para importar todo el módulo como «SplashScreen» desde «expo-splash-screen».
import * as SplashScreen from 'expo-splash-screen';
// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «StyleSheet, View» desde «react-native».
import { StyleSheet, View } from 'react-native';

// Esta línea sirve para importar «BrandIntro» desde «@/components/brand-intro».
import { BrandIntro } from '@/components/brand-intro';

/**
 * Segunda etapa de la apertura (la primera es el splash nativo de
 * expo-splash-screen). Se monta en el layout raíz recién cuando la sesión
 * terminó de hidratarse, por encima del Stack — que ya está renderizando
 * Login o Inicio debajo —, así que al terminar la intro no navega a ningún
 * lado: solo se desmonta y deja ver la pantalla que corresponde.
 *
 * El splash nativo es solo el color de fondo (sin logo) y el primer frame de
 * BrandIntro también: recién después de que ese frame está en pantalla
 * (onLayout) se oculta el splash nativo y arranca la animación, así lo
 * primero que se ve es el logo dibujándose, nunca un logo estático.
 */
// Esta línea sirve para declarar la función «AnimatedSplashOverlay».
export function AnimatedSplashOverlay() {
  // Esta línea sirve para crear el estado «started» y su función «setStarted».
  const [started, setStarted] = useState(false);
  // Esta línea sirve para crear el estado «visible» y su función «setVisible».
  const [visible, setVisible] = useState(true);
  // Esta línea sirve para crear el estado «laidOut» y su función «setLaidOut».
  const [laidOut, setLaidOut] = useState(false);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!laidOut».
    if (!laidOut) return;
    // Esta línea sirve para extraer «ancelle» de «false».
    let cancelled = false;
    // Esta línea sirve para extraer «tar» de «() => {».
    const start = () => {
      // Esta línea sirve para llamar a «setStarted» si «!cancelled».
      if (!cancelled) setStarted(true);
    };
    // Esta línea sirve para llamar a «SplashScreen.hideAsync» con «).catch(() => {}).finally(start».
    SplashScreen.hideAsync().catch(() => {}).finally(start);
    // Si hideAsync nunca resolviera, la intro arranca igual: nunca un splash infinito.
    // Esta línea sirve para extraer «allbac» de «setTimeout(start, 1200)».
    const fallback = setTimeout(start, 1200);
    // Esta línea sirve para devolver «() => {».
    return () => {
      // Esta línea sirve para asignar «true» a «cancelled».
      cancelled = true;
      // Esta línea sirve para llamar a «clearTimeout» con «fallback».
      clearTimeout(fallback);
    };
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «laidOut».
  }, [laidOut]);

  // Esta línea sirve para devolver null si «!visible».
  if (!visible) return null;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View» con sus propiedades.
    <View style={styles.overlay} onLayout={() => setLaidOut(true)}>
      {/* Esta línea sirve para mostrar el componente «BrandIntro». */}
      <BrandIntro started={started} onFinish={() => setVisible(false)} />
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «overlay» con el valor o tipo «{ ...StyleSheet.absoluteFill, zIndex: 1000 }».
  overlay: { ...StyleSheet.absoluteFill, zIndex: 1000 },
});

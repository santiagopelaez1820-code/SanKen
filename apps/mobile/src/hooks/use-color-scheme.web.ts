// Esta línea sirve para importar «useSyncExternalStore» desde «react».
import { useSyncExternalStore } from 'react';
// Esta línea sirve para importar «useColorScheme as useRNColorScheme» desde «react-native».
import { useColorScheme as useRNColorScheme } from 'react-native';

// Esta línea sirve para declarar «noopSubscribe» con el valor «() => () => {}».
const noopSubscribe = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the
 * client side for web. useSyncExternalStore con getServerSnapshot es el
 * reemplazo que React recomienda para esto: devuelve 'light' durante la
 * pasada de hidratación estática y recién después el valor real, sin el
 * viejo truco de useState+useEffect para detectar "ya hidraté" (que dispara
 * react-hooks/set-state-in-effect).
 */
// Esta línea sirve para declarar la función «useColorScheme».
export function useColorScheme() {
  // Esta línea sirve para extraer «olorSchem» de «useRNColorScheme()».
  const colorScheme = useRNColorScheme();
  // Esta línea sirve para devolver «useSyncExternalStore(».
  return useSyncExternalStore(
    // Esta línea sirve para incluir el valor «noopSubscribe» en la lista.
    noopSubscribe,
    // Esta línea sirve para devolver el esquema de color calculado en el cliente.
    () => colorScheme,
    // Esta línea sirve para devolver el esquema claro durante el renderizado en el servidor.
    () => 'light'
  );
}

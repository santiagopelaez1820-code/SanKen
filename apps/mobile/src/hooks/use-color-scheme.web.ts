import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const noopSubscribe = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the
 * client side for web. useSyncExternalStore con getServerSnapshot es el
 * reemplazo que React recomienda para esto: devuelve 'light' durante la
 * pasada de hidratación estática y recién después el valor real, sin el
 * viejo truco de useState+useEffect para detectar "ya hidraté" (que dispara
 * react-hooks/set-state-in-effect).
 */
export function useColorScheme() {
  const colorScheme = useRNColorScheme();
  return useSyncExternalStore(
    noopSubscribe,
    () => colorScheme,
    () => 'light'
  );
}

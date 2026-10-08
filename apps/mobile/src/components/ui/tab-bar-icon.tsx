// Esta línea sirve para importar «Icon, type LucideIcon» desde «./icon».
import { Icon, type LucideIcon } from './icon';

// Esta línea sirve para declarar la interfaz «TabBarIconProps».
interface TabBarIconProps {
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «LucideIcon».
  icon: LucideIcon;
  // Esta línea sirve para declarar la propiedad «focused» con el valor o tipo «boolean».
  focused: boolean;
  // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «string».
  color: string;
  // Esta línea sirve para declarar la propiedad «size» con el valor o tipo «number».
  size?: number;
}

/**
 * Trazo más grueso cuando el tab está activo -- mismo ícono, sin depender de
 * variantes filled/outline que no todos los íconos de lucide tienen.
 */
// Esta línea sirve para declarar la función «TabBarIcon».
export function TabBarIcon({ icon, focused, color, size = 22 }: TabBarIconProps) {
  // Esta línea sirve para devolver el ícono con el grosor mayor si la pestaña está activa.
  return <Icon icon={icon} size={size} color={color} strokeWidth={focused ? 2.4 : 1.8} />;
}

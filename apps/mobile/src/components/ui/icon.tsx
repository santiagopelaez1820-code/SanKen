// Esta línea sirve para importar los tipos «LucideIcon as LucideIconType» desde «lucide-react-native».
import type { LucideIcon as LucideIconType } from 'lucide-react-native';

// Esta línea sirve para declarar el tipo «LucideIcon» como «LucideIconType».
export type LucideIcon = LucideIconType;

// Esta línea sirve para declarar la interfaz «IconProps».
interface IconProps {
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «LucideIcon».
  icon: LucideIcon;
  // Esta línea sirve para declarar la propiedad «size» con el valor o tipo «number».
  size?: number;
  // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «string».
  color: string;
  // Esta línea sirve para declarar la propiedad «strokeWidth» con el valor o tipo «number».
  strokeWidth?: number;
}

/**
 * Wrapper delgado sobre lucide-react-native — un solo lugar que importa la
 * librería, para poder centralizar tamaño/stroke por defecto o cambiarla en
 * el futuro sin tocar cada pantalla.
 */
// Esta línea sirve para declarar la función «Icon».
export function Icon({ icon: IconComponent, size = 20, color, strokeWidth = 2 }: IconProps) {
  // Esta línea sirve para devolver el ícono con el tamaño, el color y el grosor indicados.
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} />;
}

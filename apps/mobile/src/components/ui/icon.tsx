import type { LucideIcon as LucideIconType } from 'lucide-react-native';

export type LucideIcon = LucideIconType;

interface IconProps {
  icon: LucideIcon;
  size?: number;
  color: string;
  strokeWidth?: number;
}

/**
 * Wrapper delgado sobre lucide-react-native — un solo lugar que importa la
 * librería, para poder centralizar tamaño/stroke por defecto o cambiarla en
 * el futuro sin tocar cada pantalla.
 */
export function Icon({ icon: IconComponent, size = 20, color, strokeWidth = 2 }: IconProps) {
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} />;
}

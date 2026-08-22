import { Icon, type LucideIcon } from './icon';

interface TabBarIconProps {
  icon: LucideIcon;
  focused: boolean;
  color: string;
  size?: number;
}

/**
 * Trazo más grueso cuando el tab está activo -- mismo ícono, sin depender de
 * variantes filled/outline que no todos los íconos de lucide tienen.
 */
export function TabBarIcon({ icon, focused, color, size = 24 }: TabBarIconProps) {
  return <Icon icon={icon} size={size} color={color} strokeWidth={focused ? 2.4 : 1.8} />;
}

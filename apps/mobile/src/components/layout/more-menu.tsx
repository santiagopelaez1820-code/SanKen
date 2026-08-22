import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import {
  Apple,
  Bell,
  CalendarDays,
  Flag,
  LogOut,
  MessageCircle,
  Settings,
  Shield,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';

interface MoreMenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

interface MoreMenuProps {
  visible: boolean;
  onClose: () => void;
  unreadFeedCount: number;
}

export function MoreMenu({ visible, onClose, unreadFeedCount }: MoreMenuProps) {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const items: MoreMenuItem[] = [
    user?.role === 'trainer'
      ? { label: 'Mis clientes', icon: Users, path: '/trainer' }
      : { label: 'Mi entrenador', icon: User, path: '/mi-entrenador' },
    { label: 'Chat', icon: MessageCircle, path: '/chat' },
    { label: 'Novedades', icon: Bell, path: '/novedades', badge: unreadFeedCount },
    { label: 'Retos', icon: Flag, path: '/retos' },
    { label: 'Calendario', icon: CalendarDays, path: '/calendario' },
    { label: 'Nutrición', icon: Apple, path: '/nutricion' },
    ...(user?.role === 'super_admin' ? [{ label: 'Super Admin', icon: Shield, path: '/admin' }] : []),
  ];

  const go = (path: string) => {
    onClose();
    router.push(path as never);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ThemedView style={styles.list}>
        {items.map((item) => (
          <Pressable key={item.path} onPress={() => go(item.path)} style={styles.row}>
            <Icon icon={item.icon} size={20} color={theme.text} />
            <ThemedText type="default" style={styles.label}>
              {item.label}
            </ThemedText>
            {!!item.badge && (
              <ThemedView style={[styles.badge, { backgroundColor: theme.accent }]}>
                <ThemedText type="small" style={styles.badgeText}>
                  {item.badge > 9 ? '9+' : item.badge}
                </ThemedText>
              </ThemedView>
            )}
          </Pressable>
        ))}

        <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />

        <Pressable
          onPress={() => {
            onClose();
            router.push('/settings');
          }}
          style={styles.row}>
          <Icon icon={Settings} size={20} color={theme.text} />
          <ThemedText type="default" style={styles.label}>
            Configuración
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => {
            onClose();
            logout();
          }}
          style={styles.row}>
          <Icon icon={LogOut} size={20} color={theme.textSecondary} />
          <ThemedText type="default" themeColor="textSecondary" style={styles.label}>
            Cerrar sesión
          </ThemedText>
        </Pressable>
      </ThemedView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.half,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  label: {
    flex: 1,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#050505',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.two,
  },
});

import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  Apple,
  Bell,
  CalendarDays,
  ChevronRight,
  Dumbbell,
  History,
  LogOut,
  MessageCircle,
  Ruler,
  Settings,
  Shield,
  Trophy,
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

function MenuTile({ item, onPress }: { item: MoreMenuItem; onPress: () => void }) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={[styles.tile, { backgroundColor: theme.backgroundElement }]}>
      <Icon icon={item.icon} size={24} color={theme.text} />
      <ThemedText type="small" style={styles.tileLabel} numberOfLines={1}>
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
  );
}

function MenuRow({ item, onPress }: { item: MoreMenuItem; onPress: () => void }) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={[styles.wideRow, { backgroundColor: theme.backgroundElement }]}>
      <Icon icon={item.icon} size={20} color={theme.text} />
      <ThemedText type="default" style={styles.wideRowLabel}>
        {item.label}
      </ThemedText>
      <Icon icon={ChevronRight} size={18} color={theme.textSecondary} />
    </Pressable>
  );
}

function GroupLabel({ children }: { children: string }) {
  return (
    <ThemedText type="small" themeColor="textSecondary" style={styles.groupLabel}>
      {children}
    </ThemedText>
  );
}

export function MoreMenu({ visible, onClose, unreadFeedCount }: MoreMenuProps) {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  /**
   * El botón central de la tab bar pasó a ser el acceso a la tienda (ver
   * app-tabs.tsx) — "Comenzar entrenamiento" se reubicó acá para que siga
   * alcanzable en 1-2 taps desde cualquier pestaña. Sigue existiendo además
   * como CTA principal dentro de la card de hoy en Home.
   */
  const entrenamientoItems: MoreMenuItem[] = [{ label: 'Comenzar entrenamiento', icon: Dumbbell, path: '/workout/precheck' }];

  const socialItems: MoreMenuItem[] = [
    user?.role === 'trainer'
      ? { label: 'Mis clientes', icon: Users, path: '/trainer' }
      : { label: 'Mi entrenador', icon: User, path: '/mi-entrenador' },
    { label: 'Chat', icon: MessageCircle, path: '/chat' },
    { label: 'Novedades', icon: Bell, path: '/novedades', badge: unreadFeedCount },
  ];

  const organizacionItems: MoreMenuItem[] = [
    { label: 'Calendario', icon: CalendarDays, path: '/calendario' },
    { label: 'Nutrición', icon: Apple, path: '/nutricion' },
  ];

  const seguimientoItems: MoreMenuItem[] = [
    { label: 'Historial', icon: History, path: '/history' },
    { label: 'PR', icon: Trophy, path: '/prs' },
    { label: 'Medidas corporales', icon: Ruler, path: '/measurements' },
  ];
  const adminItem: MoreMenuItem | null =
    user?.role === 'super_admin' ? { label: 'Super Admin', icon: Shield, path: '/admin' } : null;

  const go = (path: string) => {
    onClose();
    router.push(path as never);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ThemedView style={styles.container}>
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.title}>
          MÁS
        </ThemedText>

        <GroupLabel>ENTRENAMIENTO</GroupLabel>
        <View style={styles.grid}>
          {entrenamientoItems.map((item) => (
            <MenuTile key={item.path} item={item} onPress={() => go(item.path)} />
          ))}
        </View>

        <GroupLabel>SOCIAL</GroupLabel>
        <View style={styles.grid}>
          {socialItems.map((item) => (
            <MenuTile key={item.path} item={item} onPress={() => go(item.path)} />
          ))}
        </View>

        <GroupLabel>ORGANIZACIÓN</GroupLabel>
        <View style={styles.grid}>
          {organizacionItems.map((item) => (
            <MenuTile key={item.path} item={item} onPress={() => go(item.path)} />
          ))}
        </View>

        <GroupLabel>SEGUIMIENTO</GroupLabel>
        <View style={styles.grid}>
          {seguimientoItems.map((item) => (
            <MenuTile key={item.path} item={item} onPress={() => go(item.path)} />
          ))}
        </View>

        {adminItem && (
          <>
            <GroupLabel>ADMINISTRACIÓN</GroupLabel>
            <MenuRow item={adminItem} onPress={() => go(adminItem.path)} />
          </>
        )}

        <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />

        <Pressable
          onPress={() => {
            onClose();
            router.push('/settings');
          }}
          style={styles.accountRow}>
          <Icon icon={Settings} size={20} color={theme.text} />
          <ThemedText type="default" style={styles.accountRowLabel}>
            Configuración
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => {
            onClose();
            logout();
          }}
          style={styles.accountRow}>
          <Icon icon={LogOut} size={20} color={theme.textSecondary} />
          <ThemedText type="default" themeColor="textSecondary" style={styles.accountRowLabel}>
            Cerrar sesión
          </ThemedText>
        </Pressable>
      </ThemedView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  groupLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.two,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tile: {
    flexBasis: '31%',
    flexGrow: 1,
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
  },
  tileLabel: {
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: Spacing.one,
    right: Spacing.one,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#050505',
    fontWeight: '700',
    fontSize: 10,
  },
  wideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  wideRowLabel: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.two,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  accountRowLabel: {
    flex: 1,
  },
});

// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, StyleSheet, View» desde «react-native».
import { Pressable, StyleSheet, View } from 'react-native';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «Apple» en la lista.
  Apple,
  // Esta línea sirve para incluir el valor «Bell» en la lista.
  Bell,
  // Esta línea sirve para incluir el valor «CalendarDays» en la lista.
  CalendarDays,
  // Esta línea sirve para incluir el valor «ChevronRight» en la lista.
  ChevronRight,
  // Esta línea sirve para incluir el valor «Dumbbell» en la lista.
  Dumbbell,
  // Esta línea sirve para incluir el valor «Flag» en la lista.
  Flag,
  // Esta línea sirve para incluir el valor «History» en la lista.
  History,
  // Esta línea sirve para incluir el valor «LifeBuoy» en la lista.
  LifeBuoy,
  // Esta línea sirve para incluir el valor «LogOut» en la lista.
  LogOut,
  // Esta línea sirve para incluir el valor «MessageCircle» en la lista.
  MessageCircle,
  // Esta línea sirve para incluir el valor «Ruler» en la lista.
  Ruler,
  // Esta línea sirve para incluir el valor «Settings» en la lista.
  Settings,
  // Esta línea sirve para incluir el valor «Shield» en la lista.
  Shield,
  // Esta línea sirve para incluir el valor «User» en la lista.
  User,
  // Esta línea sirve para incluir el valor «Users» en la lista.
  Users,
  // Esta línea sirve para importar el tipo «LucideIcon».
  type LucideIcon,
// Esta línea sirve para terminar la importación desde «lucide-react-native».
} from 'lucide-react-native';
// Esta línea sirve para importar «SUPPORT_STRINGS» desde «@sanken/core».
import { SUPPORT_STRINGS } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «BottomSheet» desde «@/components/ui/bottom-sheet».
import { BottomSheet } from '@/components/ui/bottom-sheet';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

// Esta línea sirve para declarar la interfaz «MoreMenuItem».
interface MoreMenuItem {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «LucideIcon».
  icon: LucideIcon;
  // Esta línea sirve para declarar la propiedad «path» con el valor o tipo «string».
  path: string;
  // Esta línea sirve para declarar la propiedad «badge» con el valor o tipo «number».
  badge?: number;
}

// Esta línea sirve para declarar la interfaz «MoreMenuProps».
interface MoreMenuProps {
  // Esta línea sirve para declarar la propiedad «visible» con el valor o tipo «boolean».
  visible: boolean;
  // Esta línea sirve para declarar la propiedad «onClose» con el valor o tipo «() => void».
  onClose: () => void;
  // Esta línea sirve para declarar la propiedad «unreadFeedCount» con el valor o tipo «number».
  unreadFeedCount: number;
}

// Esta línea sirve para declarar la función «MenuTile».
function MenuTile({ item, onPress }: { item: MoreMenuItem; onPress: () => void }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Pressable».
    <Pressable onPress={onPress} style={[styles.tile, { backgroundColor: theme.backgroundElement }]}>
      {/* Esta línea sirve para abrir el componente «Icon». */}
      <Icon icon={item.icon} size={20} color={theme.text} />
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" style={styles.tileLabel} numberOfLines={1}>
        {/* Esta línea sirve para mostrar el valor «item.label». */}
        {item.label}
      </ThemedText>
      {/* Esta línea sirve para mostrar el bloque solo si «!!item.badge». */}
      {!!item.badge && (
        // Esta línea sirve para abrir el componente «ThemedView».
        <ThemedView style={[styles.badge, { backgroundColor: theme.accent }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" style={styles.badgeText}>
            {/* Esta línea sirve para mostrar el contador con tope en 9+. */}
            {item.badge > 9 ? '9+' : item.badge}
          </ThemedText>
        </ThemedView>
      )}
    </Pressable>
  );
}

// Esta línea sirve para declarar la función «MenuRow».
function MenuRow({ item, onPress }: { item: MoreMenuItem; onPress: () => void }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Pressable».
    <Pressable onPress={onPress} style={[styles.wideRow, { backgroundColor: theme.backgroundElement }]}>
      {/* Esta línea sirve para abrir el componente «Icon». */}
      <Icon icon={item.icon} size={20} color={theme.text} />
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="default" style={styles.wideRowLabel}>
        {/* Esta línea sirve para mostrar el valor «item.label». */}
        {item.label}
      </ThemedText>
      {/* Esta línea sirve para abrir el componente «Icon». */}
      <Icon icon={ChevronRight} size={18} color={theme.textSecondary} />
    </Pressable>
  );
}

// Esta línea sirve para declarar la función «GroupLabel».
function GroupLabel({ children }: { children: string }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedText».
    <ThemedText type="small" themeColor="textSecondary" style={styles.groupLabel}>
      {/* Esta línea sirve para mostrar el valor «children». */}
      {children}
    </ThemedText>
  );
}

// Esta línea sirve para declarar la función «MoreMenu».
export function MoreMenu({ visible, onClose, unreadFeedCount }: MoreMenuProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «logout» con el hook «useAuthStore».
  const logout = useAuthStore((s) => s.logout);

  /**
   * El botón central de la tab bar pasó a ser el acceso a la tienda (ver
   * app-tabs.tsx) — "Comenzar entrenamiento" se reubicó acá para que siga
   * alcanzable en 1-2 taps desde cualquier pestaña. Sigue existiendo además
   * como CTA principal dentro de la card de hoy en Home.
   */
  // Esta línea sirve para extraer «ntrenamientoItems: MoreMenuItem[» de «[{ label: 'Comenzar entrenamiento', icon».
  const entrenamientoItems: MoreMenuItem[] = [{ label: 'Comenzar entrenamiento', icon: Dumbbell, path: '/workout/precheck' }];

  // Esta línea sirve para extraer «ocialItems: MoreMenuItem[» de «[».
  const socialItems: MoreMenuItem[] = [
    // Esta línea sirve para revisar si el usuario es entrenador.
    user?.role === 'trainer'
      // Esta línea sirve para mostrar «Mis clientes» para el entrenador.
      ? { label: 'Mis clientes', icon: Users, path: '/trainer' }
      // Esta línea sirve para mostrar «Mi entrenador» para los demás.
      : { label: 'Mi entrenador', icon: User, path: '/mi-entrenador' },
    // Esta línea sirve para agregar un elemento cuyo «label» es «'Chat', icon: MessageCircle, path: '/cha…».
    { label: 'Chat', icon: MessageCircle, path: '/chat' },
    // Esta línea sirve para agregar un elemento cuyo «label» es «'Novedades', icon: Bell, path: '/novedad…».
    { label: 'Novedades', icon: Bell, path: '/novedades', badge: unreadFeedCount },
    // Esta línea sirve para agregar un elemento cuyo «label» es «SUPPORT_STRINGS.es.sectionTitle, icon: L…».
    { label: SUPPORT_STRINGS.es.sectionTitle, icon: LifeBuoy, path: '/soporte' },
  ];

  // Esta línea sirve para extraer «rganizacionItems: MoreMenuItem[» de «[».
  const organizacionItems: MoreMenuItem[] = [
    // Esta línea sirve para agregar un elemento cuyo «label» es «'Calendario', icon: CalendarDays, path: …».
    { label: 'Calendario', icon: CalendarDays, path: '/calendario' },
    // Esta línea sirve para agregar un elemento cuyo «label» es «'Nutrición', icon: Apple, path: '/nutric…».
    { label: 'Nutrición', icon: Apple, path: '/nutricion' },
  ];

  // Esta línea sirve para extraer «eguimientoItems: MoreMenuItem[» de «[».
  const seguimientoItems: MoreMenuItem[] = [
    // Esta línea sirve para agregar un elemento cuyo «label» es «'Historial', icon: History, path: '/hist…».
    { label: 'Historial', icon: History, path: '/history' },
    // Esta línea sirve para agregar un elemento cuyo «label» es «'Retos', icon: Flag, path: '/retos' },…».
    { label: 'Retos', icon: Flag, path: '/retos' },
    // Esta línea sirve para agregar un elemento cuyo «label» es «'Medidas corporales', icon: Ruler, path:…».
    { label: 'Medidas corporales', icon: Ruler, path: '/measurements' },
  ];
  // Esta línea sirve para declarar el acceso de administración.
  const adminItem: MoreMenuItem | null =
    // Esta línea sirve para mostrar «Super Admin» solo si el rol lo permite.
    user?.role === 'super_admin' ? { label: 'Super Admin', icon: Shield, path: '/admin' } : null;

  // Esta línea sirve para extraer «» de «(path: string) => {».
  const go = (path: string) => {
    // Esta línea sirve para llamar a «onClose».
    onClose();
    // Esta línea sirve para llamar a «router.push» con «path as never».
    router.push(path as never);
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «BottomSheet».
    <BottomSheet visible={visible} onClose={onClose}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.container}>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.title}>
          {/* Esta línea sirve para mostrar el texto «MÁS». */}
          MÁS
        </ThemedText>

        {/* Esta línea sirve para mostrar el texto «ENTRENAMIENTO» dentro de «GroupLabel». */}
        <GroupLabel>ENTRENAMIENTO</GroupLabel>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={styles.grid}>
          {/* Esta línea sirve para recorrer «entrenamientoItems» y mostrar un bloque por elemento. */}
          {entrenamientoItems.map((item) => (
            // Esta línea sirve para mostrar el componente «MenuTile».
            <MenuTile key={item.path} item={item} onPress={() => go(item.path)} />
          ))}
        </View>

        {/* Esta línea sirve para mostrar el texto «SOCIAL» dentro de «GroupLabel». */}
        <GroupLabel>SOCIAL</GroupLabel>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={styles.grid}>
          {/* Esta línea sirve para recorrer «socialItems» y mostrar un bloque por elemento. */}
          {socialItems.map((item) => (
            // Esta línea sirve para mostrar el componente «MenuTile».
            <MenuTile key={item.path} item={item} onPress={() => go(item.path)} />
          ))}
        </View>

        {/* Esta línea sirve para mostrar el texto «ORGANIZACIÓN» dentro de «GroupLabel». */}
        <GroupLabel>ORGANIZACIÓN</GroupLabel>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={styles.grid}>
          {/* Esta línea sirve para recorrer «organizacionItems» y mostrar un bloque por elemento. */}
          {organizacionItems.map((item) => (
            // Esta línea sirve para mostrar el componente «MenuTile».
            <MenuTile key={item.path} item={item} onPress={() => go(item.path)} />
          ))}
        </View>

        {/* Esta línea sirve para mostrar el texto «SEGUIMIENTO» dentro de «GroupLabel». */}
        <GroupLabel>SEGUIMIENTO</GroupLabel>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={styles.grid}>
          {/* Esta línea sirve para recorrer «seguimientoItems» y mostrar un bloque por elemento. */}
          {seguimientoItems.map((item) => (
            // Esta línea sirve para mostrar el componente «MenuTile».
            <MenuTile key={item.path} item={item} onPress={() => go(item.path)} />
          ))}
        </View>

        {/* Esta línea sirve para mostrar el bloque solo si «adminItem». */}
        {adminItem && (
          // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
          <>
            {/* Esta línea sirve para mostrar el texto «ADMINISTRACIÓN» dentro de «GroupLabel». */}
            <GroupLabel>ADMINISTRACIÓN</GroupLabel>
            {/* Esta línea sirve para mostrar el componente «MenuRow». */}
            <MenuRow item={adminItem} onPress={() => go(adminItem.path)} />
          </>
        )}

        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
        <Pressable
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={() => {
            // Esta línea sirve para llamar a «onClose».
            onClose();
            // Esta línea sirve para llamar a «router.push» con «'/settings'».
            router.push('/settings');
          }}
          // Esta línea sirve para pasar la propiedad «style» con el valor «styles.accountRow}>».
          style={styles.accountRow}>
          {/* Esta línea sirve para abrir el componente «Icon». */}
          <Icon icon={Settings} size={20} color={theme.text} />
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="default" style={styles.accountRowLabel}>
            {/* Esta línea sirve para mostrar el texto «Configuración». */}
            Configuración
          </ThemedText>
        </Pressable>

        {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
        <Pressable
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={() => {
            // Esta línea sirve para llamar a «onClose».
            onClose();
            // Esta línea sirve para llamar a «logout».
            logout();
          }}
          // Esta línea sirve para pasar la propiedad «style» con el valor «styles.accountRow}>».
          style={styles.accountRow}>
          {/* Esta línea sirve para abrir el componente «Icon». */}
          <Icon icon={LogOut} size={20} color={theme.textSecondary} />
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="default" themeColor="textSecondary" style={styles.accountRowLabel}>
            {/* Esta línea sirve para mostrar el texto «Cerrar sesión». */}
            Cerrar sesión
          </ThemedText>
        </Pressable>
      </ThemedView>
    </BottomSheet>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «Spacing.four».
    paddingBottom: Spacing.four,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{».
  title: {
    // Esta línea sirve para declarar la propiedad «textAlign» con el valor o tipo «'center'».
    textAlign: 'center',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «1».
    letterSpacing: 1,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.one».
    marginBottom: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «groupLabel» con el valor o tipo «{».
  groupLabel: {
    // Esta línea sirve para declarar la propiedad «textTransform» con el valor o tipo «'uppercase'».
    textTransform: 'uppercase',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.5».
    letterSpacing: 0.5,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.two».
    marginTop: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «grid» con el valor o tipo «{».
  grid: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «flexWrap» con el valor o tipo «'wrap'».
    flexWrap: 'wrap',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «tile» con el valor o tipo «{».
  tile: {
    // Esta línea sirve para declarar la propiedad «flexBasis» con el valor o tipo «'31%'».
    flexBasis: '31%',
    // Esta línea sirve para declarar la propiedad «flexGrow» con el valor o tipo «1».
    flexGrow: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two + 4».
    paddingVertical: Spacing.two + 4,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.one».
    paddingHorizontal: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «tileLabel» con el valor o tipo «{».
  tileLabel: {
    // Esta línea sirve para declarar la propiedad «textAlign» con el valor o tipo «'center'».
    textAlign: 'center',
  },
  // Esta línea sirve para declarar la propiedad «badge» con el valor o tipo «{».
  badge: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «Spacing.one».
    top: Spacing.one,
    // Esta línea sirve para declarar la propiedad «right» con el valor o tipo «Spacing.one».
    right: Spacing.one,
    // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «18».
    minWidth: 18,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «18».
    height: 18,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «9».
    borderRadius: 9,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «5».
    paddingHorizontal: 5,
  },
  // Esta línea sirve para declarar la propiedad «badgeText» con el valor o tipo «{».
  badgeText: {
    // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «'#050505'».
    color: '#050505',
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'700'».
    fontWeight: '700',
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «10».
    fontSize: 10,
  },
  // Esta línea sirve para declarar la propiedad «wideRow» con el valor o tipo «{».
  wideRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two + 4».
    paddingVertical: Spacing.two + 4,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «wideRowLabel» con el valor o tipo «{».
  wideRowLabel: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
  },
  // Esta línea sirve para declarar la propiedad «divider» con el valor o tipo «{».
  divider: {
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «1».
    height: 1,
    // Esta línea sirve para declarar la propiedad «marginVertical» con el valor o tipo «Spacing.two».
    marginVertical: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «accountRow» con el valor o tipo «{».
  accountRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.two».
    paddingHorizontal: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «accountRowLabel» con el valor o tipo «{».
  accountRowLabel: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
  },
});

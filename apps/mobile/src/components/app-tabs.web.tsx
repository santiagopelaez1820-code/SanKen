// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «Tabs» en la lista.
  Tabs,
  // Esta línea sirve para incluir el valor «TabList» en la lista.
  TabList,
  // Esta línea sirve para incluir el valor «TabTrigger» en la lista.
  TabTrigger,
  // Esta línea sirve para incluir el valor «TabSlot» en la lista.
  TabSlot,
  // Esta línea sirve para incluir el valor «TabTriggerSlotProps» en la lista.
  TabTriggerSlotProps,
  // Esta línea sirve para incluir el valor «TabListProps» en la lista.
  TabListProps,
// Esta línea sirve para terminar la importación desde «expo-router/ui».
} from 'expo-router/ui';
// Esta línea sirve para importar «Image, Pressable, View, StyleSheet» desde «react-native».
import { Image, Pressable, View, StyleSheet } from 'react-native';
// Esta línea sirve para importar «BarChart3, Home, ShoppingBag, Trophy, User, type LucideIcon» desde «lucide-react-native».
import { BarChart3, Home, ShoppingBag, Trophy, User, type LucideIcon } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «./themed-text».
import { ThemedText } from './themed-text';
// Esta línea sirve para importar «ThemedView» desde «./themed-view».
import { ThemedView } from './themed-view';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';

// Esta línea sirve para declarar la función «AppTabs».
export default function AppTabs() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Tabs».
    <Tabs>
      {/* Esta línea sirve para abrir el comentario que explica el relleno de la barra flotante. */}
      {/* La barra de tabs web es un header flotante (position: absolute): sin
          // Esta línea sirve para cerrar el comentario sobre el relleno de la barra.
          este padding tapaba el encabezado de cada pantalla. */}
      {/* Esta línea sirve para abrir el componente «TabSlot». */}
      <TabSlot style={styles.slot} />
      {/* Esta línea sirve para abrir el componente «TabList». */}
      <TabList asChild>
        {/* Esta línea sirve para abrir el componente «CustomTabList». */}
        <CustomTabList>
          {/* Esta línea sirve para abrir el componente «TabTrigger». */}
          <TabTrigger name="home" href="/" asChild>
            {/* Esta línea sirve para mostrar el texto «Inicio» dentro de «TabButton». */}
            <TabButton icon={Home}>Inicio</TabButton>
          </TabTrigger>
          {/* Esta línea sirve para abrir el componente «TabTrigger». */}
          <TabTrigger name="dashboard" href="/dashboard" asChild>
            {/* Esta línea sirve para mostrar el texto «Progreso» dentro de «TabButton». */}
            <TabButton icon={BarChart3}>Progreso</TabButton>
          </TabTrigger>
          {/* Esta línea sirve para mostrar el contenido dinámico «{/*». */}
          {/*
            // Esta línea sirve para incluir el texto o las clases «Tienda…».
            "Tienda" NO es un TabTrigger como los demás: /store vive en su
            // Esta línea sirve para continuar el comentario sobre el botón central.
            propio Stack top-level (src/app/store/), fuera de este grupo
            // Esta línea sirve para continuar el comentario sobre el botón central.
            (app), así que expo-router/ui no puede resolverlo como
            // Esta línea sirve para continuar el comentario sobre el botón central.
            sub-segmento de este navigator (lo intenté — tira "multiple
            // Esta línea sirve para continuar el comentario sobre el botón central.
            trigger components... map to the same sub-segment" porque lo
            // Esta línea sirve para continuar el comentario sobre el botón central.
            confunde con "/"). Un Pressable + router.push() normal, con la
            // Esta línea sirve para continuar el comentario sobre el botón central.
            misma pinta visual de TabButton, es el equivalente web del FAB
            // Esta línea sirve para continuar el comentario sobre el botón central.
            nativo (ver CenterAction en app-tabs.tsx, que por la misma razón
            // Esta línea sirve para continuar el comentario sobre el botón central.
            tampoco es un TabTrigger).
          // Esta línea sirve para cerrar el comentario sobre el botón central.
          */}
          {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
          <Pressable onPress={() => router.push('/store')} style={({ pressed }) => pressed && styles.pressed}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView type="backgroundElement" style={[styles.tabButtonView, styles.tabButtonRow]}>
              {/* Esta línea sirve para abrir el componente «ShoppingBag». */}
              <ShoppingBag size={16} color={theme.textSecondary} />
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Tienda». */}
                Tienda
              </ThemedText>
            </ThemedView>
          </Pressable>
          {/* Esta línea sirve para abrir el componente «TabTrigger». */}
          <TabTrigger name="prs" href="/prs" asChild>
            {/* Esta línea sirve para mostrar el texto «PR» dentro de «TabButton». */}
            <TabButton icon={Trophy}>PR</TabButton>
          </TabTrigger>
          {/* Esta línea sirve para abrir el componente «TabTrigger». */}
          <TabTrigger name="profile" href="/profile" asChild>
            {/* Esta línea sirve para mostrar el texto «Perfil» dentro de «TabButton». */}
            <TabButton icon={User}>Perfil</TabButton>
          </TabTrigger>
          {/* Esta línea sirve para abrir el componente «TabTrigger». */}
          <TabTrigger name="history" href="/history" style={styles.hidden} />
          {/* Esta línea sirve para abrir el componente «TabTrigger». */}
          <TabTrigger name="retos" href="/retos" style={styles.hidden} />
          {/* Esta línea sirve para abrir el componente «TabTrigger». */}
          <TabTrigger name="measurements" href="/measurements" style={styles.hidden} />
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

// Esta línea sirve para declarar la función «TabButton».
export function TabButton({
  // Esta línea sirve para incluir el valor «children» en la lista.
  children,
  // Esta línea sirve para incluir el valor «isFocused» en la lista.
  isFocused,
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «Icon».
  icon: Icon,
  // Esta línea sirve para copiar las propiedades de «props».
  ...props
// Esta línea sirve para cerrar los parámetros y declarar el componente del botón de pestaña.
}: TabTriggerSlotProps & { icon: LucideIcon }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «olo» de «isFocused ? theme.accent : theme.textSec».
  const color = isFocused ? theme.accent : theme.textSecondary;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
      <ThemedView
        // Esta línea sirve para pasar la propiedad «type» con el valor «isFocused ? 'backgroundSelected' : 'backgroun».
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.tabButtonView, styles.tabButtonRow]}>».
        style={[styles.tabButtonView, styles.tabButtonRow]}>
        {/* Esta línea sirve para abrir el componente «Icon». */}
        <Icon size={16} color={color} />
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" themeColor={isFocused ? 'accent' : 'textSecondary'}>
          {/* Esta línea sirve para mostrar el valor «children». */}
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

// Esta línea sirve para declarar la función «CustomTabList».
export function CustomTabList(props: TabListProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View {...props} style={styles.tabListContainer}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
        <Pressable style={styles.brand} onPress={() => router.push('/')}>
          {/* Esta línea sirve para abrir el componente «Image». */}
          <Image source={require('@/assets/images/logo.png')} style={styles.brandLogo} resizeMode="contain" />
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" style={styles.brandText}>
            {/* Esta línea sirve para mostrar el texto «SANKEN». */}
            SANKEN
          </ThemedText>
        </Pressable>

        {/* Esta línea sirve para mostrar el valor «props.children». */}
        {props.children}
      </ThemedView>
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Alto del header flotante: padding del contenedor + pastilla + botones.
  // Esta línea sirve para declarar la propiedad «slot» con el valor o tipo «{ height: '100%', paddingTop: 64 }».
  slot: { height: '100%', paddingTop: 64 },
  // Esta línea sirve para declarar la propiedad «tabListContainer» con el valor o tipo «{».
  tabListContainer: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
  },
  // Esta línea sirve para declarar la propiedad «innerContainer» con el valor o tipo «{».
  innerContainer: {
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.five».
    paddingHorizontal: Spacing.five,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.five».
    borderRadius: Spacing.five,
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «flexGrow» con el valor o tipo «1».
    flexGrow: 1,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
  },
  // Esta línea sirve para declarar la propiedad «brand» con el valor o tipo «{».
  brand: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «marginRight» con el valor o tipo «'auto'».
    marginRight: 'auto',
  },
  // Esta línea sirve para declarar la propiedad «brandLogo» con el valor o tipo «{».
  brandLogo: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «30».
    width: 30,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «30».
    height: 30,
  },
  // Esta línea sirve para declarar la propiedad «brandText» con el valor o tipo «{}».
  brandText: {},
  // Esta línea sirve para declarar la propiedad «pressed» con el valor o tipo «{».
  pressed: {
    // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «0.7».
    opacity: 0.7,
  },
  // Esta línea sirve para declarar la propiedad «hidden» con el valor o tipo «{».
  hidden: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «0».
    width: 0,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «0».
    height: 0,
    // Esta línea sirve para declarar la propiedad «display» con el valor o tipo «'none'».
    display: 'none',
  },
  // Esta línea sirve para declarar la propiedad «tabButtonView» con el valor o tipo «{».
  tabButtonView: {
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.one».
    paddingVertical: Spacing.one,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «tabButtonRow» con el valor o tipo «{».
  tabButtonRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
  },
});

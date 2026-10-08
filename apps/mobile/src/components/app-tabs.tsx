// Esta línea sirve para importar «Tabs, TabList, TabTrigger, TabSlot» desde «expo-router/ui».
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';

/**
 * Navegador de las pantallas de (app). La barra visible ya no vive acá: es
 * BottomTabBar (components/layout/bottom-tab-bar.tsx), montada en el layout
 * raíz para que aparezca en todos los módulos y no solo en estas pantallas.
 *
 * El TabList queda oculto pero tiene que existir: con expo-router/ui, un
 * archivo de (app) solo es navegable si tiene un TabTrigger real dentro del
 * TabList. Sin estos triggers, router.navigate() a esas rutas no tendría a
 * dónde ir.
 */
// Esta línea sirve para declarar la función «AppTabs».
export default function AppTabs() {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Tabs».
    <Tabs style={styles.tabs}>
      {/* Esta línea sirve para abrir el componente «TabSlot». */}
      <TabSlot style={styles.slot} />
      {/* Esta línea sirve para abrir el componente «TabList». */}
      <TabList style={styles.hidden}>
        {/* Esta línea sirve para abrir el componente «TabTrigger». */}
        <TabTrigger name="index" href="/" />
        {/* Esta línea sirve para abrir el componente «TabTrigger». */}
        <TabTrigger name="dashboard" href="/dashboard" />
        {/* Esta línea sirve para abrir el componente «TabTrigger». */}
        <TabTrigger name="prs" href="/prs" />
        {/* Esta línea sirve para abrir el componente «TabTrigger». */}
        <TabTrigger name="profile" href="/profile" />
        {/* Esta línea sirve para abrir el componente «TabTrigger». */}
        <TabTrigger name="history" href="/history" />
        {/* Esta línea sirve para abrir el componente «TabTrigger». */}
        <TabTrigger name="retos" href="/retos" />
        {/* Esta línea sirve para abrir el componente «TabTrigger». */}
        <TabTrigger name="measurements" href="/measurements" />
      </TabList>
    </Tabs>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «tabs» con el valor o tipo «{ flex: 1 }».
  tabs: { flex: 1 },
  // Esta línea sirve para declarar la propiedad «slot» con el valor o tipo «{ flex: 1 }».
  slot: { flex: 1 },
  // Esta línea sirve para declarar la propiedad «hidden» con el valor o tipo «{».
  hidden: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «0».
    width: 0,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «0».
    height: 0,
    // Esta línea sirve para declarar la propiedad «display» con el valor o tipo «'none'».
    display: 'none',
  },
});

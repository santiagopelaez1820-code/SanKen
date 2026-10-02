import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
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
export default function AppTabs() {
  return (
    <Tabs style={styles.tabs}>
      <TabSlot style={styles.slot} />
      <TabList style={styles.hidden}>
        <TabTrigger name="index" href="/" />
        <TabTrigger name="dashboard" href="/dashboard" />
        <TabTrigger name="prs" href="/prs" />
        <TabTrigger name="profile" href="/profile" />
        <TabTrigger name="history" href="/history" />
        <TabTrigger name="retos" href="/retos" />
        <TabTrigger name="measurements" href="/measurements" />
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabs: { flex: 1 },
  slot: { flex: 1 },
  hidden: {
    width: 0,
    height: 0,
    display: 'none',
  },
});

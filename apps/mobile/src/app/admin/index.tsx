// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Image, Pressable, StyleSheet» desde «react-native».
import { Image, Pressable, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «SUPPORT_STRINGS» desde «@sanken/core».
import { SUPPORT_STRINGS } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

// Esta línea sirve para declarar la función «AdminScreen».
export default function AdminScreen() {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
        <Pressable onPress={() => router.push('/')}>
          {/* Esta línea sirve para abrir el componente «Image». */}
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        </Pressable>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="title" style={styles.title}>
          {/* Esta línea sirve para mostrar el texto «Super Admin». */}
          Super Admin
        </ThemedText>

        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label="Usuarios" variant="ghost" onPress={() => router.push('/admin/usuarios')} />
        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label="Ejercicios" variant="ghost" onPress={() => router.push('/admin/ejercicios')} />
        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label="Rutinas generales" variant="ghost" onPress={() => router.push('/admin/rutinas')} />
        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label={SUPPORT_STRINGS.es.admin.title} variant="ghost" onPress={() => router.push('/admin/soporte')} />
        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label="Reportes" variant="ghost" onPress={() => router.push('/admin/reportes')} />
        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label="PR pendientes" variant="ghost" onPress={() => router.push('/admin/pr-submissions')} />
        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label="Retos" variant="ghost" onPress={() => router.push('/admin/retos')} />
        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label="Noticias" variant="ghost" onPress={() => router.push('/admin/noticias')} />
        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label="Métricas" variant="ghost" onPress={() => router.push('/admin/stats')} />
        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label="Auditoría" variant="ghost" onPress={() => router.push('/admin/auditoria')} />

        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1, alignItems: 'center' }».
  root: { flex: 1, alignItems: 'center' },
  // Esta línea sirve para declarar la propiedad «safeArea» con el valor o tipo «{».
  safeArea: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.four».
    gap: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «BottomTabInset».
    paddingBottom: BottomTabInset,
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
  },
  // Esta línea sirve para definir el estilo «logo» con «width: 56, height: 56, alignSelf: 'center', margin…».
  logo: { width: 56, height: 56, alignSelf: 'center', marginBottom: -Spacing.two },
  // Esta línea sirve para definir el estilo «title» con «textAlign: 'center', marginBottom: Spacing.two },…».
  title: { textAlign: 'center', marginBottom: Spacing.two },
});

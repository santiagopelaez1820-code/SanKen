import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AdminScreen() {
  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Panel admin
        </ThemedText>

        <PrimaryButton label="Usuarios" variant="ghost" onPress={() => router.push('/admin/usuarios')} />
        <PrimaryButton label="Ejercicios" variant="ghost" onPress={() => router.push('/admin/ejercicios')} />
        <PrimaryButton label="Reportes" variant="ghost" onPress={() => router.push('/admin/reportes')} />
        <PrimaryButton label="Noticias" variant="ghost" onPress={() => router.push('/admin/noticias')} />
        <PrimaryButton label="Métricas" variant="ghost" onPress={() => router.push('/admin/stats')} />
        <PrimaryButton label="Auditoría" variant="ghost" onPress={() => router.push('/admin/auditoria')} />

        <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center' },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  title: { textAlign: 'center', marginBottom: Spacing.two },
});

// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «ScrollView, StyleSheet» desde «react-native».
import { ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useAdminStore» desde «@/store/admin-store».
import { useAdminStore } from '@/store/admin-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar la función «AdminAuditoriaScreen».
export default function AdminAuditoriaScreen() {
  // Esta línea sirve para obtener el log de auditoría y su carga.
  const { auditLog, isLoadingAuditLog, loadAuditLog } = useAdminStore();

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadAuditLog».
    loadAuditLog();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadAuditLog».
  }, [loadAuditLog]);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el texto «Log de auditoría». */}
            Log de auditoría
          </ThemedText>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadingAuditLog». */}
          {isLoadingAuditLog && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingAuditLog && auditLog.length === 0». */}
          {!isLoadingAuditLog && auditLog.length === 0 && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Sin actividad registrada.». */}
              Sin actividad registrada.
            </ThemedText>
          )}

          {/* Esta línea sirve para recorrer «auditLog» y mostrar un bloque por elemento. */}
          {auditLog.map((entry) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={entry.id} style={styles.row}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small">
                {/* Esta línea sirve para mostrar el contenido dinámico «{entry.causer?.name ?? 'Sistema'} — {entry.description}». */}
                {entry.causer?.name ?? 'Sistema'} — {entry.description}
                {/* Esta línea sirve para mostrar el bloque solo si «entry.subject_type». */}
                {entry.subject_type && (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{' '}». */}
                    {' '}
                    {/* Esta línea sirve para mostrar el contenido dinámico «({entry.subject_type.split('\\').pop()} #{entry.subject_id})». */}
                    ({entry.subject_type.split('\\').pop()} #{entry.subject_id})
                  </ThemedText>
                )}
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el contenido dinámico «{new Date(entry.created_at).toLocaleString('es-AR')}». */}
                {new Date(entry.created_at).toLocaleString('es-AR')}
              </ThemedText>
            </ThemedView>
          ))}

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  // Esta línea sirve para declarar la propiedad «scrollView» con el valor o tipo «{ alignSelf: 'stretch' }».
  scrollView: { alignSelf: 'stretch' },
  // Esta línea sirve para declarar la propiedad «content» con el valor o tipo «{».
  content: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.three».
    paddingTop: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «row» con «gap: Spacing.half, paddingVertical: Spacing.one, b…».
  row: { gap: Spacing.half, paddingVertical: Spacing.one, backgroundColor: 'transparent' },
});

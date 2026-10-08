// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, TextInput, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «ReportStatus» desde «@sanken/core».
import type { ReportStatus } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useAdminStore» desde «@/store/admin-store».
import { useAdminStore } from '@/store/admin-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar «REASON_LABELS» con el valor «{».
const REASON_LABELS: Record<string, string> = {
  // Esta línea sirve para declarar la propiedad «abuse» con el valor o tipo «'Abuso'».
  abuse: 'Abuso',
  // Esta línea sirve para declarar la propiedad «spam» con el valor o tipo «'Spam'».
  spam: 'Spam',
  // Esta línea sirve para declarar la propiedad «inappropriate_content» con el valor o tipo «'Contenido inapropiado'».
  inappropriate_content: 'Contenido inapropiado',
  // Esta línea sirve para declarar la propiedad «other» con el valor o tipo «'Otro'».
  other: 'Otro',
};

// Esta línea sirve para declarar «STATUS_TABS» con el valor «[».
const STATUS_TABS: { label: string; value: ReportStatus | 'all' }[] = [
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Pendientes', value: 'pending' },…».
  { label: 'Pendientes', value: 'pending' },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Resueltos', value: 'resolved' },…».
  { label: 'Resueltos', value: 'resolved' },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Descartados', value: 'dismissed' },…».
  { label: 'Descartados', value: 'dismissed' },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Todos', value: 'all' },…».
  { label: 'Todos', value: 'all' },
];

// Esta línea sirve para declarar la función «AdminReportesScreen».
export default function AdminReportesScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener los reportes y las acciones del store de administración.
  const { reports, isLoadingReports, loadReports, resolveReport } = useAdminStore();
  // Esta línea sirve para crear el estado «status» y su función «setStatus».
  const [status, setStatus] = useState<ReportStatus | 'all'>('pending');
  // Esta línea sirve para crear el estado «notesByReport» y su función «setNotesByReport».
  const [notesByReport, setNotesByReport] = useState<Record<number, string>>({});

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadReports» con «status».
    loadReports(status);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «status, loadReports».
  }, [status, loadReports]);

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
            {/* Esta línea sirve para mostrar el texto «Reportes». */}
            Reportes
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.tabsRow}>
            {/* Esta línea sirve para recorrer «STATUS_TABS» y calcular qué mostrar por elemento. */}
            {STATUS_TABS.map((tab) => {
              // Esta línea sirve para extraer «electe» de «tab.value === status».
              const selected = tab.value === status;
              // Esta línea sirve para devolver la interfaz del componente.
              return (
                // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
                <Pressable
                  // Esta línea sirve para identificar el elemento de la lista con «tab.value}».
                  key={tab.value}
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => setStatus(tab.value)}
                  // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                  style={[
                    // Esta línea sirve para agregar el estilo «styles.chip».
                    styles.chip,
                    // Esta línea sirve para agregar un elemento cuyo «borderColor» es «theme.backgroundSelected },…».
                    { borderColor: theme.backgroundSelected },
                    // Esta línea sirve para resaltar la opción seleccionada.
                    selected && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                    {/* Esta línea sirve para mostrar el valor «tab.label». */}
                    {tab.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadingReports». */}
          {isLoadingReports && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingReports && reports.length === 0». */}
          {!isLoadingReports && reports.length === 0 && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Sin reportes acá.». */}
              Sin reportes acá.
            </ThemedText>
          )}

          {/* Esta línea sirve para recorrer «reports» y mostrar un bloque por elemento. */}
          {reports.map((report) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={report.id} type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small">
                {/* Esta línea sirve para mostrar el contenido dinámico «{report.reporter.name} reportó{' '}». */}
                {report.reporter.name} reportó{' '}
                {/* Esta línea sirve para mostrar qué se reportó. */}
                {report.reportable_type === 'chat_message' ? 'un mensaje de chat' : report.reportable_type} ·{' '}
                {/* Esta línea sirve para mostrar el contenido dinámico «{REASON_LABELS[report.reason]}». */}
                {REASON_LABELS[report.reason]}
              </ThemedText>
              {/* Esta línea sirve para mostrar el bloque solo si «report.reportable_preview». */}
              {report.reportable_preview && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el contenido dinámico «&quot;{report.reportable_preview}&quot». */}
                  &quot;{report.reportable_preview}&quot;
                </ThemedText>
              )}
              {/* Esta línea sirve para mostrar el bloque solo si «report.details». */}
              {report.details && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el valor «report.details». */}
                  {report.details}
                </ThemedText>
              )}

              {/* Esta línea sirve para elegir entre dos bloques según «report.status === 'pending'». */}
              {report.status === 'pending' ? (
                // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
                <>
                  {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
                  <TextInput
                    // Esta línea sirve para pasar la propiedad «value» con el valor «notesByReport[report.id] ?? ''}».
                    value={notesByReport[report.id] ?? ''}
                    // Esta línea sirve para asignar el manejador del evento «onChangeText».
                    onChangeText={(text) => setNotesByReport({ ...notesByReport, [report.id]: text })}
                    // Esta línea sirve para definir el atributo «placeholder» con el valor «Notas de resolución (opcional)».
                    placeholder="Notas de resolución (opcional)"
                    // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
                    placeholderTextColor={theme.textSecondary}
                    // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
                    style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
                  />
                  {/* Esta línea sirve para abrir el componente «View». */}
                  <View style={styles.actionsRow}>
                    {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                    <PrimaryButton
                      // Esta línea sirve para definir el atributo «label» con el valor «Resolver».
                      label="Resolver"
                      // Esta línea sirve para asignar el manejador del evento «onPress».
                      onPress={() => resolveReport(report.id, 'resolved', notesByReport[report.id])}
                    />
                    {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                    <PrimaryButton
                      // Esta línea sirve para definir el atributo «label» con el valor «Descartar».
                      label="Descartar"
                      // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                      variant="ghost"
                      // Esta línea sirve para asignar el manejador del evento «onPress».
                      onPress={() => resolveReport(report.id, 'dismissed', notesByReport[report.id])}
                    />
                  </View>
                </>
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar si fue resuelto o descartado y por quién. */}
                  {report.status === 'resolved' ? 'Resuelto' : 'Descartado'} por {report.resolved_by?.name}
                </ThemedText>
              )}
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
  // Esta línea sirve para definir el estilo «tabsRow» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  tabsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «chip» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  chip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.three, padding: Spacing.thre…».
  card: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.one },
  // Esta línea sirve para definir el estilo «input» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  // Esta línea sirve para declarar la propiedad «actionsRow» con el valor o tipo «{ flexDirection: 'row', gap: Spacing.two }».
  actionsRow: { flexDirection: 'row', gap: Spacing.two },
});

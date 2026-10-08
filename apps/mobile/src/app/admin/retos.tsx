// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, TextInput, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «ChallengeMetric, ChallengeType» desde «@sanken/core».
import type { ChallengeMetric, ChallengeType } from '@sanken/core';

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

// Esta línea sirve para declarar «TYPE_OPTIONS» con el valor «[».
const TYPE_OPTIONS: { value: ChallengeType; label: string }[] = [
  // Esta línea sirve para agregar un elemento cuyo «value» es «'weekly', label: 'Semanal' },…».
  { value: 'weekly', label: 'Semanal' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'monthly', label: 'Mensual' },…».
  { value: 'monthly', label: 'Mensual' },
];

// Esta línea sirve para declarar «METRIC_OPTIONS» con el valor «[».
const METRIC_OPTIONS: { value: ChallengeMetric; label: string }[] = [
  // Esta línea sirve para agregar un elemento cuyo «value» es «'workouts_count', label: 'Cantidad de en…».
  { value: 'workouts_count', label: 'Cantidad de entrenamientos' },
  // Esta línea sirve para agregar un elemento cuyo «value» es «'total_volume_kg', label: 'Volumen total…».
  { value: 'total_volume_kg', label: 'Volumen total (kg)' },
];

// Esta línea sirve para declarar la función «AdminRetosScreen».
export default function AdminRetosScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «challengeTemplates» en la lista.
    challengeTemplates,
    // Esta línea sirve para incluir el valor «isLoadingChallengeTemplates» en la lista.
    isLoadingChallengeTemplates,
    // Esta línea sirve para incluir el valor «challengeTemplateError» en la lista.
    challengeTemplateError,
    // Esta línea sirve para incluir el valor «loadChallengeTemplates» en la lista.
    loadChallengeTemplates,
    // Esta línea sirve para incluir el valor «createChallengeTemplate» en la lista.
    createChallengeTemplate,
    // Esta línea sirve para incluir el valor «toggleChallengeTemplateActive» en la lista.
    toggleChallengeTemplateActive,
  // Esta línea sirve para cerrar la desestructuración con «useAdminStore()».
  } = useAdminStore();

  // Esta línea sirve para crear el estado «code» y su función «setCode».
  const [code, setCode] = useState('');
  // Esta línea sirve para crear el estado «title» y su función «setTitle».
  const [title, setTitle] = useState('');
  // Esta línea sirve para crear el estado «description» y su función «setDescription».
  const [description, setDescription] = useState('');
  // Esta línea sirve para crear el estado «type» y su función «setType».
  const [type, setType] = useState<ChallengeType>('weekly');
  // Esta línea sirve para crear el estado «metric» y su función «setMetric».
  const [metric, setMetric] = useState<ChallengeMetric>('workouts_count');
  // Esta línea sirve para crear el estado «target» y su función «setTarget».
  const [target, setTarget] = useState('');

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadChallengeTemplates».
    loadChallengeTemplates();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadChallengeTemplates».
  }, [loadChallengeTemplates]);

  // Esta línea sirve para extraer «anSubmi» de «code.trim() && title.trim() && descripti».
  const canSubmit = code.trim() && title.trim() && description.trim() && target.trim();

  // Esta línea sirve para extraer «ubmi» de «async () => {».
  const submit = async () => {
    // Esta línea sirve para salir de la función si «!canSubmit».
    if (!canSubmit) return;
    // Esta línea sirve para esperar el resultado de «createChallengeTemplate».
    await createChallengeTemplate({ code, title, description, type, metric, target: Number(target) });
    // Esta línea sirve para guardar en el estado con «setCode» el valor «'')…».
    setCode('');
    // Esta línea sirve para guardar en el estado con «setTitle» el valor «'')…».
    setTitle('');
    // Esta línea sirve para guardar en el estado con «setDescription» el valor «'')…».
    setDescription('');
    // Esta línea sirve para guardar en el estado con «setTarget» el valor «'')…».
    setTarget('');
  };

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
            {/* Esta línea sirve para mostrar el texto «Retos». */}
            Retos
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para explicar que cada plantilla activa genera un reto nuevo. */}
            Cada plantilla activa genera un reto nuevo cada semana o mes. Agregar una métrica distinta a las ya
            listadas todavía requiere desarrollo.
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para mostrar el texto «Nueva plantilla» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Nueva plantilla</ThemedText>
            {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
            <TextInput
              // Esta línea sirve para pasar la propiedad «value» con el valor «code}».
              value={code}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={setCode}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Código único (ej. weekly_5_sessions)».
              placeholder="Código único (ej. weekly_5_sessions)"
              // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
              placeholderTextColor={theme.textSecondary}
              // Esta línea sirve para definir el atributo «autoCapitalize» con el valor «none».
              autoCapitalize="none"
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />
            {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
            <TextInput
              // Esta línea sirve para pasar la propiedad «value» con el valor «title}».
              value={title}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={setTitle}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Título».
              placeholder="Título"
              // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
              placeholderTextColor={theme.textSecondary}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />
            {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
            <TextInput
              // Esta línea sirve para pasar la propiedad «value» con el valor «description}».
              value={description}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={setDescription}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Descripción».
              placeholder="Descripción"
              // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
              placeholderTextColor={theme.textSecondary}
              // Esta línea sirve para activar la opción «multiline».
              multiline
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />

            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Cadencia». */}
              Cadencia
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.chipsRow}>
              {/* Esta línea sirve para recorrer «TYPE_OPTIONS» y calcular qué mostrar por elemento. */}
              {TYPE_OPTIONS.map((option) => {
                // Esta línea sirve para extraer «electe» de «option.value === type».
                const selected = option.value === type;
                // Esta línea sirve para devolver la interfaz del componente.
                return (
                  // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
                  <Pressable
                    // Esta línea sirve para identificar el elemento de la lista con «option.value}».
                    key={option.value}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => setType(option.value)}
                    // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                    style={[
                      // Esta línea sirve para agregar el estilo «styles.chip».
                      styles.chip,
                      // Esta línea sirve para agregar un elemento cuyo «borderColor» es «selected ? theme.accent : theme.backgrou…».
                      { borderColor: selected ? theme.accent : theme.backgroundSelected },
                      // Esta línea sirve para aplicar el estilo «backgroundColor: theme.backgroundSelecte…» solo si «selected».
                      selected && { backgroundColor: theme.backgroundSelected },
                    ]}>
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                      {/* Esta línea sirve para mostrar el valor «option.label». */}
                      {option.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Métrica». */}
              Métrica
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.chipsRow}>
              {/* Esta línea sirve para recorrer «METRIC_OPTIONS» y calcular qué mostrar por elemento. */}
              {METRIC_OPTIONS.map((option) => {
                // Esta línea sirve para extraer «electe» de «option.value === metric».
                const selected = option.value === metric;
                // Esta línea sirve para devolver la interfaz del componente.
                return (
                  // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
                  <Pressable
                    // Esta línea sirve para identificar el elemento de la lista con «option.value}».
                    key={option.value}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => setMetric(option.value)}
                    // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                    style={[
                      // Esta línea sirve para agregar el estilo «styles.chip».
                      styles.chip,
                      // Esta línea sirve para agregar un elemento cuyo «borderColor» es «selected ? theme.accent : theme.backgrou…».
                      { borderColor: selected ? theme.accent : theme.backgroundSelected },
                      // Esta línea sirve para aplicar el estilo «backgroundColor: theme.backgroundSelecte…» solo si «selected».
                      selected && { backgroundColor: theme.backgroundSelected },
                    ]}>
                    {/* Esta línea sirve para abrir el componente «ThemedText». */}
                    <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                      {/* Esta línea sirve para mostrar el valor «option.label». */}
                      {option.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
            <TextInput
              // Esta línea sirve para pasar la propiedad «value» con el valor «target}».
              value={target}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={setTarget}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Objetivo».
              placeholder="Objetivo"
              // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
              placeholderTextColor={theme.textSecondary}
              // Esta línea sirve para definir el atributo «keyboardType» con el valor «numeric».
              keyboardType="numeric"
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
            />

            {/* Esta línea sirve para mostrar el bloque solo si «challengeTemplateError». */}
            {challengeTemplateError && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={styles.error}>
                {/* Esta línea sirve para mostrar el valor «challengeTemplateError». */}
                {challengeTemplateError}
              </ThemedText>
            )}

            {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
            <PrimaryButton label="Crear plantilla" onPress={submit} disabled={!canSubmit} />
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadingChallengeTemplates». */}
          {isLoadingChallengeTemplates && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}

          {/* Esta línea sirve para recorrer «challengeTemplates» y mostrar un bloque por elemento. */}
          {challengeTemplates.map((template) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={template.id} type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="smallBold">
                {/* Esta línea sirve para mostrar el título y el código de la plantilla. */}
                {template.title} <ThemedText type="small" themeColor="textSecondary">({template.code})</ThemedText>
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el valor «template.description». */}
                {template.description}
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el tipo de la plantilla. */}
                {TYPE_OPTIONS.find((o) => o.value === template.type)?.label} ·{' '}
                {/* Esta línea sirve para mostrar la métrica y el objetivo de la plantilla. */}
                {METRIC_OPTIONS.find((o) => o.value === template.metric)?.label} · objetivo {template.target}
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el contenido dinámico «{template.is_active ? 'Activa' : 'Inactiva'}». */}
                {template.is_active ? 'Activa' : 'Inactiva'}
              </ThemedText>
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para pasar la propiedad «label» con el valor «template.is_active ? 'Desactivar' : 'Activar'».
                label={template.is_active ? 'Desactivar' : 'Activar'}
                // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                variant="ghost"
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => toggleChallengeTemplateActive(template.id, template.is_active)}
              />
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
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.four, padding: Spacing.three…».
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  // Esta línea sirve para definir el estilo «input» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  // Esta línea sirve para definir el estilo «chipsRow» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «chip» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  chip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});

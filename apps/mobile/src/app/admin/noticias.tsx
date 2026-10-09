// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «ScrollView, StyleSheet, TextInput, View» desde «react-native».
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
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
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useAdminStore» desde «@/store/admin-store».
import { useAdminStore } from '@/store/admin-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar la función «AdminNoticiasScreen».
export default function AdminNoticiasScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener las novedades y las acciones del store de administración.
  const { news, isLoadingNews, loadNews, createNews, toggleNewsPublish, deleteNews } = useAdminStore();
  // Esta línea sirve para crear el estado «title» y su función «setTitle».
  const [title, setTitle] = useState('');
  // Esta línea sirve para crear el estado «body» y su función «setBody».
  const [body, setBody] = useState('');

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadNews».
    loadNews();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadNews».
  }, [loadNews]);

  // Esta línea sirve para extraer «ubmi» de «async () => {».
  const submit = async () => {
    // Esta línea sirve para esperar el resultado de «createNews».
    await createNews(title, body);
    // Esta línea sirve para guardar en el estado con «setTitle» el valor «'')…».
    setTitle('');
    // Esta línea sirve para guardar en el estado con «setBody» el valor «'')…».
    setBody('');
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
            {/* Esta línea sirve para mostrar el texto «Noticias». */}
            Noticias
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para mostrar el texto «Nueva noticia» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Nueva noticia</ThemedText>
            {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
            <TextInput allowFontScaling={false}
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
            <TextInput allowFontScaling={false}
              // Esta línea sirve para pasar la propiedad «value» con el valor «body}».
              value={body}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={setBody}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Contenido».
              placeholder="Contenido"
              // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
              placeholderTextColor={theme.textSecondary}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
              style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
              // Esta línea sirve para activar la opción «multiline».
              multiline
            />
            {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
            <PrimaryButton label="Crear borrador" onPress={submit} disabled={!title.trim() || !body.trim()} />
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadingNews». */}
          {isLoadingNews && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}

          {/* Esta línea sirve para recorrer «news» y mostrar un bloque por elemento. */}
          {news.map((item) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={item.id} type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para mostrar el valor «item.title» dentro de «ThemedText». */}
              <ThemedText type="smallBold">{item.title}</ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el valor «item.body». */}
                {item.body}
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el contenido dinámico «{item.published ? 'Publicada' : 'Borrador'}». */}
                {item.published ? 'Publicada' : 'Borrador'}
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «View». */}
              <View style={styles.actionsRow}>
                {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                <PrimaryButton
                  // Esta línea sirve para pasar la propiedad «label» con el valor «item.published ? 'Despublicar' : 'Publicar'}».
                  label={item.published ? 'Despublicar' : 'Publicar'}
                  // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                  variant="ghost"
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => toggleNewsPublish(item.id, !item.published)}
                />
                {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
                <PrimaryButton label="Borrar" variant="ghost" onPress={() => deleteNews(item.id)} />
              </View>
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
  // Esta línea sirve para declarar la propiedad «actionsRow» con el valor o tipo «{ flexDirection: 'row', gap: Spacing.two }».
  actionsRow: { flexDirection: 'row', gap: Spacing.two },
});

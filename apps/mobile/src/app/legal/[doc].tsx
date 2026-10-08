// Esta línea sirve para importar «Redirect, router, useLocalSearchParams» desde «expo-router».
import { Redirect, router, useLocalSearchParams } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «TriangleAlert» desde «lucide-react-native».
import { TriangleAlert } from 'lucide-react-native';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «formatLegalDate» en la lista.
  formatLegalDate,
  // Esta línea sirve para incluir el valor «getLegalDocument» en la lista.
  getLegalDocument,
  // Esta línea sirve para incluir el valor «LEGAL_STRINGS» en la lista.
  LEGAL_STRINGS,
  // Esta línea sirve para incluir el valor «missingOwnerFields» en la lista.
  missingOwnerFields,
  // Esta línea sirve para incluir el valor «resolveLegalText» en la lista.
  resolveLegalText,
  // Esta línea sirve para importar el tipo «LegalBlock».
  type LegalBlock,
  // Esta línea sirve para importar el tipo «LegalLocale».
  type LegalLocale,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «legalDocumentFromSlug» desde «@/lib/legal-routes».
import { legalDocumentFromSlug } from '@/lib/legal-routes';
// Esta línea sirve para importar «useLegalLocaleStore» desde «@/store/legal-locale-store».
import { useLegalLocaleStore } from '@/store/legal-locale-store';

/** Texto con marcadores {{campo}}: un dato del responsable sin completar se resalta como "[Pendiente: …]". */
// Esta línea sirve para declarar la función «LegalText».
function LegalText({ text, locale, type = 'default' }: { text: string; locale: LegalLocale; type?: 'default' | 'small' }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedText».
    <ThemedText type={type}>
      {/* Esta línea sirve para recorrer los fragmentos del texto legal. */}
      {resolveLegalText(text, locale).map((segment, i) =>
        // Esta línea sirve para revisar si el fragmento es un dato pendiente.
        segment.pending ? (
          // Esta línea sirve para abrir el componente «ThemedText».
          <ThemedText key={i} type={type} style={styles.pending}>
            {/* Esta línea sirve para mostrar el valor «segment.text». */}
            {segment.text}
          </ThemedText>
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para mostrar el texto normal del fragmento.
          segment.text
        )
      )}
    </ThemedText>
  );
}

// Esta línea sirve para declarar la función «Block».
function Block({ block, locale }: { block: LegalBlock; locale: LegalLocale }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para elegir qué hacer según «block.type».
  switch (block.type) {
    // Esta línea sirve para tratar el caso «'p'».
    case 'p':
      // Esta línea sirve para devolver «<LegalText text={block.text} locale={locale} />».
      return <LegalText text={block.text} locale={locale} />;
    // Esta línea sirve para tratar el caso «'note'».
    case 'note':
      // Esta línea sirve para devolver la interfaz del componente.
      return (
        // Esta línea sirve para abrir el componente «ThemedView».
        <ThemedView type="backgroundElement" style={[styles.note, { borderColor: theme.accent }]}>
          {/* Esta línea sirve para abrir el componente «LegalText». */}
          <LegalText text={block.text} locale={locale} />
        </ThemedView>
      );
    // Esta línea sirve para tratar el caso «'list'».
    case 'list':
      // Esta línea sirve para devolver la interfaz del componente.
      return (
        // Esta línea sirve para abrir el componente «View».
        <View style={styles.list}>
          {/* Esta línea sirve para recorrer «block.items» y mostrar un bloque por elemento. */}
          {block.items.map((item, i) => (
            // Esta línea sirve para abrir el componente «View».
            <View key={i} style={styles.listItem}>
              {/* Esta línea sirve para mostrar el texto «•» dentro de «ThemedText». */}
              <ThemedText aria-hidden>•</ThemedText>
              {/* Esta línea sirve para abrir el componente «View». */}
              <View style={styles.flex}>
                {/* Esta línea sirve para abrir el componente «LegalText». */}
                <LegalText text={item} locale={locale} />
              </View>
            </View>
          ))}
        </View>
      );
    // Esta línea sirve para tratar el caso «'table'».
    case 'table':
      // En pantallas angostas una tabla no entra: cada fila se muestra como
      // una tarjeta con "encabezado: valor", más legible y accesible.
      // Esta línea sirve para devolver la interfaz del componente.
      return (
        // Esta línea sirve para abrir el componente «View».
        <View style={styles.list}>
          {/* Esta línea sirve para recorrer «block.rows» y mostrar un bloque por elemento. */}
          {block.rows.map((row, i) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={i} type="backgroundElement" style={styles.rowCard}>
              {/* Esta línea sirve para abrir el componente «ThemedText» con sus propiedades. */}
              <ThemedText type="smallBold">{resolveLegalText(row[0], locale).map((s) => s.text).join('')}</ThemedText>
              {/* Esta línea sirve para recorrer «row.slice(1)» y mostrar un bloque por elemento. */}
              {row.slice(1).map((cell, j) => (
                // Esta línea sirve para abrir el componente «View».
                <View key={j} style={styles.rowCell}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{block.headers[j + 1]}». */}
                    {block.headers[j + 1]}
                  </ThemedText>
                  {/* Esta línea sirve para abrir el componente «LegalText». */}
                  <LegalText text={cell} locale={locale} type="small" />
                </View>
              ))}
            </ThemedView>
          ))}
        </View>
      );
  }
}

// Esta línea sirve para declarar la función «LegalDocumentScreen».
export default function LegalDocumentScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «doc: slug» de «useLocalSearchParams<{ doc: string }>()».
  const { doc: slug } = useLocalSearchParams<{ doc: string }>();
  // Esta línea sirve para extraer «ocumentI» de «legalDocumentFromSlug(slug)».
  const documentId = legalDocumentFromSlug(slug);
  // Esta línea sirve para obtener «locale» con el hook «useLegalLocaleStore».
  const locale = useLegalLocaleStore((s) => s.locale);
  // Esta línea sirve para obtener «setLocale» con el hook «useLegalLocaleStore».
  const setLocale = useLegalLocaleStore((s) => s.setLocale);
  // Esta línea sirve para declarar «t» con el valor «LEGAL_STRINGS[locale]».
  const t = LEGAL_STRINGS[locale];

  // Esta línea sirve para devolver «<Redirect href="/login" />» si «!documentId».
  if (!documentId) return <Redirect href="/login" />;

  // Esta línea sirve para extraer «o» de «getLegalDocument(documentId, locale)».
  const doc = getLegalDocument(documentId, locale);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.flex}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={styles.topBar}>
          {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
          <PrimaryButton
            // Esta línea sirve para pasar la propiedad «label» con el valor «t.backToApp}».
            label={t.backToApp}
            // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
            variant="ghost"
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/login'))}
          />
          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={[styles.segmented, { borderColor: theme.border }]} accessibilityRole="radiogroup" accessibilityLabel={t.languageLabel}>
            {/* Esta línea sirve para recorrer «(['es', 'en'] as const)» y mostrar un bloque por elemento. */}
            {(['es', 'en'] as const).map((code) => (
              // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
              <Pressable
                // Esta línea sirve para identificar el elemento de la lista con «code}».
                key={code}
                // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «radio».
                accessibilityRole="radio"
                // Esta línea sirve para pasar la propiedad «accessibilityState» con el valor «{ selected: locale === code }}».
                accessibilityState={{ selected: locale === code }}
                // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «t.languageNames[code]}».
                accessibilityLabel={t.languageNames[code]}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => setLocale(code)}
                // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.segment, locale === code && { backgro».
                style={[styles.segment, locale === code && { backgroundColor: theme.accent }]}
                // Esta línea sirve para pasar la propiedad «hitSlop» con el valor «6}».
                hitSlop={6}
              >
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold" style={locale === code ? styles.segmentActive : undefined}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{code.toUpperCase()}». */}
                  {code.toUpperCase()}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView contentContainerStyle={styles.content}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" accessibilityRole="header">
            {/* Esta línea sirve para mostrar el valor «doc.content.title». */}
            {doc.content.title}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar la versión y la fecha de actualización del documento. */}
            {t.versionLine(doc.version, formatLegalDate(doc.updatedAt, locale))}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «LegalText». */}
          <LegalText text={doc.content.summary} locale={locale} />

          {/* Esta línea sirve para mostrar el contenido dinámico «{(doc.status === 'draft' || !doc.translationReviewed) && (». */}
          {(doc.status === 'draft' || !doc.translationReviewed) && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView type="backgroundElement" style={styles.warning} accessibilityRole="alert">
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={TriangleAlert} size={16} color="#F59E0B" />
              {/* Esta línea sirve para abrir el componente «View». */}
              <View style={styles.flex}>
                {/* Esta línea sirve para mostrar el elemento solo si «doc.status === 'draft'». */}
                {doc.status === 'draft' && <ThemedText type="small">{t.draftNotice}</ThemedText>}
                {/* Esta línea sirve para mostrar el elemento solo si «!doc.translationReviewed». */}
                {!doc.translationReviewed && <ThemedText type="small">{t.translationNotice}</ThemedText>}
                {/* Esta línea sirve para mostrar el elemento solo si «missingOwnerFields().length > 0». */}
                {missingOwnerFields().length > 0 && <ThemedText type="small">{t.pendingFieldsNotice}</ThemedText>}
              </View>
            </ThemedView>
          )}

          {/* Esta línea sirve para recorrer «doc.content.sections» y mostrar un bloque por elemento. */}
          {doc.content.sections.map((section) => (
            // Esta línea sirve para abrir el componente «View».
            <View key={section.id} style={styles.section}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="subtitle" accessibilityRole="header" style={styles.sectionTitle}>
                {/* Esta línea sirve para mostrar el valor «section.title». */}
                {section.title}
              </ThemedText>
              {/* Esta línea sirve para recorrer «section.blocks» y mostrar un bloque por elemento. */}
              {section.blocks.map((block, i) => (
                // Esta línea sirve para abrir el componente «Block».
                <Block key={i} block={block} locale={locale} />
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «{ flex: 1 }».
  flex: { flex: 1 },
  // Esta línea sirve para declarar la propiedad «safeArea» con el valor o tipo «{ flex: 1, alignItems: 'center' }».
  safeArea: { flex: 1, alignItems: 'center' },
  // Esta línea sirve para declarar la propiedad «topBar» con el valor o tipo «{».
  topBar: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.two».
    paddingTop: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «segmented» con «flexDirection: 'row', borderWidth: 1, borderRadius…».
  segmented: { flexDirection: 'row', borderWidth: 1, borderRadius: 10, padding: 2 },
  // Esta línea sirve para definir el estilo «segment» con «paddingHorizontal: Spacing.two, paddingVertical: S…».
  segment: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.one, borderRadius: 8, minWidth: 40, alignItems: 'center' },
  // Esta línea sirve para declarar la propiedad «segmentActive» con el valor o tipo «{ color: '#FFFFFF' }».
  segmentActive: { color: '#FFFFFF' },
  // Esta línea sirve para declarar la propiedad «content» con el valor o tipo «{».
  content: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'center'».
    alignSelf: 'center',
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.three».
    paddingVertical: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para definir el estilo «warning» con «flexDirection: 'row', gap: Spacing.two, padding: S…».
  warning: { flexDirection: 'row', gap: Spacing.two, padding: Spacing.three, borderRadius: Spacing.three },
  // Esta línea sirve para declarar la propiedad «section» con el valor o tipo «{ gap: Spacing.two }».
  section: { gap: Spacing.two },
  // Esta línea sirve para definir el estilo «sectionTitle» con «fontSize: 20, lineHeight: 26, marginTop: Spacing.t…».
  sectionTitle: { fontSize: 20, lineHeight: 26, marginTop: Spacing.two },
  // Esta línea sirve para definir el estilo «note» con «padding: Spacing.three, borderRadius: Spacing.thre…».
  note: { padding: Spacing.three, borderRadius: Spacing.three, borderLeftWidth: 3 },
  // Esta línea sirve para declarar la propiedad «list» con el valor o tipo «{ gap: Spacing.two }».
  list: { gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «listItem» con el valor o tipo «{ flexDirection: 'row', gap: Spacing.two }».
  listItem: { flexDirection: 'row', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «rowCard» con «padding: Spacing.three, borderRadius: Spacing.thre…».
  rowCard: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «rowCell» con el valor o tipo «{ gap: Spacing.half }».
  rowCell: { gap: Spacing.half },
  // Esta línea sirve para definir el estilo «pending» con «backgroundColor: 'rgba(245, 158, 11, 0.2)', color:…».
  pending: { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#B45309', fontWeight: '600' },
});

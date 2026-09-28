import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TriangleAlert } from 'lucide-react-native';
import {
  formatLegalDate,
  getLegalDocument,
  LEGAL_STRINGS,
  missingOwnerFields,
  resolveLegalText,
  type LegalBlock,
  type LegalLocale,
} from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { legalDocumentFromSlug } from '@/lib/legal-routes';
import { useLegalLocaleStore } from '@/store/legal-locale-store';

/** Texto con marcadores {{campo}}: un dato del responsable sin completar se resalta como "[Pendiente: …]". */
function LegalText({ text, locale, type = 'default' }: { text: string; locale: LegalLocale; type?: 'default' | 'small' }) {
  return (
    <ThemedText type={type}>
      {resolveLegalText(text, locale).map((segment, i) =>
        segment.pending ? (
          <ThemedText key={i} type={type} style={styles.pending}>
            {segment.text}
          </ThemedText>
        ) : (
          segment.text
        )
      )}
    </ThemedText>
  );
}

function Block({ block, locale }: { block: LegalBlock; locale: LegalLocale }) {
  const theme = useTheme();

  switch (block.type) {
    case 'p':
      return <LegalText text={block.text} locale={locale} />;
    case 'note':
      return (
        <ThemedView type="backgroundElement" style={[styles.note, { borderColor: theme.accent }]}>
          <LegalText text={block.text} locale={locale} />
        </ThemedView>
      );
    case 'list':
      return (
        <View style={styles.list}>
          {block.items.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <ThemedText aria-hidden>•</ThemedText>
              <View style={styles.flex}>
                <LegalText text={item} locale={locale} />
              </View>
            </View>
          ))}
        </View>
      );
    case 'table':
      // En pantallas angostas una tabla no entra: cada fila se muestra como
      // una tarjeta con "encabezado: valor", más legible y accesible.
      return (
        <View style={styles.list}>
          {block.rows.map((row, i) => (
            <ThemedView key={i} type="backgroundElement" style={styles.rowCard}>
              <ThemedText type="smallBold">{resolveLegalText(row[0], locale).map((s) => s.text).join('')}</ThemedText>
              {row.slice(1).map((cell, j) => (
                <View key={j} style={styles.rowCell}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {block.headers[j + 1]}
                  </ThemedText>
                  <LegalText text={cell} locale={locale} type="small" />
                </View>
              ))}
            </ThemedView>
          ))}
        </View>
      );
  }
}

export default function LegalDocumentScreen() {
  const theme = useTheme();
  const { doc: slug } = useLocalSearchParams<{ doc: string }>();
  const documentId = legalDocumentFromSlug(slug);
  const locale = useLegalLocaleStore((s) => s.locale);
  const setLocale = useLegalLocaleStore((s) => s.setLocale);
  const t = LEGAL_STRINGS[locale];

  if (!documentId) return <Redirect href="/login" />;

  const doc = getLegalDocument(documentId, locale);

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <PrimaryButton
            label={t.backToApp}
            variant="ghost"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/login'))}
          />
          <View style={[styles.segmented, { borderColor: theme.border }]} accessibilityRole="radiogroup" accessibilityLabel={t.languageLabel}>
            {(['es', 'en'] as const).map((code) => (
              <Pressable
                key={code}
                accessibilityRole="radio"
                accessibilityState={{ selected: locale === code }}
                accessibilityLabel={t.languageNames[code]}
                onPress={() => setLocale(code)}
                style={[styles.segment, locale === code && { backgroundColor: theme.accent }]}
                hitSlop={6}
              >
                <ThemedText type="smallBold" style={locale === code ? styles.segmentActive : undefined}>
                  {code.toUpperCase()}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" accessibilityRole="header">
            {doc.content.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t.versionLine(doc.version, formatLegalDate(doc.updatedAt, locale))}
          </ThemedText>
          <LegalText text={doc.content.summary} locale={locale} />

          {(doc.status === 'draft' || !doc.translationReviewed) && (
            <ThemedView type="backgroundElement" style={styles.warning} accessibilityRole="alert">
              <Icon icon={TriangleAlert} size={16} color="#F59E0B" />
              <View style={styles.flex}>
                {doc.status === 'draft' && <ThemedText type="small">{t.draftNotice}</ThemedText>}
                {!doc.translationReviewed && <ThemedText type="small">{t.translationNotice}</ThemedText>}
                {missingOwnerFields().length > 0 && <ThemedText type="small">{t.pendingFieldsNotice}</ThemedText>}
              </View>
            </ThemedView>
          )}

          {doc.content.sections.map((section) => (
            <View key={section.id} style={styles.section}>
              <ThemedText type="subtitle" accessibilityRole="header" style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} locale={locale} />
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center' },
  topBar: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  segmented: { flexDirection: 'row', borderWidth: 1, borderRadius: 10, padding: 2 },
  segment: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.one, borderRadius: 8, minWidth: 40, alignItems: 'center' },
  segmentActive: { color: '#FFFFFF' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  warning: { flexDirection: 'row', gap: Spacing.two, padding: Spacing.three, borderRadius: Spacing.three },
  section: { gap: Spacing.two },
  sectionTitle: { fontSize: 20, lineHeight: 26, marginTop: Spacing.two },
  note: { padding: Spacing.three, borderRadius: Spacing.three, borderLeftWidth: 3 },
  list: { gap: Spacing.two },
  listItem: { flexDirection: 'row', gap: Spacing.two },
  rowCard: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.two },
  rowCell: { gap: Spacing.half },
  pending: { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#B45309', fontWeight: '600' },
});

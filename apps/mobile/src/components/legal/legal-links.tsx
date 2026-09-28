import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { LEGAL_DOCUMENT_IDS, LEGAL_STRINGS } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { LEGAL_ROUTES } from '@/lib/legal-routes';

/** Enlaces a los tres documentos legales (pie de login/registro). */
export function LegalLinks() {
  const t = LEGAL_STRINGS.es;

  return (
    <View style={styles.row} accessibilityRole="menu" accessibilityLabel={t.legalSectionTitle}>
      {LEGAL_DOCUMENT_IDS.map((id) => (
        <ThemedText
          key={id}
          type="small"
          themeColor="textSecondary"
          accessibilityRole="link"
          style={styles.link}
          onPress={() => router.push(LEGAL_ROUTES[id])}
        >
          {t.documentNames[id]}
        </ThemedText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: Spacing.three, rowGap: Spacing.one },
  link: { textDecorationLine: 'underline', paddingVertical: Spacing.one },
});

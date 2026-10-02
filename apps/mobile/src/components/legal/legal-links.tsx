import { Fragment } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { LEGAL_DOCUMENT_IDS, LEGAL_STRINGS } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { FormMaxWidth, Spacing } from '@/constants/theme';
import { LEGAL_ROUTES } from '@/lib/legal-routes';

/**
 * Enlaces a los tres documentos legales (pie de login/registro). Ocupa el
 * ancho del formulario y usa los nombres cortos para que en pantallas
 * angostas haga salto de línea limpio en vez de desbordarse.
 */
export function LegalLinks() {
  const t = LEGAL_STRINGS.es;

  return (
    <View style={styles.row} accessibilityRole="menu" accessibilityLabel={t.legalSectionTitle}>
      {LEGAL_DOCUMENT_IDS.map((id, index) => (
        <Fragment key={id}>
          {index > 0 && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.separator}>
              ·
            </ThemedText>
          )}
          <ThemedText
            type="small"
            themeColor="textSecondary"
            accessibilityRole="link"
            accessibilityLabel={t.documentNames[id]}
            style={styles.link}
            onPress={() => router.push(LEGAL_ROUTES[id])}
          >
            {t.shortNames[id]}
          </ThemedText>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    maxWidth: FormMaxWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: Spacing.two,
  },
  link: { textDecorationLine: 'underline', textAlign: 'center', paddingVertical: Spacing.one },
  separator: { paddingVertical: Spacing.one },
});

// Esta línea sirve para importar «Fragment» desde «react».
import { Fragment } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «StyleSheet, View» desde «react-native».
import { StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «LEGAL_DOCUMENT_IDS, LEGAL_STRINGS» desde «@sanken/core».
import { LEGAL_DOCUMENT_IDS, LEGAL_STRINGS } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «FormMaxWidth, Spacing» desde «@/constants/theme».
import { FormMaxWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «LEGAL_ROUTES» desde «@/lib/legal-routes».
import { LEGAL_ROUTES } from '@/lib/legal-routes';

/**
 * Enlaces a los tres documentos legales (pie de login/registro). Ocupa el
 * ancho del formulario y usa los nombres cortos para que en pantallas
 * angostas haga salto de línea limpio en vez de desbordarse.
 */
// Esta línea sirve para declarar la función «LegalLinks».
export function LegalLinks() {
  // Esta línea sirve para declarar «t» con el valor «LEGAL_STRINGS.es».
  const t = LEGAL_STRINGS.es;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={styles.row} accessibilityRole="menu" accessibilityLabel={t.legalSectionTitle}>
      {/* Esta línea sirve para recorrer «LEGAL_DOCUMENT_IDS» y mostrar un bloque por elemento. */}
      {LEGAL_DOCUMENT_IDS.map((id, index) => (
        // Esta línea sirve para abrir el componente «Fragment».
        <Fragment key={id}>
          {/* Esta línea sirve para mostrar el bloque solo si «index > 0». */}
          {index > 0 && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary" style={styles.separator}>
              {/* Esta línea sirve para mostrar el contenido dinámico «·». */}
              ·
            </ThemedText>
          )}
          {/* Esta línea sirve para abrir el elemento «ThemedText» con sus atributos en varias líneas. */}
          <ThemedText
            // Esta línea sirve para definir el atributo «type» con el valor «small».
            type="small"
            // Esta línea sirve para definir el atributo «themeColor» con el valor «textSecondary».
            themeColor="textSecondary"
            // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «link».
            accessibilityRole="link"
            // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «t.documentNames[id]}».
            accessibilityLabel={t.documentNames[id]}
            // Esta línea sirve para pasar la propiedad «style» con el valor «styles.link}».
            style={styles.link}
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => router.push(LEGAL_ROUTES[id])}
          >
            {/* Esta línea sirve para mostrar el contenido dinámico «{t.shortNames[id]}». */}
            {t.shortNames[id]}
          </ThemedText>
        </Fragment>
      ))}
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «FormMaxWidth».
    maxWidth: FormMaxWidth,
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «flexWrap» con el valor o tipo «'wrap'».
    flexWrap: 'wrap',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «columnGap» con el valor o tipo «Spacing.two».
    columnGap: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «link» con «textDecorationLine: 'underline', textAlign: 'cente…».
  link: { textDecorationLine: 'underline', textAlign: 'center', paddingVertical: Spacing.one },
  // Esta línea sirve para declarar la propiedad «separator» con el valor o tipo «{ paddingVertical: Spacing.one }».
  separator: { paddingVertical: Spacing.one },
});

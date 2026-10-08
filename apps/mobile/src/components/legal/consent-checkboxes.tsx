// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, StyleSheet, View» desde «react-native».
import { Pressable, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «Check» desde «lucide-react-native».
import { Check } from 'lucide-react-native';
// Esta línea sirve para importar «LEGAL_STRINGS, type ConsentType, type LegalLocale» desde «@sanken/core».
import { LEGAL_STRINGS, type ConsentType, type LegalLocale } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «LEGAL_ROUTES» desde «@/lib/legal-routes».
import { LEGAL_ROUTES } from '@/lib/legal-routes';

// Esta línea sirve para declarar la interfaz «ConsentCheckboxesProps».
interface ConsentCheckboxesProps {
  // Esta línea sirve para declarar la propiedad «consents» con el valor o tipo «ConsentType[]».
  consents: ConsentType[];
  // Esta línea sirve para declarar la propiedad «values» con el valor o tipo «Partial<Record<ConsentType, boolean>>».
  values: Partial<Record<ConsentType, boolean>>;
  // Esta línea sirve para declarar la propiedad «onChange» con el valor o tipo «(type: ConsentType, checked: boolean) => void».
  onChange: (type: ConsentType, checked: boolean) => void;
  // Esta línea sirve para declarar el campo de errores por tipo de consentimiento.
  errors?: Partial<Record<ConsentType, string | undefined>>;
  // Esta línea sirve para declarar la propiedad «disabled» con el valor o tipo «boolean».
  disabled?: boolean;
  // Esta línea sirve para declarar la propiedad «locale» con el valor o tipo «LegalLocale».
  locale?: LegalLocale;
}

/**
 * Una casilla por consentimiento (nunca una sola genérica), espejo de
 * apps/web/src/components/legal/ConsentCheckboxes.tsx. Tocar el nombre del
 * documento lo abre dentro de la app (/legal/...); tocar el resto de la fila
 * marca la casilla. Para lectores de pantalla la fila es un "checkbox" con
 * una acción extra para abrir el documento.
 */
// Esta línea sirve para declarar la función «ConsentCheckboxes».
export function ConsentCheckboxes({ consents, values, onChange, errors, disabled, locale = 'es' }: ConsentCheckboxesProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para declarar «t» con el valor «LEGAL_STRINGS[locale]».
  const t = LEGAL_STRINGS[locale];

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={styles.list}>
      {/* Esta línea sirve para recorrer «consents» y calcular qué mostrar por elemento. */}
      {consents.map((type) => {
        // Esta línea sirve para extraer «abe» de «t.consentLabels[type]».
        const label = t.consentLabels[type];
        // Esta línea sirve para extraer «hecke» de «values[type] === true».
        const checked = values[type] === true;
        // Esta línea sirve para extraer «rro» de «errors?.[type]».
        const error = errors?.[type];
        // Esta línea sirve para extraer «penDocumen» de «() => router.push(LEGAL_ROUTES[label.doc».
        const openDocument = () => router.push(LEGAL_ROUTES[label.document]);

        // Esta línea sirve para devolver la interfaz del componente.
        return (
          // Esta línea sirve para abrir el componente «View».
          <View key={type} style={styles.item}>
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para pasar la propiedad «testID» con el valor «`consent-${type}`}».
              testID={`consent-${type}`}
              // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «checkbox».
              accessibilityRole="checkbox"
              // Esta línea sirve para pasar la propiedad «accessibilityState» con el valor «{ checked, disabled }}».
              accessibilityState={{ checked, disabled }}
              // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «`${label.before}${label.link}${label.after}`}».
              accessibilityLabel={`${label.before}${label.link}${label.after}`}
              // Esta línea sirve para pasar la propiedad «accessibilityHint» con el valor «error}».
              accessibilityHint={error}
              // Esta línea sirve para pasar la propiedad «accessibilityActions» con el valor «[{ name: 'activate' }, { name: 'openDocument'».
              accessibilityActions={[{ name: 'activate' }, { name: 'openDocument', label: label.link }]}
              // Esta línea sirve para asignar el manejador del evento «onAccessibilityAction».
              onAccessibilityAction={(event) => {
                // Esta línea sirve para llamar a «openDocument» si «event.nativeEvent.actionName === 'openDocument'».
                if (event.nativeEvent.actionName === 'openDocument') openDocument();
                // Esta línea sirve para alternar el estado de la casilla.
                else onChange(type, !checked);
              }}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «disabled}».
              disabled={disabled}
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => onChange(type, !checked)}
              // Esta línea sirve para pasar la propiedad «style» con el valor «styles.row}».
              style={styles.row}
              // Esta línea sirve para pasar la propiedad «hitSlop» con el valor «4}».
              hitSlop={4}
            >
              {/* Esta línea sirve para abrir el elemento «View» con sus atributos en varias líneas. */}
              <View
                // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                style={[
                  // Esta línea sirve para agregar el estilo «styles.box».
                  styles.box,
                  // Esta línea sirve para agregar un elemento cuyo «borderColor» es «error ? '#FF4D5E' : checked ? theme.acce…».
                  { borderColor: error ? '#FF4D5E' : checked ? theme.accent : theme.textSecondary },
                  // Esta línea sirve para aplicar el estilo «backgroundColor: theme.accent },…» solo si «checked».
                  checked && { backgroundColor: theme.accent },
                ]}
              >
                {/* Esta línea sirve para mostrar el elemento solo si «checked». */}
                {checked && <Icon icon={Check} size={14} color="#FFFFFF" />}
              </View>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" style={styles.label}>
                {/* Esta línea sirve para mostrar el valor «label.before». */}
                {label.before}
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="linkPrimary" style={styles.link} onPress={openDocument}>
                  {/* Esta línea sirve para mostrar el valor «label.link». */}
                  {label.link}
                </ThemedText>
                {/* Esta línea sirve para mostrar el valor «label.after». */}
                {label.after}
              </ThemedText>
            </Pressable>
            {/* Esta línea sirve para mostrar el bloque solo si «error». */}
            {error && (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" style={styles.error}>
                {/* Esta línea sirve para mostrar el valor «error». */}
                {error}
              </ThemedText>
            )}
          </View>
        );
      })}
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «list» con el valor o tipo «{ gap: Spacing.two, alignSelf: 'stretch' }».
  list: { gap: Spacing.two, alignSelf: 'stretch' },
  // Esta línea sirve para declarar la propiedad «item» con el valor o tipo «{ gap: Spacing.one }».
  item: { gap: Spacing.one },
  // Esta línea sirve para definir el estilo «row» con «flexDirection: 'row', alignItems: 'flex-start', ga…».
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, minHeight: 44 },
  // Esta línea sirve para declarar la propiedad «box» con el valor o tipo «{».
  box: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «22».
    width: 22,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «22».
    height: 22,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «6».
    borderRadius: 6,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «2».
    borderWidth: 2,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «1».
    marginTop: 1,
  },
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «{ flex: 1 }».
  label: { flex: 1 },
  // Esta línea sirve para definir el estilo «link» con «fontSize: 14, textDecorationLine: 'underline' },…».
  link: { fontSize: 14, textDecorationLine: 'underline' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E', marginLeft: 30 }».
  error: { color: '#FF4D5E', marginLeft: 30 },
});

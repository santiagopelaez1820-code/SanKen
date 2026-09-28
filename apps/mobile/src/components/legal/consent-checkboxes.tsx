import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { LEGAL_STRINGS, type ConsentType, type LegalLocale } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LEGAL_ROUTES } from '@/lib/legal-routes';

interface ConsentCheckboxesProps {
  consents: ConsentType[];
  values: Partial<Record<ConsentType, boolean>>;
  onChange: (type: ConsentType, checked: boolean) => void;
  errors?: Partial<Record<ConsentType, string | undefined>>;
  disabled?: boolean;
  locale?: LegalLocale;
}

/**
 * Una casilla por consentimiento (nunca una sola genérica), espejo de
 * apps/web/src/components/legal/ConsentCheckboxes.tsx. Tocar el nombre del
 * documento lo abre dentro de la app (/legal/...); tocar el resto de la fila
 * marca la casilla. Para lectores de pantalla la fila es un "checkbox" con
 * una acción extra para abrir el documento.
 */
export function ConsentCheckboxes({ consents, values, onChange, errors, disabled, locale = 'es' }: ConsentCheckboxesProps) {
  const theme = useTheme();
  const t = LEGAL_STRINGS[locale];

  return (
    <View style={styles.list}>
      {consents.map((type) => {
        const label = t.consentLabels[type];
        const checked = values[type] === true;
        const error = errors?.[type];
        const openDocument = () => router.push(LEGAL_ROUTES[label.document]);

        return (
          <View key={type} style={styles.item}>
            <Pressable
              testID={`consent-${type}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked, disabled }}
              accessibilityLabel={`${label.before}${label.link}${label.after}`}
              accessibilityHint={error}
              accessibilityActions={[{ name: 'activate' }, { name: 'openDocument', label: label.link }]}
              onAccessibilityAction={(event) => {
                if (event.nativeEvent.actionName === 'openDocument') openDocument();
                else onChange(type, !checked);
              }}
              disabled={disabled}
              onPress={() => onChange(type, !checked)}
              style={styles.row}
              hitSlop={4}
            >
              <View
                style={[
                  styles.box,
                  { borderColor: error ? '#FF4D5E' : checked ? theme.accent : theme.textSecondary },
                  checked && { backgroundColor: theme.accent },
                ]}
              >
                {checked && <Icon icon={Check} size={14} color="#FFFFFF" />}
              </View>
              <ThemedText type="small" style={styles.label}>
                {label.before}
                <ThemedText type="linkPrimary" style={styles.link} onPress={openDocument}>
                  {label.link}
                </ThemedText>
                {label.after}
              </ThemedText>
            </Pressable>
            {error && (
              <ThemedText type="small" style={styles.error}>
                {error}
              </ThemedText>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two, alignSelf: 'stretch' },
  item: { gap: Spacing.one },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, minHeight: 44 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  label: { flex: 1 },
  link: { fontSize: 14, textDecorationLine: 'underline' },
  error: { color: '#FF4D5E', marginLeft: 30 },
});

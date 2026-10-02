import { Platform, Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { Search, X } from 'lucide-react-native';

import { Icon } from '@/components/ui/icon';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface SearchFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText' | 'style'> {
  value: string;
  onChangeText: (value: string) => void;
}

/** Campo de búsqueda compacto: lupa + input + botón para limpiar (solo cuando hay texto). */
export function SearchField({ value, onChangeText, placeholder = 'Buscar…', ...props }: SearchFieldProps) {
  const theme = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <Icon icon={Search} size={16} color={theme.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel={placeholder}
        style={[styles.input, { color: theme.text }]}
        {...props}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
          style={[styles.clear, { backgroundColor: theme.backgroundSelected }]}>
          <Icon icon={X} size={12} color={theme.text} strokeWidth={2.5} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 42,
    borderRadius: Spacing.three,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
  },
  input: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    paddingVertical: Spacing.two,
    // En web el <input> dibujaba su propio recuadro de foco dentro de la
    // pastilla; el contenedor ya marca el campo, así que se quita.
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
  clear: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, type TextInputProps, useColorScheme, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { Icon } from '@/components/ui/icon';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
}

export function TextField({ label, style, secureTextEntry, ...props }: TextFieldProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : (scheme ?? 'dark')];
  const [isVisible, setIsVisible] = useState(false);
  const isPasswordField = secureTextEntry === true;

  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View style={styles.inputWrap}>
        <TextInput
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPasswordField && !isVisible}
          style={[
            styles.input,
            { color: colors.text, backgroundColor: colors.backgroundElement, borderColor: colors.backgroundSelected },
            isPasswordField && styles.inputWithToggle,
            style,
          ]}
          {...props}
        />
        {isPasswordField && (
          <Pressable
            onPress={() => setIsVisible((v) => !v)}
            hitSlop={8}
            style={styles.toggle}
            accessibilityLabel={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            <Icon icon={isVisible ? EyeOff : Eye} size={20} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
    alignSelf: 'stretch',
  },
  inputWrap: {
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  inputWithToggle: {
    paddingRight: Spacing.three * 2 + 20,
  },
  toggle: {
    position: 'absolute',
    right: Spacing.three,
  },
});

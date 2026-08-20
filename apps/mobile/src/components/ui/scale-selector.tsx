import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

interface ScaleSelectorProps {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  max?: number;
}

export function ScaleSelector({ label, value, onChange, max = 5 }: ScaleSelectorProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : (scheme ?? 'dark')];
  const options = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[
                styles.dot,
                {
                  backgroundColor: selected ? colors.accent : colors.backgroundElement,
                  borderColor: selected ? colors.accent : 'transparent',
                },
              ]}>
              <ThemedText type="smallBold" themeColor={selected ? 'background' : 'textSecondary'}>
                {option}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two },
  row: { flexDirection: 'row', gap: Spacing.two },
  dot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

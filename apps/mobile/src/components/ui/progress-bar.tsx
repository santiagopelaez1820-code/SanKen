import { StyleSheet, useColorScheme, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : (scheme ?? 'dark')];
  const ratio = total > 0 ? Math.min(current / total, 1) : 0;

  return (
    <View style={[styles.track, { backgroundColor: colors.backgroundElement }]}>
      <View style={[styles.fill, { backgroundColor: colors.accent, width: `${ratio * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
    alignSelf: 'stretch',
    marginBottom: Spacing.four,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});

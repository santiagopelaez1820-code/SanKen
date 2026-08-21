import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      tintColor={colors.accent}
      labelStyle={{ selected: { color: colors.accent } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="dashboard">
        <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.bar.fill" md="bar_chart" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Label>Historial</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="clock.arrow.circlepath" md="history" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="measurements">
        <NativeTabs.Trigger.Label>Medidas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="ruler.fill" md="straighten" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="prs">
        <NativeTabs.Trigger.Label>PR</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="trophy.fill" md="emoji_events" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

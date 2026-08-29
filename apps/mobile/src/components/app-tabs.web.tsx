import { router } from 'expo-router';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Image, Pressable, View, StyleSheet } from 'react-native';
import { BarChart3, Flag, Home, User, type LucideIcon } from 'lucide-react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useTheme } from '@/hooks/use-theme';

import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon={Home}>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="dashboard" href="/dashboard" asChild>
            <TabButton icon={BarChart3}>Progreso</TabButton>
          </TabTrigger>
          <TabTrigger name="retos" href="/retos" asChild>
            <TabButton icon={Flag}>Retos</TabButton>
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton icon={User}>Perfil</TabButton>
          </TabTrigger>
          <TabTrigger name="history" href="/history" style={styles.hidden} />
          <TabTrigger name="prs" href="/prs" style={styles.hidden} />
          <TabTrigger name="measurements" href="/measurements" style={styles.hidden} />
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  icon: Icon,
  ...props
}: TabTriggerSlotProps & { icon: LucideIcon }) {
  const theme = useTheme();
  const color = isFocused ? theme.accent : theme.textSecondary;

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={[styles.tabButtonView, styles.tabButtonRow]}>
        <Icon size={16} color={color} />
        <ThemedText type="small" themeColor={isFocused ? 'accent' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <Pressable style={styles.brand} onPress={() => router.push('/')}>
          <Image source={require('@/assets/images/logo.png')} style={styles.brandLogo} resizeMode="contain" />
          <ThemedText type="smallBold" style={styles.brandText}>
            SANKEN
          </ThemedText>
        </Pressable>

        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginRight: 'auto',
  },
  brandLogo: {
    width: 22,
    height: 22,
  },
  brandText: {},
  pressed: {
    opacity: 0.7,
  },
  hidden: {
    width: 0,
    height: 0,
    display: 'none',
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  tabButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});

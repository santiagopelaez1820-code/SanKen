import { useEffect, useMemo, useState } from 'react';
import { router, type Href } from 'expo-router';
import { AppState, Pressable, StyleSheet, View } from 'react-native';
import {
  Apple,
  BatteryCharging,
  CalendarCheck,
  ChevronRight,
  Dumbbell,
  Droplets,
  Flame,
  HeartPulse,
  Moon,
  PersonStanding,
  RefreshCw,
  ShieldCheck,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react-native';
import { getDailyTip, localDayKey, type DailyTipCategory, type DailyTipLink } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const CATEGORY_ICONS: Record<DailyTipCategory, LucideIcon> = {
  Entrenamiento: Dumbbell,
  Técnica: Target,
  Recuperación: RefreshCw,
  Descanso: BatteryCharging,
  Sueño: Moon,
  Hidratación: Droplets,
  Alimentación: Apple,
  Movilidad: PersonStanding,
  Cardio: HeartPulse,
  Progresión: TrendingUp,
  Motivación: Flame,
  Hábitos: CalendarCheck,
  'Prevención de lesiones': ShieldCheck,
};

/** Pantallas existentes a las que puede llevar un consejo. */
const TIP_LINKS: Record<DailyTipLink, { href: Href; label: string }> = {
  nutrition: { href: '/nutricion', label: 'Ver nutrición' },
  measurements: { href: '/measurements', label: 'Ver medidas' },
  history: { href: '/history', label: 'Ver historial' },
  calendar: { href: '/calendario', label: 'Abrir calendario' },
  prs: { href: '/prs', label: 'Ver PR' },
  progress: { href: '/dashboard', label: 'Ver progreso' },
};

/**
 * "Consejo del día" del Home — tarjeta compacta y deliberadamente plana (sin
 * glow ni gradiente) para no competir con Entrenamiento de hoy, la racha ni
 * el progreso. El consejo sale de getDailyTip (core): determinista por día
 * local, sin red ni almacenamiento. Solo se recalcula cuando cambia la
 * fecha, también si la app vuelve del segundo plano después de medianoche.
 */
export function DailyTipCard() {
  const theme = useTheme();
  const [dayKey, setDayKey] = useState(() => localDayKey(new Date()));

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setDayKey(localDayKey(new Date()));
    });
    return () => subscription.remove();
  }, []);

  // dayKey es la dependencia real: el consejo solo cambia cuando cambia el día.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tip = useMemo(() => getDailyTip(new Date()), [dayKey]);
  const link = tip.link ? TIP_LINKS[tip.link] : null;

  return (
    <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: `${theme.accent}18` }]}>
        <Icon icon={CATEGORY_ICONS[tip.category]} size={16} color={theme.accent} />
      </View>
      <View style={styles.body}>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.eyebrow}>
          CONSEJO DEL DÍA · {tip.category.toUpperCase()}
        </ThemedText>
        <ThemedText type="smallBold">{tip.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {tip.text}
        </ThemedText>
        {link && (
          <Pressable
            onPress={() => router.push(link.href)}
            hitSlop={8}
            style={styles.link}
            accessibilityRole="link">
            <ThemedText type="smallBold" style={{ color: theme.accent }}>
              {link.label}
            </ThemedText>
            <Icon icon={ChevronRight} size={14} color={theme.accent} />
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    letterSpacing: 1,
    fontWeight: '700',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 2,
    marginTop: Spacing.one,
  },
});

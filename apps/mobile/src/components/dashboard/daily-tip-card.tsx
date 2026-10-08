// Esta línea sirve para importar «useEffect, useMemo, useState» desde «react».
import { useEffect, useMemo, useState } from 'react';
// Esta línea sirve para importar «router, type Href» desde «expo-router».
import { router, type Href } from 'expo-router';
// Esta línea sirve para importar «AppState, Pressable, StyleSheet, View» desde «react-native».
import { AppState, Pressable, StyleSheet, View } from 'react-native';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «Apple» en la lista.
  Apple,
  // Esta línea sirve para incluir el valor «BatteryCharging» en la lista.
  BatteryCharging,
  // Esta línea sirve para incluir el valor «CalendarCheck» en la lista.
  CalendarCheck,
  // Esta línea sirve para incluir el valor «ChevronRight» en la lista.
  ChevronRight,
  // Esta línea sirve para incluir el valor «Dumbbell» en la lista.
  Dumbbell,
  // Esta línea sirve para incluir el valor «Droplets» en la lista.
  Droplets,
  // Esta línea sirve para incluir el valor «Flame» en la lista.
  Flame,
  // Esta línea sirve para incluir el valor «HeartPulse» en la lista.
  HeartPulse,
  // Esta línea sirve para incluir el valor «Moon» en la lista.
  Moon,
  // Esta línea sirve para incluir el valor «PersonStanding» en la lista.
  PersonStanding,
  // Esta línea sirve para incluir el valor «RefreshCw» en la lista.
  RefreshCw,
  // Esta línea sirve para incluir el valor «ShieldCheck» en la lista.
  ShieldCheck,
  // Esta línea sirve para incluir el valor «Target» en la lista.
  Target,
  // Esta línea sirve para incluir el valor «TrendingUp» en la lista.
  TrendingUp,
  // Esta línea sirve para importar el tipo «LucideIcon».
  type LucideIcon,
// Esta línea sirve para terminar la importación desde «lucide-react-native».
} from 'lucide-react-native';
// Esta línea sirve para importar «getDailyTip, localDayKey, type DailyTipCategory, type DailyTipLink» desde «@sanken/core».
import { getDailyTip, localDayKey, type DailyTipCategory, type DailyTipLink } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar «CATEGORY_ICONS» con el valor «{».
const CATEGORY_ICONS: Record<DailyTipCategory, LucideIcon> = {
  // Esta línea sirve para declarar la propiedad «Entrenamiento» con el valor o tipo «Dumbbell».
  Entrenamiento: Dumbbell,
  // Esta línea sirve para asociar la categoría «Técnica» con su ícono.
  Técnica: Target,
  // Esta línea sirve para asociar la categoría «Recuperación» con su ícono.
  Recuperación: RefreshCw,
  // Esta línea sirve para declarar la propiedad «Descanso» con el valor o tipo «BatteryCharging».
  Descanso: BatteryCharging,
  // Esta línea sirve para asociar la categoría «Sueño» con su ícono.
  Sueño: Moon,
  // Esta línea sirve para asociar la categoría «Hidratación» con su ícono.
  Hidratación: Droplets,
  // Esta línea sirve para asociar la categoría «Alimentación» con su ícono.
  Alimentación: Apple,
  // Esta línea sirve para declarar la propiedad «Movilidad» con el valor o tipo «PersonStanding».
  Movilidad: PersonStanding,
  // Esta línea sirve para declarar la propiedad «Cardio» con el valor o tipo «HeartPulse».
  Cardio: HeartPulse,
  // Esta línea sirve para asociar la categoría «Progresión» con su ícono.
  Progresión: TrendingUp,
  // Esta línea sirve para asociar la categoría «Motivación» con su ícono.
  Motivación: Flame,
  // Esta línea sirve para asociar la categoría «Hábitos» con su ícono.
  Hábitos: CalendarCheck,
  // Esta línea sirve para incluir el texto o las clases «Prevención de lesiones…».
  'Prevención de lesiones': ShieldCheck,
};

/** Pantallas existentes a las que puede llevar un consejo. */
// Esta línea sirve para declarar «TIP_LINKS» con el valor «{».
const TIP_LINKS: Record<DailyTipLink, { href: Href; label: string }> = {
  // Esta línea sirve para definir el estilo «nutrition» con «href: '/nutricion', label: 'Ver nutrición' },…».
  nutrition: { href: '/nutricion', label: 'Ver nutrición' },
  // Esta línea sirve para definir el estilo «measurements» con «href: '/measurements', label: 'Ver medidas' },…».
  measurements: { href: '/measurements', label: 'Ver medidas' },
  // Esta línea sirve para declarar la propiedad «history» con el valor o tipo «{ href: '/history', label: 'Ver historial' }».
  history: { href: '/history', label: 'Ver historial' },
  // Esta línea sirve para definir el estilo «calendar» con «href: '/calendario', label: 'Abrir calendario' },…».
  calendar: { href: '/calendario', label: 'Abrir calendario' },
  // Esta línea sirve para declarar la propiedad «prs» con el valor o tipo «{ href: '/prs', label: 'Ver PR' }».
  prs: { href: '/prs', label: 'Ver PR' },
  // Esta línea sirve para declarar la propiedad «progress» con el valor o tipo «{ href: '/dashboard', label: 'Ver progreso' }».
  progress: { href: '/dashboard', label: 'Ver progreso' },
};

/**
 * "Consejo del día" del Home — tarjeta compacta y deliberadamente plana (sin
 * glow ni gradiente) para no competir con Entrenamiento de hoy, la racha ni
 * el progreso. El consejo sale de getDailyTip (core): determinista por día
 * local, sin red ni almacenamiento. Solo se recalcula cuando cambia la
 * fecha, también si la app vuelve del segundo plano después de medianoche.
 */
// Esta línea sirve para declarar la función «DailyTipCard».
export function DailyTipCard() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para crear el estado «dayKey» y su función «setDayKey».
  const [dayKey, setDayKey] = useState(() => localDayKey(new Date()));

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para extraer «ubscriptio» de «AppState.addEventListener('change', (sta».
    const subscription = AppState.addEventListener('change', (state) => {
      // Esta línea sirve para llamar a «setDayKey» si «state === 'active'».
      if (state === 'active') setDayKey(localDayKey(new Date()));
    });
    // Esta línea sirve para devolver «() => subscription.remove()».
    return () => subscription.remove();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
  }, []);

  // dayKey es la dependencia real: el consejo solo cambia cuando cambia el día.
  // Esta línea sirve para obtener «tip» con el hook «useMemo».
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tip = useMemo(() => getDailyTip(new Date()), [dayKey]);
  // Esta línea sirve para extraer «in» de «tip.link ? TIP_LINKS[tip.link] : null».
  const link = tip.link ? TIP_LINKS[tip.link] : null;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={[styles.iconWrap, { backgroundColor: `${theme.accent}18` }]}>
        {/* Esta línea sirve para abrir el componente «Icon». */}
        <Icon icon={CATEGORY_ICONS[tip.category]} size={20} color={theme.accent} />
      </View>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={styles.body}>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="caption" themeColor="textSecondary" style={styles.eyebrow}>
          {/* Esta línea sirve para mostrar el contenido dinámico «CONSEJO DEL DÍA · {tip.category.toUpperCase()}». */}
          CONSEJO DEL DÍA · {tip.category.toUpperCase()}
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="default" style={styles.title}>
          {/* Esta línea sirve para mostrar el valor «tip.title». */}
          {tip.title}
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="default" themeColor="textSecondary" style={styles.text}>
          {/* Esta línea sirve para mostrar el valor «tip.text». */}
          {tip.text}
        </ThemedText>
        {/* Esta línea sirve para mostrar el bloque solo si «link». */}
        {link && (
          // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
          <Pressable
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => router.push(link.href)}
            // Esta línea sirve para pasar la propiedad «hitSlop» con el valor «8}».
            hitSlop={8}
            // Esta línea sirve para pasar la propiedad «style» con el valor «styles.link}».
            style={styles.link}
            // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «link».
            accessibilityRole="link">
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="smallBold" style={{ color: theme.accent }}>
              {/* Esta línea sirve para mostrar el valor «link.label». */}
              {link.label}
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «Icon». */}
            <Icon icon={ChevronRight} size={14} color={theme.accent} />
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'flex-start'».
    alignItems: 'flex-start',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.four».
    paddingVertical: Spacing.four,
  },
  // Esta línea sirve para declarar la propiedad «iconWrap» con el valor o tipo «{».
  iconWrap: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «40».
    width: 40,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «40».
    height: 40,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «12».
    borderRadius: 12,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «body» con el valor o tipo «{».
  body: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «eyebrow» con el valor o tipo «{».
  eyebrow: {
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «1».
    letterSpacing: 1,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'700'».
    fontWeight: '700',
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{».
  title: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «17».
    fontSize: 17,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «22».
    lineHeight: 22,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'700'».
    fontWeight: '700',
  },
  // Esta línea sirve para declarar la propiedad «text» con el valor o tipo «{».
  text: {
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «15».
    fontSize: 15,
    // Esta línea sirve para declarar la propiedad «lineHeight» con el valor o tipo «21».
    lineHeight: 21,
  },
  // Esta línea sirve para declarar la propiedad «link» con el valor o tipo «{».
  link: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'flex-start'».
    alignSelf: 'flex-start',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «2».
    gap: 2,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.one».
    marginTop: Spacing.one,
  },
});

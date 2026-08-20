import { useEffect, useMemo, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { OptionCard } from '@/components/ui/option-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { useOnboardingStore } from '@/store/onboarding-store';

/**
 * Encuesta corta, separada del wizard de 10 pasos de onboarding a propósito
 * — ver la nota equivalente en apps/web/src/pages/LocationSurveyPage.tsx.
 * Cubre a los usuarios que ya tenían onboarding_completed=true antes de que
 * la ubicación jerárquica existiera.
 */
export default function LocationSurveyScreen() {
  const user = useAuthStore((s) => s.user);
  const refreshMe = useAuthStore((s) => s.refreshMe);
  const { questions, loadQuestions, states, isLoadingStates, loadStates, cities, isLoadingCities, loadCities } =
    useOnboardingStore();

  const [countryId, setCountryId] = useState<number | null>(null);
  const [stateId, setStateId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [countryFilter, setCountryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const filteredCountries = useMemo(() => {
    const all = questions?.countries ?? [];
    if (!countryFilter.trim()) return all;
    const needle = countryFilter.trim().toLowerCase();
    return all.filter((c) => c.name.toLowerCase().includes(needle));
  }, [questions, countryFilter]);

  const filteredStates = useMemo(() => {
    if (!stateFilter.trim()) return states;
    const needle = stateFilter.trim().toLowerCase();
    return states.filter((s) => s.name.toLowerCase().includes(needle));
  }, [states, stateFilter]);

  // Ciudades: a diferencia de países/estados (listas chicas, filtradas acá
  // mismo), un estado con datos reales puede tener miles de ciudades (ver
  // ImportLocationData en el backend) — la búsqueda se manda al server
  // (loadCities con `search`), nunca se filtra client-side sobre una lista
  // completa. Debounce de 300ms para no pegarle al server en cada tecla.
  useEffect(() => {
    if (stateId === null) return;
    // Sin debounce para la carga inicial (cityFilter todavía vacío, recién
    // elegido el estado) — el debounce de 300ms solo aplica mientras el
    // usuario tipea una búsqueda.
    const delay = cityFilter.trim() === '' ? 0 : 300;
    const timer = setTimeout(() => {
      loadCities(stateId, cityFilter);
    }, delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId, cityFilter]);

  if (!user) return <Redirect href="/login" />;
  if (!user.onboarding_completed) return <Redirect href="/onboarding" />;
  if (user.has_location) return <Redirect href="/" />;

  const handleSubmit = async () => {
    if (!cityId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await api.patch('/onboarding', { city_id: cityId });
      await refreshMe();
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar tu ubicación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ThemedText type="title" style={styles.title}>
            Bienvenido a SanKen
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Antes de comenzar necesitamos saber dónde entrenas, para personalizar tu experiencia y los rankings.
          </ThemedText>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">País</ThemedText>
            <TextField
              label="Buscar país"
              value={countryFilter}
              onChangeText={setCountryFilter}
              placeholder="Ej. México, España…"
              autoCorrect={false}
            />
            <ThemedView style={styles.optionsList}>
              {filteredCountries.map((c) => (
                <OptionCard
                  key={c.id}
                  label={c.name}
                  selected={countryId === c.id}
                  onPress={() => {
                    setCountryId(c.id);
                    setStateId(null);
                    setStateFilter('');
                    setCityId(null);
                    setCityFilter('');
                    loadStates(c.id);
                  }}
                />
              ))}
            </ThemedView>
          </ThemedView>

          {countryId !== null && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle">Departamento</ThemedText>
              <TextField
                label="Buscar departamento"
                value={stateFilter}
                onChangeText={setStateFilter}
                placeholder="Ej. Antioquia, Cundinamarca…"
                autoCorrect={false}
              />
              {isLoadingStates && (
                <ThemedText type="small" themeColor="textSecondary">Cargando…</ThemedText>
              )}
              <ThemedView style={styles.optionsList}>
                {filteredStates.map((s) => (
                  <OptionCard
                    key={s.id}
                    label={s.name}
                    selected={stateId === s.id}
                    onPress={() => {
                      setStateId(s.id);
                      setCityId(null);
                      setCityFilter('');
                    }}
                  />
                ))}
              </ThemedView>
            </ThemedView>
          )}

          {stateId !== null && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle">Ciudad / Municipio</ThemedText>
              <TextField
                label="Buscar ciudad"
                value={cityFilter}
                onChangeText={setCityFilter}
                placeholder="Ej. Bogotá, Guadalajara…"
                autoCorrect={false}
              />
              {isLoadingCities && (
                <ThemedText type="small" themeColor="textSecondary">Cargando…</ThemedText>
              )}
              {!isLoadingCities && cities.length === 0 && (
                <ThemedText type="small" themeColor="textSecondary">Sin resultados.</ThemedText>
              )}
              <ThemedView style={styles.optionsList}>
                {cities.map((c) => (
                  <OptionCard key={c.id} label={c.name} selected={cityId === c.id} onPress={() => setCityId(c.id)} />
                ))}
              </ThemedView>
              {!isLoadingCities && cities.length >= 50 && (
                <ThemedText type="small" themeColor="textSecondary">
                  Mostrando los primeros {cities.length} resultados — seguí escribiendo para acotar la búsqueda.
                </ThemedText>
              )}
            </ThemedView>
          )}

          {error && (
            <ThemedText type="small" style={styles.error}>
              {error}
            </ThemedText>
          )}

          <PrimaryButton label="Continuar" onPress={handleSubmit} disabled={!cityId} loading={isSubmitting} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    padding: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  title: { marginBottom: Spacing.one },
  subtitle: { marginBottom: Spacing.four },
  section: { gap: Spacing.two, marginBottom: Spacing.four },
  optionsList: { gap: Spacing.two, marginTop: Spacing.two },
  error: { color: '#C9564A', marginBottom: Spacing.two },
});

// Esta línea sirve para importar «useEffect, useMemo, useState» desde «react».
import { useEffect, useMemo, useState } from 'react';
// Esta línea sirve para importar «Redirect, router» desde «expo-router».
import { Redirect, router } from 'expo-router';
// Esta línea sirve para importar «ScrollView, StyleSheet» desde «react-native».
import { ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «OptionCard» desde «@/components/ui/option-card».
import { OptionCard } from '@/components/ui/option-card';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useOnboardingStore» desde «@/store/onboarding-store».
import { useOnboardingStore } from '@/store/onboarding-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Encuesta corta, separada del wizard de 10 pasos de onboarding a propósito
 * — ver la nota equivalente en apps/web/src/pages/LocationSurveyPage.tsx.
 * Cubre a los usuarios que ya tenían onboarding_completed=true antes de que
 * la ubicación jerárquica existiera.
 */
// Esta línea sirve para declarar la función «LocationSurveyScreen».
export default function LocationSurveyScreen() {
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «refreshMe» con el hook «useAuthStore».
  const refreshMe = useAuthStore((s) => s.refreshMe);
  // Esta línea sirve para obtener el cuestionario, los departamentos y las ciudades del store.
  const { questions, loadQuestions, states, isLoadingStates, loadStates, cities, isLoadingCities, loadCities } =
    // Esta línea sirve para llamar a «useOnboardingStore».
    useOnboardingStore();

  // Esta línea sirve para crear el estado «countryId» y su función «setCountryId».
  const [countryId, setCountryId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «stateId» y su función «setStateId».
  const [stateId, setStateId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «cityId» y su función «setCityId».
  const [cityId, setCityId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «countryFilter» y su función «setCountryFilter».
  const [countryFilter, setCountryFilter] = useState('');
  // Esta línea sirve para crear el estado «stateFilter» y su función «setStateFilter».
  const [stateFilter, setStateFilter] = useState('');
  // Esta línea sirve para crear el estado «cityFilter» y su función «setCityFilter».
  const [cityFilter, setCityFilter] = useState('');
  // Esta línea sirve para crear el estado «isSubmitting» y su función «setIsSubmitting».
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Esta línea sirve para crear el estado «error» y su función «setError».
  const [error, setError] = useState<string | null>(null);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadQuestions».
    loadQuestions();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadQuestions».
  }, [loadQuestions]);

  // Esta línea sirve para obtener «filteredCountries» con el hook «useMemo».
  const filteredCountries = useMemo(() => {
    // Esta línea sirve para extraer «l» de «questions?.countries ?? []».
    const all = questions?.countries ?? [];
    // Esta línea sirve para devolver «all» si «!countryFilter.trim()».
    if (!countryFilter.trim()) return all;
    // Esta línea sirve para extraer «eedl» de «countryFilter.trim().toLowerCase()».
    const needle = countryFilter.trim().toLowerCase();
    // Esta línea sirve para filtrar las ciudades que contienen el texto buscado.
    return all.filter((c) => c.name.toLowerCase().includes(needle));
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «questions, countryFilter».
  }, [questions, countryFilter]);

  // Esta línea sirve para obtener «filteredStates» con el hook «useMemo».
  const filteredStates = useMemo(() => {
    // Esta línea sirve para devolver «states» si «!stateFilter.trim()».
    if (!stateFilter.trim()) return states;
    // Esta línea sirve para extraer «eedl» de «stateFilter.trim().toLowerCase()».
    const needle = stateFilter.trim().toLowerCase();
    // Esta línea sirve para filtrar los departamentos que contienen el texto buscado.
    return states.filter((s) => s.name.toLowerCase().includes(needle));
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «states, stateFilter».
  }, [states, stateFilter]);

  // Ciudades: a diferencia de países/estados (listas chicas, filtradas acá
  // mismo), un estado con datos reales puede tener miles de ciudades (ver
  // ImportLocationData en el backend) — la búsqueda se manda al server
  // (loadCities con `search`), nunca se filtra client-side sobre una lista
  // completa. Debounce de 300ms para no pegarle al server en cada tecla.
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «stateId === null».
    if (stateId === null) return;
    // Sin debounce para la carga inicial (cityFilter todavía vacío, recién
    // elegido el estado) — el debounce de 300ms solo aplica mientras el
    // usuario tipea una búsqueda.
    // Esta línea sirve para extraer «ela» de «cityFilter.trim() === '' ? 0 : 300».
    const delay = cityFilter.trim() === '' ? 0 : 300;
    // Esta línea sirve para extraer «ime» de «setTimeout(() => {».
    const timer = setTimeout(() => {
      // Esta línea sirve para llamar a «loadCities» con «stateId, cityFilter».
      loadCities(stateId, cityFilter);
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «ela».
    }, delay);
    // Esta línea sirve para devolver «() => clearTimeout(timer)».
    return () => clearTimeout(timer);
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «stateId, cityFilter».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId, cityFilter]);

  // Esta línea sirve para devolver «<Redirect href="/login" />» si «!user».
  if (!user) return <Redirect href="/login" />;
  // Esta línea sirve para redirigir al onboarding si no lo completó.
  if (!user.onboarding_completed) return <Redirect href="/onboarding" />;
  // Esta línea sirve para devolver «<Redirect href="/" />» si «user.has_location».
  if (user.has_location) return <Redirect href="/" />;

  // Esta línea sirve para extraer «andleSubmi» de «async () => {».
  const handleSubmit = async () => {
    // Esta línea sirve para salir de la función si «!cityId».
    if (!cityId) return;
    // Esta línea sirve para guardar en el estado con «setIsSubmitting» el valor «true)…».
    setIsSubmitting(true);
    // Esta línea sirve para guardar en el estado con «setError» el valor «null)…».
    setError(null);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.patch».
      await api.patch('/onboarding', { city_id: cityId });
      // Esta línea sirve para esperar el resultado de «refreshMe».
      await refreshMe();
      // Esta línea sirve para llamar a «router.replace» con «'/'».
      router.replace('/');
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el estado con «setError» el valor «err instanceof Error ? err.message : 'No se p…».
      setError(err instanceof Error ? err.message : 'No se pudo guardar tu ubicación.');
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsSubmitting» el valor «false)…».
      setIsSubmitting(false);
    }
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.flex}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.flex}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.title}>
            {/* Esta línea sirve para mostrar el texto «Bienvenido a SanKen». */}
            Bienvenido a SanKen
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            {/* Esta línea sirve para explicar por qué se pide la ubicación. */}
            Antes de comenzar necesitamos saber dónde entrenas, para personalizar tu experiencia y los rankings.
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.section}>
            {/* Esta línea sirve para mostrar el texto «País» dentro de «ThemedText». */}
            <ThemedText type="subtitle">País</ThemedText>
            {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
            <TextField
              // Esta línea sirve para definir el atributo «label» con el valor «Buscar país».
              label="Buscar país"
              // Esta línea sirve para pasar la propiedad «value» con el valor «countryFilter}».
              value={countryFilter}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={setCountryFilter}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Ej. México, España…».
              placeholder="Ej. México, España…"
              // Esta línea sirve para pasar la propiedad «autoCorrect» con el valor «false}».
              autoCorrect={false}
            />
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.optionsList}>
              {/* Esta línea sirve para recorrer «filteredCountries» y mostrar un bloque por elemento. */}
              {filteredCountries.map((c) => (
                // Esta línea sirve para abrir el elemento «OptionCard» con sus atributos en varias líneas.
                <OptionCard
                  // Esta línea sirve para identificar el elemento de la lista con «c.id}».
                  key={c.id}
                  // Esta línea sirve para pasar la propiedad «label» con el valor «c.name}».
                  label={c.name}
                  // Esta línea sirve para pasar la propiedad «selected» con el valor «countryId === c.id}».
                  selected={countryId === c.id}
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => {
                    // Esta línea sirve para guardar en el estado con «setCountryId» el valor «c.id)…».
                    setCountryId(c.id);
                    // Esta línea sirve para guardar en el estado con «setStateId» el valor «null)…».
                    setStateId(null);
                    // Esta línea sirve para guardar en el estado con «setStateFilter» el valor «'')…».
                    setStateFilter('');
                    // Esta línea sirve para guardar en el estado con «setCityId» el valor «null)…».
                    setCityId(null);
                    // Esta línea sirve para guardar en el estado con «setCityFilter» el valor «'')…».
                    setCityFilter('');
                    // Esta línea sirve para llamar a «loadStates» con «c.id».
                    loadStates(c.id);
                  }}
                />
              ))}
            </ThemedView>
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «countryId !== null». */}
          {countryId !== null && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView style={styles.section}>
              {/* Esta línea sirve para mostrar el texto «Departamento» dentro de «ThemedText». */}
              <ThemedText type="subtitle">Departamento</ThemedText>
              {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
              <TextField
                // Esta línea sirve para definir el atributo «label» con el valor «Buscar departamento».
                label="Buscar departamento"
                // Esta línea sirve para pasar la propiedad «value» con el valor «stateFilter}».
                value={stateFilter}
                // Esta línea sirve para asignar el manejador del evento «onChangeText».
                onChangeText={setStateFilter}
                // Esta línea sirve para definir el atributo «placeholder» con el valor «Ej. Antioquia, Cundinamarca…».
                placeholder="Ej. Antioquia, Cundinamarca…"
                // Esta línea sirve para pasar la propiedad «autoCorrect» con el valor «false}».
                autoCorrect={false}
              />
              {/* Esta línea sirve para mostrar el bloque solo si «isLoadingStates». */}
              {isLoadingStates && (
                // Esta línea sirve para abrir el componente «Skeleton».
                <Skeleton height={56} borderRadius={Spacing.three} />
              )}
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.optionsList}>
                {/* Esta línea sirve para recorrer «filteredStates» y mostrar un bloque por elemento. */}
                {filteredStates.map((s) => (
                  // Esta línea sirve para abrir el elemento «OptionCard» con sus atributos en varias líneas.
                  <OptionCard
                    // Esta línea sirve para identificar el elemento de la lista con «s.id}».
                    key={s.id}
                    // Esta línea sirve para pasar la propiedad «label» con el valor «s.name}».
                    label={s.name}
                    // Esta línea sirve para pasar la propiedad «selected» con el valor «stateId === s.id}».
                    selected={stateId === s.id}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => {
                      // Esta línea sirve para guardar en el estado con «setStateId» el valor «s.id)…».
                      setStateId(s.id);
                      // Esta línea sirve para guardar en el estado con «setCityId» el valor «null)…».
                      setCityId(null);
                      // Esta línea sirve para guardar en el estado con «setCityFilter» el valor «'')…».
                      setCityFilter('');
                    }}
                  />
                ))}
              </ThemedView>
            </ThemedView>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «stateId !== null». */}
          {stateId !== null && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView style={styles.section}>
              {/* Esta línea sirve para mostrar el texto «Ciudad / Municipio» dentro de «ThemedText». */}
              <ThemedText type="subtitle">Ciudad / Municipio</ThemedText>
              {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
              <TextField
                // Esta línea sirve para definir el atributo «label» con el valor «Buscar ciudad».
                label="Buscar ciudad"
                // Esta línea sirve para pasar la propiedad «value» con el valor «cityFilter}».
                value={cityFilter}
                // Esta línea sirve para asignar el manejador del evento «onChangeText».
                onChangeText={setCityFilter}
                // Esta línea sirve para definir el atributo «placeholder» con el valor «Ej. Bogotá, Guadalajara…».
                placeholder="Ej. Bogotá, Guadalajara…"
                // Esta línea sirve para pasar la propiedad «autoCorrect» con el valor «false}».
                autoCorrect={false}
              />
              {/* Esta línea sirve para mostrar el bloque solo si «isLoadingCities». */}
              {isLoadingCities && (
                // Esta línea sirve para abrir el componente «Skeleton».
                <Skeleton height={56} borderRadius={Spacing.three} />
              )}
              {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingCities && cities.length === 0». */}
              {!isLoadingCities && cities.length === 0 && (
                // Esta línea sirve para mostrar el texto «Sin resultados.» dentro de «ThemedText».
                <ThemedText type="small" themeColor="textSecondary">Sin resultados.</ThemedText>
              )}
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.optionsList}>
                {/* Esta línea sirve para recorrer «cities» y mostrar un bloque por elemento. */}
                {cities.map((c) => (
                  // Esta línea sirve para mostrar el componente «OptionCard».
                  <OptionCard key={c.id} label={c.name} selected={cityId === c.id} onPress={() => setCityId(c.id)} />
                ))}
              </ThemedView>
              {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingCities && cities.length >= 50». */}
              {!isLoadingCities && cities.length >= 50 && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para avisar que solo se muestran los primeros resultados. */}
                  Mostrando los primeros {cities.length} resultados — seguí escribiendo para acotar la búsqueda.
                </ThemedText>
              )}
            </ThemedView>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «error». */}
          {error && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={styles.error}>
              {/* Esta línea sirve para mostrar el valor «error». */}
              {error}
            </ThemedText>
          )}

          {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
          <PrimaryButton label="Continuar" onPress={handleSubmit} disabled={!cityId} loading={isSubmitting} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «{ flex: 1 }».
  flex: { flex: 1 },
  // Esta línea sirve para declarar la propiedad «scroll» con el valor o tipo «{».
  scroll: {
    // Esta línea sirve para declarar la propiedad «flexGrow» con el valor o tipo «1».
    flexGrow: 1,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.four».
    padding: Spacing.four,
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'center'».
    alignSelf: 'center',
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{ marginBottom: Spacing.one }».
  title: { marginBottom: Spacing.one },
  // Esta línea sirve para declarar la propiedad «subtitle» con el valor o tipo «{ marginBottom: Spacing.four }».
  subtitle: { marginBottom: Spacing.four },
  // Esta línea sirve para definir el estilo «section» con «gap: Spacing.two, marginBottom: Spacing.four },…».
  section: { gap: Spacing.two, marginBottom: Spacing.four },
  // Esta línea sirve para declarar la propiedad «optionsList» con el valor o tipo «{ gap: Spacing.two, marginTop: Spacing.two }».
  optionsList: { gap: Spacing.two, marginTop: Spacing.two },
  // Esta línea sirve para definir el estilo «error» con «color: '#FF4D5E', marginBottom: Spacing.two },…».
  error: { color: '#FF4D5E', marginBottom: Spacing.two },
});

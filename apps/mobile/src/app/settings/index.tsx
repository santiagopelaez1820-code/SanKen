// Esta línea sirve para importar «useEffect, useMemo, useState» desde «react».
import { useEffect, useMemo, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Linking, Pressable, ScrollView, StyleSheet» desde «react-native».
import { Linking, Pressable, ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «SvgXml» desde «react-native-svg».
import { SvgXml } from 'react-native-svg';
// Esta línea sirve para importar «Bell, ChevronRight, Eye, FileText, MapPin, MonitorSmartphone, Shield, ShieldCheck» desde «lucide-react-native».
import { Bell, ChevronRight, Eye, FileText, MapPin, MonitorSmartphone, Shield, ShieldCheck } from 'lucide-react-native';
// Esta línea sirve para importar los tipos «OnboardingState, User» desde «@sanken/core».
import type { OnboardingState, User } from '@sanken/core';
// Esta línea sirve para importar «formatLegalDate, LEGAL_DOCUMENT_IDS, LEGAL_DOCUMENTS, LEGAL_STRINGS» desde «@sanken/core».
import { formatLegalDate, LEGAL_DOCUMENT_IDS, LEGAL_DOCUMENTS, LEGAL_STRINGS } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «DeleteAccountSection» desde «@/components/legal/delete-account-section».
import { DeleteAccountSection } from '@/components/legal/delete-account-section';
// Esta línea sirve para importar «Avatar» desde «@/components/ui/avatar».
import { Avatar } from '@/components/ui/avatar';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «OptionCard» desde «@/components/ui/option-card».
import { OptionCard } from '@/components/ui/option-card';
// Esta línea sirve para importar «Segmented» desde «@/components/ui/segmented».
import { Segmented } from '@/components/ui/segmented';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «ToggleRow» desde «@/components/ui/toggle-row».
import { ToggleRow } from '@/components/ui/toggle-row';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «LEGAL_ROUTES» desde «@/lib/legal-routes».
import { LEGAL_ROUTES } from '@/lib/legal-routes';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «isPushNotificationsEnabled» en la lista.
  isPushNotificationsEnabled,
  // Esta línea sirve para incluir el valor «registerForPushNotificationsAsync» en la lista.
  registerForPushNotificationsAsync,
  // Esta línea sirve para incluir el valor «unregisterFromPushNotifications» en la lista.
  unregisterFromPushNotifications,
  // Esta línea sirve para importar el tipo «PushRegistrationResult».
  type PushRegistrationResult,
// Esta línea sirve para terminar la importación desde «@/lib/push».
} from '@/lib/push';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useOnboardingStore» desde «@/store/onboarding-store».
import { useOnboardingStore } from '@/store/onboarding-store';
// Esta línea sirve para importar «useSettingsStore» desde «@/store/settings-store».
import { useSettingsStore } from '@/store/settings-store';
// Esta línea sirve para importar «useThemeStore» desde «@/store/theme-store».
import { useThemeStore } from '@/store/theme-store';

// Esta línea sirve para declarar «THEME_MODE_OPTIONS» con el valor «[».
const THEME_MODE_OPTIONS = [
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Automático', value: 'system' as const }…».
  { label: 'Automático', value: 'system' as const },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Claro', value: 'light' as const },…».
  { label: 'Claro', value: 'light' as const },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Oscuro', value: 'dark' as const },…».
  { label: 'Oscuro', value: 'dark' as const },
];

// Esta línea sirve para declarar «ROLE_LABEL» con el valor «{».
const ROLE_LABEL: Record<User['role'], string> = {
  // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «'Atleta'».
  user: 'Atleta',
  // Esta línea sirve para declarar la propiedad «trainer» con el valor o tipo «'Entrenador'».
  trainer: 'Entrenador',
  // Esta línea sirve para declarar la propiedad «super_admin» con el valor o tipo «'Super Admin'».
  super_admin: 'Super Admin',
};

// Esta línea sirve para declarar la función «SettingsScreen».
export default function SettingsScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «user, refreshMe» con el hook «useAuthStore».
  const { user, refreshMe } = useAuthStore();
  // Esta línea sirve para obtener «themeMode» con el hook «useThemeStore».
  const themeMode = useThemeStore((s) => s.mode);
  // Esta línea sirve para obtener «setThemeMode» con el hook «useThemeStore».
  const setThemeMode = useThemeStore((s) => s.setMode);
  // Esta línea sirve para obtener el cuestionario, los departamentos y las ciudades del store.
  const { questions, loadQuestions, states, isLoadingStates, loadStates, cities, isLoadingCities, loadCities } =
    // Esta línea sirve para llamar a «useOnboardingStore».
    useOnboardingStore();

  // Esta línea sirve para crear el estado «onboardingState» y su función «setOnboardingState».
  const [onboardingState, setOnboardingState] = useState<OnboardingState | null>(null);
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadQuestions».
    loadQuestions();
    // Esta línea sirve para pedir el estado del onboarding a la API.
    api.get<OnboardingState>('/onboarding').then((fresh) => {
      // Esta línea sirve para guardar en el estado con «setOnboardingState» el valor «fresh)…».
      setOnboardingState(fresh);
      // Se cargan de una para poder mostrar los NOMBRES actuales (no solo
      // los IDs) en la vista de solo-lectura, no solo cuando se edita.
      // Esta línea sirve para llamar a «loadStates» si «fresh.country_id».
      if (fresh.country_id) loadStates(fresh.country_id);
      // Esta línea sirve para llamar a «loadCities» si «fresh.state_id».
      if (fresh.state_id) loadCities(fresh.state_id);
    });
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadQuestions».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadQuestions]);

  // Esta línea sirve para crear el estado «pushEnabled» y su función «setPushEnabled».
  const [pushEnabled, setPushEnabled] = useState(false);
  // Esta línea sirve para crear el estado «isTogglingPush» y su función «setIsTogglingPush».
  const [isTogglingPush, setIsTogglingPush] = useState(false);
  // Esta línea sirve para crear el estado «pushMessage» y su función «setPushMessage».
  const [pushMessage, setPushMessage] = useState<{ text: string; canOpenSettings: boolean } | null>(null);
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «isPushNotificationsEnabled» con «).then(setPushEnabled».
    isPushNotificationsEnabled().then(setPushEnabled);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
  }, []);

  // Esta línea sirve para extraer «andlePushToggl» de «async (enabled: boolean) => {».
  const handlePushToggle = async (enabled: boolean) => {
    // Esta línea sirve para guardar en el estado con «setIsTogglingPush» el valor «true)…».
    setIsTogglingPush(true);
    // Esta línea sirve para guardar en el estado con «setPushMessage» el valor «null)…».
    setPushMessage(null);
    // Refleja el toque de inmediato — si el registro falla, vuelve abajo
    // junto con el motivo en vez de "rebotar" sin explicación.
    // Esta línea sirve para guardar en el estado con «setPushEnabled» el valor «enabled)…».
    setPushEnabled(enabled);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para revisar si «enabled».
      if (enabled) {
        // Esta línea sirve para esperar «registerForPushNotificationsAsync()» y guardar el resultado en «result».
        const result = await registerForPushNotificationsAsync();
        // Esta línea sirve para extraer «essag» de «PUSH_RESULT_MESSAGES[result]».
        const message = PUSH_RESULT_MESSAGES[result];
        // Esta línea sirve para llamar a «setPushMessage» si «message».
        if (message) setPushMessage({ text: message, canOpenSettings: result === 'blocked' });
      // Esta línea sirve para ejecutar este bloque en el caso contrario.
      } else {
        // Esta línea sirve para esperar el resultado de «unregisterFromPushNotifications».
        await unregisterFromPushNotifications();
      }
      // Esta línea sirve para guardar en el estado con «setPushEnabled» el valor «await isPushNotificationsEnabled())…».
      setPushEnabled(await isPushNotificationsEnabled());
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsTogglingPush» el valor «false)…».
      setIsTogglingPush(false);
    }
  };

  // Esta línea sirve para crear el estado «locationEditing» y su función «setLocationEditing».
  const [locationEditing, setLocationEditing] = useState(false);
  // Esta línea sirve para crear el estado «countryId» y su función «setCountryId».
  const [countryId, setCountryId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «stateId» y su función «setStateId».
  const [stateId, setStateId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «cityId» y su función «setCityId».
  const [cityId, setCityId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «locationSubmitting» y su función «setLocationSubmitting».
  const [locationSubmitting, setLocationSubmitting] = useState(false);
  // Esta línea sirve para crear el estado «locationError» y su función «setLocationError».
  const [locationError, setLocationError] = useState<string | null>(null);

  // Esta línea sirve para extraer «urrentCountryNam» de «questions?.countries.find((c) => c.id ==».
  const currentCountryName = questions?.countries.find((c) => c.id === onboardingState?.country_id)?.name;
  // Esta línea sirve para obtener «currentStateName» con el hook «useMemo».
  const currentStateName = useMemo(
    // Esta línea sirve para buscar el nombre del departamento actual.
    () => states.find((s) => s.id === onboardingState?.state_id)?.name,
    // Esta línea sirve para volver a calcular cuando cambian los departamentos o el estado.
    [states, onboardingState],
  );
  // Esta línea sirve para obtener «currentCityName» con el hook «useMemo».
  const currentCityName = useMemo(
    // Esta línea sirve para buscar el nombre de la ciudad actual.
    () => cities.find((c) => c.id === onboardingState?.city_id)?.name,
    // Esta línea sirve para volver a calcular cuando cambian las ciudades o el estado.
    [cities, onboardingState],
  );

  // Esta línea sirve para extraer «tartEditingLocatio» de «() => {».
  const startEditingLocation = () => {
    // Esta línea sirve para guardar en el estado con «setCountryId» el valor «onboardingState?.country_id ?? null)…».
    setCountryId(onboardingState?.country_id ?? null);
    // Esta línea sirve para guardar en el estado con «setStateId» el valor «onboardingState?.state_id ?? null)…».
    setStateId(onboardingState?.state_id ?? null);
    // Esta línea sirve para guardar en el estado con «setCityId» el valor «onboardingState?.city_id ?? null)…».
    setCityId(onboardingState?.city_id ?? null);
    // Esta línea sirve para guardar en el estado con «setLocationError» el valor «null)…».
    setLocationError(null);
    // Esta línea sirve para guardar en el estado con «setLocationEditing» el valor «true)…».
    setLocationEditing(true);
  };

  // Esta línea sirve para extraer «andleSaveLocatio» de «async () => {».
  const handleSaveLocation = async () => {
    // Esta línea sirve para salir de la función si «!cityId».
    if (!cityId) return;
    // Esta línea sirve para guardar en el estado con «setLocationSubmitting» el valor «true)…».
    setLocationSubmitting(true);
    // Esta línea sirve para guardar en el estado con «setLocationError» el valor «null)…».
    setLocationError(null);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.patch».
      await api.patch('/onboarding', { city_id: cityId });
      // Esta línea sirve para esperar «api.get<OnboardingState>('/onboarding')» y guardar el resultado en «fresh».
      const fresh = await api.get<OnboardingState>('/onboarding');
      // Esta línea sirve para guardar en el estado con «setOnboardingState» el valor «fresh)…».
      setOnboardingState(fresh);
      // Esta línea sirve para guardar en el estado con «setLocationEditing» el valor «false)…».
      setLocationEditing(false);
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el estado con «setLocationError» el valor «err instanceof Error ? err.message : 'No se p…».
      setLocationError(err instanceof Error ? err.message : 'No se pudo guardar tu ubicación.');
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setLocationSubmitting» el valor «false)…».
      setLocationSubmitting(false);
    }
  };
  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «enrollment» en la lista.
    enrollment,
    // Esta línea sirve para incluir el valor «recoveryCodes» en la lista.
    recoveryCodes,
    // Esta línea sirve para incluir el valor «isSubmitting» en la lista.
    isSubmitting,
    // Esta línea sirve para incluir el valor «submitError» en la lista.
    submitError,
    // Esta línea sirve para incluir el valor «isUpdatingPrivacy» en la lista.
    isUpdatingPrivacy,
    // Esta línea sirve para incluir el valor «enableTwoFactor» en la lista.
    enableTwoFactor,
    // Esta línea sirve para incluir el valor «confirmTwoFactor» en la lista.
    confirmTwoFactor,
    // Esta línea sirve para incluir el valor «disableTwoFactor» en la lista.
    disableTwoFactor,
    // Esta línea sirve para incluir el valor «dismissRecoveryCodes» en la lista.
    dismissRecoveryCodes,
    // Esta línea sirve para incluir el valor «setPublicProfile» en la lista.
    setPublicProfile,
  // Esta línea sirve para cerrar la desestructuración con «useSettingsStore()».
  } = useSettingsStore();
  // Esta línea sirve para crear el estado «code» y su función «setCode».
  const [code, setCode] = useState('');
  // Esta línea sirve para crear el estado «password» y su función «setPassword».
  const [password, setPassword] = useState('');

  // Esta línea sirve para extraer «andleConfir» de «async () => {».
  const handleConfirm = async () => {
    // Esta línea sirve para esperar «confirmTwoFactor(code)» y guardar el resultado en «ok».
    const ok = await confirmTwoFactor(code);
    // Esta línea sirve para revisar si «ok».
    if (ok) {
      // Esta línea sirve para guardar en el estado con «setCode» el valor «'')…».
      setCode('');
      // Esta línea sirve para llamar a «refreshMe».
      refreshMe();
    }
  };

  // Esta línea sirve para extraer «andleDisabl» de «async () => {».
  const handleDisable = async () => {
    // Esta línea sirve para esperar «disableTwoFactor(password)» y guardar el resultado en «ok».
    const ok = await disableTwoFactor(password);
    // Esta línea sirve para revisar si «ok».
    if (ok) {
      // Esta línea sirve para guardar en el estado con «setPassword» el valor «'')…».
      setPassword('');
      // Esta línea sirve para llamar a «refreshMe».
      refreshMe();
    }
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el texto «Configuración». */}
            Configuración
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={[styles.card, styles.identityCard]}>
            {/* Esta línea sirve para abrir el componente «Avatar». */}
            <Avatar name={user?.name} avatarUrl={user?.avatar_url} size={48} />
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.identityInfo}>
              {/* Esta línea sirve para mostrar el valor «user?.name ?? '…'» dentro de «ThemedText». */}
              <ThemedText type="smallBold">{user?.name ?? '…'}</ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el contenido dinámico «{user ? ROLE_LABEL[user.role] : ''}». */}
                {user ? ROLE_LABEL[user.role] : ''}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «user?.role === 'super_admin'». */}
          {user?.role === 'super_admin' && (
            // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
            <Pressable onPress={() => router.push('/admin')}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView type="backgroundElement" style={[styles.card, styles.identityCard]}>
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={[styles.adminIconBubble, { backgroundColor: theme.accent + '1A' }]}>
                  {/* Esta línea sirve para abrir el componente «Icon». */}
                  <Icon icon={Shield} size={20} color={theme.accent} />
                </ThemedView>
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.identityInfo}>
                  {/* Esta línea sirve para mostrar el texto «Panel de administración» dentro de «ThemedText». */}
                  <ThemedText type="smallBold">Panel de administración</ThemedText>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el texto «Usuarios, ejercicios, rutinas, reportes y más.». */}
                    Usuarios, ejercicios, rutinas, reportes y más.
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </Pressable>
          )}

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.cardHeading}>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={MapPin} size={16} color={theme.accent} />
              {/* Esta línea sirve para mostrar el texto «Ubicación» dentro de «ThemedText». */}
              <ThemedText type="default">Ubicación</ThemedText>
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Se usa para tus rankings por país, departamento y ciudad.». */}
              Se usa para tus rankings por país, departamento y ciudad.
            </ThemedText>

            {/* Esta línea sirve para mostrar el bloque solo si «!locationEditing». */}
            {!locationEditing && (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={styles.locationRow}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small">
                  {/* Esta línea sirve para mostrar el contenido dinámico «{onboardingState?.city_id». */}
                  {onboardingState?.city_id
                    // Esta línea sirve para mostrar la ciudad, el departamento y el país actuales.
                    ? `${currentCityName ?? '…'}, ${currentStateName ?? '…'}, ${currentCountryName ?? '…'}`
                    // Esta línea sirve para mostrar «Sin configurar» si falta la ubicación.
                    : 'Sin configurar'}
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
                <PrimaryButton label="Editar ubicación" variant="ghost" onPress={startEditingLocation} />
              </ThemedView>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «locationEditing». */}
            {locationEditing && (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={styles.enrollBox}>
                {/* Esta línea sirve para mostrar el texto «País» dentro de «ThemedText». */}
                <ThemedText type="smallBold">País</ThemedText>
                {/* Esta línea sirve para recorrer «questions?.countries» y mostrar un bloque por elemento. */}
                {questions?.countries.map((c) => (
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
                      // Esta línea sirve para guardar en el estado con «setCityId» el valor «null)…».
                      setCityId(null);
                      // Esta línea sirve para llamar a «loadStates» con «c.id».
                      loadStates(c.id);
                    }}
                  />
                ))}

                {/* Esta línea sirve para mostrar el bloque solo si «countryId !== null». */}
                {countryId !== null && (
                  // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
                  <>
                    {/* Esta línea sirve para mostrar el texto «Departamento» dentro de «ThemedText». */}
                    <ThemedText type="smallBold">Departamento</ThemedText>
                    {/* Esta línea sirve para mostrar el elemento solo si «isLoadingStates». */}
                    {isLoadingStates && <Skeleton height={40} borderRadius={Spacing.two} />}
                    {/* Esta línea sirve para recorrer «states» y mostrar un bloque por elemento. */}
                    {states.map((s) => (
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
                          // Esta línea sirve para llamar a «loadCities» con «s.id».
                          loadCities(s.id);
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Esta línea sirve para mostrar el bloque solo si «stateId !== null». */}
                {stateId !== null && (
                  // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
                  <>
                    {/* Esta línea sirve para mostrar el texto «Ciudad / Municipio» dentro de «ThemedText». */}
                    <ThemedText type="smallBold">Ciudad / Municipio</ThemedText>
                    {/* Esta línea sirve para mostrar el elemento solo si «isLoadingCities». */}
                    {isLoadingCities && <Skeleton height={40} borderRadius={Spacing.two} />}
                    {/* Esta línea sirve para recorrer «cities» y mostrar un bloque por elemento. */}
                    {cities.map((c) => (
                      // Esta línea sirve para mostrar el componente «OptionCard».
                      <OptionCard key={c.id} label={c.name} selected={cityId === c.id} onPress={() => setCityId(c.id)} />
                    ))}
                  </>
                )}

                {/* Esta línea sirve para mostrar el bloque solo si «locationError». */}
                {locationError && (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" style={styles.error}>
                    {/* Esta línea sirve para mostrar el valor «locationError». */}
                    {locationError}
                  </ThemedText>
                )}

                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.locationActions}>
                  {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                  <PrimaryButton
                    // Esta línea sirve para definir el atributo «label» con el valor «Guardar».
                    label="Guardar"
                    // Esta línea sirve para pasar la propiedad «loading» con el valor «locationSubmitting}».
                    loading={locationSubmitting}
                    // Esta línea sirve para pasar la propiedad «disabled» con el valor «!cityId}».
                    disabled={!cityId}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={handleSaveLocation}
                  />
                  {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
                  <PrimaryButton label="Cancelar" variant="ghost" onPress={() => setLocationEditing(false)} />
                </ThemedView>
              </ThemedView>
            )}
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.cardHeading}>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={ShieldCheck} size={16} color={theme.accent} />
              {/* Esta línea sirve para mostrar el texto «Autenticación de dos factores» dentro de «ThemedText». */}
              <ThemedText type="default">Autenticación de dos factores</ThemedText>
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para explicar para qué sirve la verificación en dos pasos. */}
              Agrega una capa extra de seguridad pidiendo un código de tu app autenticadora al iniciar sesión.
            </ThemedText>

            {/* Esta línea sirve para mostrar el bloque solo si «recoveryCodes». */}
            {recoveryCodes && (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={styles.recoveryBox}>
                {/* Esta línea sirve para abrir el componente «ThemedText» con sus propiedades. */}
                <ThemedText type="smallBold">2FA activado. Guarda estos códigos de recuperación:</ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para explicar que cada código de recuperación sirve una sola vez. */}
                  Cada uno sirve una sola vez si perdés el acceso a tu app autenticadora. No se van a volver a
                  mostrar.
                </ThemedText>
                {/* Esta línea sirve para recorrer «recoveryCodes» y mostrar un bloque por elemento. */}
                {recoveryCodes.map((rc) => (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText key={rc} type="smallBold" style={styles.recoveryCode}>
                    {/* Esta línea sirve para mostrar el valor «rc». */}
                    {rc}
                  </ThemedText>
                ))}
                {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
                <PrimaryButton label="Ya los guardé" onPress={dismissRecoveryCodes} />
              </ThemedView>
            )}

            {/* Esta línea sirve para mostrar la opción de activar solo si no está activada ni en proceso. */}
            {!recoveryCodes && user && !user.two_factor_enabled && !enrollment && (
              // Esta línea sirve para abrir el componente «PrimaryButton».
              <PrimaryButton label="Activar 2FA" loading={isSubmitting} onPress={enableTwoFactor} />
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «!recoveryCodes && enrollment». */}
            {!recoveryCodes && enrollment && (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={styles.enrollBox}>
                {/* Esta línea sirve para abrir el componente «SvgXml». */}
                <SvgXml xml={enrollment.qr_svg} width={200} height={200} style={styles.qr} />
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                  {/* Esta línea sirve para explicar cómo escanear el QR o usar la clave manual. */}
                  Escaneá el QR con tu app autenticadora, o ingresá esta clave manualmente:
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold" style={styles.center}>
                  {/* Esta línea sirve para mostrar el valor «enrollment.secret». */}
                  {enrollment.secret}
                </ThemedText>

                {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
                <TextField
                  // Esta línea sirve para definir el atributo «label» con el valor «Código de 6 dígitos».
                  label="Código de 6 dígitos"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «code}».
                  value={code}
                  // Esta línea sirve para asignar el manejador del evento «onChangeText».
                  onChangeText={setCode}
                  // Esta línea sirve para definir el atributo «keyboardType» con el valor «number-pad».
                  keyboardType="number-pad"
                  // Esta línea sirve para pasar la propiedad «maxLength» con el valor «6}».
                  maxLength={6}
                />
                {/* Esta línea sirve para mostrar el bloque solo si «submitError». */}
                {submitError && (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" style={styles.error}>
                    {/* Esta línea sirve para mostrar el valor «submitError». */}
                    {submitError}
                  </ThemedText>
                )}
                {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
                <PrimaryButton label="Confirmar" loading={isSubmitting} onPress={handleConfirm} />
              </ThemedView>
            )}

            {/* Esta línea sirve para mostrar el bloque solo si «!recoveryCodes && user?.two_factor_enabled». */}
            {!recoveryCodes && user?.two_factor_enabled && (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={styles.enrollBox}>
                {/* Esta línea sirve para mostrar el texto «2FA está activado en tu cuenta.» dentro de «ThemedText». */}
                <ThemedText type="default">2FA está activado en tu cuenta.</ThemedText>
                {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
                <TextField
                  // Esta línea sirve para definir el atributo «label» con el valor «Contraseña para desactivar».
                  label="Contraseña para desactivar"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «password}».
                  value={password}
                  // Esta línea sirve para asignar el manejador del evento «onChangeText».
                  onChangeText={setPassword}
                  // Esta línea sirve para activar la opción «secureTextEntry».
                  secureTextEntry
                />
                {/* Esta línea sirve para mostrar el bloque solo si «submitError». */}
                {submitError && (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" style={styles.error}>
                    {/* Esta línea sirve para mostrar el valor «submitError». */}
                    {submitError}
                  </ThemedText>
                )}
                {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                <PrimaryButton
                  // Esta línea sirve para definir el atributo «label» con el valor «Desactivar 2FA».
                  label="Desactivar 2FA"
                  // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                  variant="ghost"
                  // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
                  loading={isSubmitting}
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={handleDisable}
                />
              </ThemedView>
            )}
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.cardHeading}>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={MonitorSmartphone} size={16} color={theme.accent} />
              {/* Esta línea sirve para mostrar el texto «Apariencia» dentro de «ThemedText». */}
              <ThemedText type="default">Apariencia</ThemedText>
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Elegí cómo se ve SanKen en este dispositivo.». */}
              Elegí cómo se ve SanKen en este dispositivo.
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «Segmented». */}
            <Segmented options={THEME_MODE_OPTIONS} value={themeMode} onChange={setThemeMode} />
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el elemento «ToggleRow» con sus atributos en varias líneas. */}
            <ToggleRow
              // Esta línea sirve para pasar la propiedad «icon» con el valor «Eye}».
              icon={Eye}
              // Esta línea sirve para definir el atributo «label» con el valor «Rankings públicos».
              label="Rankings públicos"
              // Esta línea sirve para definir el atributo «description».
              description="Si activás esto, tu volumen total aparece en los rankings de ciudad, país, gimnasio, edad, sexo y categoría de fuerza."
              // Esta línea sirve para pasar la propiedad «value» con el valor «user?.is_public_profile ?? false}».
              value={user?.is_public_profile ?? false}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «isUpdatingPrivacy}».
              disabled={isUpdatingPrivacy}
              // Esta línea sirve para asignar el manejador del evento «onValueChange».
              onValueChange={(value) => setPublicProfile(value)}
            />
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el elemento «ToggleRow» con sus atributos en varias líneas. */}
            <ToggleRow
              // Esta línea sirve para pasar la propiedad «icon» con el valor «Bell}».
              icon={Bell}
              // Esta línea sirve para definir el atributo «label» con el valor «Notificaciones push».
              label="Notificaciones push"
              // Esta línea sirve para definir el atributo «description».
              description="Recibí un aviso cuando te llegue un mensaje, aunque no tengas SanKen abierto."
              // Esta línea sirve para pasar la propiedad «value» con el valor «pushEnabled}».
              value={pushEnabled}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «isTogglingPush}».
              disabled={isTogglingPush}
              // Esta línea sirve para asignar el manejador del evento «onValueChange».
              onValueChange={handlePushToggle}
            />
            {/* Esta línea sirve para mostrar el bloque solo si «pushMessage». */}
            {pushMessage && (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={styles.pushMessage}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el valor «pushMessage.text». */}
                  {pushMessage.text}
                </ThemedText>
                {/* Esta línea sirve para mostrar el bloque solo si «pushMessage.canOpenSettings». */}
                {pushMessage.canOpenSettings && (
                  // Esta línea sirve para mostrar el componente «PrimaryButton».
                  <PrimaryButton label="Abrir ajustes del teléfono" variant="ghost" onPress={() => Linking.openSettings()} />
                )}
              </ThemedView>
            )}
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.cardHeading}>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={FileText} size={16} color={theme.accent} />
              {/* Esta línea sirve para mostrar el valor «LEGAL_STRINGS.es.legalSectionTitle» dentro de «ThemedText». */}
              <ThemedText type="default">{LEGAL_STRINGS.es.legalSectionTitle}</ThemedText>
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el valor «LEGAL_STRINGS.es.legalSectionDescription». */}
              {LEGAL_STRINGS.es.legalSectionDescription}
            </ThemedText>
            {/* Esta línea sirve para recorrer «LEGAL_DOCUMENT_IDS» y mostrar un bloque por elemento. */}
            {LEGAL_DOCUMENT_IDS.map((id) => (
              // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
              <Pressable
                // Esta línea sirve para identificar el elemento de la lista con «id}».
                key={id}
                // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «link».
                accessibilityRole="link"
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => router.push(LEGAL_ROUTES[id])}
                // Esta línea sirve para pasar la propiedad «style» con el valor «styles.legalRow}».
                style={styles.legalRow}
              >
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.legalRowText}>
                  {/* Esta línea sirve para mostrar el valor «LEGAL_STRINGS.es.documentNames[id]» dentro de «ThemedText». */}
                  <ThemedText type="default">{LEGAL_STRINGS.es.documentNames[id]}</ThemedText>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar la versión y la fecha del documento legal. */}
                    {LEGAL_STRINGS.es.versionLine(LEGAL_DOCUMENTS[id].version, formatLegalDate(LEGAL_DOCUMENTS[id].updatedAt, 'es'))}
                  </ThemedText>
                </ThemedView>
                {/* Esta línea sirve para abrir el componente «Icon». */}
                <Icon icon={ChevronRight} size={16} color={theme.textSecondary} />
              </Pressable>
            ))}
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el componente «DeleteAccountSection». */}
            <DeleteAccountSection />
          </ThemedView>

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «PUSH_RESULT_MESSAGES» con el valor «{».
const PUSH_RESULT_MESSAGES: Record<PushRegistrationResult, string | null> = {
  // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «null».
  enabled: null,
  // Esta línea sirve para declarar la propiedad «skipped» con el valor o tipo «null».
  skipped: null,
  // Esta línea sirve para definir la propiedad «denied» con «Necesitamos tu permiso para enviarte not…».
  denied: 'Necesitamos tu permiso para enviarte notificaciones. Volvé a activar el interruptor y aceptá el aviso.',
  // Esta línea sirve para definir la propiedad «blocked» con «Las notificaciones de SanKen están bloqu…».
  blocked: 'Las notificaciones de SanKen están bloqueadas en tu teléfono. Activalas desde los ajustes del sistema y volvé a intentarlo.',
  // Esta línea sirve para definir la propiedad «unavailable» con «Las notificaciones push no están disponi…».
  unavailable: 'Las notificaciones push no están disponibles en esta versión de la app (Expo Go o web).',
  // Esta línea sirve para definir la propiedad «error» con «No pudimos activar las notificaciones. R…».
  error: 'No pudimos activar las notificaciones. Revisá tu conexión y probá de nuevo.',
};

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para definir el estilo «pushMessage» con «gap: Spacing.two, marginTop: Spacing.two, backgrou…».
  pushMessage: { gap: Spacing.two, marginTop: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  // Esta línea sirve para declarar la propiedad «scrollView» con el valor o tipo «{ alignSelf: 'stretch' }».
  scrollView: { alignSelf: 'stretch' },
  // Esta línea sirve para declarar la propiedad «content» con el valor o tipo «{».
  content: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.three».
    paddingTop: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para definir el estilo «pageTitle» con «fontSize: 24, lineHeight: 30, marginBottom: Spacin…».
  pageTitle: { fontSize: 24, lineHeight: 30, marginBottom: Spacing.two },
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «identityCard» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  identityCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  // Esta línea sirve para declarar la propiedad «identityInfo» con el valor o tipo «{ gap: 2, backgroundColor: 'transparent' }».
  identityInfo: { gap: 2, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «adminIconBubble» con el valor o tipo «{».
  adminIconBubble: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «48».
    width: 48,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «48».
    height: 48,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «24».
    borderRadius: 24,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para definir el estilo «cardHeading» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  cardHeading: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «enrollBox» con «gap: Spacing.two, marginTop: Spacing.two, backgrou…».
  enrollBox: { gap: Spacing.two, marginTop: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «locationRow» con «gap: Spacing.two, marginTop: Spacing.two, backgrou…».
  locationRow: { gap: Spacing.two, marginTop: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «locationActions» con «gap: Spacing.two, marginTop: Spacing.two, backgrou…».
  locationActions: { gap: Spacing.two, marginTop: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «recoveryBox» con «gap: Spacing.one, marginTop: Spacing.two, backgrou…».
  recoveryBox: { gap: Spacing.one, marginTop: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «recoveryCode» con el valor o tipo «{ textAlign: 'center' }».
  recoveryCode: { textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «qr» con el valor o tipo «{ alignSelf: 'center' }».
  qr: { alignSelf: 'center' },
  // Esta línea sirve para declarar la propiedad «center» con el valor o tipo «{ textAlign: 'center' }».
  center: { textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
  // Esta línea sirve para definir el estilo «legalRow» con «flexDirection: 'row', alignItems: 'center', justif…».
  legalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.two, minHeight: 44 },
  // Esta línea sirve para definir el estilo «legalRowText» con «flex: 1, gap: 2, backgroundColor: 'transparent' },…».
  legalRowText: { flex: 1, gap: 2, backgroundColor: 'transparent' },
});

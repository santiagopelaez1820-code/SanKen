import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { Bell, ChevronRight, Eye, FileText, MapPin, MonitorSmartphone, Shield, ShieldCheck } from 'lucide-react-native';
import type { OnboardingState, User } from '@sanken/core';
import { formatLegalDate, LEGAL_DOCUMENT_IDS, LEGAL_DOCUMENTS, LEGAL_STRINGS } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DeleteAccountSection } from '@/components/legal/delete-account-section';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { OptionCard } from '@/components/ui/option-card';
import { Segmented } from '@/components/ui/segmented';
import { Skeleton } from '@/components/ui/skeleton';
import { TextField } from '@/components/ui/text-field';
import { ToggleRow } from '@/components/ui/toggle-row';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { LEGAL_ROUTES } from '@/lib/legal-routes';
import {
  isPushNotificationsEnabled,
  registerForPushNotificationsAsync,
  unregisterFromPushNotifications,
  type PushRegistrationResult,
} from '@/lib/push';
import { useAuthStore } from '@/store/auth-store';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useSettingsStore } from '@/store/settings-store';
import { useThemeStore } from '@/store/theme-store';

const THEME_MODE_OPTIONS = [
  { label: 'Automático', value: 'system' as const },
  { label: 'Claro', value: 'light' as const },
  { label: 'Oscuro', value: 'dark' as const },
];

const ROLE_LABEL: Record<User['role'], string> = {
  user: 'Atleta',
  trainer: 'Entrenador',
  super_admin: 'Super Admin',
};

export default function SettingsScreen() {
  const theme = useTheme();
  const { user, refreshMe } = useAuthStore();
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const { questions, loadQuestions, states, isLoadingStates, loadStates, cities, isLoadingCities, loadCities } =
    useOnboardingStore();

  const [onboardingState, setOnboardingState] = useState<OnboardingState | null>(null);
  useEffect(() => {
    loadQuestions();
    api.get<OnboardingState>('/onboarding').then((fresh) => {
      setOnboardingState(fresh);
      // Se cargan de una para poder mostrar los NOMBRES actuales (no solo
      // los IDs) en la vista de solo-lectura, no solo cuando se edita.
      if (fresh.country_id) loadStates(fresh.country_id);
      if (fresh.state_id) loadCities(fresh.state_id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadQuestions]);

  const [pushEnabled, setPushEnabled] = useState(false);
  const [isTogglingPush, setIsTogglingPush] = useState(false);
  const [pushMessage, setPushMessage] = useState<{ text: string; canOpenSettings: boolean } | null>(null);
  useEffect(() => {
    isPushNotificationsEnabled().then(setPushEnabled);
  }, []);

  const handlePushToggle = async (enabled: boolean) => {
    setIsTogglingPush(true);
    setPushMessage(null);
    // Refleja el toque de inmediato — si el registro falla, vuelve abajo
    // junto con el motivo en vez de "rebotar" sin explicación.
    setPushEnabled(enabled);
    try {
      if (enabled) {
        const result = await registerForPushNotificationsAsync();
        const message = PUSH_RESULT_MESSAGES[result];
        if (message) setPushMessage({ text: message, canOpenSettings: result === 'blocked' });
      } else {
        await unregisterFromPushNotifications();
      }
      setPushEnabled(await isPushNotificationsEnabled());
    } finally {
      setIsTogglingPush(false);
    }
  };

  const [locationEditing, setLocationEditing] = useState(false);
  const [countryId, setCountryId] = useState<number | null>(null);
  const [stateId, setStateId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [locationSubmitting, setLocationSubmitting] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const currentCountryName = questions?.countries.find((c) => c.id === onboardingState?.country_id)?.name;
  const currentStateName = useMemo(
    () => states.find((s) => s.id === onboardingState?.state_id)?.name,
    [states, onboardingState],
  );
  const currentCityName = useMemo(
    () => cities.find((c) => c.id === onboardingState?.city_id)?.name,
    [cities, onboardingState],
  );

  const startEditingLocation = () => {
    setCountryId(onboardingState?.country_id ?? null);
    setStateId(onboardingState?.state_id ?? null);
    setCityId(onboardingState?.city_id ?? null);
    setLocationError(null);
    setLocationEditing(true);
  };

  const handleSaveLocation = async () => {
    if (!cityId) return;
    setLocationSubmitting(true);
    setLocationError(null);
    try {
      await api.patch('/onboarding', { city_id: cityId });
      const fresh = await api.get<OnboardingState>('/onboarding');
      setOnboardingState(fresh);
      setLocationEditing(false);
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : 'No se pudo guardar tu ubicación.');
    } finally {
      setLocationSubmitting(false);
    }
  };
  const {
    enrollment,
    recoveryCodes,
    isSubmitting,
    submitError,
    isUpdatingPrivacy,
    enableTwoFactor,
    confirmTwoFactor,
    disableTwoFactor,
    dismissRecoveryCodes,
    setPublicProfile,
  } = useSettingsStore();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const handleConfirm = async () => {
    const ok = await confirmTwoFactor(code);
    if (ok) {
      setCode('');
      refreshMe();
    }
  };

  const handleDisable = async () => {
    const ok = await disableTwoFactor(password);
    if (ok) {
      setPassword('');
      refreshMe();
    }
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.pageTitle}>
            Configuración
          </ThemedText>

          <ThemedView type="backgroundElement" style={[styles.card, styles.identityCard]}>
            <Avatar name={user?.name} avatarUrl={user?.avatar_url} size={48} />
            <ThemedView style={styles.identityInfo}>
              <ThemedText type="smallBold">{user?.name ?? '…'}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {user ? ROLE_LABEL[user.role] : ''}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {user?.role === 'super_admin' && (
            <Pressable onPress={() => router.push('/admin')}>
              <ThemedView type="backgroundElement" style={[styles.card, styles.identityCard]}>
                <ThemedView style={[styles.adminIconBubble, { backgroundColor: theme.accent + '1A' }]}>
                  <Icon icon={Shield} size={20} color={theme.accent} />
                </ThemedView>
                <ThemedView style={styles.identityInfo}>
                  <ThemedText type="smallBold">Panel de administración</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Usuarios, ejercicios, rutinas, reportes y más.
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </Pressable>
          )}

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedView style={styles.cardHeading}>
              <Icon icon={MapPin} size={16} color={theme.accent} />
              <ThemedText type="default">Ubicación</ThemedText>
            </ThemedView>
            <ThemedText type="small" themeColor="textSecondary">
              Se usa para tus rankings por país, departamento y ciudad.
            </ThemedText>

            {!locationEditing && (
              <ThemedView style={styles.locationRow}>
                <ThemedText type="small">
                  {onboardingState?.city_id
                    ? `${currentCityName ?? '…'}, ${currentStateName ?? '…'}, ${currentCountryName ?? '…'}`
                    : 'Sin configurar'}
                </ThemedText>
                <PrimaryButton label="Editar ubicación" variant="ghost" onPress={startEditingLocation} />
              </ThemedView>
            )}

            {locationEditing && (
              <ThemedView style={styles.enrollBox}>
                <ThemedText type="smallBold">País</ThemedText>
                {questions?.countries.map((c) => (
                  <OptionCard
                    key={c.id}
                    label={c.name}
                    selected={countryId === c.id}
                    onPress={() => {
                      setCountryId(c.id);
                      setStateId(null);
                      setCityId(null);
                      loadStates(c.id);
                    }}
                  />
                ))}

                {countryId !== null && (
                  <>
                    <ThemedText type="smallBold">Departamento</ThemedText>
                    {isLoadingStates && <Skeleton height={40} borderRadius={Spacing.two} />}
                    {states.map((s) => (
                      <OptionCard
                        key={s.id}
                        label={s.name}
                        selected={stateId === s.id}
                        onPress={() => {
                          setStateId(s.id);
                          setCityId(null);
                          loadCities(s.id);
                        }}
                      />
                    ))}
                  </>
                )}

                {stateId !== null && (
                  <>
                    <ThemedText type="smallBold">Ciudad / Municipio</ThemedText>
                    {isLoadingCities && <Skeleton height={40} borderRadius={Spacing.two} />}
                    {cities.map((c) => (
                      <OptionCard key={c.id} label={c.name} selected={cityId === c.id} onPress={() => setCityId(c.id)} />
                    ))}
                  </>
                )}

                {locationError && (
                  <ThemedText type="small" style={styles.error}>
                    {locationError}
                  </ThemedText>
                )}

                <ThemedView style={styles.locationActions}>
                  <PrimaryButton
                    label="Guardar"
                    loading={locationSubmitting}
                    disabled={!cityId}
                    onPress={handleSaveLocation}
                  />
                  <PrimaryButton label="Cancelar" variant="ghost" onPress={() => setLocationEditing(false)} />
                </ThemedView>
              </ThemedView>
            )}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedView style={styles.cardHeading}>
              <Icon icon={ShieldCheck} size={16} color={theme.accent} />
              <ThemedText type="default">Autenticación de dos factores</ThemedText>
            </ThemedView>
            <ThemedText type="small" themeColor="textSecondary">
              Agrega una capa extra de seguridad pidiendo un código de tu app autenticadora al iniciar sesión.
            </ThemedText>

            {recoveryCodes && (
              <ThemedView style={styles.recoveryBox}>
                <ThemedText type="smallBold">2FA activado. Guarda estos códigos de recuperación:</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Cada uno sirve una sola vez si perdés el acceso a tu app autenticadora. No se van a volver a
                  mostrar.
                </ThemedText>
                {recoveryCodes.map((rc) => (
                  <ThemedText key={rc} type="smallBold" style={styles.recoveryCode}>
                    {rc}
                  </ThemedText>
                ))}
                <PrimaryButton label="Ya los guardé" onPress={dismissRecoveryCodes} />
              </ThemedView>
            )}

            {!recoveryCodes && user && !user.two_factor_enabled && !enrollment && (
              <PrimaryButton label="Activar 2FA" loading={isSubmitting} onPress={enableTwoFactor} />
            )}

            {!recoveryCodes && enrollment && (
              <ThemedView style={styles.enrollBox}>
                <SvgXml xml={enrollment.qr_svg} width={200} height={200} style={styles.qr} />
                <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                  Escaneá el QR con tu app autenticadora, o ingresá esta clave manualmente:
                </ThemedText>
                <ThemedText type="smallBold" style={styles.center}>
                  {enrollment.secret}
                </ThemedText>

                <TextField
                  label="Código de 6 dígitos"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {submitError && (
                  <ThemedText type="small" style={styles.error}>
                    {submitError}
                  </ThemedText>
                )}
                <PrimaryButton label="Confirmar" loading={isSubmitting} onPress={handleConfirm} />
              </ThemedView>
            )}

            {!recoveryCodes && user?.two_factor_enabled && (
              <ThemedView style={styles.enrollBox}>
                <ThemedText type="default">2FA está activado en tu cuenta.</ThemedText>
                <TextField
                  label="Contraseña para desactivar"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                {submitError && (
                  <ThemedText type="small" style={styles.error}>
                    {submitError}
                  </ThemedText>
                )}
                <PrimaryButton
                  label="Desactivar 2FA"
                  variant="ghost"
                  loading={isSubmitting}
                  onPress={handleDisable}
                />
              </ThemedView>
            )}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedView style={styles.cardHeading}>
              <Icon icon={MonitorSmartphone} size={16} color={theme.accent} />
              <ThemedText type="default">Apariencia</ThemedText>
            </ThemedView>
            <ThemedText type="small" themeColor="textSecondary">
              Elegí cómo se ve SanKen en este dispositivo.
            </ThemedText>
            <Segmented options={THEME_MODE_OPTIONS} value={themeMode} onChange={setThemeMode} />
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ToggleRow
              icon={Eye}
              label="Rankings públicos"
              description="Si activás esto, tu volumen total aparece en los rankings de ciudad, país, gimnasio, edad, sexo y categoría de fuerza."
              value={user?.is_public_profile ?? false}
              disabled={isUpdatingPrivacy}
              onValueChange={(value) => setPublicProfile(value)}
            />
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ToggleRow
              icon={Bell}
              label="Notificaciones push"
              description="Recibí un aviso cuando te llegue un mensaje, aunque no tengas SanKen abierto."
              value={pushEnabled}
              disabled={isTogglingPush}
              onValueChange={handlePushToggle}
            />
            {pushMessage && (
              <ThemedView style={styles.pushMessage}>
                <ThemedText type="small" themeColor="textSecondary">
                  {pushMessage.text}
                </ThemedText>
                {pushMessage.canOpenSettings && (
                  <PrimaryButton label="Abrir ajustes del teléfono" variant="ghost" onPress={() => Linking.openSettings()} />
                )}
              </ThemedView>
            )}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedView style={styles.cardHeading}>
              <Icon icon={FileText} size={16} color={theme.accent} />
              <ThemedText type="default">{LEGAL_STRINGS.es.legalSectionTitle}</ThemedText>
            </ThemedView>
            <ThemedText type="small" themeColor="textSecondary">
              {LEGAL_STRINGS.es.legalSectionDescription}
            </ThemedText>
            {LEGAL_DOCUMENT_IDS.map((id) => (
              <Pressable
                key={id}
                accessibilityRole="link"
                onPress={() => router.push(LEGAL_ROUTES[id])}
                style={styles.legalRow}
              >
                <ThemedView style={styles.legalRowText}>
                  <ThemedText type="default">{LEGAL_STRINGS.es.documentNames[id]}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {LEGAL_STRINGS.es.versionLine(LEGAL_DOCUMENTS[id].version, formatLegalDate(LEGAL_DOCUMENTS[id].updatedAt, 'es'))}
                  </ThemedText>
                </ThemedView>
                <Icon icon={ChevronRight} size={16} color={theme.textSecondary} />
              </Pressable>
            ))}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <DeleteAccountSection />
          </ThemedView>

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const PUSH_RESULT_MESSAGES: Record<PushRegistrationResult, string | null> = {
  enabled: null,
  skipped: null,
  denied: 'Necesitamos tu permiso para enviarte notificaciones. Volvé a activar el interruptor y aceptá el aviso.',
  blocked: 'Las notificaciones de SanKen están bloqueadas en tu teléfono. Activalas desde los ajustes del sistema y volvé a intentarlo.',
  unavailable: 'Las notificaciones push no están disponibles en esta versión de la app (Expo Go o web).',
  error: 'No pudimos activar las notificaciones. Revisá tu conexión y probá de nuevo.',
};

const styles = StyleSheet.create({
  pushMessage: { gap: Spacing.two, marginTop: Spacing.two, backgroundColor: 'transparent' },
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  scrollView: { alignSelf: 'stretch' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 24, lineHeight: 30, marginBottom: Spacing.two },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  identityCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  identityInfo: { gap: 2, backgroundColor: 'transparent' },
  adminIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeading: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
  enrollBox: { gap: Spacing.two, marginTop: Spacing.two, backgroundColor: 'transparent' },
  locationRow: { gap: Spacing.two, marginTop: Spacing.two, backgroundColor: 'transparent' },
  locationActions: { gap: Spacing.two, marginTop: Spacing.two, backgroundColor: 'transparent' },
  recoveryBox: { gap: Spacing.one, marginTop: Spacing.two, backgroundColor: 'transparent' },
  recoveryCode: { textAlign: 'center' },
  qr: { alignSelf: 'center' },
  center: { textAlign: 'center' },
  error: { color: '#FF4D5E' },
  legalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.two, minHeight: 44 },
  legalRowText: { flex: 1, gap: 2, backgroundColor: 'transparent' },
});

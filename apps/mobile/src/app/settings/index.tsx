import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import type { OnboardingState } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { OptionCard } from '@/components/ui/option-card';
import { TextField } from '@/components/ui/text-field';
import { ToggleRow } from '@/components/ui/toggle-row';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useSettingsStore } from '@/store/settings-store';

export default function SettingsScreen() {
  const { user, refreshMe } = useAuthStore();
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

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="default">Ubicación</ThemedText>
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
                    {isLoadingStates && (
                      <ThemedText type="small" themeColor="textSecondary">Cargando…</ThemedText>
                    )}
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
                    {isLoadingCities && (
                      <ThemedText type="small" themeColor="textSecondary">Cargando…</ThemedText>
                    )}
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
            <ThemedText type="default">Autenticación de dos factores</ThemedText>
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
            <ToggleRow
              label="Rankings públicos"
              description="Si activás esto, tu volumen total aparece en los rankings de ciudad, país, gimnasio, edad, sexo y categoría de fuerza."
              value={user?.is_public_profile ?? false}
              disabled={isUpdatingPrivacy}
              onValueChange={(value) => setPublicProfile(value)}
            />
          </ThemedView>

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  pageTitle: { fontSize: 28, lineHeight: 34, marginBottom: Spacing.two },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  enrollBox: { gap: Spacing.two, marginTop: Spacing.two },
  locationRow: { gap: Spacing.two, marginTop: Spacing.two },
  locationActions: { gap: Spacing.two, marginTop: Spacing.two },
  recoveryBox: { gap: Spacing.one, marginTop: Spacing.two },
  recoveryCode: { textAlign: 'center' },
  qr: { alignSelf: 'center' },
  center: { textAlign: 'center' },
  error: { color: '#C9564A' },
});

import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AdminUser, OnboardingCity, OnboardingQuestions } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { OptionPickerModal } from '@/components/ui/option-picker-modal';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { useAdminStore } from '@/store/admin-store';

const ROLE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Todos', value: '' },
  { label: 'Usuario', value: 'user' },
  { label: 'Entrenador', value: 'trainer' },
  { label: 'Super Admin', value: 'super_admin' },
];

const ROLE_LABELS: Record<AdminUser['role'], string> = {
  user: 'Usuario',
  trainer: 'Entrenador',
  super_admin: 'Super Admin',
};

export default function AdminUsuariosScreen() {
  const theme = useTheme();
  const {
    users,
    isLoadingUsers,
    loadUsers,
    banUser,
    verifyTrainer,
    changeUserRole,
    activateUser,
    deactivateUser,
    deleteUser,
  } = useAdminStore();
  const [role, setRole] = useState('');
  const [q, setQ] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [countries, setCountries] = useState<{ id: number; name: string }[]>([]);
  const [country, setCountry] = useState<{ id: number; name: string } | null>(null);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [city, setCity] = useState<{ id: number; name: string } | null>(null);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  const applyFilters = (overrides?: { countryId?: number; cityId?: number }) =>
    loadUsers({
      role: role || undefined,
      q: q || undefined,
      country_id: overrides?.countryId ?? country?.id,
      city_id: overrides?.cityId ?? city?.id,
    });

  useEffect(() => {
    api.get<OnboardingQuestions>('/onboarding/questions').then((questions) => setCountries(questions.countries));
  }, []);

  useEffect(() => {
    if (!country) {
      setCities([]);
      return;
    }
    api.get<OnboardingCity[]>(`/onboarding/countries/${country.id}/cities`).then(setCities);
  }, [country]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const confirmingUser = users.find((u) => u.id === confirmingDeleteId) ?? null;

  const handleDelete = async () => {
    if (!confirmingDeleteId) return;
    setIsDeleting(true);
    try {
      await deleteUser(confirmingDeleteId);
      setConfirmingDeleteId(null);
      await applyFilters();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Usuarios
          </ThemedText>

          <View style={styles.roleRow}>
            {ROLE_OPTIONS.map((option) => {
              const selected = option.value === role;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setRole(option.value)}
                  style={[
                    styles.chip,
                    { borderColor: theme.backgroundSelected },
                    selected && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                    {option.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            value={q}
            onChangeText={setQ}
            onSubmitEditing={() => applyFilters()}
            placeholder="Buscar por nombre o correo…"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
          />

          <View style={styles.roleRow}>
            <Pressable
              onPress={() => setCountryPickerVisible(true)}
              style={[styles.chip, { borderColor: theme.backgroundSelected }, country && { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText type="small" themeColor={country ? 'text' : 'textSecondary'}>
                País: {country?.name ?? 'Todos'}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => country && setCityPickerVisible(true)}
              style={[styles.chip, { borderColor: theme.backgroundSelected }, city && { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText type="small" themeColor={city ? 'text' : 'textSecondary'}>
                Ciudad: {city?.name ?? 'Todas'}
              </ThemedText>
            </Pressable>
          </View>

          {isLoadingUsers && (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando…
            </ThemedText>
          )}

          {users.map((user) => (
            <ThemedView key={user.id} type="backgroundElement" style={styles.userCard}>
              <ThemedText type="smallBold">
                {user.name} <ThemedText type="small" themeColor="textSecondary">· {ROLE_LABELS[user.role]}</ThemedText>
                {user.trainer_verified_at && <ThemedText type="small" themeColor="accent"> ✓</ThemedText>}
                {user.is_deactivated && <ThemedText type="small" style={styles.warn}> · Desactivado</ThemedText>}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {user.email}
                {(user.country || user.city) && ` · ${[user.city, user.country].filter(Boolean).join(', ')}`}
              </ThemedText>
              <ThemedText type="small" themeColor={user.current_routine?.source === 'admin' ? 'accent' : 'textSecondary'}>
                Rutina: {user.current_routine?.label ?? 'Sin rutina activa'}
              </ThemedText>
              <View style={styles.actionsRow}>
                {user.role === 'trainer' && (
                  <PrimaryButton
                    label={user.trainer_verified_at ? 'Quitar verificación' : 'Verificar'}
                    variant="ghost"
                    onPress={() => verifyTrainer(user.id)}
                  />
                )}
                <PrimaryButton
                  label={user.is_banned ? 'Desbanear' : 'Banear'}
                  variant="ghost"
                  onPress={() => banUser(user.id)}
                />
                {user.role !== 'super_admin' && (
                  <>
                    {user.role === 'user' && (
                      <PrimaryButton
                        label="Promover a entrenador"
                        variant="ghost"
                        onPress={() => changeUserRole(user.id, 'trainer').then(() => applyFilters())}
                      />
                    )}
                    {user.role === 'trainer' && (
                      <PrimaryButton
                        label="Degradar a usuario"
                        variant="ghost"
                        onPress={() => changeUserRole(user.id, 'user').then(() => applyFilters())}
                      />
                    )}
                    <PrimaryButton
                      label={user.is_deactivated ? 'Reactivar' : 'Desactivar'}
                      variant="ghost"
                      onPress={() =>
                        (user.is_deactivated ? activateUser(user.id) : deactivateUser(user.id)).then(() =>
                          applyFilters(),
                        )
                      }
                    />
                    <PrimaryButton label="Eliminar" variant="ghost" onPress={() => setConfirmingDeleteId(user.id)} />
                  </>
                )}
              </View>
            </ThemedView>
          ))}

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>

        <ConfirmDialog
          visible={confirmingDeleteId !== null}
          title={`¿Eliminar la cuenta de ${confirmingUser?.name ?? ''}?`}
          description="Esta acción es irreversible — se borran su cuenta, rutinas, entrenamientos, PRs e historial."
          confirmLabel="Sí, eliminar"
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDeleteId(null)}
        />

        <OptionPickerModal
          visible={countryPickerVisible}
          title="País"
          options={countries}
          onSelect={(option) => {
            setCountry(option);
            setCity(null);
            setCountryPickerVisible(false);
            applyFilters({ countryId: option?.id, cityId: undefined });
          }}
          onClose={() => setCountryPickerVisible(false)}
        />

        <OptionPickerModal
          visible={cityPickerVisible}
          title="Ciudad"
          options={cities}
          onSelect={(option) => {
            setCity(option);
            setCityPickerVisible(false);
            applyFilters({ cityId: option?.id });
          }}
          onClose={() => setCityPickerVisible(false)}
        />
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
  pageTitle: { fontSize: 28, lineHeight: 34 },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  userCard: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.one },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginTop: Spacing.one },
  warn: { color: '#C9564A' },
});

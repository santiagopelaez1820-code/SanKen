import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AdminUser } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAdminStore } from '@/store/admin-store';

const ROLE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Todos', value: '' },
  { label: 'Usuario', value: 'user' },
  { label: 'Entrenador', value: 'trainer' },
  { label: 'Admin', value: 'admin' },
];

const ROLE_LABELS: Record<AdminUser['role'], string> = {
  user: 'Usuario',
  trainer: 'Entrenador',
  admin: 'Admin',
};

export default function AdminUsuariosScreen() {
  const theme = useTheme();
  const { users, isLoadingUsers, loadUsers, banUser, verifyTrainer } = useAdminStore();
  const [role, setRole] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    loadUsers({ role: role || undefined, q: q || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
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
            onSubmitEditing={() => loadUsers({ role: role || undefined, q: q || undefined })}
            placeholder="Buscar por nombre o correo…"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
          />

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
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {user.email}
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
              </View>
            </ThemedView>
          ))}

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
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
  actionsRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one },
});

import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAdminStore } from '@/store/admin-store';

const ROLE_LABELS: Record<string, string> = {
  user: 'Usuario',
  trainer: 'Entrenador',
  super_admin: 'Super Admin',
};

/** Mismas acciones y layout que apps/web AdminUserDetailPage — ver ese archivo para el criterio de cada botón. */
export default function AdminUserDetailScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const id = Number(userId);

  const {
    userDetail,
    isLoadingUserDetail,
    loadUserDetail,
    changeUserRole,
    activateUser,
    deactivateUser,
    deleteUser,
    revertToGeneralRoutine,
    isSubmittingAdminRoutine,
  } = useAdminStore();

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingRevert, setConfirmingRevert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) loadUserDetail(id);
  }, [id, loadUserDetail]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUser(id);
      router.replace('/admin/usuarios');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRevert = async () => {
    const ok = await revertToGeneralRoutine(id);
    if (ok) setConfirmingRevert(false);
  };

  if (isLoadingUserDetail || !userDetail) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <Skeleton height={56} borderRadius={Spacing.three} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const user = userDetail;

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ gap: Spacing.two, paddingBottom: BottomTabInset + Spacing.four }}>
          <ThemedText type="small" themeColor="textSecondary" onPress={() => router.back()}>
            ← Usuarios
          </ThemedText>
          <ThemedText type="title" style={styles.pageTitle}>
            {user.name}
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedView style={styles.infoGrid}>
              <ThemedView style={styles.infoCell}>
                <ThemedText type="small" themeColor="textSecondary">
                  Correo
                </ThemedText>
                <ThemedText type="small">{user.email}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.infoCell}>
                <ThemedText type="small" themeColor="textSecondary">
                  Rol
                </ThemedText>
                <ThemedText type="small">
                  {ROLE_LABELS[user.role] ?? user.role}
                  {user.role === 'trainer' && user.trainer_verified_at && (
                    <ThemedText type="small" themeColor="accent">
                      {' '}
                      ✓ Verificado
                    </ThemedText>
                  )}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.infoCell}>
                <ThemedText type="small" themeColor="textSecondary">
                  Estado
                </ThemedText>
                <ThemedText type="small" style={user.is_banned || user.is_deactivated ? styles.warn : undefined}>
                  {user.is_banned ? 'Baneado' : user.is_deactivated ? 'Desactivado' : 'Activo'}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.infoCell}>
                <ThemedText type="small" themeColor="textSecondary">
                  País / Ciudad
                </ThemedText>
                <ThemedText type="small">{[user.city, user.country].filter(Boolean).join(' · ') || '—'}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.infoCell}>
                <ThemedText type="small" themeColor="textSecondary">
                  Registrado
                </ThemedText>
                <ThemedText type="small">{new Date(user.created_at).toLocaleDateString()}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.infoCell}>
                <ThemedText type="small" themeColor="textSecondary">
                  Entrenamientos completados
                </ThemedText>
                <ThemedText type="small">{user.trainings_completed}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {user.role !== 'super_admin' && (
            <ThemedView type="backgroundElement" style={[styles.card, styles.actionsRow]}>
              {user.role === 'user' && (
                <PrimaryButton label="Promover a entrenador" variant="ghost" onPress={() => changeUserRole(id, 'trainer')} />
              )}
              {user.role === 'trainer' && (
                <PrimaryButton label="Degradar a usuario" variant="ghost" onPress={() => changeUserRole(id, 'user')} />
              )}
              <PrimaryButton
                label={user.is_banned ? 'Desbanear' : 'Banear'}
                variant="ghost"
                onPress={async () => {
                  await useAdminStore.getState().banUser(id);
                  loadUserDetail(id);
                }}
              />
              <PrimaryButton
                label={user.is_deactivated ? 'Reactivar cuenta' : 'Desactivar cuenta'}
                variant="ghost"
                onPress={() => (user.is_deactivated ? activateUser(id) : deactivateUser(id))}
              />
              <PrimaryButton label="Eliminar cuenta" variant="ghost" onPress={() => setConfirmingDelete(true)} />
            </ThemedView>
          )}

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">Rutina</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {user.current_routine ? user.current_routine.label : 'Sin rutina activa'}
            </ThemedText>
            <ThemedView style={styles.actionsRow}>
              <PrimaryButton
                label={user.current_routine?.source === 'admin' ? 'Reemplazar rutina personalizada' : 'Asignar rutina personalizada'}
                variant="ghost"
                onPress={() => router.push(`/admin/usuarios/${id}/routine`)}
              />
              {user.current_routine?.source === 'admin' && (
                <PrimaryButton label="Volver a rutina general" variant="ghost" onPress={() => setConfirmingRevert(true)} />
              )}
            </ThemedView>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">Récords personales</ThemedText>
            {user.personal_records.length === 0 ? (
              <ThemedText type="small" themeColor="textSecondary">
                Sin récords registrados.
              </ThemedText>
            ) : (
              user.personal_records.map((record) => (
                <ThemedView key={record.id} style={styles.recordRow}>
                  <ThemedText type="small">{record.exercise_name}</ThemedText>
                  <ThemedText type="smallBold" themeColor="accent">
                    {record.value} kg
                  </ThemedText>
                </ThemedView>
              ))
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>

      <ConfirmDialog
        visible={confirmingDelete}
        title={`¿Eliminar la cuenta de ${user.name}?`}
        description="Esta acción es irreversible — se borran su cuenta, rutinas, entrenamientos, PRs e historial."
        confirmLabel="Sí, eliminar"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />

      <ConfirmDialog
        visible={confirmingRevert}
        title="¿Volver a la rutina general?"
        description="Se desactiva la rutina personalizada (queda en su historial) y se le asigna la plantilla general que le corresponde según su frecuencia."
        confirmLabel="Sí, volver a la general"
        isLoading={isSubmittingAdminRoutine}
        onConfirm={handleRevert}
        onCancel={() => setConfirmingRevert(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: {
    flex: 1,
    alignItems: 'stretch',
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  pageTitle: { fontSize: 24, lineHeight: 30 },
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three, backgroundColor: 'transparent' },
  infoCell: { width: '45%', gap: 2, backgroundColor: 'transparent' },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, backgroundColor: 'transparent' },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    backgroundColor: 'transparent',
  },
  warn: { color: '#FF4D5E' },
});

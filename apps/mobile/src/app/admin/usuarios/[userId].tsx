// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router, useLocalSearchParams» desde «expo-router».
import { router, useLocalSearchParams } from 'expo-router';
// Esta línea sirve para importar «ScrollView, StyleSheet» desde «react-native».
import { ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «formatPersonalRecord» desde «@sanken/core».
import { formatPersonalRecord } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «BackButton» desde «@/components/ui/back-button».
import { BackButton } from '@/components/ui/back-button';
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/confirm-dialog».
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useAdminStore» desde «@/store/admin-store».
import { useAdminStore } from '@/store/admin-store';

// Esta línea sirve para declarar «ROLE_LABELS» con el valor «{».
const ROLE_LABELS: Record<string, string> = {
  // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «'Usuario'».
  user: 'Usuario',
  // Esta línea sirve para declarar la propiedad «trainer» con el valor o tipo «'Entrenador'».
  trainer: 'Entrenador',
  // Esta línea sirve para declarar la propiedad «super_admin» con el valor o tipo «'Super Admin'».
  super_admin: 'Super Admin',
};

/** Mismas acciones y layout que apps/web AdminUserDetailPage — ver ese archivo para el criterio de cada botón. */
// Esta línea sirve para declarar la función «AdminUserDetailScreen».
export default function AdminUserDetailScreen() {
  // Esta línea sirve para extraer «userId» de «useLocalSearchParams<{ userId: string }>».
  const { userId } = useLocalSearchParams<{ userId: string }>();
  // Esta línea sirve para extraer «» de «Number(userId)».
  const id = Number(userId);

  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «userDetail» en la lista.
    userDetail,
    // Esta línea sirve para incluir el valor «isLoadingUserDetail» en la lista.
    isLoadingUserDetail,
    // Esta línea sirve para incluir el valor «loadUserDetail» en la lista.
    loadUserDetail,
    // Esta línea sirve para incluir el valor «changeUserRole» en la lista.
    changeUserRole,
    // Esta línea sirve para incluir el valor «activateUser» en la lista.
    activateUser,
    // Esta línea sirve para incluir el valor «deactivateUser» en la lista.
    deactivateUser,
    // Esta línea sirve para incluir el valor «deleteUser» en la lista.
    deleteUser,
    // Esta línea sirve para incluir el valor «revertToGeneralRoutine» en la lista.
    revertToGeneralRoutine,
    // Esta línea sirve para incluir el valor «isSubmittingAdminRoutine» en la lista.
    isSubmittingAdminRoutine,
  // Esta línea sirve para cerrar la desestructuración con «useAdminStore()».
  } = useAdminStore();

  // Esta línea sirve para crear el estado «confirmingDelete» y su función «setConfirmingDelete».
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  // Esta línea sirve para crear el estado «confirmingRevert» y su función «setConfirmingRevert».
  const [confirmingRevert, setConfirmingRevert] = useState(false);
  // Esta línea sirve para crear el estado «isDeleting» y su función «setIsDeleting».
  const [isDeleting, setIsDeleting] = useState(false);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadUserDetail» si «id».
    if (id) loadUserDetail(id);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «id, loadUserDetail».
  }, [id, loadUserDetail]);

  // Esta línea sirve para extraer «andleDelet» de «async () => {».
  const handleDelete = async () => {
    // Esta línea sirve para guardar en el estado con «setIsDeleting» el valor «true)…».
    setIsDeleting(true);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «deleteUser».
      await deleteUser(id);
      // Esta línea sirve para llamar a «router.replace» con «'/admin/usuarios'».
      router.replace('/admin/usuarios');
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsDeleting» el valor «false)…».
      setIsDeleting(false);
    }
  };

  // Esta línea sirve para extraer «andleRever» de «async () => {».
  const handleRevert = async () => {
    // Esta línea sirve para esperar «revertToGeneralRoutine(id)» y guardar el resultado en «ok».
    const ok = await revertToGeneralRoutine(id);
    // Esta línea sirve para llamar a «setConfirmingRevert» si «ok».
    if (ok) setConfirmingRevert(false);
  };

  // Esta línea sirve para revisar si «isLoadingUserDetail || !userDetail».
  if (isLoadingUserDetail || !userDetail) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «ThemedView».
      <ThemedView style={styles.root}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={styles.safeArea}>
          {/* Esta línea sirve para abrir el componente «Skeleton». */}
          <Skeleton height={56} borderRadius={Spacing.three} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Esta línea sirve para extraer «se» de «userDetail».
  const user = userDetail;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView contentContainerStyle={{ gap: Spacing.two, paddingBottom: BottomTabInset + Spacing.four }}>
          {/* Esta línea sirve para abrir el componente «BackButton». */}
          <BackButton label="Usuarios" fallbackHref="/admin/usuarios" />
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el valor «user.name». */}
            {user.name}
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.infoGrid}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.infoCell}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «Correo». */}
                  Correo
                </ThemedText>
                {/* Esta línea sirve para mostrar el valor «user.email» dentro de «ThemedText». */}
                <ThemedText type="small">{user.email}</ThemedText>
              </ThemedView>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.infoCell}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «Rol». */}
                  Rol
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small">
                  {/* Esta línea sirve para mostrar el contenido dinámico «{ROLE_LABELS[user.role] ?? user.role}». */}
                  {ROLE_LABELS[user.role] ?? user.role}
                  {/* Esta línea sirve para mostrar el contenido dinámico «{user.role === 'trainer' && user.trainer_verified_at && (». */}
                  {user.role === 'trainer' && user.trainer_verified_at && (
                    // Esta línea sirve para abrir el componente «ThemedText».
                    <ThemedText type="small" themeColor="accent">
                      {/* Esta línea sirve para mostrar el contenido dinámico «{' '}». */}
                      {' '}
                      {/* Esta línea sirve para mostrar el contenido dinámico «✓ Verificado». */}
                      ✓ Verificado
                    </ThemedText>
                  )}
                </ThemedText>
              </ThemedView>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.infoCell}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «Estado». */}
                  Estado
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" style={user.is_banned || user.is_deactivated ? styles.warn : undefined}>
                  {/* Esta línea sirve para mostrar el estado de la cuenta: baneado, desactivado o activo. */}
                  {user.is_banned ? 'Baneado' : user.is_deactivated ? 'Desactivado' : 'Activo'}
                </ThemedText>
              </ThemedView>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.infoCell}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «País / Ciudad». */}
                  País / Ciudad
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText» con sus propiedades. */}
                <ThemedText type="small">{[user.city, user.country].filter(Boolean).join(' · ') || '—'}</ThemedText>
              </ThemedView>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.infoCell}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «Registrado». */}
                  Registrado
                </ThemedText>
                {/* Esta línea sirve para mostrar el valor «new Date(user.created_at).toLocaleDateString()» dentro de «ThemedText». */}
                <ThemedText type="small">{new Date(user.created_at).toLocaleDateString()}</ThemedText>
              </ThemedView>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.infoCell}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «Entrenamientos completados». */}
                  Entrenamientos completados
                </ThemedText>
                {/* Esta línea sirve para mostrar el valor «user.trainings_completed» dentro de «ThemedText». */}
                <ThemedText type="small">{user.trainings_completed}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «user.role !== 'super_admin'». */}
          {user.role !== 'super_admin' && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView type="backgroundElement" style={[styles.card, styles.actionsRow]}>
              {/* Esta línea sirve para mostrar el bloque solo si «user.role === 'user'». */}
              {user.role === 'user' && (
                // Esta línea sirve para mostrar el componente «PrimaryButton».
                <PrimaryButton label="Promover a entrenador" variant="ghost" onPress={() => changeUserRole(id, 'trainer')} />
              )}
              {/* Esta línea sirve para mostrar el bloque solo si «user.role === 'trainer'». */}
              {user.role === 'trainer' && (
                // Esta línea sirve para mostrar el componente «PrimaryButton».
                <PrimaryButton label="Degradar a usuario" variant="ghost" onPress={() => changeUserRole(id, 'user')} />
              )}
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para pasar la propiedad «label» con el valor «user.is_banned ? 'Desbanear' : 'Banear'}».
                label={user.is_banned ? 'Desbanear' : 'Banear'}
                // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                variant="ghost"
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={async () => {
                  // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
                  await useAdminStore.getState().banUser(id);
                  // Esta línea sirve para llamar a «loadUserDetail» con «id».
                  loadUserDetail(id);
                }}
              />
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para pasar la propiedad «label» con el valor «user.is_deactivated ? 'Reactivar cuenta' : 'D».
                label={user.is_deactivated ? 'Reactivar cuenta' : 'Desactivar cuenta'}
                // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                variant="ghost"
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => (user.is_deactivated ? activateUser(id) : deactivateUser(id))}
              />
              {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
              <PrimaryButton label="Eliminar cuenta" variant="ghost" onPress={() => setConfirmingDelete(true)} />
            </ThemedView>
          )}

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para mostrar el texto «Rutina» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Rutina</ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar la rutina actual o «Sin rutina activa». */}
              {user.current_routine ? user.current_routine.label : 'Sin rutina activa'}
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.actionsRow}>
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para pasar la propiedad «label» con el valor «user.current_routine?.source === 'admin' ? 'R».
                label={user.current_routine?.source === 'admin' ? 'Reemplazar rutina personalizada' : 'Asignar rutina personalizada'}
                // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                variant="ghost"
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => router.push(`/admin/usuarios/${id}/routine`)}
              />
              {/* Esta línea sirve para mostrar el bloque solo si «user.current_routine?.source === 'admin'». */}
              {user.current_routine?.source === 'admin' && (
                // Esta línea sirve para mostrar el componente «PrimaryButton».
                <PrimaryButton label="Volver a rutina general" variant="ghost" onPress={() => setConfirmingRevert(true)} />
              )}
            </ThemedView>
          </ThemedView>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.card}>
            {/* Esta línea sirve para mostrar el texto «Récords personales» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Récords personales</ThemedText>
            {/* Esta línea sirve para elegir entre dos bloques según «user.personal_records.length === 0». */}
            {user.personal_records.length === 0 ? (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Sin récords registrados.». */}
                Sin récords registrados.
              </ThemedText>
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para recorrer los récords personales del usuario.
              user.personal_records.map((record) => (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView key={record.id} style={styles.recordRow}>
                  {/* Esta línea sirve para mostrar el valor «record.exercise_name» dentro de «ThemedText». */}
                  <ThemedText type="small">{record.exercise_name}</ThemedText>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="smallBold" themeColor="accent">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{formatPersonalRecord(record)}». */}
                    {formatPersonalRecord(record)}
                  </ThemedText>
                </ThemedView>
              ))
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>

      {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
      <ConfirmDialog
        // Esta línea sirve para pasar la propiedad «visible» con el valor «confirmingDelete}».
        visible={confirmingDelete}
        // Esta línea sirve para pasar la propiedad «title» con el valor «`¿Eliminar la cuenta de ${user.name}?`}».
        title={`¿Eliminar la cuenta de ${user.name}?`}
        // Esta línea sirve para definir el atributo «description».
        description="Esta acción es irreversible — se borran su cuenta, rutinas, entrenamientos, PRs e historial."
        // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, eliminar».
        confirmLabel="Sí, eliminar"
        // Esta línea sirve para pasar la propiedad «isLoading» con el valor «isDeleting}».
        isLoading={isDeleting}
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={handleDelete}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={() => setConfirmingDelete(false)}
      />

      {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
      <ConfirmDialog
        // Esta línea sirve para pasar la propiedad «visible» con el valor «confirmingRevert}».
        visible={confirmingRevert}
        // Esta línea sirve para definir el atributo «title» con el valor «¿Volver a la rutina general?».
        title="¿Volver a la rutina general?"
        // Esta línea sirve para definir el atributo «description».
        description="Se desactiva la rutina personalizada (queda en su historial) y se le asigna la plantilla general que le corresponde según su frecuencia."
        // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, volver a la general».
        confirmLabel="Sí, volver a la general"
        // Esta línea sirve para pasar la propiedad «isLoading» con el valor «isSubmittingAdminRoutine}».
        isLoading={isSubmittingAdminRoutine}
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={handleRevert}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={() => setConfirmingRevert(false)}
      />
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para declarar la propiedad «safeArea» con el valor o tipo «{».
  safeArea: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'stretch'».
    alignItems: 'stretch',
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'center'».
    alignSelf: 'center',
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.three».
    paddingTop: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.four, padding: Spacing.three…».
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  // Esta línea sirve para definir el estilo «infoGrid» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «infoCell» con «width: '45%', gap: 2, backgroundColor: 'transparen…».
  infoCell: { width: '45%', gap: 2, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «actionsRow» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «recordRow» con el valor o tipo «{».
  recordRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.one».
    paddingVertical: Spacing.one,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «warn» con el valor o tipo «{ color: '#FF4D5E' }».
  warn: { color: '#FF4D5E' },
});

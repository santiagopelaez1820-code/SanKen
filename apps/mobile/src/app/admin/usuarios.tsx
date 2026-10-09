// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, TextInput, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «AdminUser, OnboardingCity, OnboardingQuestions» desde «@sanken/core».
import type { AdminUser, OnboardingCity, OnboardingQuestions } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/confirm-dialog».
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
// Esta línea sirve para importar «ListPickerModal» desde «@/components/ui/list-picker-modal».
import { ListPickerModal } from '@/components/ui/list-picker-modal';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useAdminStore» desde «@/store/admin-store».
import { useAdminStore } from '@/store/admin-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar «ROLE_OPTIONS» con el valor «[».
const ROLE_OPTIONS: { label: string; value: string }[] = [
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Todos', value: '' },…».
  { label: 'Todos', value: '' },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Usuario', value: 'user' },…».
  { label: 'Usuario', value: 'user' },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Entrenador', value: 'trainer' },…».
  { label: 'Entrenador', value: 'trainer' },
  // Esta línea sirve para agregar un elemento cuyo «label» es «'Super Admin', value: 'super_admin' },…».
  { label: 'Super Admin', value: 'super_admin' },
];

// Esta línea sirve para declarar «ROLE_LABELS» con el valor «{».
const ROLE_LABELS: Record<AdminUser['role'], string> = {
  // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «'Usuario'».
  user: 'Usuario',
  // Esta línea sirve para declarar la propiedad «trainer» con el valor o tipo «'Entrenador'».
  trainer: 'Entrenador',
  // Esta línea sirve para declarar la propiedad «super_admin» con el valor o tipo «'Super Admin'».
  super_admin: 'Super Admin',
};

// Esta línea sirve para declarar la función «AdminUsuariosScreen».
export default function AdminUsuariosScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «users» en la lista.
    users,
    // Esta línea sirve para incluir el valor «isLoadingUsers» en la lista.
    isLoadingUsers,
    // Esta línea sirve para incluir el valor «loadUsers» en la lista.
    loadUsers,
    // Esta línea sirve para incluir el valor «banUser» en la lista.
    banUser,
    // Esta línea sirve para incluir el valor «verifyTrainer» en la lista.
    verifyTrainer,
    // Esta línea sirve para incluir el valor «changeUserRole» en la lista.
    changeUserRole,
    // Esta línea sirve para incluir el valor «activateUser» en la lista.
    activateUser,
    // Esta línea sirve para incluir el valor «deactivateUser» en la lista.
    deactivateUser,
    // Esta línea sirve para incluir el valor «deleteUser» en la lista.
    deleteUser,
  // Esta línea sirve para cerrar la desestructuración con «useAdminStore()».
  } = useAdminStore();
  // Esta línea sirve para crear el estado «role» y su función «setRole».
  const [role, setRole] = useState('');
  // Esta línea sirve para crear el estado «q» y su función «setQ».
  const [q, setQ] = useState('');
  // Esta línea sirve para crear el estado «confirmingDeleteId» y su función «setConfirmingDeleteId».
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
  // Esta línea sirve para crear el estado «isDeleting» y su función «setIsDeleting».
  const [isDeleting, setIsDeleting] = useState(false);

  // Esta línea sirve para crear el estado «countries» y su función «setCountries».
  const [countries, setCountries] = useState<{ id: number; name: string }[]>([]);
  // Esta línea sirve para crear el estado «country» y su función «setCountry».
  const [country, setCountry] = useState<{ id: number; name: string } | null>(null);
  // Esta línea sirve para crear el estado «cities» y su función «setCities».
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  // Esta línea sirve para crear el estado «city» y su función «setCity».
  const [city, setCity] = useState<{ id: number; name: string } | null>(null);
  // Esta línea sirve para crear el estado «countryPickerVisible» y su función «setCountryPickerVisible».
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  // Esta línea sirve para crear el estado «cityPickerVisible» y su función «setCityPickerVisible».
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  // Esta línea sirve para extraer «pplyFilter» de «(overrides?: { countryId?: number; cityI».
  const applyFilters = (overrides?: { countryId?: number; cityId?: number }) =>
    // Esta línea sirve para cargar los usuarios con los filtros.
    loadUsers({
      // Esta línea sirve para declarar la propiedad «role» con el valor o tipo «role || undefined».
      role: role || undefined,
      // Esta línea sirve para declarar la propiedad «q» con el valor o tipo «q || undefined».
      q: q || undefined,
      // Esta línea sirve para declarar la propiedad «country_id» con el valor o tipo «overrides?.countryId ?? country?.id».
      country_id: overrides?.countryId ?? country?.id,
      // Esta línea sirve para declarar la propiedad «city_id» con el valor o tipo «overrides?.cityId ?? city?.id».
      city_id: overrides?.cityId ?? city?.id,
    });

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para pedir los países del cuestionario y guardarlos.
    api.get<OnboardingQuestions>('/onboarding/questions').then((questions) => setCountries(questions.countries));
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
  }, []);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!country».
    if (!country) return;
    // Esta línea sirve para pedir las ciudades del país y guardarlas.
    api.get<OnboardingCity[]>(`/onboarding/countries/${country.id}/cities`).then(setCities);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «country».
  }, [country]);

  // Deriva de `country` en vez de resetear `cities` sincrónicamente en el
  // efecto de arriba -- sin país seleccionado, la lista de ciudades para el
  // picker siempre debe estar vacía, sin importar qué haya quedado cacheado
  // del país anterior.
  // Esta línea sirve para extraer «isibleCitie» de «country ? cities : []».
  const visibleCities = country ? cities : [];

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «applyFilters».
    applyFilters();
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «role».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // Esta línea sirve para extraer «onfirmingUse» de «users.find((u) => u.id === confirmingDel».
  const confirmingUser = users.find((u) => u.id === confirmingDeleteId) ?? null;

  // Esta línea sirve para extraer «andleDelet» de «async () => {».
  const handleDelete = async () => {
    // Esta línea sirve para salir de la función si «!confirmingDeleteId».
    if (!confirmingDeleteId) return;
    // Esta línea sirve para guardar en el estado con «setIsDeleting» el valor «true)…».
    setIsDeleting(true);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «deleteUser».
      await deleteUser(confirmingDeleteId);
      // Esta línea sirve para guardar en el estado con «setConfirmingDeleteId» el valor «null)…».
      setConfirmingDeleteId(null);
      // Esta línea sirve para esperar el resultado de «applyFilters».
      await applyFilters();
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsDeleting» el valor «false)…».
      setIsDeleting(false);
    }
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el texto «Usuarios». */}
            Usuarios
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.roleRow}>
            {/* Esta línea sirve para recorrer «ROLE_OPTIONS» y calcular qué mostrar por elemento. */}
            {ROLE_OPTIONS.map((option) => {
              // Esta línea sirve para extraer «electe» de «option.value === role».
              const selected = option.value === role;
              // Esta línea sirve para devolver la interfaz del componente.
              return (
                // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
                <Pressable
                  // Esta línea sirve para identificar el elemento de la lista con «option.value}».
                  key={option.value}
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => setRole(option.value)}
                  // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                  style={[
                    // Esta línea sirve para agregar el estilo «styles.chip».
                    styles.chip,
                    // Esta línea sirve para agregar un elemento cuyo «borderColor» es «theme.backgroundSelected },…».
                    { borderColor: theme.backgroundSelected },
                    // Esta línea sirve para aplicar el estilo «backgroundColor: theme.backgroundSelecte…» solo si «selected».
                    selected && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                    {/* Esta línea sirve para mostrar el valor «option.label». */}
                    {option.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
          <TextInput allowFontScaling={false}
            // Esta línea sirve para pasar la propiedad «value» con el valor «q}».
            value={q}
            // Esta línea sirve para asignar el manejador del evento «onChangeText».
            onChangeText={setQ}
            // Esta línea sirve para asignar el manejador del evento «onSubmitEditing».
            onSubmitEditing={() => applyFilters()}
            // Esta línea sirve para definir el atributo «placeholder» con el valor «Buscar por nombre o correo…».
            placeholder="Buscar por nombre o correo…"
            // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
            placeholderTextColor={theme.textSecondary}
            // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { borderColor: theme.backgroun».
            style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
          />

          {/* Esta línea sirve para abrir el componente «View». */}
          <View style={styles.roleRow}>
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => setCountryPickerVisible(true)}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.chip, { borderColor: theme.background».
              style={[styles.chip, { borderColor: theme.backgroundSelected }, country && { backgroundColor: theme.backgroundSelected }]}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor={country ? 'text' : 'textSecondary'}>
                {/* Esta línea sirve para mostrar el contenido dinámico «País: {country?.name ?? 'Todos'}». */}
                País: {country?.name ?? 'Todos'}
              </ThemedText>
            </Pressable>
            {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
            <Pressable
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => country && setCityPickerVisible(true)}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.chip, { borderColor: theme.background».
              style={[styles.chip, { borderColor: theme.backgroundSelected }, city && { backgroundColor: theme.backgroundSelected }]}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor={city ? 'text' : 'textSecondary'}>
                {/* Esta línea sirve para mostrar el contenido dinámico «Ciudad: {city?.name ?? 'Todas'}». */}
                Ciudad: {city?.name ?? 'Todas'}
              </ThemedText>
            </Pressable>
          </View>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadingUsers». */}
          {isLoadingUsers && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}

          {/* Esta línea sirve para recorrer «users» y mostrar un bloque por elemento. */}
          {users.map((user) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={user.id} type="backgroundElement" style={styles.userCard}>
              {/* Esta línea sirve para abrir el componente «Pressable» con sus propiedades. */}
              <Pressable onPress={() => router.push(`/admin/usuarios/${user.id}`)}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold">
                  {/* Esta línea sirve para mostrar el nombre y el rol del usuario. */}
                  {user.name} <ThemedText type="small" themeColor="textSecondary">· {ROLE_LABELS[user.role]}</ThemedText>
                  {/* Esta línea sirve para mostrar el elemento solo si «user.trainer_verified_at». */}
                  {user.trainer_verified_at && <ThemedText type="small" themeColor="accent"> ✓</ThemedText>}
                  {/* Esta línea sirve para mostrar el elemento solo si «user.is_deactivated». */}
                  {user.is_deactivated && <ThemedText type="small" style={styles.warn}> · Desactivado</ThemedText>}
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el valor «user.email». */}
                  {user.email}
                  {/* Esta línea sirve para mostrar la ciudad y el país del usuario. */}
                  {(user.country || user.city) && ` · ${[user.city, user.country].filter(Boolean).join(', ')}`}
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor={user.current_routine?.source === 'admin' ? 'accent' : 'textSecondary'}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «Rutina: {user.current_routine?.label ?? 'Sin rutina activa'}». */}
                  Rutina: {user.current_routine?.label ?? 'Sin rutina activa'}
                </ThemedText>
              </Pressable>
              {/* Esta línea sirve para abrir el componente «View». */}
              <View style={styles.actionsRow}>
                {/* Esta línea sirve para mostrar el bloque solo si «user.role === 'trainer'». */}
                {user.role === 'trainer' && (
                  // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
                  <PrimaryButton
                    // Esta línea sirve para pasar la propiedad «label» con el valor «user.trainer_verified_at ? 'Quitar verificaci».
                    label={user.trainer_verified_at ? 'Quitar verificación' : 'Verificar'}
                    // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                    variant="ghost"
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => verifyTrainer(user.id)}
                  />
                )}
                {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                <PrimaryButton
                  // Esta línea sirve para pasar la propiedad «label» con el valor «user.is_banned ? 'Desbanear' : 'Banear'}».
                  label={user.is_banned ? 'Desbanear' : 'Banear'}
                  // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                  variant="ghost"
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => banUser(user.id)}
                />
                {/* Esta línea sirve para mostrar el bloque solo si «user.role !== 'super_admin'». */}
                {user.role !== 'super_admin' && (
                  // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
                  <>
                    {/* Esta línea sirve para mostrar el bloque solo si «user.role === 'user'». */}
                    {user.role === 'user' && (
                      // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
                      <PrimaryButton
                        // Esta línea sirve para definir el atributo «label» con el valor «Promover a entrenador».
                        label="Promover a entrenador"
                        // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                        variant="ghost"
                        // Esta línea sirve para asignar el manejador del evento «onPress».
                        onPress={() => changeUserRole(user.id, 'trainer').then(() => applyFilters())}
                      />
                    )}
                    {/* Esta línea sirve para mostrar el bloque solo si «user.role === 'trainer'». */}
                    {user.role === 'trainer' && (
                      // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
                      <PrimaryButton
                        // Esta línea sirve para definir el atributo «label» con el valor «Degradar a usuario».
                        label="Degradar a usuario"
                        // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                        variant="ghost"
                        // Esta línea sirve para asignar el manejador del evento «onPress».
                        onPress={() => changeUserRole(user.id, 'user').then(() => applyFilters())}
                      />
                    )}
                    {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                    <PrimaryButton
                      // Esta línea sirve para pasar la propiedad «label» con el valor «user.is_deactivated ? 'Reactivar' : 'Desactiv».
                      label={user.is_deactivated ? 'Reactivar' : 'Desactivar'}
                      // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                      variant="ghost"
                      // Esta línea sirve para asignar el manejador del evento «onPress».
                      onPress={() =>
                        // Esta línea sirve para activar o desactivar la cuenta según su estado.
                        (user.is_deactivated ? activateUser(user.id) : deactivateUser(user.id)).then(() =>
                          // Esta línea sirve para aplicar los filtros de nuevo al terminar.
                          applyFilters(),
                        )
                      }
                    />
                    {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
                    <PrimaryButton label="Eliminar" variant="ghost" onPress={() => setConfirmingDeleteId(user.id)} />
                  </>
                )}
              </View>
            </ThemedView>
          ))}

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>

        {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
        <ConfirmDialog
          // Esta línea sirve para pasar la propiedad «visible» con el valor «confirmingDeleteId !== null}».
          visible={confirmingDeleteId !== null}
          // Esta línea sirve para pasar la propiedad «title» con el valor «`¿Eliminar la cuenta de ${confirmingUser?.nam».
          title={`¿Eliminar la cuenta de ${confirmingUser?.name ?? ''}?`}
          // Esta línea sirve para definir el atributo «description».
          description="Esta acción es irreversible — se borran su cuenta, rutinas, entrenamientos, PRs e historial."
          // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, eliminar».
          confirmLabel="Sí, eliminar"
          // Esta línea sirve para pasar la propiedad «isLoading» con el valor «isDeleting}».
          isLoading={isDeleting}
          // Esta línea sirve para asignar el manejador del evento «onConfirm».
          onConfirm={handleDelete}
          // Esta línea sirve para asignar el manejador del evento «onCancel».
          onCancel={() => setConfirmingDeleteId(null)}
        />

        {/* Esta línea sirve para abrir el elemento «ListPickerModal» con sus atributos en varias líneas. */}
        <ListPickerModal
          // Esta línea sirve para pasar la propiedad «visible» con el valor «countryPickerVisible}».
          visible={countryPickerVisible}
          // Esta línea sirve para definir el atributo «title» con el valor «País».
          title="País"
          // Esta línea sirve para pasar la propiedad «items» con el valor «countries}».
          items={countries}
          // Esta línea sirve para pasar la propiedad «getId» con el valor «(option) => option.id}».
          getId={(option) => option.id}
          // Esta línea sirve para pasar la propiedad «getLabel» con el valor «(option) => option.name}».
          getLabel={(option) => option.name}
          // Esta línea sirve para asignar el manejador del evento «onSelect».
          onSelect={(option) => {
            // Esta línea sirve para guardar en el estado con «setCountry» el valor «option)…».
            setCountry(option);
            // Esta línea sirve para guardar en el estado con «setCity» el valor «null)…».
            setCity(null);
            // Esta línea sirve para guardar en el estado con «setCountryPickerVisible» el valor «false)…».
            setCountryPickerVisible(false);
            // Esta línea sirve para aplicar el filtro de país y limpiar el de ciudad.
            applyFilters({ countryId: option.id, cityId: undefined });
          }}
          // Esta línea sirve para asignar el manejador del evento «onSelectAll».
          onSelectAll={() => {
            // Esta línea sirve para guardar en el estado con «setCountry» el valor «null)…».
            setCountry(null);
            // Esta línea sirve para guardar en el estado con «setCity» el valor «null)…».
            setCity(null);
            // Esta línea sirve para guardar en el estado con «setCountryPickerVisible» el valor «false)…».
            setCountryPickerVisible(false);
            // Esta línea sirve para limpiar los filtros de país y ciudad.
            applyFilters({ countryId: undefined, cityId: undefined });
          }}
          // Esta línea sirve para asignar el manejador del evento «onClose».
          onClose={() => setCountryPickerVisible(false)}
        />

        {/* Esta línea sirve para abrir el elemento «ListPickerModal» con sus atributos en varias líneas. */}
        <ListPickerModal
          // Esta línea sirve para pasar la propiedad «visible» con el valor «cityPickerVisible}».
          visible={cityPickerVisible}
          // Esta línea sirve para definir el atributo «title» con el valor «Ciudad».
          title="Ciudad"
          // Esta línea sirve para pasar la propiedad «items» con el valor «visibleCities}».
          items={visibleCities}
          // Esta línea sirve para pasar la propiedad «getId» con el valor «(option) => option.id}».
          getId={(option) => option.id}
          // Esta línea sirve para pasar la propiedad «getLabel» con el valor «(option) => option.name}».
          getLabel={(option) => option.name}
          // Esta línea sirve para asignar el manejador del evento «onSelect».
          onSelect={(option) => {
            // Esta línea sirve para guardar en el estado con «setCity» el valor «option)…».
            setCity(option);
            // Esta línea sirve para guardar en el estado con «setCityPickerVisible» el valor «false)…».
            setCityPickerVisible(false);
            // Esta línea sirve para llamar a «applyFilters» con «{ cityId: option.id }».
            applyFilters({ cityId: option.id });
          }}
          // Esta línea sirve para asignar el manejador del evento «onSelectAll».
          onSelectAll={() => {
            // Esta línea sirve para guardar en el estado con «setCity» el valor «null)…».
            setCity(null);
            // Esta línea sirve para guardar en el estado con «setCityPickerVisible» el valor «false)…».
            setCityPickerVisible(false);
            // Esta línea sirve para llamar a «applyFilters» con «{ cityId: undefined }».
            applyFilters({ cityId: undefined });
          }}
          // Esta línea sirve para asignar el manejador del evento «onClose».
          onClose={() => setCityPickerVisible(false)}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
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
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «roleRow» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  // Esta línea sirve para definir el estilo «chip» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  chip: { borderWidth: 1, borderRadius: Spacing.two, paddingVertical: Spacing.one, paddingHorizontal: Spacing.two },
  // Esta línea sirve para definir el estilo «input» con «borderWidth: 1, borderRadius: Spacing.two, padding…».
  input: { borderWidth: 1, borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.two },
  // Esta línea sirve para definir el estilo «userCard» con «borderRadius: Spacing.three, padding: Spacing.thre…».
  userCard: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.one },
  // Esta línea sirve para definir el estilo «actionsRow» con «flexDirection: 'row', flexWrap: 'wrap', gap: Spaci…».
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginTop: Spacing.one },
  // Esta línea sirve para declarar la propiedad «warn» con el valor o tipo «{ color: '#FF4D5E' }».
  warn: { color: '#FF4D5E' },
});

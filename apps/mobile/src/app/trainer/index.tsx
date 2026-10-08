// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «FlatList, Pressable, StyleSheet» desde «react-native».
import { FlatList, Pressable, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «TrainerClient, TrainerClientStatus» desde «@sanken/core».
import type { TrainerClient, TrainerClientStatus } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTrainerClientsStore» desde «@/store/trainer-clients-store».
import { useTrainerClientsStore } from '@/store/trainer-clients-store';

// Esta línea sirve para declarar «STATUS_LABELS» con el valor «{».
const STATUS_LABELS: Record<TrainerClientStatus, string> = {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «'Pendiente'».
  pending: 'Pendiente',
  // Esta línea sirve para declarar la propiedad «active» con el valor o tipo «'Activo'».
  active: 'Activo',
  // Esta línea sirve para declarar la propiedad «paused» con el valor o tipo «'Pausado'».
  paused: 'Pausado',
  // Esta línea sirve para declarar la propiedad «ended» con el valor o tipo «'Finalizado'».
  ended: 'Finalizado',
};

// Esta línea sirve para declarar la función «ClientRow».
function ClientRow({ trainerClient }: { trainerClient: TrainerClient }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
    <Pressable onPress={() => router.push(`/trainer/clients/${trainerClient.id}`)}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView type="backgroundElement" style={styles.row}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={{ flex: 1 }}>
          {/* Esta línea sirve para mostrar el valor «trainerClient.client.name» dentro de «ThemedText». */}
          <ThemedText type="default">{trainerClient.client.name}</ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el valor «trainerClient.client.email». */}
            {trainerClient.client.email}
          </ThemedText>
        </ThemedView>
        {/* Esta línea sirve para mostrar el valor «STATUS_LABELS[trainerClient.status]» dentro de «ThemedText». */}
        <ThemedText type="smallBold">{STATUS_LABELS[trainerClient.status]}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

// Esta línea sirve para declarar la función «TrainerClientsScreen».
export default function TrainerClientsScreen() {
  // Esta línea sirve para obtener «clients, isLoading, error, isSubmitting, submitError, load, addClient» con el hook «useTrainerClientsStore».
  const { clients, isLoading, error, isSubmitting, submitError, load, addClient } = useTrainerClientsStore();
  // Esta línea sirve para crear el estado «emailInput» y su función «setEmailInput».
  const [emailInput, setEmailInput] = useState('');

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «load».
    load();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «load».
  }, [load]);

  // Esta línea sirve para extraer «andleAd» de «async () => {».
  const handleAdd = async () => {
    // Esta línea sirve para salir de la función si «!emailInput.trim()».
    if (!emailInput.trim()) return;
    // Esta línea sirve para esperar «addClient(emailInput.trim())» y guardar el resultado en «ok».
    const ok = await addClient(emailInput.trim());
    // Esta línea sirve para llamar a «setEmailInput» si «ok».
    if (ok) setEmailInput('');
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el elemento «FlatList» con sus atributos en varias líneas. */}
        <FlatList
          // Esta línea sirve para pasar la propiedad «style» con el valor «styles.list}».
          style={styles.list}
          // Esta línea sirve para pasar la propiedad «data» con el valor «clients}».
          data={clients}
          // Esta línea sirve para pasar la propiedad «keyExtractor» con el valor «(item) => String(item.id)}».
          keyExtractor={(item) => String(item.id)}
          // Esta línea sirve para pasar la propiedad «renderItem» con el valor «({ item }) => <ClientRow trainerClient={item}».
          renderItem={({ item }) => <ClientRow trainerClient={item} />}
          // Esta línea sirve para pasar la propiedad «contentContainerStyle» con el valor «[styles.content, { paddingBottom: BottomTabIn».
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
          // Esta línea sirve para pasar la propiedad «ListHeaderComponent» con el valor «».
          ListHeaderComponent={
            // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
            <>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="title" style={styles.pageTitle}>
                {/* Esta línea sirve para mostrar el texto «Mis clientes». */}
                Mis clientes
              </ThemedText>

              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView type="backgroundElement" style={styles.formCard}>
                {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
                <TextField
                  // Esta línea sirve para definir el atributo «label» con el valor «Correo del cliente».
                  label="Correo del cliente"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «emailInput}».
                  value={emailInput}
                  // Esta línea sirve para asignar el manejador del evento «onChangeText».
                  onChangeText={setEmailInput}
                  // Esta línea sirve para definir el atributo «autoCapitalize» con el valor «none».
                  autoCapitalize="none"
                  // Esta línea sirve para definir el atributo «keyboardType» con el valor «email-address».
                  keyboardType="email-address"
                  // Esta línea sirve para definir el atributo «placeholder» con el valor «cliente@correo.com».
                  placeholder="cliente@correo.com"
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
                <PrimaryButton label="Agregar" loading={isSubmitting} onPress={handleAdd} />
              </ThemedView>

              {/* Esta línea sirve para mostrar el bloque solo si «error». */}
              {error && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" style={styles.error}>
                  {/* Esta línea sirve para mostrar el valor «error». */}
                  {error}
                </ThemedText>
              )}
            </>
          }
          // Esta línea sirve para pasar la propiedad «ListEmptyComponent» con el valor «».
          ListEmptyComponent={
            // Esta línea sirve para revisar si ya terminó de cargar.
            !isLoading ? (
              // Esta línea sirve para abrir el componente «ThemedText».
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Todavía no tienes clientes vinculados.». */}
                Todavía no tienes clientes vinculados.
              </ThemedText>
            // Esta línea sirve para mostrar nada en caso contrario.
            ) : null
          }
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
  // Esta línea sirve para declarar la propiedad «list» con el valor o tipo «{ alignSelf: 'stretch' }».
  list: { alignSelf: 'stretch' },
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
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «pageTitle» con «fontSize: 24, lineHeight: 30, marginBottom: Spacin…».
  pageTitle: { fontSize: 24, lineHeight: 30, marginBottom: Spacing.two },
  // Esta línea sirve para declarar la propiedad «formCard» con el valor o tipo «{».
  formCard: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.three».
    marginBottom: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.two».
    marginBottom: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});

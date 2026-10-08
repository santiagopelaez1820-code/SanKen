// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «router, useLocalSearchParams» desde «expo-router».
import { router, useLocalSearchParams } from 'expo-router';
// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «TrainerClientStatus» desde «@sanken/core».
import type { TrainerClientStatus } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «BackButton» desde «@/components/ui/back-button».
import { BackButton } from '@/components/ui/back-button';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useChatStore» desde «@/store/chat-store».
import { useChatStore } from '@/store/chat-store';
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

// Esta línea sirve para declarar la función «TrainerClientDetailScreen».
export default function TrainerClientDetailScreen() {
  // Esta línea sirve para extraer «trainerClientId» de «useLocalSearchParams<{ trainerClientId: ».
  const { trainerClientId } = useLocalSearchParams<{ trainerClientId: string }>();
  // Esta línea sirve para extraer «» de «Number(trainerClientId)».
  const id = Number(trainerClientId);

  // Esta línea sirve para obtener el cliente, su rutina y las acciones del store.
  const { selectedClient, activeRoutine, isLoadingDetail, detailError, isSubmitting, loadDetail, updateStatus } =
    // Esta línea sirve para llamar a «useTrainerClientsStore».
    useTrainerClientsStore();
  // Esta línea sirve para obtener «openConversationForTrainerClient» con el hook «useChatStore».
  const openConversationForTrainerClient = useChatStore((s) => s.openConversationForTrainerClient);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadDetail» si «id».
    if (id) loadDetail(id);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «id, loadDetail».
  }, [id, loadDetail]);

  // Esta línea sirve para extraer «penCha» de «async () => {».
  const openChat = async () => {
    // Esta línea sirve para esperar «openConversationForTrainerClient(id)» y guardar el resultado en «conversationId».
    const conversationId = await openConversationForTrainerClient(id);
    // Esta línea sirve para llamar a «router.push» con «`/chat/${conversationId}`».
    router.push(`/chat/${conversationId}`);
  };

  // Esta línea sirve para revisar si «isLoadingDetail || !selectedClient».
  if (isLoadingDetail || !selectedClient) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «ThemedView».
      <ThemedView style={styles.root}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={styles.safeArea}>
          {/* Esta línea sirve para elegir entre dos bloques según «detailError». */}
          {detailError ? (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el valor «detailError». */}
              {detailError}
            </ThemedText>
          // Esta línea sirve para mostrar el bloque alternativo.
          ) : (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Esta línea sirve para extraer «wnsActiveRoutin» de «activeRoutine?.source === 'trainer'».
  const ownsActiveRoutine = activeRoutine?.source === 'trainer';

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «BackButton». */}
        <BackButton label="Mis clientes" fallbackHref="/trainer" />

        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="title" style={styles.pageTitle}>
          {/* Esta línea sirve para mostrar el valor «selectedClient.client.name». */}
          {selectedClient.client.name}
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" themeColor="textSecondary">
          {/* Esta línea sirve para mostrar el valor «selectedClient.client.email». */}
          {selectedClient.client.email}
        </ThemedText>

        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView type="backgroundElement" style={styles.card}>
          {/* Esta línea sirve para mostrar el texto «Relación» dentro de «ThemedText». */}
          <ThemedText type="smallBold">Relación</ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el contenido dinámico «Estado: {STATUS_LABELS[selectedClient.status]}». */}
            Estado: {STATUS_LABELS[selectedClient.status]}
          </ThemedText>

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.buttonRow}>
            {/* Esta línea sirve para mostrar el elemento solo si «selectedClient.status === 'active'». */}
            {selectedClient.status === 'active' && <PrimaryButton label="Chat" onPress={openChat} />}
            {/* Esta línea sirve para mostrar el bloque solo si «selectedClient.status === 'active'». */}
            {selectedClient.status === 'active' && (
              // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
              <PrimaryButton
                // Esta línea sirve para definir el atributo «label» con el valor «Pausar».
                label="Pausar"
                // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                variant="ghost"
                // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
                loading={isSubmitting}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => updateStatus(id, 'paused')}
              />
            )}
            {/* Esta línea sirve para mostrar el bloque solo si «selectedClient.status === 'paused'». */}
            {selectedClient.status === 'paused' && (
              // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
              <PrimaryButton
                // Esta línea sirve para definir el atributo «label» con el valor «Reactivar».
                label="Reactivar"
                // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                variant="ghost"
                // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
                loading={isSubmitting}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => updateStatus(id, 'active')}
              />
            )}
            {/* Esta línea sirve para mostrar el bloque solo si «selectedClient.status !== 'ended'». */}
            {selectedClient.status !== 'ended' && (
              // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
              <PrimaryButton
                // Esta línea sirve para definir el atributo «label» con el valor «Finalizar».
                label="Finalizar"
                // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                variant="ghost"
                // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
                loading={isSubmitting}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => updateStatus(id, 'ended')}
              />
            )}
          </ThemedView>
        </ThemedView>

        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView type="backgroundElement" style={styles.card}>
          {/* Esta línea sirve para mostrar el texto «Rutina activa» dentro de «ThemedText». */}
          <ThemedText type="smallBold">Rutina activa</ThemedText>

          {/* Esta línea sirve para mostrar el bloque solo si «!activeRoutine». */}
          {!activeRoutine && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Este cliente no tiene una rutina activa.». */}
              Este cliente no tiene una rutina activa.
            </ThemedText>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «activeRoutine». */}
          {activeRoutine && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el tipo de división y la frecuencia de la rutina. */}
              {activeRoutine.split_type} · {activeRoutine.frequency_days} días/semana ·{' '}
              {/* Esta línea sirve para mostrar el contenido dinámico «{activeRoutine.duration_weeks} semanas ·{' '}». */}
              {activeRoutine.duration_weeks} semanas ·{' '}
              {/* Esta línea sirve para mostrar el origen de la rutina. */}
              {activeRoutine.source === 'trainer' ? 'asignada manualmente' : 'motor automático'}
            </ThemedText>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «selectedClient.status === 'active'». */}
          {selectedClient.status === 'active' && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView style={styles.spacer}>
              {/* Esta línea sirve para elegir entre dos bloques según «ownsActiveRoutine». */}
              {ownsActiveRoutine ? (
                // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
                <PrimaryButton
                  // Esta línea sirve para definir el atributo «label» con el valor «Editar rutina».
                  label="Editar rutina"
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => router.push(`/trainer/routines/${activeRoutine!.id}/edit`)}
                />
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas.
                <PrimaryButton
                  // Esta línea sirve para definir el atributo «label» con el valor «Asignar rutina manual».
                  label="Asignar rutina manual"
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => router.push(`/trainer/clients/${id}/routine/new`)}
                />
              )}
            </ThemedView>
          )}
        </ThemedView>
      </SafeAreaView>
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
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.two».
    marginTop: Spacing.two,
  },
  // Mismo mecanismo que `spacer` más abajo: sin `backgroundColor`
  // `ThemedView` pinta `theme.background`, distinto al de la card
  // `backgroundElement` que lo contiene — dejaba un rectángulo claro
  // detrás de la fila de botones Chat/Pausar/Finalizar.
  // Esta línea sirve para declarar la propiedad «buttonRow» con el valor o tipo «{».
  buttonRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.one».
    marginTop: Spacing.one,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Este spacer envuelve el botón dentro de una card `backgroundElement` —
  // sin este override, `ThemedView` pinta `theme.background` (el fondo
  // general de la página, distinto al de la card) y deja un rectángulo del
  // color equivocado alrededor del botón. Mismo mecanismo que en
  // app/(app)/index.tsx.
  // Esta línea sirve para definir el estilo «spacer» con «marginTop: Spacing.two, backgroundColor: 'transpar…».
  spacer: { marginTop: Spacing.two, backgroundColor: 'transparent' },
});

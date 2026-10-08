// Esta línea sirve para importar «useEffect, useRef, useState» desde «react».
import { useEffect, useRef, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «ScrollView, StyleSheet, View» desde «react-native».
import { ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/tutorial-overlay».
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from '@/hooks/use-tutorial';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useChatStore» desde «@/store/chat-store».
import { useChatStore } from '@/store/chat-store';
// Esta línea sirve para importar «useMyTrainerStore» desde «@/store/my-trainer-store».
import { useMyTrainerStore } from '@/store/my-trainer-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar la función «MiEntrenadorScreen».
export default function MiEntrenadorScreen() {
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id);
  // Esta línea sirve para obtener «trainers, isLoading, error, load» con el hook «useMyTrainerStore».
  const { trainers, isLoading, error, load } = useMyTrainerStore();
  // Esta línea sirve para obtener «openConversationForTrainerClient» con el hook «useChatStore».
  const { openConversationForTrainerClient } = useChatStore();
  // Esta línea sirve para crear el estado «openingId» y su función «setOpeningId».
  const [openingId, setOpeningId] = useState<number | null>(null);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «load».
    load();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «load».
  }, [load]);

  // Esta línea sirve para crear la referencia «titleRef».
  const titleRef = useRef<View>(null);
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «mi-entrenador…».
    'mi-entrenador',
    [
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «titleRef».
        ref: titleRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Tu entrenador asignado'».
        title: 'Tu entrenador asignado',
        // Esta línea sirve para definir la propiedad «description» con «Acá ves quién es tu entrenador y podés e…».
        description: 'Acá ves quién es tu entrenador y podés escribirle directamente cuando quieras.',
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'¿Dudas sobre tu rutina o nutrición?'».
        title: '¿Dudas sobre tu rutina o nutrición?',
        // Esta línea sirve para definir la propiedad «description» con «Escribile por acá — te va a responder di…».
        description: 'Escribile por acá — te va a responder directo en el chat.',
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoading,
    // Esta línea sirve para incluir el valor «userId» en la lista.
    userId,
  );

  // Esta línea sirve para extraer «penCha» de «async (trainerClientId: number) => {».
  const openChat = async (trainerClientId: number) => {
    // Esta línea sirve para guardar en el estado con «setOpeningId» el valor «trainerClientId)…».
    setOpeningId(trainerClientId);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «openConversationForTrainerClient(trainerClientId)» y guardar el resultado en «conversationId».
      const conversationId = await openConversationForTrainerClient(trainerClientId);
      // Esta línea sirve para llamar a «router.push» con «`/chat/${conversationId}`».
      router.push(`/chat/${conversationId}`);
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setOpeningId» el valor «null)…».
      setOpeningId(null);
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
          {/* Esta línea sirve para abrir el componente «View». */}
          <View ref={titleRef}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" style={styles.pageTitle}>
              {/* Esta línea sirve para mostrar el texto «Mi entrenador». */}
              Mi entrenador
            </ThemedText>
          </View>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoading». */}
          {isLoading && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={56} borderRadius={Spacing.three} />
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «error». */}
          {error && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={styles.error}>
              {/* Esta línea sirve para mostrar el valor «error». */}
              {error}
            </ThemedText>
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && trainers.length === 0». */}
          {!isLoading && trainers.length === 0 && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Todavía no tenés un entrenador asignado.». */}
              Todavía no tenés un entrenador asignado.
            </ThemedText>
          )}

          {/* Esta línea sirve para recorrer «trainers» y mostrar un bloque por elemento. */}
          {trainers.map((relationship) => (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView key={relationship.trainer_client_id} type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.cardInfo}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="smallBold">
                  {/* Esta línea sirve para mostrar el valor «relationship.trainer.name». */}
                  {relationship.trainer.name}
                  {/* Esta línea sirve para mostrar el bloque solo si «relationship.trainer.trainer_verified_at». */}
                  {relationship.trainer.trainer_verified_at && (
                    // Esta línea sirve para abrir el componente «ThemedText».
                    <ThemedText type="small" themeColor="accent">
                      {/* Esta línea sirve para mostrar el contenido dinámico «{' '}». */}
                      {' '}
                      {/* Esta línea sirve para mostrar el contenido dinámico «✓». */}
                      ✓
                    </ThemedText>
                  )}
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el valor «relationship.trainer.email». */}
                  {relationship.trainer.email}
                </ThemedText>
              </ThemedView>
              {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
              <PrimaryButton
                // Esta línea sirve para definir el atributo «label» con el valor «Chatear».
                label="Chatear"
                // Esta línea sirve para pasar la propiedad «loading» con el valor «openingId === relationship.trainer_client_id}».
                loading={openingId === relationship.trainer_client_id}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={() => openChat(relationship.trainer_client_id)}
              />
            </ThemedView>
          ))}

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
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
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.four».
    borderRadius: Spacing.four,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «cardInfo» con «flex: 1, gap: 2, backgroundColor: 'transparent' },…».
  cardInfo: { flex: 1, gap: 2, backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});

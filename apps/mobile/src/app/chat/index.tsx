// Esta línea sirve para importar «useEffect, useRef» desde «react».
import { useEffect, useRef } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet, View» desde «react-native».
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from '@/hooks/use-tutorial';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useChatStore» desde «@/store/chat-store».
import { useChatStore } from '@/store/chat-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar la función «ChatInboxScreen».
export default function ChatInboxScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id);
  // Esta línea sirve para obtener «conversations, isLoadingInbox, inboxError, loadInbox» con el hook «useChatStore».
  const { conversations, isLoadingInbox, inboxError, loadInbox } = useChatStore();

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadInbox».
    loadInbox();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «loadInbox».
  }, [loadInbox]);

  // Esta línea sirve para crear la referencia «titleRef».
  const titleRef = useRef<View>(null);
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «chat…».
    'chat',
    [
      {
        // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «titleRef».
        ref: titleRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Chat con tu entrenador'».
        title: 'Chat con tu entrenador',
        // Esta línea sirve para definir la propiedad «description» con «Acá hablás directo con tu entrenador asi…».
        description: 'Acá hablás directo con tu entrenador asignado, en tiempo real.',
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Tus conversaciones'».
        title: 'Tus conversaciones',
        // Esta línea sirve para definir la propiedad «description» con «Cuando tengas conversaciones activas, la…».
        description: 'Cuando tengas conversaciones activas, las vas a ver listadas acá con los mensajes sin leer marcados.',
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'¿Todavía no escribiste a nadie?'».
        title: '¿Todavía no escribiste a nadie?',
        // Esta línea sirve para definir la propiedad «description» con «Andá a "Mi entrenador" y tocá "Chatear" …».
        description: 'Andá a "Mi entrenador" y tocá "Chatear" para empezar una conversación.',
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoadingInbox,
    // Esta línea sirve para incluir el valor «userId» en la lista.
    userId,
  );

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
              {/* Esta línea sirve para mostrar el texto «Chat». */}
              Chat
            </ThemedText>
          </View>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadingInbox». */}
          {isLoadingInbox && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={72} borderRadius={Spacing.three} />
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «inboxError». */}
          {inboxError && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={styles.error}>
              {/* Esta línea sirve para mostrar el valor «inboxError». */}
              {inboxError}
            </ThemedText>
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoadingInbox && conversations.length === 0». */}
          {!isLoadingInbox && conversations.length === 0 && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Todavía no tenés conversaciones.». */}
              Todavía no tenés conversaciones.
            </ThemedText>
          )}

          {/* Esta línea sirve para recorrer «conversations» y mostrar un bloque por elemento. */}
          {conversations.map((conversation) => (
            // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
            <Pressable
              // Esta línea sirve para identificar el elemento de la lista con «conversation.id}».
              key={conversation.id}
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => router.push(`/chat/${conversation.id}`)}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.row, { borderColor: theme.backgroundS».
              style={[styles.row, { borderColor: theme.backgroundSelected }]}
            >
              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.rowInfo}>
                {/* Esta línea sirve para mostrar el valor «conversation.other_party.name» dentro de «ThemedText». */}
                <ThemedText type="smallBold">{conversation.other_party.name}</ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{conversation.last_message?.body ?? 'Sin mensajes todavía'}». */}
                  {conversation.last_message?.body ?? 'Sin mensajes todavía'}
                </ThemedText>
              </ThemedView>
              {/* Esta línea sirve para mostrar el bloque solo si «conversation.unread_count > 0». */}
              {conversation.unread_count > 0 && (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView style={[styles.badge, { backgroundColor: theme.accent }]}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" style={styles.badgeLabel}>
                    {/* Esta línea sirve para mostrar el valor «conversation.unread_count». */}
                    {conversation.unread_count}
                  </ThemedText>
                </ThemedView>
              )}
            </Pressable>
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
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «pageTitle» con «fontSize: 24, lineHeight: 30, marginBottom: Spacin…».
  pageTitle: { fontSize: 24, lineHeight: 30, marginBottom: Spacing.one },
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.three».
    padding: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «rowInfo» con el valor o tipo «{ flex: 1, gap: 2, marginRight: Spacing.two }».
  rowInfo: { flex: 1, gap: 2, marginRight: Spacing.two },
  // Esta línea sirve para definir el estilo «badge» con «minWidth: 20, height: 20, borderRadius: 10, alignI…».
  badge: { minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  // Esta línea sirve para declarar la propiedad «badgeLabel» con el valor o tipo «{ color: '#050505' }».
  badgeLabel: { color: '#050505' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});

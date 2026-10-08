// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «router, type Href» desde «expo-router».
import { router, type Href } from 'expo-router';
// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet» desde «react-native».
import { Pressable, ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «isLinkedNotificationData, type FeedItem, type NewChatMessageNotificationData» desde «@sanken/core».
import { isLinkedNotificationData, type FeedItem, type NewChatMessageNotificationData } from '@sanken/core';

// Esta línea sirve para importar «linkFromNotificationData» desde «@/components/notification-link-handler».
import { linkFromNotificationData } from '@/components/notification-link-handler';
// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useFeedStore» desde «@/store/feed-store».
import { useFeedStore } from '@/store/feed-store';
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from '@/components/ui/skeleton';

// Esta línea sirve para declarar la función «FeedRow».
function FeedRow({ item, onPress }: { item: FeedItem; onPress: (item: FeedItem) => void }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «nreadStyl» de «!item.read_at ? { backgroundColor: theme».
  const unreadStyle = !item.read_at ? { backgroundColor: theme.backgroundSelected } : undefined;

  // Esta línea sirve para revisar si «item.feed_type === 'news'».
  if (item.feed_type === 'news') {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
      <Pressable onPress={() => onPress(item)} style={styles.pressableCard}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView type="backgroundElement" style={[styles.card, unreadStyle]}>
          {/* Esta línea sirve para mostrar el valor «item.title» dentro de «ThemedText». */}
          <ThemedText type="smallBold">{item.title}</ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el contenido dinámico «{new Date(item.created_at).toLocaleDateString('es-AR')}». */}
            {new Date(item.created_at).toLocaleDateString('es-AR')}
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el valor «item.body». */}
            {item.body}
          </ThemedText>
        </ThemedView>
      </Pressable>
    );
  }

  // Notificaciones con título/cuerpo/link propios (soporte, check-in semanal).
  // Esta línea sirve para revisar si «isLinkedNotificationData(item.data)».
  if (isLinkedNotificationData(item.data)) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
      <Pressable onPress={() => onPress(item)} style={styles.pressableCard}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView type="backgroundElement" style={[styles.card, unreadStyle]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el contenido dinámico «{new Date(item.created_at).toLocaleDateString('es-AR')}». */}
            {new Date(item.created_at).toLocaleDateString('es-AR')}
          </ThemedText>
          {/* Esta línea sirve para mostrar el valor «item.data.title» dentro de «ThemedText». */}
          <ThemedText type="smallBold">{item.data.title}</ThemedText>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {/* Esta línea sirve para mostrar el valor «item.data.body». */}
            {item.data.body}
          </ThemedText>
        </ThemedView>
      </Pressable>
    );
  }

  // Esta línea sirve para extraer «at» de «item.data as unknown as NewChatMessageNo».
  const data = item.data as unknown as NewChatMessageNotificationData;
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Pressable» con sus propiedades.
    <Pressable onPress={() => onPress(item)} style={styles.pressableCard}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView type="backgroundElement" style={[styles.card, unreadStyle]}>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" themeColor="textSecondary">
          {/* Esta línea sirve para mostrar el contenido dinámico «{new Date(item.created_at).toLocaleDateString('es-AR')}». */}
          {new Date(item.created_at).toLocaleDateString('es-AR')}
        </ThemedText>
        {/* Esta línea sirve para mostrar el valor «data.sender_name» dentro de «ThemedText». */}
        <ThemedText type="smallBold">{data.sender_name}</ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
          {/* Esta línea sirve para mostrar el valor «data.body». */}
          {data.body}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

// Esta línea sirve para declarar la función «NovedadesScreen».
export default function NovedadesScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «items, unreadCount, isLoading, error, load, markRead, markAllRead» con el hook «useFeedStore».
  const { items, unreadCount, isLoading, error, load, markRead, markAllRead } = useFeedStore();

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «load».
    load();
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «load».
  }, [load]);

  // Esta línea sirve para extraer «andlePres» de «(item: FeedItem) => {».
  const handlePress = (item: FeedItem) => {
    // Esta línea sirve para llamar a «markRead» con «item».
    markRead(item);
    // Esta línea sirve para revisar si «item.feed_type === 'notification'».
    if (item.feed_type === 'notification') {
      // Esta línea sirve para extraer «in» de «linkFromNotificationData(item.data)».
      const link = linkFromNotificationData(item.data);
      // Esta línea sirve para llamar a «router.push» si «link».
      if (link) router.push(link as Href);
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
          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView style={styles.header}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" style={styles.pageTitle}>
              {/* Esta línea sirve para mostrar el texto «Novedades». */}
              Novedades
            </ThemedText>
            {/* Esta línea sirve para mostrar el bloque solo si «unreadCount > 0». */}
            {unreadCount > 0 && (
              // Esta línea sirve para abrir el componente «ThemedText» con sus propiedades.
              <ThemedText type="small" style={{ color: theme.accent }} onPress={() => markAllRead()}>
                {/* Esta línea sirve para mostrar el texto «Marcar todo leído». */}
                Marcar todo leído
              </ThemedText>
            )}
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «isLoading». */}
          {isLoading && (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton height={72} borderRadius={Spacing.three} />
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && error». */}
          {!isLoading && error && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView style={styles.errorBlock}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" style={styles.error}>
                {/* Esta línea sirve para mostrar el valor «error». */}
                {error}
              </ThemedText>
              {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
              <PrimaryButton label="Reintentar" variant="ghost" onPress={() => load()} />
            </ThemedView>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && !error && items.length === 0». */}
          {!isLoading && !error && items.length === 0 && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «No hay novedades ni notificaciones por ahora.». */}
              No hay novedades ni notificaciones por ahora.
            </ThemedText>
          )}

          {/* Esta línea sirve para recorrer «items» y mostrar un bloque por elemento. */}
          {items.map((item) => (
            // Esta línea sirve para abrir el componente «FeedRow».
            <FeedRow key={`${item.feed_type}-${item.id}`} item={item} onPress={handlePress} />
          ))}

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
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
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para definir el estilo «header» con «flexDirection: 'row', alignItems: 'center', justif…».
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.three, padding: Spacing.thre…».
  card: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.one },
  // Mismo radio que `card` en el Pressable que lo envuelve — sin esto, el
  // anillo de foco de teclado en web se dibuja como un rectángulo recto
  // que no sigue las esquinas redondeadas de la tarjeta (mismo bug que en
  // primary-button.tsx).
  // Esta línea sirve para declarar la propiedad «pressableCard» con el valor o tipo «{ borderRadius: Spacing.three }».
  pressableCard: { borderRadius: Spacing.three },
  // Esta línea sirve para definir el estilo «errorBlock» con «gap: Spacing.two, alignItems: 'flex-start', backgr…».
  errorBlock: { gap: Spacing.two, alignItems: 'flex-start', backgroundColor: 'transparent' },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
});

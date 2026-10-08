// Esta línea sirve para importar «StyleSheet, View» desde «react-native».
import { StyleSheet, View } from 'react-native';
// Esta línea sirve para importar los tipos «SupportTicketMessage» desde «@sanken/core».
import type { SupportTicketMessage } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «formatSupportDate, supportStrings as t» desde «@/components/support/support-ui».
import { formatSupportDate, supportStrings as t } from '@/components/support/support-ui';

/** Historial de la conversación (espejo de TicketConversation de la web). */
// Esta línea sirve para declarar la función «TicketConversation».
export function TicketConversation({ messages, viewer }: { messages: SupportTicketMessage[]; viewer: 'user' | 'staff' }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={styles.list} accessibilityLabel={t.conversation}>
      {/* Esta línea sirve para recorrer «messages» y calcular qué mostrar por elemento. */}
      {messages.map((message) => {
        // Esta línea sirve para extraer «in» de «viewer === 'staff' ? message.is_staff : ».
        const mine = viewer === 'staff' ? message.is_staff : !message.is_staff;
        // Esta línea sirve para extraer «utho» de «message.is_staff».
        const author = message.is_staff
          // Esta línea sirve para revisar si el mensaje tiene nombre de autor.
          ? message.author_name
            // Esta línea sirve para mostrar el nombre con la etiqueta del equipo.
            ? `${message.author_name} · ${t.staffName}`
            // Esta línea sirve para mostrar solo la etiqueta del equipo.
            : t.staffName
          // Esta línea sirve para revisar si el espectador es el usuario.
          : viewer === 'user'
            // Esta línea sirve para mostrar «Tú» para sus propios mensajes.
            ? t.youName
            // Esta línea sirve para mostrar el nombre del usuario en la vista del administrador.
            : (message.author_name ?? t.admin.user);

        // Esta línea sirve para devolver la interfaz del componente.
        return (
          // Esta línea sirve para abrir el componente «View».
          <View key={message.id} style={[styles.item, mine ? styles.mine : styles.theirs]}>
            {/* Esta línea sirve para abrir el elemento «ThemedView» con sus atributos en varias líneas. */}
            <ThemedView
              // Esta línea sirve para pasar la propiedad «type» con el valor «message.is_staff ? undefined : 'backgroundEle».
              type={message.is_staff ? undefined : 'backgroundElement'}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[».
              style={[
                // Esta línea sirve para agregar el estilo «styles.bubble».
                styles.bubble,
                // Esta línea sirve para aplicar el estilo «borderColor: theme.accent, borderWidth: …» solo si «message.is_staff».
                message.is_staff && { borderColor: theme.accent, borderWidth: 1, backgroundColor: `${theme.accent}1A` },
              ]}
            >
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" selectable>
                {/* Esta línea sirve para mostrar el valor «message.body». */}
                {message.body}
              </ThemedText>
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary" style={styles.meta}>
              {/* Esta línea sirve para mostrar el contenido dinámico «{author} · {formatSupportDate(message.created_at, true)}». */}
              {author} · {formatSupportDate(message.created_at, true)}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «list» con el valor o tipo «{ gap: Spacing.three }».
  list: { gap: Spacing.three },
  // Esta línea sirve para declarar la propiedad «item» con el valor o tipo «{ gap: Spacing.half, maxWidth: '88%' }».
  item: { gap: Spacing.half, maxWidth: '88%' },
  // Esta línea sirve para definir el estilo «mine» con «alignSelf: 'flex-end', alignItems: 'flex-end' },…».
  mine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  // Esta línea sirve para definir el estilo «theirs» con «alignSelf: 'flex-start', alignItems: 'flex-start' …».
  theirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  // Esta línea sirve para definir el estilo «bubble» con «borderRadius: 16, paddingHorizontal: Spacing.three…».
  bubble: { borderRadius: 16, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  // Esta línea sirve para declarar la propiedad «meta» con el valor o tipo «{ fontSize: 12 }».
  meta: { fontSize: 12 },
});

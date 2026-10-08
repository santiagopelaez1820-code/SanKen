// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «StyleSheet, View» desde «react-native».
import { StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «Trash2» desde «lucide-react-native».
import { Trash2 } from 'lucide-react-native';
// Esta línea sirve para importar «DELETE_ACCOUNT_CONFIRMATION, LEGAL_STRINGS» desde «@sanken/core».
import { DELETE_ACCOUNT_CONFIRMATION, LEGAL_STRINGS } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

/**
 * Eliminación de la propia cuenta (DELETE /auth/me), espejo de
 * DeleteAccountDialog en la web. Se usa en Configuración y en la pantalla de
 * re-aceptación (quien no acepta una versión nueva debe poder irse).
 * Doble confirmación: escribir ELIMINAR y, en cuentas de correo, la
 * contraseña.
 */
// Esta línea sirve para declarar la función «DeleteAccountSection».
export function DeleteAccountSection({ compact = false }: { compact?: boolean }) {
  // Esta línea sirve para declarar «t» con el valor «LEGAL_STRINGS.es».
  const t = LEGAL_STRINGS.es;
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «isDeleting» con el hook «useAuthStore».
  const isDeleting = useAuthStore((s) => s.isDeletingAccount);
  // Esta línea sirve para obtener «deleteAccount» con el hook «useAuthStore».
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  // Esta línea sirve para crear el estado «open» y su función «setOpen».
  const [open, setOpen] = useState(false);
  // Esta línea sirve para crear el estado «confirmation» y su función «setConfirmation».
  const [confirmation, setConfirmation] = useState('');
  // Esta línea sirve para crear el estado «password» y su función «setPassword».
  const [password, setPassword] = useState('');
  // Esta línea sirve para crear el estado «error» y su función «setError».
  const [error, setError] = useState<string | null>(null);
  // Sin `auth_provider` = cuenta de correo (o un `user` sin ese campo): se
  // pide la contraseña; el backend decide si es obligatoria.
  // Esta línea sirve para extraer «eedsPasswor» de «!user?.auth_provider».
  const needsPassword = !user?.auth_provider;
  // Esta línea sirve para extraer «sSuperAdmi» de «user?.role === 'super_admin'».
  const isSuperAdmin = user?.role === 'super_admin';
  // Esta línea sirve para extraer «anSubmi» de «confirmation.trim() === DELETE_ACCOUNT_C».
  const canSubmit = confirmation.trim() === DELETE_ACCOUNT_CONFIRMATION && (!needsPassword || password.length > 0);

  // Esta línea sirve para extraer «andleDelet» de «() => {».
  const handleDelete = () => {
    // Esta línea sirve para guardar en el estado con «setError» el valor «null)…».
    setError(null);
    // Esta línea sirve para enviar la confirmación y la contraseña si hace falta.
    deleteAccount({ confirmation: confirmation.trim(), ...(needsPassword ? { password } : {}) })
      // Esta línea sirve para encadenar la operación «then».
      .then(() => router.replace('/login'))
      // Esta línea sirve para encadenar la operación «catch».
      .catch(() => setError(useAuthStore.getState().error ?? t.deleteAccountError));
  };

  // Esta línea sirve para revisar si «!open».
  if (!open) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «View».
      <View style={styles.container}>
        {/* Esta línea sirve para mostrar el bloque solo si «!compact». */}
        {!compact && (
          // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
          <>
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.heading}>
              {/* Esta línea sirve para abrir el componente «Icon». */}
              <Icon icon={Trash2} size={16} color="#FF4D5E" />
              {/* Esta línea sirve para mostrar el valor «t.deleteAccountTitle» dentro de «ThemedText». */}
              <ThemedText type="default">{t.deleteAccountTitle}</ThemedText>
            </View>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el valor «t.deleteAccountDescription». */}
              {t.deleteAccountDescription}
            </ThemedText>
          </>
        )}
        {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
        <PrimaryButton
          // Esta línea sirve para pasar la propiedad «label» con el valor «compact ? t.deleteAccountFromReaccept : t.del».
          label={compact ? t.deleteAccountFromReaccept : t.deleteAccountOpen}
          // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
          variant="ghost"
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={() => setOpen(true)}
        />
      </View>
    );
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={styles.container}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="default" accessibilityRole="header">
        {/* Esta línea sirve para mostrar el valor «t.deleteAccountTitle». */}
        {t.deleteAccountTitle}
      </ThemedText>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary">
        {/* Esta línea sirve para mostrar el valor «t.deleteAccountDescription». */}
        {t.deleteAccountDescription}
      </ThemedText>

      {/* Esta línea sirve para elegir entre dos bloques según «isSuperAdmin». */}
      {isSuperAdmin ? (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" style={styles.error}>
          {/* Esta línea sirve para mostrar el valor «t.deleteAccountAdminNote». */}
          {t.deleteAccountAdminNote}
        </ThemedText>
      // Esta línea sirve para mostrar el bloque alternativo.
      ) : (
        // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
        <>
          {/* Esta línea sirve para mostrar el bloque solo si «needsPassword». */}
          {needsPassword && (
            // Esta línea sirve para abrir el componente «TextField».
            <TextField label={t.deleteAccountPasswordLabel} value={password} onChangeText={setPassword} secureTextEntry />
          )}
          {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
          <TextField
            // Esta línea sirve para pasar la propiedad «label» con el valor «t.deleteAccountConfirmLabel}».
            label={t.deleteAccountConfirmLabel}
            // Esta línea sirve para pasar la propiedad «value» con el valor «confirmation}».
            value={confirmation}
            // Esta línea sirve para asignar el manejador del evento «onChangeText».
            onChangeText={setConfirmation}
            // Esta línea sirve para definir el atributo «autoCapitalize» con el valor «characters».
            autoCapitalize="characters"
            // Esta línea sirve para pasar la propiedad «autoCorrect» con el valor «false}».
            autoCorrect={false}
          />
          {/* Esta línea sirve para mostrar el bloque solo si «error». */}
          {error && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" style={styles.error} accessibilityRole="alert">
              {/* Esta línea sirve para mostrar el valor «error». */}
              {error}
            </ThemedText>
          )}
          {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
          <PrimaryButton
            // Esta línea sirve para pasar la propiedad «label» con el valor «t.deleteAccountSubmit}».
            label={t.deleteAccountSubmit}
            // Esta línea sirve para pasar la propiedad «loading» con el valor «isDeleting}».
            loading={isDeleting}
            // Esta línea sirve para pasar la propiedad «disabled» con el valor «!canSubmit || isDeleting}».
            disabled={!canSubmit || isDeleting}
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={handleDelete}
            // Esta línea sirve para pasar la propiedad «style» con el valor «styles.danger}».
            style={styles.danger}
          />
        </>
      )}
      {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
      <PrimaryButton label={t.cancel} variant="ghost" disabled={isDeleting} onPress={() => setOpen(false)} />
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{ gap: Spacing.two }».
  container: { gap: Spacing.two },
  // Esta línea sirve para definir el estilo «heading» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  heading: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
  // Esta línea sirve para declarar la propiedad «danger» con el valor o tipo «{ backgroundColor: '#D92D3F' }».
  danger: { backgroundColor: '#D92D3F' },
});

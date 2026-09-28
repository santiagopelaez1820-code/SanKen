import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { DELETE_ACCOUNT_CONFIRMATION, LEGAL_STRINGS } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';

/**
 * Eliminación de la propia cuenta (DELETE /auth/me), espejo de
 * DeleteAccountDialog en la web. Se usa en Configuración y en la pantalla de
 * re-aceptación (quien no acepta una versión nueva debe poder irse).
 * Doble confirmación: escribir ELIMINAR y, en cuentas de correo, la
 * contraseña.
 */
export function DeleteAccountSection({ compact = false }: { compact?: boolean }) {
  const t = LEGAL_STRINGS.es;
  const user = useAuthStore((s) => s.user);
  const isDeleting = useAuthStore((s) => s.isDeletingAccount);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  // Sin `auth_provider` = cuenta de correo (o un `user` sin ese campo): se
  // pide la contraseña; el backend decide si es obligatoria.
  const needsPassword = !user?.auth_provider;
  const isSuperAdmin = user?.role === 'super_admin';
  const canSubmit = confirmation.trim() === DELETE_ACCOUNT_CONFIRMATION && (!needsPassword || password.length > 0);

  const handleDelete = () => {
    setError(null);
    deleteAccount({ confirmation: confirmation.trim(), ...(needsPassword ? { password } : {}) })
      .then(() => router.replace('/login'))
      .catch(() => setError(useAuthStore.getState().error ?? t.deleteAccountError));
  };

  if (!open) {
    return (
      <View style={styles.container}>
        {!compact && (
          <>
            <View style={styles.heading}>
              <Icon icon={Trash2} size={16} color="#FF4D5E" />
              <ThemedText type="default">{t.deleteAccountTitle}</ThemedText>
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              {t.deleteAccountDescription}
            </ThemedText>
          </>
        )}
        <PrimaryButton
          label={compact ? t.deleteAccountFromReaccept : t.deleteAccountOpen}
          variant="ghost"
          onPress={() => setOpen(true)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText type="default" accessibilityRole="header">
        {t.deleteAccountTitle}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {t.deleteAccountDescription}
      </ThemedText>

      {isSuperAdmin ? (
        <ThemedText type="small" style={styles.error}>
          {t.deleteAccountAdminNote}
        </ThemedText>
      ) : (
        <>
          {needsPassword && (
            <TextField label={t.deleteAccountPasswordLabel} value={password} onChangeText={setPassword} secureTextEntry />
          )}
          <TextField
            label={t.deleteAccountConfirmLabel}
            value={confirmation}
            onChangeText={setConfirmation}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          {error && (
            <ThemedText type="small" style={styles.error} accessibilityRole="alert">
              {error}
            </ThemedText>
          )}
          <PrimaryButton
            label={t.deleteAccountSubmit}
            loading={isDeleting}
            disabled={!canSubmit || isDeleting}
            onPress={handleDelete}
            style={styles.danger}
          />
        </>
      )}
      <PrimaryButton label={t.cancel} variant="ghost" disabled={isDeleting} onPress={() => setOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two },
  heading: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  error: { color: '#FF4D5E' },
  danger: { backgroundColor: '#D92D3F' },
});

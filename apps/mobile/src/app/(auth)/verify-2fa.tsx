import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';

export default function Verify2faScreen() {
  const [code, setCode] = useState('');
  const { pendingChallenge, challenge2fa, isSubmitting, error, clearError } = useAuthStore();

  // Solo se verifica al montar: si el usuario llega a esta pantalla sin un
  // challenge pendiente (navegación directa), lo mandamos de vuelta. No debe
  // re-evaluarse reactivamente — un envío exitoso también limpia
  // `pendingChallenge`, y eso competiría con el guard de (auth)/_layout que
  // redirige una vez que `token`/`user` quedan seteados.
  useEffect(() => {
    if (!useAuthStore.getState().pendingChallenge) {
      router.replace('/login');
    }
  }, []);

  if (!pendingChallenge) return null;

  const handleSubmit = () => {
    clearError();
    challenge2fa(code).catch(() => {});
  };

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <ThemedText type="title" style={styles.title}>
              Verificación en dos pasos
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              Ingresa el código de tu app autenticadora, o un código de recuperación.
            </ThemedText>

            <ThemedView style={styles.form}>
              <TextField
                label="Código"
                value={code}
                onChangeText={setCode}
                autoCapitalize="characters"
                autoFocus
              />

              {error && (
                <ThemedText type="small" style={styles.error}>
                  {error}
                </ThemedText>
              )}

              <PrimaryButton label="Verificar" loading={isSubmitting} onPress={handleSubmit} />
            </ThemedView>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.four,
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: Spacing.two },
  form: {
    alignSelf: 'stretch',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  error: { color: '#C9564A' },
});

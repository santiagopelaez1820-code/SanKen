import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isSubmitting, error, clearError } = useAuthStore();

  const handleSubmit = () => {
    clearError();
    login({ email: email.trim().toLowerCase(), password })
      .then(() => {
        if (useAuthStore.getState().pendingChallenge) {
          router.push('/verify-2fa');
        }
      })
      .catch(() => {});
  };

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
            <ThemedText type="title" style={styles.title}>
              San<ThemedText type="title" style={styles.accent}>Ken</ThemedText>
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              Inicia sesión para continuar tu entrenamiento.
            </ThemedText>

            <ThemedView style={styles.form}>
              <TextField
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <TextField
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />

              {error && (
                <ThemedText type="small" style={styles.error}>
                  {error}
                </ThemedText>
              )}

              <PrimaryButton label="Entrar" loading={isSubmitting} onPress={handleSubmit} />
            </ThemedView>

            <Link href="/register" style={styles.footerLink}>
              <ThemedText type="small" themeColor="textSecondary">
                ¿No tienes cuenta? <ThemedText type="linkPrimary">Regístrate</ThemedText>
              </ThemedText>
            </Link>
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
  logo: { width: 72, height: 72, marginBottom: -Spacing.two },
  title: { textAlign: 'center' },
  accent: { color: '#FF7A3D' },
  subtitle: { textAlign: 'center', marginBottom: Spacing.two },
  form: {
    alignSelf: 'stretch',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  error: { color: '#C9564A' },
  footerLink: { marginTop: Spacing.two },
});

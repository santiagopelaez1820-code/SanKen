import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GoogleSignInButton } from '@/components/ui/google-sign-in-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterScreen() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { register, loginWithGoogle, isSubmitting, isSubmittingGoogle, error, clearError } = useAuthStore();
  const anySubmitting = isSubmitting || isSubmittingGoogle;

  const handleSubmit = () => {
    clearError();
    register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      password_confirmation: passwordConfirmation,
    }).catch(() => {});
  };

  // Mismo endpoint /auth/social que usa el login: el backend resuelve solo
  // si la cuenta de Google ya existe o hay que crearla — no hace falta un
  // flujo de "registro con Google" separado ni un formulario adicional.
  const handleGoogleSubmit = () => {
    clearError();
    loginWithGoogle()
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
            <Image source={require('@/assets/images/logo-full.png')} style={styles.logo} resizeMode="contain" />
            <ThemedText type="title" style={styles.title}>
              Crea tu cuenta
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              Empecemos por lo básico. Luego personalizamos tu plan.
            </ThemedText>

            <ThemedView style={styles.form}>
              <TextField label="Nombre" value={name} onChangeText={setName} autoComplete="name" />
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
                autoComplete="new-password"
              />
              <TextField
                label="Confirmar contraseña"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry
                autoComplete="new-password"
              />

              {error && (
                <ThemedText type="small" style={styles.error}>
                  {error}
                </ThemedText>
              )}

              <PrimaryButton label="Continuar" loading={isSubmitting} disabled={anySubmitting} onPress={handleSubmit} />
            </ThemedView>

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <ThemedText type="small" themeColor="textSecondary">
                O
              </ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <ThemedView style={styles.form}>
              <GoogleSignInButton
                label={isSubmittingGoogle ? 'Continuando con Google…' : 'Continuar con Google'}
                loading={isSubmittingGoogle}
                disabled={anySubmitting}
                onPress={handleGoogleSubmit}
              />
            </ThemedView>

            <Link href="/login" style={styles.footerLink}>
              <ThemedText type="small" themeColor="textSecondary">
                ¿Ya tienes cuenta? <ThemedText type="linkPrimary">Inicia sesión</ThemedText>
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
  logo: { width: 200, height: 135 },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: Spacing.two },
  form: {
    alignSelf: 'stretch',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  error: { color: '#FF4D5E' },
  footerLink: { marginTop: Spacing.two },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    alignSelf: 'stretch',
    maxWidth: MaxContentWidth,
  },
  dividerLine: { flex: 1, height: 1 },
});

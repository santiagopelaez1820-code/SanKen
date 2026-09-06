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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { forgotPassword, isSubmittingForgotPassword } = useAuthStore();

  const handleSubmit = () => {
    setError(null);
    forgotPassword(email.trim().toLowerCase())
      .then(() => setSent(true))
      .catch(() => setError('No se pudo enviar el correo. Intenta de nuevo.'));
  };

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Image source={require('@/assets/images/logo-full.png')} style={styles.logo} resizeMode="contain" />

            {sent ? (
              <ThemedView style={styles.form}>
                <ThemedText type="title" style={styles.title}>
                  Revisa tu correo
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                  Si ese correo tiene una cuenta en SanKen, te acabamos de enviar un enlace para elegir una
                  contraseña nueva. Ábrelo desde el correo de tu teléfono — el enlace vence en 60 minutos.
                </ThemedText>
                <PrimaryButton label="Volver a iniciar sesión" onPress={() => router.replace('/login')} />
              </ThemedView>
            ) : (
              <ThemedView style={styles.form}>
                <ThemedText type="title" style={styles.title}>
                  ¿Olvidaste tu contraseña?
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                  Ingresa el correo con el que te registraste y te enviamos un enlace para elegir una contraseña
                  nueva.
                </ThemedText>

                <TextField
                  label="Correo electrónico"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />

                {error && (
                  <ThemedText type="small" style={styles.error}>
                    {error}
                  </ThemedText>
                )}

                <PrimaryButton
                  label="Enviar enlace de recuperación"
                  loading={isSubmittingForgotPassword}
                  disabled={isSubmittingForgotPassword || !email.trim()}
                  onPress={handleSubmit}
                />

                <Link href="/login" style={styles.footerLink}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Volver a <ThemedText type="linkPrimary">iniciar sesión</ThemedText>
                  </ThemedText>
                </Link>
              </ThemedView>
            )}
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
  logo: { width: 240, height: 162 },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: Spacing.two },
  form: {
    alignSelf: 'stretch',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  error: { color: '#FF4D5E', textAlign: 'center' },
  footerLink: { alignSelf: 'center', marginTop: Spacing.two },
});

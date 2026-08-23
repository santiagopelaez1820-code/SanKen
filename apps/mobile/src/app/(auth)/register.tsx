import { useState } from 'react';
import { Link } from 'expo-router';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { register, isSubmitting, error, clearError } = useAuthStore();

  const handleSubmit = () => {
    clearError();
    register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      password_confirmation: passwordConfirmation,
    }).catch(() => {});
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

              <PrimaryButton label="Continuar" loading={isSubmitting} onPress={handleSubmit} />
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
  error: { color: '#D9534F' },
  footerLink: { marginTop: Spacing.two },
});

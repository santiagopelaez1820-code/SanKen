import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { buildConsentFields, LEGAL_STRINGS, REQUIRED_CONSENTS, type ConsentType } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ConsentCheckboxes } from '@/components/legal/consent-checkboxes';
import { LegalLinks } from '@/components/legal/legal-links';
import { SocialConsentSheet } from '@/components/legal/social-consent-sheet';
import { GoogleSignInButton } from '@/components/ui/google-sign-in-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { FormMaxWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterScreen() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [consents, setConsents] = useState<Partial<Record<ConsentType, boolean>>>({});
  const [consentErrors, setConsentErrors] = useState<Partial<Record<ConsentType, string>>>({});
  const { register, loginWithGoogle, isSubmitting, isSubmittingGoogle, error, clearError } = useAuthStore();
  const anySubmitting = isSubmitting || isSubmittingGoogle;

  const handleConsentChange = (type: ConsentType, checked: boolean) => {
    setConsents((prev) => ({ ...prev, [type]: checked }));
    if (checked) setConsentErrors((prev) => ({ ...prev, [type]: undefined }));
  };

  // Validación local para dar feedback inmediato; el backend igual rechaza
  // el registro si falta cualquiera (RegisterRequest).
  const handleSubmit = () => {
    clearError();
    const missing: Partial<Record<ConsentType, string>> = {};
    for (const type of REQUIRED_CONSENTS) {
      if (!consents[type]) missing[type] = LEGAL_STRINGS.es.consentRequiredErrors[type];
    }
    setConsentErrors(missing);
    if (Object.keys(missing).length > 0) return;

    register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      password_confirmation: passwordConfirmation,
      ...buildConsentFields(consents),
    }).catch(() => {});
  };

  const goTo2faIfNeeded = () => {
    if (useAuthStore.getState().pendingChallenge) {
      router.push('/verify-2fa');
    }
  };

  // Mismo endpoint /auth/social que usa el login: el backend resuelve solo
  // si la cuenta de Google ya existe o hay que crearla — no hace falta un
  // flujo de "registro con Google" separado ni un formulario adicional.
  // Si las casillas ya están marcadas se mandan directo; si no, y la cuenta
  // de Google es nueva, se abre SocialConsentSheet antes de crearla.
  const handleGoogleSubmit = () => {
    clearError();
    loginWithGoogle(consents).then(goTo2faIfNeeded).catch(() => {});
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

              <ConsentCheckboxes
                consents={REQUIRED_CONSENTS}
                values={consents}
                errors={consentErrors}
                disabled={anySubmitting}
                onChange={handleConsentChange}
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

            <LegalLinks />
          </ScrollView>
          <SocialConsentSheet onAuthenticated={goTo2faIfNeeded} />
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
    gap: Spacing.three,
  },
  logo: { width: 100, height: 68 },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  form: {
    width: '100%',
    maxWidth: FormMaxWidth,
    gap: Spacing.two + 4,
  },
  error: { color: '#FF4D5E' },
  footerLink: {},
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    width: '100%',
    maxWidth: FormMaxWidth,
  },
  dividerLine: { flex: 1, height: 1 },
});

// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «Link, router» desde «expo-router».
import { Link, router } from 'expo-router';
// Esta línea sirve para importar «Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View» desde «react-native».
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «LegalLinks» desde «@/components/legal/legal-links».
import { LegalLinks } from '@/components/legal/legal-links';
// Esta línea sirve para importar «SocialConsentSheet» desde «@/components/legal/social-consent-sheet».
import { SocialConsentSheet } from '@/components/legal/social-consent-sheet';
// Esta línea sirve para importar «GoogleSignInButton» desde «@/components/ui/google-sign-in-button».
import { GoogleSignInButton } from '@/components/ui/google-sign-in-button';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «FormMaxWidth, Spacing» desde «@/constants/theme».
import { FormMaxWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

// Esta línea sirve para declarar la función «LoginScreen».
export default function LoginScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para crear el estado «email» y su función «setEmail».
  const [email, setEmail] = useState('');
  // Esta línea sirve para crear el estado «password» y su función «setPassword».
  const [password, setPassword] = useState('');
  // Esta línea sirve para obtener las acciones y el estado de autenticación.
  const { login, loginWithGoogle, isSubmitting, isSubmittingGoogle, error, clearError } = useAuthStore();
  // Esta línea sirve para extraer «nySubmittin» de «isSubmitting || isSubmittingGoogle».
  const anySubmitting = isSubmitting || isSubmittingGoogle;

  // Esta línea sirve para extraer «andleSubmi» de «() => {».
  const handleSubmit = () => {
    // Esta línea sirve para llamar a «clearError».
    clearError();
    // Esta línea sirve para iniciar sesión con el correo normalizado y la contraseña.
    login({ email: email.trim().toLowerCase(), password })
      // Esta línea sirve para encadenar la operación «then».
      .then(() => {
        // Esta línea sirve para revisar si «useAuthStore.getState().pendingChallenge».
        if (useAuthStore.getState().pendingChallenge) {
          // Esta línea sirve para llamar a «router.push» con «'/verify-2fa'».
          router.push('/verify-2fa');
        }
      })
      // Esta línea sirve para encadenar la operación «catch».
      .catch(() => {});
  };

  // Esta línea sirve para extraer «oTo2faIfNeede» de «() => {».
  const goTo2faIfNeeded = () => {
    // Esta línea sirve para revisar si «useAuthStore.getState().pendingChallenge».
    if (useAuthStore.getState().pendingChallenge) {
      // Esta línea sirve para llamar a «router.push» con «'/verify-2fa'».
      router.push('/verify-2fa');
    }
  };

  // Si la cuenta de Google es nueva, el store deja pendingSocialConsent y se
  // abre SocialConsentSheet: la cuenta no se crea sin las casillas.
  // Esta línea sirve para extraer «andleGoogleSubmi» de «() => {».
  const handleGoogleSubmit = () => {
    // Esta línea sirve para llamar a «clearError».
    clearError();
    // Esta línea sirve para llamar a «loginWithGoogle» con «).then(goTo2faIfNeeded).catch(() => {}».
    loginWithGoogle().then(goTo2faIfNeeded).catch(() => {});
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.flex}>
      {/* Esta línea sirve para abrir el componente «KeyboardAvoidingView». */}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
        <SafeAreaView style={styles.flex}>
          {/* Esta línea sirve para abrir el componente «ScrollView». */}
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {/* Esta línea sirve para abrir el componente «Image». */}
            <Image source={require('@/assets/images/logo-full.png')} style={styles.logo} resizeMode="contain" />
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              {/* Esta línea sirve para mostrar el texto «Inicia sesión para continuar tu entrenamiento.». */}
              Inicia sesión para continuar tu entrenamiento.
            </ThemedText>

            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.form}>
              {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
              <TextField
                // Esta línea sirve para definir el atributo «label» con el valor «Correo electrónico».
                label="Correo electrónico"
                // Esta línea sirve para pasar la propiedad «value» con el valor «email}».
                value={email}
                // Esta línea sirve para asignar el manejador del evento «onChangeText».
                onChangeText={setEmail}
                // Esta línea sirve para definir el atributo «autoCapitalize» con el valor «none».
                autoCapitalize="none"
                // Esta línea sirve para definir el atributo «keyboardType» con el valor «email-address».
                keyboardType="email-address"
                // Esta línea sirve para definir el atributo «autoComplete» con el valor «email».
                autoComplete="email"
              />
              {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
              <TextField
                // Esta línea sirve para definir el atributo «label» con el valor «Contraseña».
                label="Contraseña"
                // Esta línea sirve para pasar la propiedad «value» con el valor «password}».
                value={password}
                // Esta línea sirve para asignar el manejador del evento «onChangeText».
                onChangeText={setPassword}
                // Esta línea sirve para activar la opción «secureTextEntry».
                secureTextEntry
                // Esta línea sirve para definir el atributo «autoComplete» con el valor «password».
                autoComplete="password"
              />

              {/* Esta línea sirve para abrir el componente «Link». */}
              <Link href="/forgot-password" style={styles.forgotPasswordLink}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el enlace para recuperar la contraseña. */}
                  ¿Olvidaste tu <ThemedText type="linkPrimary">contraseña</ThemedText>?
                </ThemedText>
              </Link>

              {/* Esta línea sirve para mostrar el bloque solo si «error». */}
              {error && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" style={styles.error}>
                  {/* Esta línea sirve para mostrar el valor «error». */}
                  {error}
                </ThemedText>
              )}

              {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
              <PrimaryButton label="Entrar" loading={isSubmitting} disabled={anySubmitting} onPress={handleSubmit} />
            </ThemedView>

            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={styles.dividerRow}>
              {/* Esta línea sirve para abrir el componente «View». */}
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «O». */}
                O
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «View». */}
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.form}>
              {/* Esta línea sirve para abrir el elemento «GoogleSignInButton» con sus atributos en varias líneas. */}
              <GoogleSignInButton
                // Esta línea sirve para pasar la propiedad «label» con el valor «isSubmittingGoogle ? 'Continuando con Google…».
                label={isSubmittingGoogle ? 'Continuando con Google…' : 'Continuar con Google'}
                // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmittingGoogle}».
                loading={isSubmittingGoogle}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «anySubmitting}».
                disabled={anySubmitting}
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={handleGoogleSubmit}
              />
            </ThemedView>

            {/* Esta línea sirve para abrir el componente «Link». */}
            <Link href="/register" style={styles.footerLink}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el enlace para registrarse. */}
                ¿No tienes cuenta? <ThemedText type="linkPrimary">Regístrate</ThemedText>
              </ThemedText>
            </Link>

            {/* Esta línea sirve para abrir el componente «LegalLinks». */}
            <LegalLinks />
          </ScrollView>
          {/* Esta línea sirve para abrir el componente «SocialConsentSheet». */}
          <SocialConsentSheet onAuthenticated={goTo2faIfNeeded} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «{ flex: 1 }».
  flex: { flex: 1 },
  // Esta línea sirve para declarar la propiedad «scroll» con el valor o tipo «{».
  scroll: {
    // Esta línea sirve para declarar la propiedad «flexGrow» con el valor o tipo «1».
    flexGrow: 1,
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «Spacing.four».
    padding: Spacing.four,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Proporción real de logo-full.png (879x600).
  // Esta línea sirve para declarar la propiedad «logo» con el valor o tipo «{ width: 132, height: 90 }».
  logo: { width: 132, height: 90 },
  // Esta línea sirve para declarar la propiedad «subtitle» con el valor o tipo «{ textAlign: 'center' }».
  subtitle: { textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «form» con el valor o tipo «{».
  form: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «FormMaxWidth».
    maxWidth: FormMaxWidth,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two + 4».
    gap: Spacing.two + 4,
  },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E' }».
  error: { color: '#FF4D5E' },
  // Esta línea sirve para declarar la propiedad «footerLink» con el valor o tipo «{}».
  footerLink: {},
  // Esta línea sirve para declarar la propiedad «forgotPasswordLink» con el valor o tipo «{ alignSelf: 'center' }».
  forgotPasswordLink: { alignSelf: 'center' },
  // Esta línea sirve para declarar la propiedad «dividerRow» con el valor o tipo «{».
  dividerRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «FormMaxWidth».
    maxWidth: FormMaxWidth,
  },
  // Esta línea sirve para declarar la propiedad «dividerLine» con el valor o tipo «{ flex: 1, height: 1 }».
  dividerLine: { flex: 1, height: 1 },
});

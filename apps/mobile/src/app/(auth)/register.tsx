// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «Link, router» desde «expo-router».
import { Link, router } from 'expo-router';
// Esta línea sirve para importar «Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View» desde «react-native».
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «buildConsentFields, LEGAL_STRINGS, REQUIRED_CONSENTS, type ConsentType» desde «@sanken/core».
import { buildConsentFields, LEGAL_STRINGS, REQUIRED_CONSENTS, type ConsentType } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «ConsentCheckboxes» desde «@/components/legal/consent-checkboxes».
import { ConsentCheckboxes } from '@/components/legal/consent-checkboxes';
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

// Esta línea sirve para declarar la función «RegisterScreen».
export default function RegisterScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para crear el estado «name» y su función «setName».
  const [name, setName] = useState('');
  // Esta línea sirve para crear el estado «email» y su función «setEmail».
  const [email, setEmail] = useState('');
  // Esta línea sirve para crear el estado «password» y su función «setPassword».
  const [password, setPassword] = useState('');
  // Esta línea sirve para crear el estado «passwordConfirmation» y su función «setPasswordConfirmation».
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  // Esta línea sirve para crear el estado «consents» y su función «setConsents».
  const [consents, setConsents] = useState<Partial<Record<ConsentType, boolean>>>({});
  // Esta línea sirve para crear el estado «consentErrors» y su función «setConsentErrors».
  const [consentErrors, setConsentErrors] = useState<Partial<Record<ConsentType, string>>>({});
  // Esta línea sirve para obtener las acciones y el estado de registro.
  const { register, loginWithGoogle, isSubmitting, isSubmittingGoogle, error, clearError } = useAuthStore();
  // Esta línea sirve para extraer «nySubmittin» de «isSubmitting || isSubmittingGoogle».
  const anySubmitting = isSubmitting || isSubmittingGoogle;

  // Esta línea sirve para extraer «andleConsentChang» de «(type: ConsentType, checked: boolean) =>».
  const handleConsentChange = (type: ConsentType, checked: boolean) => {
    // Esta línea sirve para guardar en el estado con «setConsents» el valor «(prev) => ({ ...prev, [type]: checked }))…».
    setConsents((prev) => ({ ...prev, [type]: checked }));
    // Esta línea sirve para limpiar el error del consentimiento cuando se marca.
    if (checked) setConsentErrors((prev) => ({ ...prev, [type]: undefined }));
  };

  // Validación local para dar feedback inmediato; el backend igual rechaza
  // el registro si falta cualquiera (RegisterRequest).
  // Esta línea sirve para extraer «andleSubmi» de «() => {».
  const handleSubmit = () => {
    // Esta línea sirve para llamar a «clearError».
    clearError();
    // Esta línea sirve para declarar «missing» con el valor «{}».
    const missing: Partial<Record<ConsentType, string>> = {};
    // Esta línea sirve para recorrer los elementos con «const type of REQUIRED_CONSENTS».
    for (const type of REQUIRED_CONSENTS) {
      // Esta línea sirve para agregar el mensaje de error de cada consentimiento sin marcar.
      if (!consents[type]) missing[type] = LEGAL_STRINGS.es.consentRequiredErrors[type];
    }
    // Esta línea sirve para guardar en el estado con «setConsentErrors» el valor «missing)…».
    setConsentErrors(missing);
    // Esta línea sirve para salir de la función si «Object.keys(missing).length > 0».
    if (Object.keys(missing).length > 0) return;

    // Esta línea sirve para enviar el registro.
    register({
      // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «name.trim()».
      name: name.trim(),
      // Esta línea sirve para declarar la propiedad «email» con el valor o tipo «email.trim().toLowerCase()».
      email: email.trim().toLowerCase(),
      // Esta línea sirve para incluir el valor «password» en la lista.
      password,
      // Esta línea sirve para declarar la propiedad «password_confirmation» con el valor o tipo «passwordConfirmation».
      password_confirmation: passwordConfirmation,
      // Esta línea sirve para copiar las propiedades de «buildConsentFields».
      ...buildConsentFields(consents),
    // Esta línea sirve para ignorar el error porque el store ya lo muestra.
    }).catch(() => {});
  };

  // Esta línea sirve para extraer «oTo2faIfNeede» de «() => {».
  const goTo2faIfNeeded = () => {
    // Esta línea sirve para revisar si «useAuthStore.getState().pendingChallenge».
    if (useAuthStore.getState().pendingChallenge) {
      // Esta línea sirve para llamar a «router.push» con «'/verify-2fa'».
      router.push('/verify-2fa');
    }
  };

  // Mismo endpoint /auth/social que usa el login: el backend resuelve solo
  // si la cuenta de Google ya existe o hay que crearla — no hace falta un
  // flujo de "registro con Google" separado ni un formulario adicional.
  // Si las casillas ya están marcadas se mandan directo; si no, y la cuenta
  // de Google es nueva, se abre SocialConsentSheet antes de crearla.
  // Esta línea sirve para extraer «andleGoogleSubmi» de «() => {».
  const handleGoogleSubmit = () => {
    // Esta línea sirve para llamar a «clearError».
    clearError();
    // Esta línea sirve para iniciar sesión con Google enviando los consentimientos.
    loginWithGoogle(consents).then(goTo2faIfNeeded).catch(() => {});
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
            <ThemedText type="title" style={styles.title}>
              {/* Esta línea sirve para mostrar el texto «Crea tu cuenta». */}
              Crea tu cuenta
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              {/* Esta línea sirve para mostrar el texto «Empecemos por lo básico. Luego personalizamos tu plan.». */}
              Empecemos por lo básico. Luego personalizamos tu plan.
            </ThemedText>

            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.form}>
              {/* Esta línea sirve para abrir el componente «TextField». */}
              <TextField label="Nombre" value={name} onChangeText={setName} autoComplete="name" />
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
                // Esta línea sirve para definir el atributo «autoComplete» con el valor «new-password».
                autoComplete="new-password"
              />
              {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
              <TextField
                // Esta línea sirve para definir el atributo «label» con el valor «Confirmar contraseña».
                label="Confirmar contraseña"
                // Esta línea sirve para pasar la propiedad «value» con el valor «passwordConfirmation}».
                value={passwordConfirmation}
                // Esta línea sirve para asignar el manejador del evento «onChangeText».
                onChangeText={setPasswordConfirmation}
                // Esta línea sirve para activar la opción «secureTextEntry».
                secureTextEntry
                // Esta línea sirve para definir el atributo «autoComplete» con el valor «new-password».
                autoComplete="new-password"
              />

              {/* Esta línea sirve para abrir el elemento «ConsentCheckboxes» con sus atributos en varias líneas. */}
              <ConsentCheckboxes
                // Esta línea sirve para pasar la propiedad «consents» con el valor «REQUIRED_CONSENTS}».
                consents={REQUIRED_CONSENTS}
                // Esta línea sirve para pasar la propiedad «values» con el valor «consents}».
                values={consents}
                // Esta línea sirve para pasar la propiedad «errors» con el valor «consentErrors}».
                errors={consentErrors}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «anySubmitting}».
                disabled={anySubmitting}
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={handleConsentChange}
              />

              {/* Esta línea sirve para mostrar el bloque solo si «error». */}
              {error && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" style={styles.error}>
                  {/* Esta línea sirve para mostrar el valor «error». */}
                  {error}
                </ThemedText>
              )}

              {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
              <PrimaryButton label="Continuar" loading={isSubmitting} disabled={anySubmitting} onPress={handleSubmit} />
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
            <Link href="/login" style={styles.footerLink}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el enlace para iniciar sesión. */}
                ¿Ya tienes cuenta? <ThemedText type="linkPrimary">Inicia sesión</ThemedText>
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
  // Esta línea sirve para declarar la propiedad «logo» con el valor o tipo «{ width: 100, height: 68 }».
  logo: { width: 100, height: 68 },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{ textAlign: 'center' }».
  title: { textAlign: 'center' },
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

// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «Link, router» desde «expo-router».
import { Link, router } from 'expo-router';
// Esta línea sirve para importar «Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet» desde «react-native».
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «FormMaxWidth, Spacing» desde «@/constants/theme».
import { FormMaxWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

// Esta línea sirve para declarar la función «ForgotPasswordScreen».
export default function ForgotPasswordScreen() {
  // Esta línea sirve para crear el estado «email» y su función «setEmail».
  const [email, setEmail] = useState('');
  // Esta línea sirve para crear el estado «sent» y su función «setSent».
  const [sent, setSent] = useState(false);
  // Esta línea sirve para crear el estado «error» y su función «setError».
  const [error, setError] = useState<string | null>(null);
  // Esta línea sirve para obtener la acción de recuperar contraseña y su estado.
  const { forgotPassword, isSubmittingForgotPassword } = useAuthStore();

  // Esta línea sirve para extraer «andleSubmi» de «() => {».
  const handleSubmit = () => {
    // Esta línea sirve para guardar en el estado con «setError» el valor «null)…».
    setError(null);
    // Esta línea sirve para llamar a «forgotPassword» con «email.trim().toLowerCase()».
    forgotPassword(email.trim().toLowerCase())
      // Esta línea sirve para encadenar la operación «then».
      .then(() => setSent(true))
      // Esta línea sirve para encadenar la operación «catch».
      .catch(() => setError('No se pudo enviar el correo. Intenta de nuevo.'));
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

            {/* Esta línea sirve para elegir entre dos bloques según «sent». */}
            {sent ? (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={styles.form}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="title" style={styles.title}>
                  {/* Esta línea sirve para mostrar el texto «Revisa tu correo». */}
                  Revisa tu correo
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                  {/* Esta línea sirve para mostrar la confirmación de que se envió el enlace. */}
                  Si ese correo tiene una cuenta en SanKen, te acabamos de enviar un enlace para elegir una
                  contraseña nueva. Ábrelo desde el correo de tu teléfono — el enlace vence en 60 minutos.
                </ThemedText>
                {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
                <PrimaryButton label="Volver a iniciar sesión" onPress={() => router.replace('/login')} />
              </ThemedView>
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView style={styles.form}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="title" style={styles.title}>
                  {/* Esta línea sirve para mostrar el texto «¿Olvidaste tu contraseña?». */}
                  ¿Olvidaste tu contraseña?
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                  {/* Esta línea sirve para mostrar la instrucción para pedir el enlace de recuperación. */}
                  Ingresa el correo con el que te registraste y te enviamos un enlace para elegir una contraseña
                  nueva.
                </ThemedText>

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

                {/* Esta línea sirve para mostrar el bloque solo si «error». */}
                {error && (
                  // Esta línea sirve para abrir el componente «ThemedText».
                  <ThemedText type="small" style={styles.error}>
                    {/* Esta línea sirve para mostrar el valor «error». */}
                    {error}
                  </ThemedText>
                )}

                {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                <PrimaryButton
                  // Esta línea sirve para definir el atributo «label» con el valor «Enviar enlace de recuperación».
                  label="Enviar enlace de recuperación"
                  // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmittingForgotPassword}».
                  loading={isSubmittingForgotPassword}
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «isSubmittingForgotPassword || !email.trim()}».
                  disabled={isSubmittingForgotPassword || !email.trim()}
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={handleSubmit}
                />

                {/* Esta línea sirve para abrir el componente «Link». */}
                <Link href="/login" style={styles.footerLink}>
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" themeColor="textSecondary">
                    {/* Esta línea sirve para mostrar el enlace para volver a iniciar sesión. */}
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
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ color: '#FF4D5E', textAlign: 'center' }».
  error: { color: '#FF4D5E', textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «footerLink» con el valor o tipo «{ alignSelf: 'center' }».
  footerLink: { alignSelf: 'center' },
});

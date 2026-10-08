// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «KeyboardAvoidingView, Platform, ScrollView, StyleSheet» desde «react-native».
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
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

// Esta línea sirve para declarar la función «Verify2faScreen».
export default function Verify2faScreen() {
  // Esta línea sirve para crear el estado «code» y su función «setCode».
  const [code, setCode] = useState('');
  // Esta línea sirve para obtener el desafío de doble verificación y sus acciones.
  const { pendingChallenge, challenge2fa, isSubmitting, error, clearError } = useAuthStore();

  // Solo se verifica al montar: si el usuario llega a esta pantalla sin un
  // challenge pendiente (navegación directa), lo mandamos de vuelta. No debe
  // re-evaluarse reactivamente — un envío exitoso también limpia
  // `pendingChallenge`, y eso competiría con el guard de (auth)/_layout que
  // redirige una vez que `token`/`user` quedan seteados.
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para revisar si «!useAuthStore.getState().pendingChallenge».
    if (!useAuthStore.getState().pendingChallenge) {
      // Esta línea sirve para llamar a «router.replace» con «'/login'».
      router.replace('/login');
    }
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
  }, []);

  // Esta línea sirve para devolver null si «!pendingChallenge».
  if (!pendingChallenge) return null;

  // Esta línea sirve para extraer «andleSubmi» de «() => {».
  const handleSubmit = () => {
    // Esta línea sirve para llamar a «clearError».
    clearError();
    // Esta línea sirve para llamar a «challenge2fa» con «code).catch(() => {}».
    challenge2fa(code).catch(() => {});
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
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="title" style={styles.title}>
              {/* Esta línea sirve para mostrar el texto «Verificación en dos pasos». */}
              Verificación en dos pasos
            </ThemedText>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              {/* Esta línea sirve para mostrar la instrucción de ingresar el código. */}
              Ingresa el código de tu app autenticadora, o un código de recuperación.
            </ThemedText>

            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.form}>
              {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
              <TextField
                // Esta línea sirve para definir el atributo «label» con el valor «Código».
                label="Código"
                // Esta línea sirve para pasar la propiedad «value» con el valor «code}».
                value={code}
                // Esta línea sirve para asignar el manejador del evento «onChangeText».
                onChangeText={setCode}
                // Esta línea sirve para definir el atributo «autoCapitalize» con el valor «characters».
                autoCapitalize="characters"
                // Esta línea sirve para activar la opción «autoFocus».
                autoFocus
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
              <PrimaryButton label="Verificar" loading={isSubmitting} onPress={handleSubmit} />
            </ThemedView>
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
});

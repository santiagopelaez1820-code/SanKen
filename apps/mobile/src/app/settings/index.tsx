import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { ToggleRow } from '@/components/ui/toggle-row';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';

export default function SettingsScreen() {
  const { user, refreshMe } = useAuthStore();
  const {
    enrollment,
    recoveryCodes,
    isSubmitting,
    submitError,
    isUpdatingPrivacy,
    enableTwoFactor,
    confirmTwoFactor,
    disableTwoFactor,
    dismissRecoveryCodes,
    setPublicProfile,
  } = useSettingsStore();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const handleConfirm = async () => {
    const ok = await confirmTwoFactor(code);
    if (ok) {
      setCode('');
      refreshMe();
    }
  };

  const handleDisable = async () => {
    const ok = await disableTwoFactor(password);
    if (ok) {
      setPassword('');
      refreshMe();
    }
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.pageTitle}>
            Configuración
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="default">Autenticación de dos factores</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Agrega una capa extra de seguridad pidiendo un código de tu app autenticadora al iniciar sesión.
            </ThemedText>

            {recoveryCodes && (
              <ThemedView style={styles.recoveryBox}>
                <ThemedText type="smallBold">2FA activado. Guarda estos códigos de recuperación:</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Cada uno sirve una sola vez si perdés el acceso a tu app autenticadora. No se van a volver a
                  mostrar.
                </ThemedText>
                {recoveryCodes.map((rc) => (
                  <ThemedText key={rc} type="smallBold" style={styles.recoveryCode}>
                    {rc}
                  </ThemedText>
                ))}
                <PrimaryButton label="Ya los guardé" onPress={dismissRecoveryCodes} />
              </ThemedView>
            )}

            {!recoveryCodes && user && !user.two_factor_enabled && !enrollment && (
              <PrimaryButton label="Activar 2FA" loading={isSubmitting} onPress={enableTwoFactor} />
            )}

            {!recoveryCodes && enrollment && (
              <ThemedView style={styles.enrollBox}>
                <SvgXml xml={enrollment.qr_svg} width={200} height={200} style={styles.qr} />
                <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                  Escaneá el QR con tu app autenticadora, o ingresá esta clave manualmente:
                </ThemedText>
                <ThemedText type="smallBold" style={styles.center}>
                  {enrollment.secret}
                </ThemedText>

                <TextField
                  label="Código de 6 dígitos"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {submitError && (
                  <ThemedText type="small" style={styles.error}>
                    {submitError}
                  </ThemedText>
                )}
                <PrimaryButton label="Confirmar" loading={isSubmitting} onPress={handleConfirm} />
              </ThemedView>
            )}

            {!recoveryCodes && user?.two_factor_enabled && (
              <ThemedView style={styles.enrollBox}>
                <ThemedText type="default">2FA está activado en tu cuenta.</ThemedText>
                <TextField
                  label="Contraseña para desactivar"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                {submitError && (
                  <ThemedText type="small" style={styles.error}>
                    {submitError}
                  </ThemedText>
                )}
                <PrimaryButton
                  label="Desactivar 2FA"
                  variant="ghost"
                  loading={isSubmitting}
                  onPress={handleDisable}
                />
              </ThemedView>
            )}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ToggleRow
              label="Rankings públicos"
              description="Si activás esto, tu volumen total aparece en los rankings de ciudad, país, gimnasio, edad, sexo y categoría de fuerza."
              value={user?.is_public_profile ?? false}
              disabled={isUpdatingPrivacy}
              onValueChange={(value) => setPublicProfile(value)}
            />
          </ThemedView>

          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  pageTitle: { fontSize: 28, lineHeight: 34, marginBottom: Spacing.two },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  enrollBox: { gap: Spacing.two, marginTop: Spacing.two },
  recoveryBox: { gap: Spacing.one, marginTop: Spacing.two },
  recoveryCode: { textAlign: 'center' },
  qr: { alignSelf: 'center' },
  center: { textAlign: 'center' },
  error: { color: '#C9564A' },
});

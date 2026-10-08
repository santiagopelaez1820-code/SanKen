// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from 'react';
// Esta línea sirve para importar «usePathname» desde «expo-router».
import { usePathname } from 'expo-router';
// Esta línea sirve para importar «StyleSheet, View» desde «react-native».
import { StyleSheet, View } from 'react-native';
// Esta línea sirve para importar los tipos «AnswerCheckinResponse» desde «@sanken/core».
import type { AnswerCheckinResponse } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «BottomSheet» desde «@/components/ui/bottom-sheet».
import { BottomSheet } from '@/components/ui/bottom-sheet';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useSupportStore» desde «@/store/support-store».
import { useSupportStore } from '@/store/support-store';
// Esta línea sirve para importar «CheckinForm» desde «@/components/support/checkin-form».
import { CheckinForm } from '@/components/support/checkin-form';
// Esta línea sirve para importar «supportStrings as t» desde «@/components/support/support-ui».
import { supportStrings as t } from '@/components/support/support-ui';

/**
 * Hoja del check-in semanal, montada en el layout de las pestañas: consulta
 * GET /support/check-ins/current una vez por apertura de la app y se abre
 * solo si el backend dice que toca (viernes a domingo, una vez por semana,
 * respetando "Ahora no"). Cerrarla sin responder cuenta como "Ahora no".
 */
// Esta línea sirve para declarar la función «WeeklyCheckinSheet».
export function WeeklyCheckinSheet() {
  // Esta línea sirve para obtener «pathname» con el hook «usePathname».
  const pathname = usePathname();
  // Esta línea sirve para obtener «checkin» con el hook «useSupportStore».
  const checkin = useSupportStore((s) => s.checkin);
  // Esta línea sirve para obtener «checkinUserId» con el hook «useSupportStore».
  const checkinUserId = useSupportStore((s) => s.checkinUserId);
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id);
  // Esta línea sirve para obtener «loadCheckin» con el hook «useSupportStore».
  const loadCheckin = useSupportStore((s) => s.loadCheckin);
  // Esta línea sirve para obtener «postpone» con el hook «useSupportStore».
  const postpone = useSupportStore((s) => s.postponeCheckin);
  // Esta línea sirve para crear el estado «result» y su función «setResult».
  const [result, setResult] = useState<AnswerCheckinResponse | null>(null);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para llamar a «loadCheckin» si «userId && checkinUserId !== userId».
    if (userId && checkinUserId !== userId) void loadCheckin(userId);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «userId, checkinUserId, loadCheckin».
  }, [userId, checkinUserId, loadCheckin]);

  // Esta línea sirve para extraer «isibl» de «pathname !== '/soporte/check-in' && ((!!».
  const visible = pathname !== '/soporte/check-in' && ((!!checkin?.should_prompt && !!checkin.checkin) || !!result);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «BottomSheet» con sus propiedades.
    <BottomSheet visible={visible} onClose={() => (result ? setResult(null) : void postpone())}>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={styles.content}>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="subtitle" accessibilityRole="header">
          {/* Esta línea sirve para mostrar el contenido dinámico «{t.checkinTitle} 💪». */}
          {t.checkinTitle} 💪
        </ThemedText>
        {/* Esta línea sirve para elegir entre dos bloques según «result». */}
        {result ? (
          // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
          <>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText accessibilityRole="alert">
              {/* Esta línea sirve para mostrar el agradecimiento, con el número de ticket si se creó. */}
              {result.ticket ? t.checkinThanksWithTicket(result.ticket.id) : t.checkinThanks}
            </ThemedText>
            {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
            <PrimaryButton label={t.done} onPress={() => setResult(null)} />
          </>
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para mostrar el componente «CheckinForm».
          <CheckinForm onDone={setResult} onPostpone={() => void postpone()} />
        )}
      </View>
    </BottomSheet>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para definir el estilo «content» con «gap: Spacing.three, paddingBottom: Spacing.three }…».
  content: { gap: Spacing.three, paddingBottom: Spacing.three },
});

import { useEffect, useState } from 'react';
import { usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import type { AnswerCheckinResponse } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useSupportStore } from '@/store/support-store';
import { CheckinForm } from '@/components/support/checkin-form';
import { supportStrings as t } from '@/components/support/support-ui';

/**
 * Hoja del check-in semanal, montada en el layout de las pestañas: consulta
 * GET /support/check-ins/current una vez por apertura de la app y se abre
 * solo si el backend dice que toca (viernes a domingo, una vez por semana,
 * respetando "Ahora no"). Cerrarla sin responder cuenta como "Ahora no".
 */
export function WeeklyCheckinSheet() {
  const pathname = usePathname();
  const checkin = useSupportStore((s) => s.checkin);
  const checkinUserId = useSupportStore((s) => s.checkinUserId);
  const userId = useAuthStore((s) => s.user?.id);
  const loadCheckin = useSupportStore((s) => s.loadCheckin);
  const postpone = useSupportStore((s) => s.postponeCheckin);
  const [result, setResult] = useState<AnswerCheckinResponse | null>(null);

  useEffect(() => {
    if (userId && checkinUserId !== userId) void loadCheckin(userId);
  }, [userId, checkinUserId, loadCheckin]);

  const visible = pathname !== '/soporte/check-in' && ((!!checkin?.should_prompt && !!checkin.checkin) || !!result);

  return (
    <BottomSheet visible={visible} onClose={() => (result ? setResult(null) : void postpone())}>
      <View style={styles.content}>
        <ThemedText type="subtitle" accessibilityRole="header">
          {t.checkinTitle} 💪
        </ThemedText>
        {result ? (
          <>
            <ThemedText accessibilityRole="alert">
              {result.ticket ? t.checkinThanksWithTicket(result.ticket.id) : t.checkinThanks}
            </ThemedText>
            <PrimaryButton label={t.done} onPress={() => setResult(null)} />
          </>
        ) : (
          <CheckinForm onDone={setResult} onPostpone={() => void postpone()} />
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.three, paddingBottom: Spacing.three },
});

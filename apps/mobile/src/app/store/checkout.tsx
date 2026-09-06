import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCurrency } from '@sanken/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { ToggleRow } from '@/components/ui/toggle-row';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

export default function CheckoutScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const isSubmittingOrder = useCartStore((s) => s.isSubmittingOrder);
  const orderError = useCartStore((s) => s.orderError);
  const submitOrder = useCartStore((s) => s.submitOrder);

  const [form, setForm] = useState({
    customer_name: user?.name ?? '',
    customer_email: user?.email ?? '',
    customer_phone: '',
    customer_whatsapp: '',
    department: '',
    city: '',
    address: '',
    additional_info: '',
  });
  // Por defecto asumimos que el WhatsApp es el mismo que el celular — la
  // mayoría de los clientes no tienen un número aparte, así que evitamos
  // pedirles que lo escriban dos veces.
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true);

  const update = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  // Resuelto siempre explícito — nunca se manda en blanco al backend, aunque
  // el checkbox esté marcado y el usuario nunca haya tocado el campo de WhatsApp.
  const resolvedWhatsapp = whatsappSameAsPhone ? form.customer_phone.trim() : form.customer_whatsapp.trim();

  const isValid = Boolean(
    form.customer_name.trim() &&
      form.customer_email.trim() &&
      form.customer_phone.trim() &&
      resolvedWhatsapp &&
      form.department.trim() &&
      form.city.trim() &&
      form.address.trim(),
  );

  const handleSubmit = async () => {
    const order = await submitOrder({
      ...form,
      customer_whatsapp: resolvedWhatsapp,
      additional_info: form.additional_info.trim() || null,
    });
    if (order) {
      router.replace({ pathname: '/store/confirmation', params: { orderId: String(order.id) } });
    }
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="small" themeColor="textSecondary" onPress={() => router.back()}>
          ← Carrito
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          Checkout
        </ThemedText>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="smallBold">Datos del cliente</ThemedText>
          <TextField label="Nombre completo" value={form.customer_name} onChangeText={update('customer_name')} />
          <TextField
            label="Teléfono"
            value={form.customer_phone}
            onChangeText={update('customer_phone')}
            keyboardType="phone-pad"
          />
          <ToggleRow
            label="Mi WhatsApp es el mismo que mi celular"
            value={whatsappSameAsPhone}
            onValueChange={setWhatsappSameAsPhone}
          />
          {!whatsappSameAsPhone && (
            <TextField
              label="WhatsApp"
              value={form.customer_whatsapp}
              onChangeText={update('customer_whatsapp')}
              keyboardType="phone-pad"
            />
          )}
          <TextField
            label="Correo"
            value={form.customer_email}
            onChangeText={update('customer_email')}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ThemedText type="smallBold" style={styles.sectionSpacer}>
            Datos de entrega
          </ThemedText>
          <TextField label="Departamento" value={form.department} onChangeText={update('department')} />
          <TextField label="Ciudad" value={form.city} onChangeText={update('city')} />
          <TextField label="Dirección" value={form.address} onChangeText={update('address')} />
          <TextField
            label="Información adicional (opcional)"
            value={form.additional_info}
            onChangeText={update('additional_info')}
            multiline
          />

          <ThemedView type="backgroundElement" style={styles.summary}>
            <ThemedText type="smallBold">Resumen</ThemedText>
            {items.map((item) => (
              <ThemedView key={item.product.id} style={styles.summaryRow}>
                <ThemedText type="small" style={styles.summaryLabel} numberOfLines={1}>
                  {item.quantity}× {item.product.name}
                </ThemedText>
                <ThemedText type="small">{formatCurrency(Number(item.product.price) * item.quantity)}</ThemedText>
              </ThemedView>
            ))}
            <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />
            <ThemedView style={styles.summaryRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Subtotal (COP)
              </ThemedText>
              <ThemedText type="small">{formatCurrency(subtotal)}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.summaryRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Envío (COP)
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Por definir
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.summaryRow}>
              <ThemedText type="smallBold">Total (COP)</ThemedText>
              <ThemedText type="smallBold" themeColor="accent">
                {formatCurrency(subtotal)}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {orderError && (
            <ThemedText type="small" themeColor="error" style={styles.error}>
              {orderError}
            </ThemedText>
          )}
        </ScrollView>

        <PrimaryButton label="Realizar pedido" onPress={handleSubmit} loading={isSubmittingOrder} disabled={!isValid} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center' },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset,
    gap: Spacing.two,
  },
  title: { fontSize: 26, lineHeight: 32 },
  scrollContent: { gap: Spacing.two, paddingBottom: Spacing.four },
  sectionSpacer: { marginTop: Spacing.three },
  summary: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.one, marginTop: Spacing.three },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  summaryLabel: { flex: 1, marginRight: Spacing.two },
  divider: { height: 1, marginVertical: Spacing.one },
  error: { marginTop: Spacing.one },
});

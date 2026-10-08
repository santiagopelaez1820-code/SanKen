// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «ScrollView, StyleSheet» desde «react-native».
import { ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «formatCurrency» desde «@sanken/core».
import { formatCurrency } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «BackButton» desde «@/components/ui/back-button».
import { BackButton } from '@/components/ui/back-button';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «TextField» desde «@/components/ui/text-field».
import { TextField } from '@/components/ui/text-field';
// Esta línea sirve para importar «ToggleRow» desde «@/components/ui/toggle-row».
import { ToggleRow } from '@/components/ui/toggle-row';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';
// Esta línea sirve para importar «useCartStore» desde «@/store/cart-store».
import { useCartStore } from '@/store/cart-store';

// Esta línea sirve para declarar la función «CheckoutScreen».
export default function CheckoutScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((s) => s.user);
  // Esta línea sirve para obtener «items» con el hook «useCartStore».
  const items = useCartStore((s) => s.items);
  // Esta línea sirve para obtener «subtotal» con el hook «useCartStore».
  const subtotal = useCartStore((s) => s.getSubtotal());
  // Esta línea sirve para obtener «isSubmittingOrder» con el hook «useCartStore».
  const isSubmittingOrder = useCartStore((s) => s.isSubmittingOrder);
  // Esta línea sirve para obtener «orderError» con el hook «useCartStore».
  const orderError = useCartStore((s) => s.orderError);
  // Esta línea sirve para obtener «submitOrder» con el hook «useCartStore».
  const submitOrder = useCartStore((s) => s.submitOrder);

  // Esta línea sirve para crear el estado «form» y su función «setForm».
  const [form, setForm] = useState({
    // Esta línea sirve para declarar la propiedad «customer_name» con el valor o tipo «user?.name ?? ''».
    customer_name: user?.name ?? '',
    // Esta línea sirve para declarar la propiedad «customer_email» con el valor o tipo «user?.email ?? ''».
    customer_email: user?.email ?? '',
    // Esta línea sirve para declarar la propiedad «customer_phone» con el valor o tipo «''».
    customer_phone: '',
    // Esta línea sirve para declarar la propiedad «customer_whatsapp» con el valor o tipo «''».
    customer_whatsapp: '',
    // Esta línea sirve para declarar la propiedad «department» con el valor o tipo «''».
    department: '',
    // Esta línea sirve para declarar la propiedad «city» con el valor o tipo «''».
    city: '',
    // Esta línea sirve para declarar la propiedad «address» con el valor o tipo «''».
    address: '',
    // Esta línea sirve para declarar la propiedad «additional_info» con el valor o tipo «''».
    additional_info: '',
  });
  // Por defecto asumimos que el WhatsApp es el mismo que el celular — la
  // mayoría de los clientes no tienen un número aparte, así que evitamos
  // pedirles que lo escriban dos veces.
  // Esta línea sirve para crear el estado «whatsappSameAsPhone» y su función «setWhatsappSameAsPhone».
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(true);

  // Esta línea sirve para extraer «pdat» de «(key: keyof typeof form) => (value: stri».
  const update = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  // Resuelto siempre explícito — nunca se manda en blanco al backend, aunque
  // el checkbox esté marcado y el usuario nunca haya tocado el campo de WhatsApp.
  // Esta línea sirve para extraer «esolvedWhatsap» de «whatsappSameAsPhone ? form.customer_phon».
  const resolvedWhatsapp = whatsappSameAsPhone ? form.customer_phone.trim() : form.customer_whatsapp.trim();

  // Esta línea sirve para extraer «sVali» de «Boolean(».
  const isValid = Boolean(
    // Esta línea sirve para exigir el nombre del cliente.
    form.customer_name.trim() &&
      // Esta línea sirve para exigir el correo del cliente.
      form.customer_email.trim() &&
      // Esta línea sirve para exigir el teléfono del cliente.
      form.customer_phone.trim() &&
      // Esta línea sirve para exigir el WhatsApp resuelto.
      resolvedWhatsapp &&
      // Esta línea sirve para exigir el departamento.
      form.department.trim() &&
      // Esta línea sirve para exigir la ciudad.
      form.city.trim() &&
      // Esta línea sirve para exigir la dirección.
      form.address.trim(),
  );

  // Esta línea sirve para extraer «andleSubmi» de «async () => {».
  const handleSubmit = async () => {
    // Esta línea sirve para esperar «submitOrder({» y guardar el resultado en «order».
    const order = await submitOrder({
      // Esta línea sirve para copiar las propiedades de «form».
      ...form,
      // Esta línea sirve para declarar la propiedad «customer_whatsapp» con el valor o tipo «resolvedWhatsapp».
      customer_whatsapp: resolvedWhatsapp,
      // Esta línea sirve para declarar la propiedad «additional_info» con el valor o tipo «form.additional_info.trim() || null».
      additional_info: form.additional_info.trim() || null,
    });
    // Esta línea sirve para revisar si «order».
    if (order) {
      // Esta línea sirve para reemplazar la pantalla por la confirmación del pedido.
      router.replace({ pathname: '/store/confirmation', params: { orderId: String(order.id) } });
    }
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «BackButton». */}
        <BackButton label="Carrito" fallbackHref="/store/cart" />
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="title" style={styles.title}>
          {/* Esta línea sirve para mostrar el texto «Checkout». */}
          Checkout
        </ThemedText>

        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Esta línea sirve para mostrar el texto «Datos del cliente» dentro de «ThemedText». */}
          <ThemedText type="smallBold">Datos del cliente</ThemedText>
          {/* Esta línea sirve para abrir el componente «TextField». */}
          <TextField label="Nombre completo" value={form.customer_name} onChangeText={update('customer_name')} />
          {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
          <TextField
            // Esta línea sirve para definir el atributo «label» con el valor «Teléfono».
            label="Teléfono"
            // Esta línea sirve para pasar la propiedad «value» con el valor «form.customer_phone}».
            value={form.customer_phone}
            // Esta línea sirve para asignar el manejador del evento «onChangeText».
            onChangeText={update('customer_phone')}
            // Esta línea sirve para definir el atributo «keyboardType» con el valor «phone-pad».
            keyboardType="phone-pad"
          />
          {/* Esta línea sirve para abrir el elemento «ToggleRow» con sus atributos en varias líneas. */}
          <ToggleRow
            // Esta línea sirve para definir el atributo «label» con el valor «Mi WhatsApp es el mismo que mi celular».
            label="Mi WhatsApp es el mismo que mi celular"
            // Esta línea sirve para pasar la propiedad «value» con el valor «whatsappSameAsPhone}».
            value={whatsappSameAsPhone}
            // Esta línea sirve para asignar el manejador del evento «onValueChange».
            onValueChange={setWhatsappSameAsPhone}
          />
          {/* Esta línea sirve para mostrar el bloque solo si «!whatsappSameAsPhone». */}
          {!whatsappSameAsPhone && (
            // Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas.
            <TextField
              // Esta línea sirve para definir el atributo «label» con el valor «WhatsApp».
              label="WhatsApp"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.customer_whatsapp}».
              value={form.customer_whatsapp}
              // Esta línea sirve para asignar el manejador del evento «onChangeText».
              onChangeText={update('customer_whatsapp')}
              // Esta línea sirve para definir el atributo «keyboardType» con el valor «phone-pad».
              keyboardType="phone-pad"
            />
          )}
          {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
          <TextField
            // Esta línea sirve para definir el atributo «label» con el valor «Correo».
            label="Correo"
            // Esta línea sirve para pasar la propiedad «value» con el valor «form.customer_email}».
            value={form.customer_email}
            // Esta línea sirve para asignar el manejador del evento «onChangeText».
            onChangeText={update('customer_email')}
            // Esta línea sirve para definir el atributo «keyboardType» con el valor «email-address».
            keyboardType="email-address"
            // Esta línea sirve para definir el atributo «autoCapitalize» con el valor «none».
            autoCapitalize="none"
          />

          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="smallBold" style={styles.sectionSpacer}>
            {/* Esta línea sirve para mostrar el texto «Datos de entrega». */}
            Datos de entrega
          </ThemedText>
          {/* Esta línea sirve para abrir el componente «TextField». */}
          <TextField label="Departamento" value={form.department} onChangeText={update('department')} />
          {/* Esta línea sirve para abrir el componente «TextField». */}
          <TextField label="Ciudad" value={form.city} onChangeText={update('city')} />
          {/* Esta línea sirve para abrir el componente «TextField». */}
          <TextField label="Dirección" value={form.address} onChangeText={update('address')} />
          {/* Esta línea sirve para abrir el elemento «TextField» con sus atributos en varias líneas. */}
          <TextField
            // Esta línea sirve para definir el atributo «label» con el valor «Información adicional (opcional)».
            label="Información adicional (opcional)"
            // Esta línea sirve para pasar la propiedad «value» con el valor «form.additional_info}».
            value={form.additional_info}
            // Esta línea sirve para asignar el manejador del evento «onChangeText».
            onChangeText={update('additional_info')}
            // Esta línea sirve para activar la opción «multiline».
            multiline
          />

          {/* Esta línea sirve para abrir el componente «ThemedView». */}
          <ThemedView type="backgroundElement" style={styles.summary}>
            {/* Esta línea sirve para mostrar el texto «Resumen» dentro de «ThemedText». */}
            <ThemedText type="smallBold">Resumen</ThemedText>
            {/* Esta línea sirve para recorrer «items» y mostrar un bloque por elemento. */}
            {items.map((item) => (
              // Esta línea sirve para abrir el componente «ThemedView».
              <ThemedView key={item.product.id} style={styles.summaryRow}>
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="small" style={styles.summaryLabel} numberOfLines={1}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{item.quantity}× {item.product.name}». */}
                  {item.quantity}× {item.product.name}
                </ThemedText>
                {/* Esta línea sirve para abrir el componente «ThemedText» con sus propiedades. */}
                <ThemedText type="small">{formatCurrency(Number(item.product.price) * item.quantity)}</ThemedText>
              </ThemedView>
            ))}
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.summaryRow}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Subtotal (COP)». */}
                Subtotal (COP)
              </ThemedText>
              {/* Esta línea sirve para mostrar el valor «formatCurrency(subtotal)» dentro de «ThemedText». */}
              <ThemedText type="small">{formatCurrency(subtotal)}</ThemedText>
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.summaryRow}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Envío (COP)». */}
                Envío (COP)
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para mostrar el texto «Por definir». */}
                Por definir
              </ThemedText>
            </ThemedView>
            {/* Esta línea sirve para abrir el componente «ThemedView». */}
            <ThemedView style={styles.summaryRow}>
              {/* Esta línea sirve para mostrar el texto «Total (COP)» dentro de «ThemedText». */}
              <ThemedText type="smallBold">Total (COP)</ThemedText>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="smallBold" themeColor="accent">
                {/* Esta línea sirve para mostrar el contenido dinámico «{formatCurrency(subtotal)}». */}
                {formatCurrency(subtotal)}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Esta línea sirve para mostrar el bloque solo si «orderError». */}
          {orderError && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="error" style={styles.error}>
              {/* Esta línea sirve para mostrar el valor «orderError». */}
              {orderError}
            </ThemedText>
          )}
        </ScrollView>

        {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
        <PrimaryButton label="Realizar pedido" onPress={handleSubmit} loading={isSubmittingOrder} disabled={!isValid} />
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1, alignItems: 'center' }».
  root: { flex: 1, alignItems: 'center' },
  // Esta línea sirve para declarar la propiedad «safeArea» con el valor o tipo «{».
  safeArea: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.two».
    paddingTop: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «BottomTabInset».
    paddingBottom: BottomTabInset,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  title: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «scrollContent» con «gap: Spacing.two, paddingBottom: Spacing.four },…».
  scrollContent: { gap: Spacing.two, paddingBottom: Spacing.four },
  // Esta línea sirve para declarar la propiedad «sectionSpacer» con el valor o tipo «{ marginTop: Spacing.three }».
  sectionSpacer: { marginTop: Spacing.three },
  // Esta línea sirve para definir el estilo «summary» con «borderRadius: Spacing.four, padding: Spacing.three…».
  summary: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.one, marginTop: Spacing.three },
  // Esta línea sirve para declarar la propiedad «summaryRow» con el valor o tipo «{».
  summaryRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «summaryLabel» con el valor o tipo «{ flex: 1, marginRight: Spacing.two }».
  summaryLabel: { flex: 1, marginRight: Spacing.two },
  // Esta línea sirve para declarar la propiedad «divider» con el valor o tipo «{ height: 1, marginVertical: Spacing.one }».
  divider: { height: 1, marginVertical: Spacing.one },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{ marginTop: Spacing.one }».
  error: { marginTop: Spacing.one },
});

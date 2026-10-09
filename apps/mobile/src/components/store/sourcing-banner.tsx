import { useState } from 'react';
import { Linking, Pressable, StyleSheet } from 'react-native';
import { Banknote, ChevronDown } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// WhatsApp de SanKen (Colombia, +57) para pedir productos que no están en el catálogo.
const WHATSAPP_NUMBER = '573012790523';
const WHATSAPP_MESSAGE = 'Hola SanKen, estoy buscando este producto de suplementación: ';

// Verde de marca de WhatsApp: fijo en los dos modos, igual que su botón oficial.
const WHATSAPP_GREEN = '#25D366';

// Logo oficial de WhatsApp (lucide no trae marcas).
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill="#FFFFFF" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </Svg>
  );
}

const CATEGORIES = ['Proteínas', 'Pre-entrenos', 'Creatinas', 'Aminoácidos', 'Vitaminas y suplementos'];

/**
 * Aviso plegable de la tienda: cerrado es una sola línea; al abrirlo explica que SanKen
 * consigue productos que no están en el catálogo y ofrece el contacto por WhatsApp.
 * Todos los colores salen de useTheme() para verse bien en modo claro y oscuro.
 */
export function SourcingBanner() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <ThemedView style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={styles.header}>
        <ThemedText type="smallBold" style={styles.title}>
          ¿No encuentras lo que buscas? Nosotros lo conseguimos
        </ThemedText>
        <ChevronDown size={18} color={theme.accent} style={open ? styles.chevronOpen : undefined} />
      </Pressable>

      {open && (
        <ThemedView style={styles.body}>
          <ThemedText type="caption" themeColor="textSecondary">
            Trabajamos con una amplia variedad de marcas de suplementación deportiva. Dinos qué producto necesitas y
            buscamos la mejor opción para ti.
          </ThemedText>
          <ThemedView style={styles.list}>
            {CATEGORIES.map((item) => (
              <ThemedText key={item} type="caption" style={[styles.chip, { backgroundColor: theme.backgroundElement }]}>
                {item}
              </ThemedText>
            ))}
          </ThemedView>
          <ThemedText type="caption" themeColor="textSecondary">
            ¿Tienes una marca o producto específico en mente? Escríbenos.
          </ThemedText>
          <ThemedView style={styles.actions}>
            <ThemedView style={styles.notice}>
              <Banknote size={18} color={theme.accent} />
              <ThemedText type="smallBold" style={styles.noticeText}>
                Todos los pagos se hacen contraentrega
              </ThemedText>
            </ThemedView>
            <Pressable
            onPress={() => Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`)}
            accessibilityRole="link"
            accessibilityLabel="Hablemos por WhatsApp"
            style={({ pressed }) => [styles.whatsapp, pressed && styles.whatsappPressed]}>
            <WhatsAppIcon />
            <ThemedText type="smallBold" style={styles.whatsappLabel}>
              Hablemos
            </ThemedText>
          </Pressable>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  title: {
    flex: 1,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  body: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    backgroundColor: 'transparent',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  actions: {
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  noticeText: {
    flex: 1,
  },
  whatsapp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: WHATSAPP_GREEN,
    borderRadius: 999,
    paddingVertical: Spacing.two + Spacing.one,
  },
  whatsappPressed: {
    opacity: 0.85,
  },
  whatsappLabel: {
    color: '#FFFFFF',
  },
  chip: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    overflow: 'hidden',
  },
});

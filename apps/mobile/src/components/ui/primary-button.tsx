// Esta línea sirve para importar «ActivityIndicator, Pressable, StyleSheet, type GestureResponderEvent, type PressableProps» desde «react-native».
import { ActivityIndicator, Pressable, StyleSheet, type GestureResponderEvent, type PressableProps } from 'react-native';
// Esta línea sirve para importar «LinearGradient» desde «expo-linear-gradient».
import { LinearGradient } from 'expo-linear-gradient';
// Esta línea sirve para importar «Animated» y «useAnimatedStyle, useSharedValue, withSpring» desde «react-native-reanimated».
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «Icon, type LucideIcon» desde «@/components/ui/icon».
import { Icon, type LucideIcon } from '@/components/ui/icon';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «PrimaryButtonProps».
interface PrimaryButtonProps extends PressableProps {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
  // Esta línea sirve para declarar la propiedad «loading» con el valor o tipo «boolean».
  loading?: boolean;
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «LucideIcon».
  icon?: LucideIcon;
  /**
   * `primary` (lima sólido) es la ÚNICA acción principal de cada
   * pantalla — no todo botón debe ser lima. `accent2` (cyan sólido) es
   * para acciones ligadas a entrenamiento/actividad. `neutral` (superficie
   * oscura/clara según tema, texto normal) es para acciones secundarias
   * que siguen siendo un botón "sólido" (ej. navegación). `ghost` es la
   * acción terciaria/cancelar de siempre.
   */
  // Esta línea sirve para declarar la propiedad «variant» con el valor o tipo «'primary' | 'accent2' | 'neutral' | 'ghost'».
  variant?: 'primary' | 'accent2' | 'neutral' | 'ghost';
}

// Esta línea sirve para declarar «PRESS_SPRING» con el valor «{ damping: 16, stiffness: 320 }».
const PRESS_SPRING = { damping: 16, stiffness: 320 };

// Esta línea sirve para declarar la función «PrimaryButton».
export function PrimaryButton({
  // Esta línea sirve para incluir el valor «label» en la lista.
  label,
  // Esta línea sirve para incluir el valor «loading» en la lista.
  loading,
  // Esta línea sirve para incluir el valor «icon» en la lista.
  icon,
  // Esta línea sirve para incluir el valor «variant» en la lista.
  variant = 'primary',
  // Esta línea sirve para incluir el valor «style» en la lista.
  style,
  // Esta línea sirve para incluir el valor «disabled» en la lista.
  disabled,
  // Esta línea sirve para incluir el valor «onPressIn» en la lista.
  onPressIn,
  // Esta línea sirve para incluir el valor «onPressOut» en la lista.
  onPressOut,
  // Esta línea sirve para copiar las propiedades de «props».
  ...props
// Esta línea sirve para cerrar los parámetros con el tipo «PrimaryButtonProps» y abrir el cuerpo.
}: PrimaryButtonProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «scale» con el hook «useSharedValue».
  const scale = useSharedValue(1);
  // Esta línea sirve para extraer «sGhos» de «variant === 'ghost'».
  const isGhost = variant === 'ghost';
  // Esta línea sirve para extraer «sNeutra» de «variant === 'neutral'».
  const isNeutral = variant === 'neutral';
  // Esta línea sirve para extraer «sAccent» de «variant === 'accent2'».
  const isAccent2 = variant === 'accent2';
  // Esta línea sirve para extraer «sSoli» de «!isGhost && !isNeutral».
  const isSolid = !isGhost && !isNeutral;
  // Esta línea sirve para extraer «abelColo» de «isGhost ? theme.accent : isNeutral ? the».
  const labelColor = isGhost ? theme.accent : isNeutral ? theme.text : '#050505';
  // Esta línea sirve para extraer «lowColo» de «isAccent2 ? theme.accentSecondary : them».
  const glowColor = isAccent2 ? theme.accentSecondary : theme.accent;

  // Esta línea sirve para obtener «animatedStyle» con el hook «useAnimatedStyle».
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Esta línea sirve para extraer «andlePressI» de «(e: GestureResponderEvent) => {».
  const handlePressIn = (e: GestureResponderEvent) => {
    // react-hooks/immutability no conoce el contrato de Reanimated: asignar
    // .value de un SharedValue es la API pública sancionada para animar en
    // el hilo de UI, no un estado de React (vive fuera del ciclo de
    // render/reconciliación a propósito). Falso positivo documentado.
    // Esta línea sirve para asignar «withSpring(0.97, PRESS_SPRING)» a «scale.value».
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(0.97, PRESS_SPRING);
    // Esta línea sirve para avisar al padre cuando se presiona el botón.
    onPressIn?.(e);
  };
  // Esta línea sirve para extraer «andlePressOu» de «(e: GestureResponderEvent) => {».
  const handlePressOut = (e: GestureResponderEvent) => {
    // Esta línea sirve para asignar «withSpring(1, PRESS_SPRING)» a «scale.value».
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(1, PRESS_SPRING);
    // Esta línea sirve para avisar al padre cuando se suelta el botón.
    onPressOut?.(e);
  };

  // Esta línea sirve para extraer «onten» de «loading ? (».
  const content = loading ? (
    // Esta línea sirve para abrir el componente «ActivityIndicator».
    <ActivityIndicator color={labelColor} />
  // Esta línea sirve para mostrar el bloque alternativo.
  ) : (
    // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
    <>
      {/* Esta línea sirve para mostrar el elemento solo si «icon». */}
      {icon && <Icon icon={icon} size={16} color={labelColor} />}
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="smallBold" style={[styles.label, { color: labelColor }]}>
        {/* Esta línea sirve para mostrar el valor «label». */}
        {label}
      </ThemedText>
    </>
  );

  // Esta línea sirve para revisar si «isSolid».
  if (isSolid) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «Animated.View».
      <Animated.View style={[animatedStyle, (disabled || loading) && styles.disabled]}>
        {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
        <Pressable
          // Esta línea sirve para pasar la propiedad «disabled» con el valor «disabled || loading}».
          disabled={disabled || loading}
          // Esta línea sirve para asignar el manejador del evento «onPressIn».
          onPressIn={handlePressIn}
          // Esta línea sirve para asignar el manejador del evento «onPressOut».
          onPressOut={handlePressOut}
          // El `borderRadius` real del botón vive en el `LinearGradient` de
          // abajo (es el que necesita recortar el degradé), pero en web
          // `Pressable` es el elemento que de verdad recibe el foco del
          // teclado (React Native Web lo renderiza como un <div
          // tabindex="0">). Sin un borderRadius acá TAMBIÉN, el navegador
          // no tiene forma de saber que el botón es redondeado y dibuja su
          // anillo de foco por defecto como un rectángulo recto que corta
          // las esquinas — el cuadro visible alrededor de "Comenzar" y de
          // cualquier otro botón sólido (Entrar, Registrar, Crear, etc.).
          // Esta línea sirve para pasar la propiedad «style» con el valor «styles.pressableShape}».
          style={styles.pressableShape}
          // Esta línea sirve para pasar el resto de propiedades al botón.
          {...props}>
          {/* Esta línea sirve para abrir el elemento «LinearGradient» con sus atributos en varias líneas. */}
          <LinearGradient
            // Esta línea sirve para pasar la propiedad «colors» con el valor «[glowColor, `${glowColor}D9`]}».
            colors={[glowColor, `${glowColor}D9`]}
            // Esta línea sirve para pasar la propiedad «start» con el valor «{ x: 0, y: 0 }}».
            start={{ x: 0, y: 0 }}
            // Esta línea sirve para pasar la propiedad «end» con el valor «{ x: 0, y: 1 }}».
            end={{ x: 0, y: 1 }}
            // `backgroundColor` acá no se ve (el gradiente lo tapa) pero es
            // necesario para Android: `elevation` calcula el contorno de la
            // sombra a partir del background+borderRadius del View. Sin un
            // backgroundColor propio, el gradiente se pinta encima de un
            // View "transparente" y Android cae a una sombra RECTANGULAR
            // por fuera de las esquinas redondeadas del botón — el cuadro
            // visible detrás de botones redondeados en varias pantallas.
            // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.base, styles.solid, { backgroundColor».
            style={[styles.base, styles.solid, { backgroundColor: glowColor, shadowColor: glowColor }, style as object]}>
            {/* Esta línea sirve para mostrar el valor «content». */}
            {content}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  // Esta línea sirve para extraer «taticVariantStyl» de «isGhost».
  const staticVariantStyle = isGhost
    // Esta línea sirve para usar el estilo de contorno con el color de acento.
    ? [styles.ghost, { borderColor: theme.accent }]
    // Esta línea sirve para usar el estilo neutro con el fondo de elemento.
    : [styles.neutral, { backgroundColor: theme.backgroundElement, borderColor: theme.border }];

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Animated.View».
    <Animated.View style={animatedStyle}>
      {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
      <Pressable
        // Esta línea sirve para pasar la propiedad «disabled» con el valor «disabled || loading}».
        disabled={disabled || loading}
        // Esta línea sirve para asignar el manejador del evento «onPressIn».
        onPressIn={handlePressIn}
        // Esta línea sirve para asignar el manejador del evento «onPressOut».
        onPressOut={handlePressOut}
        // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.base, staticVariantStyle, (disabled |».
        style={[styles.base, staticVariantStyle, (disabled || loading) && styles.disabled, style as object]}
        // Esta línea sirve para pasar el resto de propiedades al botón.
        {...props}>
        {/* Esta línea sirve para mostrar el valor «content». */}
        {content}
      </Pressable>
    </Animated.View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «pressableShape» con el valor o tipo «{».
  pressableShape: {
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'stretch'».
    alignSelf: 'stretch',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «base» con el valor o tipo «{».
  base: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'stretch'».
    alignSelf: 'stretch',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two + 5».
    paddingVertical: Spacing.two + 5,
    // Esta línea sirve para declarar la propiedad «minHeight» con el valor o tipo «44».
    minHeight: 44,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «solid» con el valor o tipo «{».
  solid: {
    // Esta línea sirve para declarar la propiedad «shadowOffset» con el valor o tipo «{ width: 0, height: 4 }».
    shadowOffset: { width: 0, height: 4 },
    // Esta línea sirve para declarar la propiedad «shadowOpacity» con el valor o tipo «0.45».
    shadowOpacity: 0.45,
    // Esta línea sirve para declarar la propiedad «shadowRadius» con el valor o tipo «12».
    shadowRadius: 12,
    // Esta línea sirve para declarar la propiedad «elevation» con el valor o tipo «6».
    elevation: 6,
  },
  // Esta línea sirve para declarar la propiedad «neutral» con el valor o tipo «{».
  neutral: {
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
  },
  // Esta línea sirve para declarar la propiedad «ghost» con el valor o tipo «{».
  ghost: {
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «{ fontSize: 14, lineHeight: 18 }».
  label: { fontSize: 14, lineHeight: 18 },
  // Esta línea sirve para declarar la propiedad «disabled» con el valor o tipo «{».
  disabled: {
    // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «0.5».
    opacity: 0.5,
  },
});

// Esta línea sirve para importar «useRef, useState» desde «react».
import { useRef, useState } from 'react';
// Esta línea sirve para importar todo el módulo como «ImagePicker» desde «expo-image-picker».
import * as ImagePicker from 'expo-image-picker';
// Esta línea sirve para importar «ImageManipulator, SaveFormat» desde «expo-image-manipulator».
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
// Esta línea sirve para importar «Image» desde «expo-image».
import { Image } from 'expo-image';
// Esta línea sirve para importar «ActivityIndicator, Pressable, StyleSheet» desde «react-native».
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
// Esta línea sirve para importar «ImageOff, Images, Trash2» desde «lucide-react-native».
import { ImageOff, Images, Trash2 } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «BottomSheet» desde «@/components/ui/bottom-sheet».
import { BottomSheet } from '@/components/ui/bottom-sheet';
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/confirm-dialog».
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

/** Tiempo para que el Modal del BottomSheet termine de cerrarse (animación "fade") antes de abrir la galería. */
// Esta línea sirve para declarar «MODAL_DISMISS_MS» con el valor «350».
const MODAL_DISMISS_MS = 350;

/** Detalle técnico al final del mensaje, para que un tester pueda reportar qué falló. */
// Esta línea sirve para declarar la función «errorDetail».
function errorDetail(err: unknown): string {
  // Esta línea sirve para devolver el detalle del error si existe.
  return err instanceof Error && err.message ? ` (detalle: ${err.message})` : '';
}

// Esta línea sirve para declarar la interfaz «PickedAsset».
interface PickedAsset {
  // Esta línea sirve para declarar la propiedad «uri» con el valor o tipo «string».
  uri: string;
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string».
  name: string;
  // Esta línea sirve para declarar la propiedad «mimeType» con el valor o tipo «string | null».
  mimeType: string | null;
}

// Esta línea sirve para declarar la interfaz «AvatarEditSheetProps».
interface AvatarEditSheetProps {
  // Esta línea sirve para declarar la propiedad «visible» con el valor o tipo «boolean».
  visible: boolean;
  // Esta línea sirve para declarar la propiedad «onClose» con el valor o tipo «() => void».
  onClose: () => void;
  // Esta línea sirve para declarar la propiedad «hasAvatar» con el valor o tipo «boolean».
  hasAvatar: boolean;
}

/**
 * Dos etapas: elegir/eliminar (options) y previsualizar antes de subir
 * (preview) — nunca se sube una imagen apenas se selecciona, el usuario
 * confirma primero. Reutiliza BottomSheet/ConfirmDialog/PrimaryButton ya
 * existentes, no inventa un shell nuevo.
 */
// Esta línea sirve para declarar la función «AvatarEditSheet».
export function AvatarEditSheet({ visible, onClose, hasAvatar }: AvatarEditSheetProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «updateAvatar, deleteAvatar, isUploadingAvatar, avatarError, clearError» con el hook «useAuthStore».
  const { updateAvatar, deleteAvatar, isUploadingAvatar, avatarError, clearError } = useAuthStore();

  // Esta línea sirve para crear el estado «pickedAsset» y su función «setPickedAsset».
  const [pickedAsset, setPickedAsset] = useState<PickedAsset | null>(null);
  // Esta línea sirve para crear el estado «confirmingDelete» y su función «setConfirmingDelete».
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  // Esta línea sirve para crear el estado «pickerError» y su función «setPickerError».
  const [pickerError, setPickerError] = useState<string | null>(null);
  // Esta línea sirve para crear el estado «isPicking» y su función «setIsPicking».
  const [isPicking, setIsPicking] = useState(false);

  // Entre "elegir de galería" y que aparezca la previsualización hay un
  // pipeline async de varios pasos (permiso → picker/crop nativo → nuestro
  // propio decode+resize+encode). Sin nada que lo invalide, si el usuario
  // cierra la sheet (o dispara una segunda selección) mientras el primer
  // pick todavía está en vuelo, esa promesa vieja puede resolver DESPUÉS
  // — y como AvatarEditSheet nunca se desmonta (solo se oculta el
  // BottomSheet), su `setPickedAsset` de todos modos se aplica en
  // silencio, pisando o revelando un estado que ya no corresponde al
  // intento actual. Esto es exactamente lo que explica "a veces sí, a
  // veces no": no es que el crop falle, es que un resultado de un intento
  // abandonado llega tarde y pisa al bueno (o aparece cuando ya no se lo
  // espera). Cada llamada a handlePickFromGallery saca su propio número de
  // esta ref; solo la que sigue siendo la más reciente al terminar puede
  // tocar el estado.
  // Esta línea sirve para crear la referencia «pickTokenRef».
  const pickTokenRef = useRef(0);

  // Esta línea sirve para extraer «ese» de «() => {».
  const reset = () => {
    // Esta línea sirve para invalidar cualquier selección de foto que siga en curso.
    pickTokenRef.current += 1; // invalida cualquier pick en vuelo
    // Esta línea sirve para guardar en el estado con «setPickedAsset» el valor «null)…».
    setPickedAsset(null);
    // Esta línea sirve para guardar en el estado con «setConfirmingDelete» el valor «false)…».
    setConfirmingDelete(false);
    // Esta línea sirve para guardar en el estado con «setPickerError» el valor «null)…».
    setPickerError(null);
    // Esta línea sirve para guardar en el estado con «setIsPicking» el valor «false)…».
    setIsPicking(false);
    // Esta línea sirve para llamar a «clearError».
    clearError();
  };

  // Esta línea sirve para extraer «andleClos» de «() => {».
  const handleClose = () => {
    // Esta línea sirve para salir de la función si «isUploadingAvatar».
    if (isUploadingAvatar) return;
    // Esta línea sirve para llamar a «reset».
    reset();
    // Esta línea sirve para llamar a «onClose».
    onClose();
  };

  // Esta línea sirve para extraer «andlePickFromGaller» de «async () => {».
  const handlePickFromGallery = async () => {
    // Esta línea sirve para salir si ya se está eligiendo una foto para evitar dobles toques.
    if (isPicking) return; // evita doble-tap: dos picks concurrentes es la otra mitad de la misma race
    // Esta línea sirve para extraer «yToke» de «++pickTokenRef.current».
    const myToken = ++pickTokenRef.current;
    // Esta línea sirve para extraer «sStal» de «() => myToken !== pickTokenRef.current».
    const isStale = () => myToken !== pickTokenRef.current;

    // Esta línea sirve para guardar en el estado con «setPickerError» el valor «null)…».
    setPickerError(null);
    // Esta línea sirve para guardar en el estado con «setIsPicking» el valor «true)…».
    setIsPicking(true);
    // isPicking oculta el BottomSheet (ver `sheetVisible`). Se espera a que
    // el Modal termine de cerrarse ANTES de abrir la galería: en Android el
    // Modal es un Dialog nativo, y abrir otra Activity encima de él hacía
    // que al volver se disparara su onRequestClose -> handleClose -> reset(),
    // descartando en silencio la foto elegida. Por eso en el APK "eliminar"
    // funcionaba (no abre ninguna Activity) y "cambiar" nunca llegaba a
    // mandar el POST, mientras que en la web andaba perfecto.
    // Esta línea sirve para esperar a que se cierre el modal antes de abrir el selector.
    await new Promise((resolve) => setTimeout(resolve, MODAL_DISMISS_MS));
    // Esta línea sirve para salir de la función si «isStale()».
    if (isStale()) return;

    // Esta línea sirve para esperar «ImagePicker.requestMediaLibraryPermissionsAsync()» y guardar el resultado en «permission».
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // Esta línea sirve para salir de la función si «isStale()».
    if (isStale()) return;
    // Esta línea sirve para revisar si «!permission.granted».
    if (!permission.granted) {
      // Esta línea sirve para llamar a «setPickerError» con los argumentos de las líneas siguientes.
      setPickerError(
        // Esta línea sirve para revisar si se puede volver a pedir el permiso.
        permission.canAskAgain
          // Esta línea sirve para pedir acceso a las fotos.
          ? 'Necesitamos acceso a tus fotos para elegir una imagen.'
          // Esta línea sirve para avisar que el acceso está bloqueado y pedir habilitarlo en los ajustes.
          : 'El acceso a fotos está bloqueado — habilitalo en los ajustes del dispositivo.',
      );
      // Esta línea sirve para guardar en el estado con «setIsPicking» el valor «false)…».
      setIsPicking(false);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // Esta línea sirve para declarar la variable «result» sin valor inicial.
    let result: ImagePicker.ImagePickerResult;
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Sin `allowsEditing`: el recorte nativo abre una segunda Activity
      // (ExpoCropImageActivity, de CanHub Cropper) que era otro punto de
      // falla en Android/MIUI. El recorte cuadrado se hace abajo con
      // ImageManipulator, centrado — igual resultado que la web, que
      // tampoco usa un recortador nativo.
      // Esta línea sirve para asignar «await ImagePicker.launchImageLibraryAsync({» a «result».
      result = await ImagePicker.launchImageLibraryAsync({
        // Esta línea sirve para declarar la propiedad «mediaTypes» con el valor o tipo «['images']».
        mediaTypes: ['images'],
        // Esta línea sirve para declarar la propiedad «quality» con el valor o tipo «1».
        quality: 1,
      });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para revisar si «!isStale()».
      if (!isStale()) {
        // Esta línea sirve para guardar en el estado con «setPickerError» el valor «`No se pudo abrir la galería. Inténtalo nueva…».
        setPickerError(`No se pudo abrir la galería. Inténtalo nuevamente.${errorDetail(err)}`);
        // Esta línea sirve para guardar en el estado con «setIsPicking» el valor «false)…».
        setIsPicking(false);
      }
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para salir de la función si «isStale()».
    if (isStale()) return;

    // Esta línea sirve para revisar si «result.canceled || !result.assets[0]».
    if (result.canceled || !result.assets[0]) {
      // Esta línea sirve para guardar en el estado con «setIsPicking» el valor «false)…».
      setIsPicking(false);
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // Esta línea sirve para extraer «sse» de «result.assets[0]».
    const asset = result.assets[0];

    // El picker puede devolver cualquier formato que soporte la galería del
    // dispositivo (HEIC/HEIF en iPhones, WEBP, GIF, BMP, TIFF, etc.) — el
    // backend solo puede validar un set fijo de formatos de forma segura.
    // Reencodear acá a JPEG garantiza que lo que se sube siempre es un
    // formato que el servidor puede procesar, sin depender de qué mandó el
    // picker ni de que el usuario tenga que "buscar una foto que sí ande".
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // `asset.width`/`asset.height` (los que reporta el picker) "pueden
      // ser 0 si no están disponibles" según la documentación de Expo — en
      // varios OEMs de Android el recorte nativo no informa esa metadata.
      // Confiar en ese valor para decidir si hacía falta redimensionar
      // dejaba pasar sin tocar fotos a resolución completa (varios MB) en
      // esos dispositivos, superando el límite de tamaño del backend — eso
      // explica por qué algunas fotos "sí" y otras "no" se subían. Por eso
      // se decodifica primero (renderAsync) y se usan las dimensiones
      // reales del archivo ya decodificado, que nunca son 0.
      // Esta línea sirve para esperar «ImageManipulator.manipulate(asset.uri).renderAsync» y guardar el resultado en «probe».
      const probe = await ImageManipulator.manipulate(asset.uri).renderAsync();
      // Esta línea sirve para salir de la función si «isStale()».
      if (isStale()) return;

      // Recorte cuadrado centrado (reemplaza al recortador nativo) y, si hace
      // falta, reducción a 512px. Solo se pasa `width` al resize: el recorte
      // ya es 1:1, así que el alto sale igual sin riesgo de estirar.
      // Esta línea sirve para extraer «AX_AVATAR_DIMENSIO» de «512».
      const MAX_AVATAR_DIMENSION = 512;
      // Esta línea sirve para extraer «id» de «Math.min(probe.width, probe.height)».
      const side = Math.min(probe.width, probe.height);
      // Esta línea sirve para extraer «ontex» de «ImageManipulator.manipulate(probe).crop(».
      let context = ImageManipulator.manipulate(probe).crop({
        // Esta línea sirve para declarar la propiedad «originX» con el valor o tipo «Math.floor((probe.width - side) / 2)».
        originX: Math.floor((probe.width - side) / 2),
        // Esta línea sirve para declarar la propiedad «originY» con el valor o tipo «Math.floor((probe.height - side) / 2)».
        originY: Math.floor((probe.height - side) / 2),
        // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «side».
        width: side,
        // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «side».
        height: side,
      });
      // Esta línea sirve para reducir la imagen si supera el tamaño máximo.
      if (side > MAX_AVATAR_DIMENSION) context = context.resize({ width: MAX_AVATAR_DIMENSION });
      // Esta línea sirve para esperar «context.renderAsync()» y guardar el resultado en «rendered».
      const rendered = await context.renderAsync();
      // Esta línea sirve para salir de la función si «isStale()».
      if (isStale()) return;
      // Esta línea sirve para esperar «rendered.saveAsync({ format: SaveFormat.JPEG, comp» y guardar el resultado en «jpeg».
      const jpeg = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.85 });
      // Esta línea sirve para salir de la función si «isStale()».
      if (isStale()) return;

      // Si el manipulador nativo "resuelve" sin tirar excepción pero devuelve
      // un resultado vacío/sin dimensiones, seguir de largo subiría un
      // archivo roto sin que el usuario se entere — mejor cortar acá con un
      // error visible que dejar avanzar algo inválido en silencio.
      // Esta línea sirve para revisar si «!jpeg.uri || !jpeg.width || !jpeg.height».
      if (!jpeg.uri || !jpeg.width || !jpeg.height) {
        // Esta línea sirve para guardar en el estado con «setPickerError» el valor «'No pudimos procesar esa imagen. Probá con ot…».
        setPickerError('No pudimos procesar esa imagen. Probá con otra foto.');
        // Esta línea sirve para guardar en el estado con «setIsPicking» el valor «false)…».
        setIsPicking(false);
        // Esta línea sirve para terminar la función sin devolver nada.
        return;
      }

      // Esta línea sirve para guardar en el estado con «setPickedAsset» el valor «{…».
      setPickedAsset({
        // Esta línea sirve para declarar la propiedad «uri» con el valor o tipo «jpeg.uri».
        uri: jpeg.uri,
        // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «`avatar-${Date.now()}.jpg`».
        name: `avatar-${Date.now()}.jpg`,
        // Esta línea sirve para declarar la propiedad «mimeType» con el valor o tipo «'image/jpeg'».
        mimeType: 'image/jpeg',
      });
      // Esta línea sirve para guardar en el estado con «setIsPicking» el valor «false)…».
      setIsPicking(false);
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para revisar si «!isStale()».
      if (!isStale()) {
        // Esta línea sirve para guardar en el estado con «setPickerError» el valor «`No pudimos procesar esa imagen. Probá con ot…».
        setPickerError(`No pudimos procesar esa imagen. Probá con otra foto.${errorDetail(err)}`);
        // Esta línea sirve para guardar en el estado con «setIsPicking» el valor «false)…».
        setIsPicking(false);
      }
    }
  };

  // Esta línea sirve para extraer «andleConfirmUploa» de «async () => {».
  const handleConfirmUpload = async () => {
    // Esta línea sirve para salir de la función si «!pickedAsset».
    if (!pickedAsset) return;
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «updateAvatar».
      await updateAvatar(pickedAsset);
      // Esta línea sirve para llamar a «reset».
      reset();
      // Esta línea sirve para llamar a «onClose».
      onClose();
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // el error queda expuesto abajo vía avatarError, la foto anterior no se toca
    }
  };

  // Esta línea sirve para extraer «andleConfirmDelet» de «async () => {».
  const handleConfirmDelete = async () => {
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «deleteAvatar».
      await deleteAvatar();
      // Esta línea sirve para llamar a «reset».
      reset();
      // Esta línea sirve para llamar a «onClose».
      onClose();
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // avatarError lo muestra el sheet; la foto anterior sigue intacta
    }
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
    <>
      {/* Esta línea sirve para abrir el componente «BottomSheet». */}
      <BottomSheet visible={visible && !confirmingDelete && !isPicking} onClose={handleClose}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={styles.container}>
          {/* Esta línea sirve para elegir entre dos bloques según «!pickedAsset». */}
          {!pickedAsset ? (
            // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
            <>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.title}>
                {/* Esta línea sirve para mostrar el texto «FOTO DE PERFIL». */}
                FOTO DE PERFIL
              </ThemedText>

              {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
              <Pressable
                // Esta línea sirve para asignar el manejador del evento «onPress».
                onPress={handlePickFromGallery}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «isPicking}».
                disabled={isPicking}
                // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.row, { backgroundColor: theme.backgro».
                style={[styles.row, { backgroundColor: theme.backgroundElement }, isPicking && styles.rowDisabled]}>
                {/* Esta línea sirve para elegir entre dos bloques según «isPicking». */}
                {isPicking ? (
                  // Esta línea sirve para abrir el componente «ActivityIndicator».
                  <ActivityIndicator size="small" color={theme.text} />
                // Esta línea sirve para mostrar el bloque alternativo.
                ) : (
                  // Esta línea sirve para abrir el componente «Icon».
                  <Icon icon={Images} size={20} color={theme.text} />
                )}
                {/* Esta línea sirve para abrir el componente «ThemedText». */}
                <ThemedText type="default" style={styles.rowLabel}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{isPicking ? 'Procesando imagen…' : 'Elegir de galería'}». */}
                  {isPicking ? 'Procesando imagen…' : 'Elegir de galería'}
                </ThemedText>
              </Pressable>

              {/* Esta línea sirve para mostrar el bloque solo si «hasAvatar». */}
              {hasAvatar && (
                // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
                <Pressable
                  // Esta línea sirve para asignar el manejador del evento «onPress».
                  onPress={() => setConfirmingDelete(true)}
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «isPicking}».
                  disabled={isPicking}
                  // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.row, { backgroundColor: theme.backgro».
                  style={[styles.row, { backgroundColor: theme.backgroundElement }]}>
                  {/* Esta línea sirve para abrir el componente «Icon». */}
                  <Icon icon={Trash2} size={20} color={theme.error} />
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="default" style={[styles.rowLabel, { color: theme.error }]}>
                    {/* Esta línea sirve para mostrar el texto «Eliminar foto». */}
                    Eliminar foto
                  </ThemedText>
                </Pressable>
              )}

              {/* Esta línea sirve para mostrar el bloque solo si «(pickerError || avatarError)». */}
              {(pickerError || avatarError) && (
                // Esta línea sirve para abrir el componente «ThemedView».
                <ThemedView style={styles.errorRow}>
                  {/* Esta línea sirve para abrir el componente «Icon». */}
                  <Icon icon={ImageOff} size={16} color={theme.error} />
                  {/* Esta línea sirve para abrir el componente «ThemedText». */}
                  <ThemedText type="small" style={{ color: theme.error }}>
                    {/* Esta línea sirve para mostrar el contenido dinámico «{pickerError ?? avatarError}». */}
                    {pickerError ?? avatarError}
                  </ThemedText>
                </ThemedView>
              )}
            </>
          // Esta línea sirve para mostrar el bloque alternativo.
          ) : (
            // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
            <>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.title}>
                {/* Esta línea sirve para mostrar el texto «PREVISUALIZACIÓN». */}
                PREVISUALIZACIÓN
              </ThemedText>

              {/* Esta línea sirve para abrir el componente «Image». */}
              <Image source={{ uri: pickedAsset.uri }} style={styles.preview} contentFit="cover" />

              {/* Esta línea sirve para mostrar el bloque solo si «avatarError». */}
              {avatarError && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" style={[styles.error, { color: theme.error }]}>
                  {/* Esta línea sirve para mostrar el valor «avatarError». */}
                  {avatarError}
                </ThemedText>
              )}

              {/* Esta línea sirve para abrir el componente «ThemedView». */}
              <ThemedView style={styles.previewActions}>
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.previewActionHalf}>
                  {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                  <PrimaryButton
                    // Esta línea sirve para definir el atributo «label» con el valor «Cancelar».
                    label="Cancelar"
                    // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                    variant="ghost"
                    // Esta línea sirve para pasar la propiedad «disabled» con el valor «isUploadingAvatar}».
                    disabled={isUploadingAvatar}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={() => setPickedAsset(null)}
                  />
                </ThemedView>
                {/* Esta línea sirve para abrir el componente «ThemedView». */}
                <ThemedView style={styles.previewActionHalf}>
                  {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
                  <PrimaryButton
                    // Esta línea sirve para pasar la propiedad «label» con el valor «isUploadingAvatar ? 'Subiendo foto…' : 'Usar ».
                    label={isUploadingAvatar ? 'Subiendo foto…' : 'Usar esta foto'}
                    // Esta línea sirve para pasar la propiedad «loading» con el valor «isUploadingAvatar}».
                    loading={isUploadingAvatar}
                    // Esta línea sirve para asignar el manejador del evento «onPress».
                    onPress={handleConfirmUpload}
                  />
                </ThemedView>
              </ThemedView>
            </>
          )}
        </ThemedView>
      </BottomSheet>

      {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
      <ConfirmDialog
        // Esta línea sirve para pasar la propiedad «visible» con el valor «confirmingDelete}».
        visible={confirmingDelete}
        // Esta línea sirve para definir el atributo «title» con el valor «¿Eliminar tu foto de perfil?».
        title="¿Eliminar tu foto de perfil?"
        // Esta línea sirve para definir el atributo «description».
        description="Vas a volver a mostrar la inicial de tu nombre."
        // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, eliminar».
        confirmLabel="Sí, eliminar"
        // Esta línea sirve para pasar la propiedad «isLoading» con el valor «isUploadingAvatar}».
        isLoading={isUploadingAvatar}
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={handleConfirmDelete}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={() => setConfirmingDelete(false)}
      />
    </>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingBottom» con el valor o tipo «Spacing.four».
    paddingBottom: Spacing.four,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{».
  title: {
    // Esta línea sirve para declarar la propiedad «textAlign» con el valor o tipo «'center'».
    textAlign: 'center',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «1».
    letterSpacing: 1,
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.one».
    marginBottom: Spacing.one,
  },
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.three».
    paddingVertical: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «rowLabel» con el valor o tipo «{».
  rowLabel: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
  },
  // Esta línea sirve para declarar la propiedad «rowDisabled» con el valor o tipo «{».
  rowDisabled: {
    // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «0.6».
    opacity: 0.6,
  },
  // Esta línea sirve para declarar la propiedad «errorRow» con el valor o tipo «{».
  errorRow: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.one».
    paddingHorizontal: Spacing.one,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «preview» con el valor o tipo «{».
  preview: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «160».
    width: 160,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «160».
    height: 160,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «80».
    borderRadius: 80,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'center'».
    alignSelf: 'center',
  },
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «{».
  error: {
    // Esta línea sirve para declarar la propiedad «textAlign» con el valor o tipo «'center'».
    textAlign: 'center',
  },
  // Esta línea sirve para declarar la propiedad «previewActions» con el valor o tipo «{».
  previewActions: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.two».
    marginTop: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «previewActionHalf» con el valor o tipo «{».
  previewActionHalf: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
});

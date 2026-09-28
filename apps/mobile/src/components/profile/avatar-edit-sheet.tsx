import { useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { ImageOff, Images, Trash2 } from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Icon } from '@/components/ui/icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';

/** Tiempo para que el Modal del BottomSheet termine de cerrarse (animación "fade") antes de abrir la galería. */
const MODAL_DISMISS_MS = 350;

/** Detalle técnico al final del mensaje, para que un tester pueda reportar qué falló. */
function errorDetail(err: unknown): string {
  return err instanceof Error && err.message ? ` (detalle: ${err.message})` : '';
}

interface PickedAsset {
  uri: string;
  name: string;
  mimeType: string | null;
}

interface AvatarEditSheetProps {
  visible: boolean;
  onClose: () => void;
  hasAvatar: boolean;
}

/**
 * Dos etapas: elegir/eliminar (options) y previsualizar antes de subir
 * (preview) — nunca se sube una imagen apenas se selecciona, el usuario
 * confirma primero. Reutiliza BottomSheet/ConfirmDialog/PrimaryButton ya
 * existentes, no inventa un shell nuevo.
 */
export function AvatarEditSheet({ visible, onClose, hasAvatar }: AvatarEditSheetProps) {
  const theme = useTheme();
  const { updateAvatar, deleteAvatar, isUploadingAvatar, avatarError, clearError } = useAuthStore();

  const [pickedAsset, setPickedAsset] = useState<PickedAsset | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);
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
  const pickTokenRef = useRef(0);

  const reset = () => {
    pickTokenRef.current += 1; // invalida cualquier pick en vuelo
    setPickedAsset(null);
    setConfirmingDelete(false);
    setPickerError(null);
    setIsPicking(false);
    clearError();
  };

  const handleClose = () => {
    if (isUploadingAvatar) return;
    reset();
    onClose();
  };

  const handlePickFromGallery = async () => {
    if (isPicking) return; // evita doble-tap: dos picks concurrentes es la otra mitad de la misma race
    const myToken = ++pickTokenRef.current;
    const isStale = () => myToken !== pickTokenRef.current;

    setPickerError(null);
    setIsPicking(true);
    // isPicking oculta el BottomSheet (ver `sheetVisible`). Se espera a que
    // el Modal termine de cerrarse ANTES de abrir la galería: en Android el
    // Modal es un Dialog nativo, y abrir otra Activity encima de él hacía
    // que al volver se disparara su onRequestClose -> handleClose -> reset(),
    // descartando en silencio la foto elegida. Por eso en el APK "eliminar"
    // funcionaba (no abre ninguna Activity) y "cambiar" nunca llegaba a
    // mandar el POST, mientras que en la web andaba perfecto.
    await new Promise((resolve) => setTimeout(resolve, MODAL_DISMISS_MS));
    if (isStale()) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (isStale()) return;
    if (!permission.granted) {
      setPickerError(
        permission.canAskAgain
          ? 'Necesitamos acceso a tus fotos para elegir una imagen.'
          : 'El acceso a fotos está bloqueado — habilitalo en los ajustes del dispositivo.',
      );
      setIsPicking(false);
      return;
    }

    let result: ImagePicker.ImagePickerResult;
    try {
      // Sin `allowsEditing`: el recorte nativo abre una segunda Activity
      // (ExpoCropImageActivity, de CanHub Cropper) que era otro punto de
      // falla en Android/MIUI. El recorte cuadrado se hace abajo con
      // ImageManipulator, centrado — igual resultado que la web, que
      // tampoco usa un recortador nativo.
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });
    } catch (err) {
      if (!isStale()) {
        setPickerError(`No se pudo abrir la galería. Inténtalo nuevamente.${errorDetail(err)}`);
        setIsPicking(false);
      }
      return;
    }
    if (isStale()) return;

    if (result.canceled || !result.assets[0]) {
      setIsPicking(false);
      return;
    }

    const asset = result.assets[0];

    // El picker puede devolver cualquier formato que soporte la galería del
    // dispositivo (HEIC/HEIF en iPhones, WEBP, GIF, BMP, TIFF, etc.) — el
    // backend solo puede validar un set fijo de formatos de forma segura.
    // Reencodear acá a JPEG garantiza que lo que se sube siempre es un
    // formato que el servidor puede procesar, sin depender de qué mandó el
    // picker ni de que el usuario tenga que "buscar una foto que sí ande".
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
      const probe = await ImageManipulator.manipulate(asset.uri).renderAsync();
      if (isStale()) return;

      // Recorte cuadrado centrado (reemplaza al recortador nativo) y, si hace
      // falta, reducción a 512px. Solo se pasa `width` al resize: el recorte
      // ya es 1:1, así que el alto sale igual sin riesgo de estirar.
      const MAX_AVATAR_DIMENSION = 512;
      const side = Math.min(probe.width, probe.height);
      let context = ImageManipulator.manipulate(probe).crop({
        originX: Math.floor((probe.width - side) / 2),
        originY: Math.floor((probe.height - side) / 2),
        width: side,
        height: side,
      });
      if (side > MAX_AVATAR_DIMENSION) context = context.resize({ width: MAX_AVATAR_DIMENSION });
      const rendered = await context.renderAsync();
      if (isStale()) return;
      const jpeg = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.85 });
      if (isStale()) return;

      // Si el manipulador nativo "resuelve" sin tirar excepción pero devuelve
      // un resultado vacío/sin dimensiones, seguir de largo subiría un
      // archivo roto sin que el usuario se entere — mejor cortar acá con un
      // error visible que dejar avanzar algo inválido en silencio.
      if (!jpeg.uri || !jpeg.width || !jpeg.height) {
        setPickerError('No pudimos procesar esa imagen. Probá con otra foto.');
        setIsPicking(false);
        return;
      }

      setPickedAsset({
        uri: jpeg.uri,
        name: `avatar-${Date.now()}.jpg`,
        mimeType: 'image/jpeg',
      });
      setIsPicking(false);
    } catch (err) {
      if (!isStale()) {
        setPickerError(`No pudimos procesar esa imagen. Probá con otra foto.${errorDetail(err)}`);
        setIsPicking(false);
      }
    }
  };

  const handleConfirmUpload = async () => {
    if (!pickedAsset) return;
    try {
      await updateAvatar(pickedAsset);
      reset();
      onClose();
    } catch {
      // el error queda expuesto abajo vía avatarError, la foto anterior no se toca
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAvatar();
      reset();
      onClose();
    } catch {
      // avatarError lo muestra el sheet; la foto anterior sigue intacta
    }
  };

  return (
    <>
      <BottomSheet visible={visible && !confirmingDelete && !isPicking} onClose={handleClose}>
        <ThemedView style={styles.container}>
          {!pickedAsset ? (
            <>
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.title}>
                FOTO DE PERFIL
              </ThemedText>

              <Pressable
                onPress={handlePickFromGallery}
                disabled={isPicking}
                style={[styles.row, { backgroundColor: theme.backgroundElement }, isPicking && styles.rowDisabled]}>
                {isPicking ? (
                  <ActivityIndicator size="small" color={theme.text} />
                ) : (
                  <Icon icon={Images} size={20} color={theme.text} />
                )}
                <ThemedText type="default" style={styles.rowLabel}>
                  {isPicking ? 'Procesando imagen…' : 'Elegir de galería'}
                </ThemedText>
              </Pressable>

              {hasAvatar && (
                <Pressable
                  onPress={() => setConfirmingDelete(true)}
                  disabled={isPicking}
                  style={[styles.row, { backgroundColor: theme.backgroundElement }]}>
                  <Icon icon={Trash2} size={20} color={theme.error} />
                  <ThemedText type="default" style={[styles.rowLabel, { color: theme.error }]}>
                    Eliminar foto
                  </ThemedText>
                </Pressable>
              )}

              {(pickerError || avatarError) && (
                <ThemedView style={styles.errorRow}>
                  <Icon icon={ImageOff} size={16} color={theme.error} />
                  <ThemedText type="small" style={{ color: theme.error }}>
                    {pickerError ?? avatarError}
                  </ThemedText>
                </ThemedView>
              )}
            </>
          ) : (
            <>
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.title}>
                PREVISUALIZACIÓN
              </ThemedText>

              <Image source={{ uri: pickedAsset.uri }} style={styles.preview} contentFit="cover" />

              {avatarError && (
                <ThemedText type="small" style={[styles.error, { color: theme.error }]}>
                  {avatarError}
                </ThemedText>
              )}

              <ThemedView style={styles.previewActions}>
                <ThemedView style={styles.previewActionHalf}>
                  <PrimaryButton
                    label="Cancelar"
                    variant="ghost"
                    disabled={isUploadingAvatar}
                    onPress={() => setPickedAsset(null)}
                  />
                </ThemedView>
                <ThemedView style={styles.previewActionHalf}>
                  <PrimaryButton
                    label={isUploadingAvatar ? 'Subiendo foto…' : 'Usar esta foto'}
                    loading={isUploadingAvatar}
                    onPress={handleConfirmUpload}
                  />
                </ThemedView>
              </ThemedView>
            </>
          )}
        </ThemedView>
      </BottomSheet>

      <ConfirmDialog
        visible={confirmingDelete}
        title="¿Eliminar tu foto de perfil?"
        description="Vas a volver a mostrar la inicial de tu nombre."
        confirmLabel="Sí, eliminar"
        isLoading={isUploadingAvatar}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  rowLabel: {
    flex: 1,
  },
  rowDisabled: {
    opacity: 0.6,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
    backgroundColor: 'transparent',
  },
  preview: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: 'center',
  },
  error: {
    textAlign: 'center',
  },
  previewActions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.two,
    backgroundColor: 'transparent',
  },
  previewActionHalf: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';
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

  const reset = () => {
    setPickedAsset(null);
    setConfirmingDelete(false);
    setPickerError(null);
    clearError();
  };

  const handleClose = () => {
    if (isUploadingAvatar) return;
    reset();
    onClose();
  };

  const handlePickFromGallery = async () => {
    setPickerError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setPickerError(
        permission.canAskAgain
          ? 'Necesitamos acceso a tus fotos para elegir una imagen.'
          : 'El acceso a fotos está bloqueado — habilitalo en los ajustes del dispositivo.',
      );
      return;
    }

    let result: ImagePicker.ImagePickerResult;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    } catch {
      setPickerError('No se pudo abrir la galería. Inténtalo nuevamente.');
      return;
    }

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setPickedAsset({
      uri: asset.uri,
      name: asset.fileName ?? `avatar-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
    });
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
      <BottomSheet visible={visible && !confirmingDelete} onClose={handleClose}>
        <ThemedView style={styles.container}>
          {!pickedAsset ? (
            <>
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.title}>
                FOTO DE PERFIL
              </ThemedText>

              <Pressable
                onPress={handlePickFromGallery}
                style={[styles.row, { backgroundColor: theme.backgroundElement }]}>
                <Icon icon={Images} size={20} color={theme.text} />
                <ThemedText type="default" style={styles.rowLabel}>
                  Elegir de galería
                </ThemedText>
              </Pressable>

              {hasAvatar && (
                <Pressable
                  onPress={() => setConfirmingDelete(true)}
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

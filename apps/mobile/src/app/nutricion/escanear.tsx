import { useState } from 'react';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { FoodItem } from '@sanken/core';

import { LogMealForm } from '@/components/nutrition/log-meal-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useNutritionStore } from '@/store/nutrition-store';

export default function EscanearCodigoScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const findByBarcode = useNutritionStore((s) => s.findByBarcode);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [foundFood, setFoundFood] = useState<FoodItem | null>(null);

  const handleScanned = async (result: BarcodeScanningResult) => {
    if (isLookingUp || foundFood || notFound) return;
    setIsLookingUp(true);
    try {
      const food = await findByBarcode(result.data);
      if (food) {
        setFoundFood(food);
      } else {
        setNotFound(true);
      }
    } finally {
      setIsLookingUp(false);
    }
  };

  const reset = () => {
    setFoundFood(null);
    setNotFound(false);
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          <ThemedText type="title" style={styles.pageTitle}>
            Escanear código
          </ThemedText>

          {!permission && (
            <ThemedText type="small" themeColor="textSecondary">
              Verificando permiso de cámara…
            </ThemedText>
          )}

          {permission && !permission.granted && (
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="small" themeColor="textSecondary">
                Necesitamos acceso a la cámara para escanear el código de barras del producto.
              </ThemedText>
              <PrimaryButton label="Dar permiso" onPress={requestPermission} />
            </ThemedView>
          )}

          {permission?.granted && !foundFood && !notFound && (
            <ThemedView style={styles.cameraWrapper}>
              <CameraView
                style={styles.camera}
                barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
                onBarcodeScanned={handleScanned}
              />
              {isLookingUp && (
                <ThemedText type="small" themeColor="textSecondary">
                  Buscando producto…
                </ThemedText>
              )}
            </ThemedView>
          )}

          {notFound && (
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="small" themeColor="textSecondary">
                No encontramos ese producto. Podés intentar buscarlo por nombre.
              </ThemedText>
              <PrimaryButton label="Escanear de nuevo" variant="ghost" onPress={reset} />
              <PrimaryButton label="Buscar por nombre" onPress={() => router.replace('/nutricion/buscar')} />
            </ThemedView>
          )}

          {foundFood && <LogMealForm food={foundFood} onLogged={() => router.back()} />}

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
  pageTitle: { fontSize: 28, lineHeight: 34 },
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  cameraWrapper: { gap: Spacing.two },
  camera: { width: '100%', aspectRatio: 3 / 4, borderRadius: Spacing.three, overflow: 'hidden' },
});

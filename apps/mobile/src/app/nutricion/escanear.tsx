// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «router» desde «expo-router».
import { router } from 'expo-router';
// Esta línea sirve para importar «CameraView, useCameraPermissions, type BarcodeScanningResult» desde «expo-camera».
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
// Esta línea sirve para importar «ScrollView, StyleSheet» desde «react-native».
import { ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar los tipos «FoodItem» desde «@sanken/core».
import type { FoodItem } from '@sanken/core';

// Esta línea sirve para importar «LogMealForm» desde «@/components/nutrition/log-meal-form».
import { LogMealForm } from '@/components/nutrition/log-meal-form';
// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «BottomTabInset, MaxContentWidth, Spacing» desde «@/constants/theme».
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useNutritionStore» desde «@/store/nutrition-store».
import { useNutritionStore } from '@/store/nutrition-store';

// Esta línea sirve para declarar la función «EscanearCodigoScreen».
export default function EscanearCodigoScreen() {
  // Esta línea sirve para extraer «permission, requestPermission» de «useCameraPermissions()».
  const [permission, requestPermission] = useCameraPermissions();
  // Esta línea sirve para obtener «findByBarcode» con el hook «useNutritionStore».
  const findByBarcode = useNutritionStore((s) => s.findByBarcode);
  // Esta línea sirve para crear el estado «isLookingUp» y su función «setIsLookingUp».
  const [isLookingUp, setIsLookingUp] = useState(false);
  // Esta línea sirve para crear el estado «notFound» y su función «setNotFound».
  const [notFound, setNotFound] = useState(false);
  // Esta línea sirve para crear el estado «foundFood» y su función «setFoundFood».
  const [foundFood, setFoundFood] = useState<FoodItem | null>(null);

  // Esta línea sirve para extraer «andleScanne» de «async (result: BarcodeScanningResult) =>».
  const handleScanned = async (result: BarcodeScanningResult) => {
    // Esta línea sirve para salir de la función si «isLookingUp || foundFood || notFound».
    if (isLookingUp || foundFood || notFound) return;
    // Esta línea sirve para guardar en el estado con «setIsLookingUp» el valor «true)…».
    setIsLookingUp(true);
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «findByBarcode(result.data)» y guardar el resultado en «food».
      const food = await findByBarcode(result.data);
      // Esta línea sirve para revisar si «food».
      if (food) {
        // Esta línea sirve para guardar en el estado con «setFoundFood» el valor «food)…».
        setFoundFood(food);
      // Esta línea sirve para ejecutar este bloque en el caso contrario.
      } else {
        // Esta línea sirve para guardar en el estado con «setNotFound» el valor «true)…».
        setNotFound(true);
      }
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsLookingUp» el valor «false)…».
      setIsLookingUp(false);
    }
  };

  // Esta línea sirve para extraer «ese» de «() => {».
  const reset = () => {
    // Esta línea sirve para guardar en el estado con «setFoundFood» el valor «null)…».
    setFoundFood(null);
    // Esta línea sirve para guardar en el estado con «setNotFound» el valor «false)…».
    setNotFound(false);
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ScrollView». */}
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}>
          {/* Esta línea sirve para abrir el componente «ThemedText». */}
          <ThemedText type="title" style={styles.pageTitle}>
            {/* Esta línea sirve para mostrar el texto «Escanear código». */}
            Escanear código
          </ThemedText>

          {/* Esta línea sirve para mostrar el bloque solo si «!permission». */}
          {!permission && (
            // Esta línea sirve para abrir el componente «ThemedText».
            <ThemedText type="small" themeColor="textSecondary">
              {/* Esta línea sirve para mostrar el texto «Verificando permiso de cámara…». */}
              Verificando permiso de cámara…
            </ThemedText>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «permission && !permission.granted». */}
          {permission && !permission.granted && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para explicar que se necesita la cámara para escanear el código de barras. */}
                Necesitamos acceso a la cámara para escanear el código de barras del producto.
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
              <PrimaryButton label="Dar permiso" onPress={requestPermission} />
            </ThemedView>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «permission?.granted && !foundFood && !notFound». */}
          {permission?.granted && !foundFood && !notFound && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView style={styles.cameraWrapper}>
              {/* Esta línea sirve para abrir el elemento «CameraView» con sus atributos en varias líneas. */}
              <CameraView
                // Esta línea sirve para pasar la propiedad «style» con el valor «styles.camera}».
                style={styles.camera}
                // Esta línea sirve para pasar la propiedad «barcodeScannerSettings» con el valor «{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'u».
                barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
                // Esta línea sirve para asignar el manejador del evento «onBarcodeScanned».
                onBarcodeScanned={handleScanned}
              />
              {/* Esta línea sirve para mostrar el bloque solo si «isLookingUp». */}
              {isLookingUp && (
                // Esta línea sirve para abrir el componente «ThemedText».
                <ThemedText type="small" themeColor="textSecondary">
                  {/* Esta línea sirve para mostrar el texto «Buscando producto…». */}
                  Buscando producto…
                </ThemedText>
              )}
            </ThemedView>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «notFound». */}
          {notFound && (
            // Esta línea sirve para abrir el componente «ThemedView».
            <ThemedView type="backgroundElement" style={styles.card}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="small" themeColor="textSecondary">
                {/* Esta línea sirve para avisar que no se encontró el producto y sugerir buscarlo por nombre. */}
                No encontramos ese producto. Podés intentar buscarlo por nombre.
              </ThemedText>
              {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
              <PrimaryButton label="Escanear de nuevo" variant="ghost" onPress={reset} />
              {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
              <PrimaryButton label="Buscar por nombre" onPress={() => router.replace('/nutricion/buscar')} />
            </ThemedView>
          )}

          {/* Esta línea sirve para mostrar el elemento solo si «foundFood». */}
          {foundFood && <LogMealForm food={foundFood} onLogged={() => router.back()} />}

          {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
          <PrimaryButton label="Volver" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{ flex: 1 }».
  root: { flex: 1 },
  // Esta línea sirve para definir el estilo «safeArea» con «flex: 1, alignItems: 'center', width: '100%' },…».
  safeArea: { flex: 1, alignItems: 'center', width: '100%' },
  // Esta línea sirve para declarar la propiedad «scrollView» con el valor o tipo «{ alignSelf: 'stretch' }».
  scrollView: { alignSelf: 'stretch' },
  // Esta línea sirve para declarar la propiedad «content» con el valor o tipo «{».
  content: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingTop» con el valor o tipo «Spacing.three».
    paddingTop: Spacing.three,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «pageTitle» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  pageTitle: { fontSize: 24, lineHeight: 30 },
  // Esta línea sirve para definir el estilo «card» con «borderRadius: Spacing.four, padding: Spacing.three…».
  card: { borderRadius: Spacing.four, padding: Spacing.three, gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «cameraWrapper» con el valor o tipo «{ gap: Spacing.two }».
  cameraWrapper: { gap: Spacing.two },
  // Esta línea sirve para definir el estilo «camera» con «width: '100%', aspectRatio: 3 / 4, borderRadius: S…».
  camera: { width: '100%', aspectRatio: 3 / 4, borderRadius: Spacing.three, overflow: 'hidden' },
});

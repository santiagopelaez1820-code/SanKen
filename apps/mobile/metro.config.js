const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// `barcode-detector` (pulled in by expo-camera's web barcode scanner) ships
// an `exports`/`module` field Metro can't resolve on this SDK — see
// https://github.com/expo/expo/discussions/36551. Falling back to `main`
// (CJS) resolution fixes it without affecting other packages, which all
// resolved fine before expo-camera was added.
config.resolver.unstable_enablePackageExports = false;

// El SDK de Firebase (firebase/auth) para React Native se resuelve como
// .cjs — sin esto, Metro puede fallar en resolverlo correctamente en el
// bundle nativo (aunque funcione en web), causando errores en tiempo de
// arranque como "Component auth has not been registered yet".
config.resolver.sourceExts.push('cjs');

module.exports = config;

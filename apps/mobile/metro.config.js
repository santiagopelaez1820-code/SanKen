const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// `barcode-detector` (pulled in by expo-camera's web barcode scanner) ships
// an `exports`/`module` field Metro can't resolve on this SDK — see
// https://github.com/expo/expo/discussions/36551. Falling back to `main`
// (CJS) resolution fixes it without affecting other packages, which all
// resolved fine before expo-camera was added.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;

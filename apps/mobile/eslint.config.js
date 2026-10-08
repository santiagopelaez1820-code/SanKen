// https://docs.expo.dev/guides/using-eslint/
// Esta línea sirve para extraer «defineConfig» de «require('eslint/config')».
const { defineConfig } = require('eslint/config');
// Esta línea sirve para declarar «expoConfig» con el valor «require("eslint-config-expo/flat")».
const expoConfig = require("eslint-config-expo/flat");

// Esta línea sirve para asignar «defineConfig([» a «module.exports».
module.exports = defineConfig([
  // Esta línea sirve para incluir el valor «expoConfig» en la lista.
  expoConfig,
  {
    // Esta línea sirve para declarar la propiedad «ignores» con el valor o tipo «["dist/*"]».
    ignores: ["dist/*"],
  }
]);

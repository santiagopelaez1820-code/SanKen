// Permite el import de efecto lateral `import '@/global.css'` en constants/theme.ts.
// Sin esto, tsc solo type-checkea bien si `expo-env.d.ts` está presente -- pero ese
// archivo está en .gitignore (lo regenera Expo CLI localmente), así que un checkout
// limpio de CI nunca lo tiene y el type-check falla. Este .d.ts sí está versionado.
declare module '*.css';

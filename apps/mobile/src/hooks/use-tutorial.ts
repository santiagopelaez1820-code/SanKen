// Esta línea sirve para importar «useEffect, useRef, useState» desde «react».
import { useEffect, useRef, useState } from 'react';
// Esta línea sirve para importar los tipos «View» desde «react-native».
import type { View } from 'react-native';

// Esta línea sirve para importar «tutorialStorage» desde «@/lib/tutorial-storage».
import { tutorialStorage } from '@/lib/tutorial-storage';

// Esta línea sirve para declarar la interfaz «TutorialStep».
export interface TutorialStep {
  /** Ref del elemento a resaltar. Si es null/no está montado, el paso se muestra como tarjeta centrada sin recorte (útil para pantallas con contenido condicional). */
  // Esta línea sirve para declarar la propiedad «ref» con el valor o tipo «React.RefObject<View | null>».
  ref?: React.RefObject<View | null>;
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «string».
  title: string;
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «string».
  description: string;
}

/**
 * Arranca automáticamente (una sola vez por usuario+sección, ver
 * tutorial-storage) la primera vez que `ready` es true, hay un `userId`
 * conocido, y ese usuario no lo vio antes. `ready` deja que la pantalla
 * espere a tener datos/refs montados antes de abrir el spotlight — abrirlo
 * antes apuntaría a elementos que todavía no existen.
 */
// Esta línea sirve para declarar la función «useTutorial».
export function useTutorial(
  // Esta línea sirve para declarar la propiedad «section» con el valor o tipo «string».
  section: string,
  // Esta línea sirve para declarar la propiedad «steps» con el valor o tipo «TutorialStep[]».
  steps: TutorialStep[],
  // Esta línea sirve para declarar la propiedad «ready» con el valor o tipo «boolean = true».
  ready: boolean = true,
  // Esta línea sirve para declarar la propiedad «userId» con el valor o tipo «number | string | null | undefined».
  userId: number | string | null | undefined,
// Esta línea sirve para cerrar los parámetros del hook.
) {
  // Esta línea sirve para extraer «isOpen, setIsOpen» de «useState(false)».
  const [isOpen, setIsOpen] = useState(false);
  // Esta línea sirve para extraer «stepIndex, setStepIndex» de «useState(0)».
  const [stepIndex, setStepIndex] = useState(0);
  // Esta línea sirve para extraer «heckedRe» de «useRef(false)».
  const checkedRef = useRef(false);

  // Esta línea sirve para llamar a «useEffect» con una función.
  useEffect(() => {
    // Esta línea sirve para salir si la pantalla no está lista, no hay usuario, no hay pasos o ya se revisó.
    if (!ready || !userId || steps.length === 0 || checkedRef.current) return;
    // Esta línea sirve para asignar «true» a «checkedRef.current».
    checkedRef.current = true;
    // Esta línea sirve para extraer «ancelle» de «false».
    let cancelled = false;

    // Esta línea sirve para consultar si el usuario ya vio el tutorial de la sección.
    tutorialStorage.hasSeen(userId, section).then((seen) => {
      // Esta línea sirve para salir de la función si «seen || cancelled».
      if (seen || cancelled) return;
      // Esta línea sirve para llamar a «setTimeout» con una función.
      setTimeout(() => {
        // Esta línea sirve para llamar a «setIsOpen» si «!cancelled».
        if (!cancelled) setIsOpen(true);
      // Esta línea sirve para volver a ejecutar el efecto cuando cambian «0».
      }, 500);
    });

    // Esta línea sirve para devolver «() => {».
    return () => {
      // Esta línea sirve para asignar «true» a «cancelled».
      cancelled = true;
    };
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «ready, userId, section, steps.length».
  }, [ready, userId, section, steps.length]);

  // Esta línea sirve para extraer «inis» de «() => {».
  const finish = () => {
    // Esta línea sirve para llamar a «tutorialStorage.markSeen» si «userId».
    if (userId) tutorialStorage.markSeen(userId, section);
    // Esta línea sirve para guardar en el estado con «setIsOpen» el valor «false)…».
    setIsOpen(false);
    // Esta línea sirve para guardar en el estado con «setStepIndex» el valor «0)…».
    setStepIndex(0);
  };

  // Esta línea sirve para extraer «ex» de «() => {».
  const next = () => {
    // Esta línea sirve para revisar si «stepIndex >= steps.length - 1».
    if (stepIndex >= steps.length - 1) {
      // Esta línea sirve para llamar a «finish».
      finish();
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }
    // Esta línea sirve para guardar en el estado con «setStepIndex» el valor «(i) => i + 1)…».
    setStepIndex((i) => i + 1);
  };

  // Esta línea sirve para extraer «re» de «() => setStepIndex((i) => Math.max(0, i ».
  const prev = () => setStepIndex((i) => Math.max(0, i - 1));

  // Esta línea sirve para devolver el estado y las acciones del tutorial.
  return { isOpen, stepIndex, steps, next, prev, skip: finish };
}

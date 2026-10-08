// Esta línea sirve para importar «SpotlightOverlay» desde «@/components/tutorial/spotlight-overlay».
import { SpotlightOverlay } from '@/components/tutorial/spotlight-overlay';
// Esta línea sirve para importar los tipos «useTutorial» desde «@/hooks/use-tutorial».
import type { useTutorial } from '@/hooks/use-tutorial';

/** Envoltorio fino para no repetir el cableado de useTutorial -> SpotlightOverlay en cada pantalla. */
// Esta línea sirve para declarar la función «TutorialOverlay».
export function TutorialOverlay({ tutorial }: { tutorial: ReturnType<typeof useTutorial> }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «SpotlightOverlay» con sus atributos en varias líneas.
    <SpotlightOverlay
      // Esta línea sirve para pasar la propiedad «visible» con el valor «tutorial.isOpen}».
      visible={tutorial.isOpen}
      // Esta línea sirve para pasar la propiedad «steps» con el valor «tutorial.steps}».
      steps={tutorial.steps}
      // Esta línea sirve para pasar la propiedad «stepIndex» con el valor «tutorial.stepIndex}».
      stepIndex={tutorial.stepIndex}
      // Esta línea sirve para asignar el manejador del evento «onNext».
      onNext={tutorial.next}
      // Esta línea sirve para asignar el manejador del evento «onPrev».
      onPrev={tutorial.prev}
      // Esta línea sirve para asignar el manejador del evento «onSkip».
      onSkip={tutorial.skip}
    />
  );
}

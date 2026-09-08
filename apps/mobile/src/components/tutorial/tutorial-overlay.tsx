import { SpotlightOverlay } from '@/components/tutorial/spotlight-overlay';
import type { useTutorial } from '@/hooks/use-tutorial';

/** Envoltorio fino para no repetir el cableado de useTutorial -> SpotlightOverlay en cada pantalla. */
export function TutorialOverlay({ tutorial }: { tutorial: ReturnType<typeof useTutorial> }) {
  return (
    <SpotlightOverlay
      visible={tutorial.isOpen}
      steps={tutorial.steps}
      stepIndex={tutorial.stepIndex}
      onNext={tutorial.next}
      onPrev={tutorial.prev}
      onSkip={tutorial.skip}
    />
  );
}

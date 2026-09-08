import { SpotlightOverlay } from "@/components/tutorial/SpotlightOverlay"
import type { useTutorial } from "@/hooks/use-tutorial"

/** Envoltorio fino para no repetir el cableado de useTutorial -> SpotlightOverlay en cada página. */
export function TutorialOverlay({ tutorial }: { tutorial: ReturnType<typeof useTutorial> }) {
  if (!tutorial.isOpen) return null

  return (
    <SpotlightOverlay
      steps={tutorial.steps}
      stepIndex={tutorial.stepIndex}
      onNext={tutorial.next}
      onPrev={tutorial.prev}
      onSkip={tutorial.skip}
    />
  )
}

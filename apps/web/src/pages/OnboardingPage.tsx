import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useNavigate } from "react-router-dom"
import type {
  FitnessGoal,
  FitnessLevel,
  FrequencyDays,
  OnboardingAnswers,
  OnboardingQuestions,
  OnboardingState,
} from "@sanken/core"
import { ApiError } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const LEVEL_LABELS: Record<FitnessLevel, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
}

const GOAL_LABELS: Record<FitnessGoal, string> = {
  gain_muscle: "Ganar músculo",
  lose_fat: "Perder grasa",
  body_recomposition: "Recomposición corporal",
  strength: "Fuerza",
  endurance: "Resistencia",
  sport_performance: "Rendimiento deportivo",
  health: "Salud",
  cardio: "Cardio",
}

type StepId = "age" | "sex" | "height" | "weight" | "level" | "goals" | "frequency"

/**
 * La ubicación (país/departamento/ciudad) se pide en una pantalla separada
 * después de completar este wizard (ver /ubicacion, LocationSurveyPage) —
 * no acá. Antes este wizard también tenía esos pasos y terminaba pidiendo
 * la ubicación dos veces (una vez en el wizard, otra en /ubicacion, porque
 * setOnboardingCompleted() nunca sincronizaba has_location localmente).
 *
 * Tampoco pregunta por equipamiento disponible: el generador de rutinas
 * activo (TemplateRoutineGenerator) no usa esa respuesta.
 */
const STEP_ORDER: StepId[] = ["age", "sex", "height", "weight", "level", "goals", "frequency"]

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export function OnboardingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const setOnboardingCompleted = useAuthStore((state) => state.setOnboardingCompleted)

  const {
    data: questions,
    isLoading,
    isError: questionsFailed,
    refetch: retryQuestions,
  } = useQuery({
    queryKey: ["onboarding", "questions"],
    queryFn: () => api.get<OnboardingQuestions>("/onboarding/questions"),
  })

  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<OnboardingAnswers>({})
  const [ageInput, setAgeInput] = useState("")
  const [heightInput, setHeightInput] = useState("")
  const [weightInput, setWeightInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const step = STEP_ORDER[stepIndex]

  if (!user) return <Navigate to="/login" replace />
  if (user.onboarding_completed) return <Navigate to="/dashboard" replace />

  const setAnswer = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const toggleGoal = (value: FitnessGoal) => {
    const current = answers.goals ?? []
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    setAnswer("goals", next)
  }

  if (questionsFailed) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4 text-center text-foreground">
        <p className="text-sm text-muted-foreground">
          No pudimos cargar el cuestionario. Si tu sesión expiró, iniciá sesión de nuevo.
        </p>
        <div className="flex gap-2">
          <Button onClick={() => retryQuestions()}>Reintentar</Button>
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Ir al login
          </Button>
        </div>
      </main>
    )
  }

  if (isLoading || !questions) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background text-foreground">
        <Skeleton className="h-20 w-full" />
      </main>
    )
  }

  const canContinue = (): boolean => {
    switch (step) {
      case "age":
        return ageInput.trim().length > 0
      case "sex":
        return !!answers.sex
      case "height":
        return heightInput.trim().length > 0
      case "weight":
        return weightInput.trim().length > 0
      case "level":
        return !!answers.level
      case "goals":
        return (answers.goals?.length ?? 0) > 0
      case "frequency":
        return !!answers.frequency_days
    }
  }

  const goBack = () => {
    if (stepIndex === 0) return
    setStepIndex((i) => i - 1)
  }

  const goNext = async () => {
    const isLast = stepIndex === STEP_ORDER.length - 1

    if (!isLast) {
      setStepIndex((i) => i + 1)
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await api.post<OnboardingState>("/onboarding", answers)
      await api.post<OnboardingState>("/onboarding/complete")
      setOnboardingCompleted()
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.body.message : "Faltan respuestas por completar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center bg-background px-6 py-10 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((stepIndex + 1) / STEP_ORDER.length) * 100}%` }}
          />
        </div>

        {step === "age" && (
          <Question title="¿Cuál es tu edad?">
            <input
              type="number"
              inputMode="numeric"
              className={inputClass}
              value={ageInput}
              onChange={(e) => {
                setAgeInput(e.target.value)
                setAnswer("age", Number(e.target.value) || undefined)
              }}
            />
          </Question>
        )}

        {step === "sex" && (
          <Question title="¿Cuál es tu sexo?">
            {(["male", "female"] as const).map((value) => (
              <OptionButton
                key={value}
                label={value === "male" ? "Hombre" : "Mujer"}
                selected={answers.sex === value}
                onClick={() => setAnswer("sex", value)}
              />
            ))}
          </Question>
        )}

        {step === "height" && (
          <Question title="¿Cuál es tu altura?" subtitle="En centímetros">
            <input
              type="number"
              inputMode="decimal"
              className={inputClass}
              value={heightInput}
              onChange={(e) => {
                setHeightInput(e.target.value)
                setAnswer("height_cm", Number(e.target.value) || undefined)
              }}
            />
          </Question>
        )}

        {step === "weight" && (
          <Question title="¿Cuál es tu peso?" subtitle="En kilogramos">
            <input
              type="number"
              inputMode="decimal"
              className={inputClass}
              value={weightInput}
              onChange={(e) => {
                setWeightInput(e.target.value)
                setAnswer("weight_kg", Number(e.target.value) || undefined)
              }}
            />
          </Question>
        )}

        {step === "level" && (
          <Question title="¿Cuál es tu nivel?">
            {questions.levels.map((value) => (
              <OptionButton
                key={value}
                label={LEVEL_LABELS[value]}
                selected={answers.level === value}
                onClick={() => setAnswer("level", value)}
              />
            ))}
          </Question>
        )}

        {step === "goals" && (
          <Question title="¿Cuál es tu objetivo?" subtitle="Puedes elegir más de uno">
            {questions.goals.map((value) => (
              <OptionButton
                key={value}
                label={GOAL_LABELS[value]}
                selected={(answers.goals ?? []).includes(value)}
                onClick={() => toggleGoal(value)}
              />
            ))}
          </Question>
        )}

        {step === "frequency" && (
          <Question title="¿Cuántos días a la semana entrenarás?">
            {questions.frequency_days.map((value) => (
              <OptionButton
                key={value}
                label={`${value} días`}
                selected={answers.frequency_days === value}
                onClick={() => setAnswer("frequency_days", value as FrequencyDays)}
              />
            ))}
          </Question>
        )}

        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={goNext} disabled={!canContinue() || isSubmitting} className="w-full">
            {isSubmitting ? "Generando…" : stepIndex === STEP_ORDER.length - 1 ? "Generar mi plan" : "Continuar"}
          </Button>
          {stepIndex > 0 && (
            <Button variant="ghost" onClick={goBack} className="w-full" disabled={isSubmitting}>
              Atrás
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}

function Question({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-4 flex flex-col gap-2">{children}</div>
    </div>
  )
}

function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background hover:bg-muted",
      )}
    >
      {label}
    </button>
  )
}

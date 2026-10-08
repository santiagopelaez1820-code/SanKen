// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «Navigate, useNavigate» desde «react-router-dom».
import { Navigate, useNavigate } from "react-router-dom"
// Esta línea sirve para abrir la importación de los nombres siguientes.
import type {
  // Esta línea sirve para incluir el valor «FitnessGoal» en la lista.
  FitnessGoal,
  // Esta línea sirve para incluir el valor «FitnessLevel» en la lista.
  FitnessLevel,
  // Esta línea sirve para incluir el valor «FrequencyDays» en la lista.
  FrequencyDays,
  // Esta línea sirve para incluir el valor «OnboardingAnswers» en la lista.
  OnboardingAnswers,
  // Esta línea sirve para incluir el valor «OnboardingQuestions» en la lista.
  OnboardingQuestions,
  // Esta línea sirve para incluir el valor «OnboardingState» en la lista.
  OnboardingState,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «ApiError» en la lista.
  ApiError,
  // Esta línea sirve para incluir el valor «ONBOARDING_AGE_MESSAGES» en la lista.
  ONBOARDING_AGE_MESSAGES,
  // Esta línea sirve para incluir el valor «ONBOARDING_MAX_AGE» en la lista.
  ONBOARDING_MAX_AGE,
  // Esta línea sirve para incluir el valor «ONBOARDING_MIN_AGE» en la lista.
  ONBOARDING_MIN_AGE,
  // Esta línea sirve para incluir el valor «validateOnboardingAge» en la lista.
  validateOnboardingAge,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar «LEVEL_LABELS» con el valor «{».
const LEVEL_LABELS: Record<FitnessLevel, string> = {
  // Esta línea sirve para declarar la propiedad «beginner» con el valor o tipo «"Principiante"».
  beginner: "Principiante",
  // Esta línea sirve para declarar la propiedad «intermediate» con el valor o tipo «"Intermedio"».
  intermediate: "Intermedio",
  // Esta línea sirve para declarar la propiedad «advanced» con el valor o tipo «"Avanzado"».
  advanced: "Avanzado",
}

// Esta línea sirve para declarar «GOAL_LABELS» con el valor «{».
const GOAL_LABELS: Record<FitnessGoal, string> = {
  // Esta línea sirve para declarar la propiedad «gain_muscle» con el valor o tipo «"Ganar músculo"».
  gain_muscle: "Ganar músculo",
  // Esta línea sirve para declarar la propiedad «lose_fat» con el valor o tipo «"Perder grasa"».
  lose_fat: "Perder grasa",
  // Esta línea sirve para declarar la propiedad «body_recomposition» con el valor o tipo «"Recomposición corporal"».
  body_recomposition: "Recomposición corporal",
  // Esta línea sirve para declarar la propiedad «strength» con el valor o tipo «"Fuerza"».
  strength: "Fuerza",
  // Esta línea sirve para declarar la propiedad «endurance» con el valor o tipo «"Resistencia"».
  endurance: "Resistencia",
  // Esta línea sirve para declarar la propiedad «sport_performance» con el valor o tipo «"Rendimiento deportivo"».
  sport_performance: "Rendimiento deportivo",
  // Esta línea sirve para declarar la propiedad «health» con el valor o tipo «"Salud"».
  health: "Salud",
  // Esta línea sirve para declarar la propiedad «cardio» con el valor o tipo «"Cardio"».
  cardio: "Cardio",
}

// Esta línea sirve para declarar los ids de los pasos del cuestionario.
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
// Esta línea sirve para extraer «TEP_ORDER: StepId[» de «["age", "sex", "height", "weight", "leve».
const STEP_ORDER: StepId[] = ["age", "sex", "height", "weight", "level", "goals", "frequency"]

// Esta línea sirve para declarar las clases comunes de los campos.
const inputClass =
  // Esta línea sirve para incluir el texto o las clases «w-full rounded-lg border border-input bg-back…».
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

// Esta línea sirve para declarar la función «OnboardingPage».
export function OnboardingPage() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((state) => state.user)
  // Esta línea sirve para obtener «setOnboardingCompleted» con el hook «useAuthStore».
  const setOnboardingCompleted = useAuthStore((state) => state.setOnboardingCompleted)

  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «questions».
    data: questions,
    // Esta línea sirve para incluir el valor «isLoading» en la lista.
    isLoading,
    // Esta línea sirve para declarar la propiedad «isError» con el valor o tipo «questionsFailed».
    isError: questionsFailed,
    // Esta línea sirve para declarar la propiedad «refetch» con el valor o tipo «retryQuestions».
    refetch: retryQuestions,
  // Esta línea sirve para cerrar la desestructuración con «useQuery({».
  } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["onboarding", "questions"]».
    queryKey: ["onboarding", "questions"],
    // Esta línea sirve para pedir a la API los datos de «/onboarding/questions».
    queryFn: () => api.get<OnboardingQuestions>("/onboarding/questions"),
  })

  // Esta línea sirve para crear el estado «stepIndex» y su función «setStepIndex».
  const [stepIndex, setStepIndex] = useState(0)
  // Esta línea sirve para crear el estado «answers» y su función «setAnswers».
  const [answers, setAnswers] = useState<OnboardingAnswers>({})
  // Esta línea sirve para crear el estado «ageInput» y su función «setAgeInput».
  const [ageInput, setAgeInput] = useState("")
  // Esta línea sirve para crear el estado «ageTouched» y su función «setAgeTouched».
  const [ageTouched, setAgeTouched] = useState(false)
  // Esta línea sirve para crear el estado «heightInput» y su función «setHeightInput».
  const [heightInput, setHeightInput] = useState("")
  // Esta línea sirve para crear el estado «weightInput» y su función «setWeightInput».
  const [weightInput, setWeightInput] = useState("")
  // Esta línea sirve para crear el estado «isSubmitting» y su función «setIsSubmitting».
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Esta línea sirve para crear el estado «error» y su función «setError».
  const [error, setError] = useState<string | null>(null)

  // Esta línea sirve para extraer «te» de «STEP_ORDER[stepIndex]».
  const step = STEP_ORDER[stepIndex]

  // Esta línea sirve para redirigir al login si no hay usuario.
  if (!user) return <Navigate to="/login" replace />
  // Esta línea sirve para redirigir al dashboard si ya completó el onboarding.
  if (user.onboarding_completed) return <Navigate to="/dashboard" replace />

  // Esta línea sirve para extraer «etAnswe» de «<K extends keyof OnboardingAnswers>(key:».
  const setAnswer = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => {
    // Esta línea sirve para guardar en el estado con «setAnswers» el valor «(prev) => ({ ...prev, [key]: value }))…».
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  // Esta línea sirve para extraer «oggleGoa» de «(value: FitnessGoal) => {».
  const toggleGoal = (value: FitnessGoal) => {
    // Esta línea sirve para extraer «urren» de «answers.goals ?? []».
    const current = answers.goals ?? []
    // Esta línea sirve para extraer «ex» de «current.includes(value) ? current.filter».
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    // Esta línea sirve para guardar en el estado con «setAnswer» el valor «"goals", next)…».
    setAnswer("goals", next)
  }

  // Esta línea sirve para revisar si «questionsFailed».
  if (questionsFailed) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «main» con las clases «flex min-h-svh flex-col items-center jus».
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4 text-center text-foreground">
        {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm text-muted-foreground». */}
        <p className="text-sm text-muted-foreground">
          {/* Esta línea sirve para avisar que no se pudo cargar el cuestionario. */}
          No pudimos cargar el cuestionario. Si tu sesión expiró, iniciá sesión de nuevo.
        </p>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «flex gap-2». */}
        <div className="flex gap-2">
          {/* Esta línea sirve para mostrar el texto « retryQuestions()}>Reintentar» dentro de «Button». */}
          <Button onClick={() => retryQuestions()}>Reintentar</Button>
          {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
          <Button variant="ghost" onClick={() => navigate("/login")}>
            {/* Esta línea sirve para mostrar el texto «Ir al login». */}
            Ir al login
          </Button>
        </div>
      </main>
    )
  }

  // Esta línea sirve para revisar si «isLoading || !questions».
  if (isLoading || !questions) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «main» con las clases «flex min-h-svh items-center justify-cent».
      <main className="flex min-h-svh items-center justify-center bg-background text-foreground">
        {/* Esta línea sirve para abrir el componente «Skeleton». */}
        <Skeleton className="h-20 w-full" />
      </main>
    )
  }

  // Esta línea sirve para extraer «geValidatio» de «validateOnboardingAge(ageInput)».
  const ageValidation = validateOnboardingAge(ageInput)

  // Esta línea sirve para extraer «anContinu» de «(): boolean => {».
  const canContinue = (): boolean => {
    // Esta línea sirve para elegir qué hacer según «step».
    switch (step) {
      // Esta línea sirve para tratar el caso «"age"».
      case "age":
        // Esta línea sirve para devolver «ageValidation.valid».
        return ageValidation.valid
      // Esta línea sirve para tratar el caso «"sex"».
      case "sex":
        // Esta línea sirve para devolver «!!answers.sex».
        return !!answers.sex
      // Esta línea sirve para tratar el caso «"height"».
      case "height":
        // Esta línea sirve para devolver «heightInput.trim().length > 0».
        return heightInput.trim().length > 0
      // Esta línea sirve para tratar el caso «"weight"».
      case "weight":
        // Esta línea sirve para devolver «weightInput.trim().length > 0».
        return weightInput.trim().length > 0
      // Esta línea sirve para tratar el caso «"level"».
      case "level":
        // Esta línea sirve para devolver «!!answers.level».
        return !!answers.level
      // Esta línea sirve para tratar el caso «"goals"».
      case "goals":
        // Esta línea sirve para devolver «(answers.goals?.length ?? 0) > 0».
        return (answers.goals?.length ?? 0) > 0
      // Esta línea sirve para tratar el caso «"frequency"».
      case "frequency":
        // Esta línea sirve para devolver «!!answers.frequency_days».
        return !!answers.frequency_days
    }
  }

  // Esta línea sirve para extraer «oBac» de «() => {».
  const goBack = () => {
    // Esta línea sirve para salir de la función si «stepIndex === 0».
    if (stepIndex === 0) return
    // Esta línea sirve para guardar en el estado con «setStepIndex» el valor «(i) => i - 1)…».
    setStepIndex((i) => i - 1)
  }

  // Esta línea sirve para extraer «oNex» de «async () => {».
  const goNext = async () => {
    // No alcanza con deshabilitar el botón: Enter en el input no debe
    // poder saltarse la validación de edad (ver validateOnboardingAge).
    // Esta línea sirve para revisar si la edad no es válida en el paso de edad o en el último paso.
    if ((step === "age" || stepIndex === STEP_ORDER.length - 1) && !ageValidation.valid) {
      // Esta línea sirve para guardar en el estado con «setStepIndex» el valor «STEP_ORDER.indexOf("age"))…».
      setStepIndex(STEP_ORDER.indexOf("age"))
      // Esta línea sirve para guardar en el estado con «setAgeTouched» el valor «true)…».
      setAgeTouched(true)
      // Esta línea sirve para terminar la función sin devolver nada.
      return
    }

    // Esta línea sirve para extraer «sLas» de «stepIndex === STEP_ORDER.length - 1».
    const isLast = stepIndex === STEP_ORDER.length - 1

    // Esta línea sirve para revisar si «!isLast».
    if (!isLast) {
      // Esta línea sirve para guardar en el estado con «setStepIndex» el valor «(i) => i + 1)…».
      setStepIndex((i) => i + 1)
      // Esta línea sirve para terminar la función sin devolver nada.
      return
    }

    // Esta línea sirve para guardar en el estado con «setIsSubmitting» el valor «true)…».
    setIsSubmitting(true)
    // Esta línea sirve para guardar en el estado con «setError» el valor «null)…».
    setError(null)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para enviar las respuestas a la API.
      await api.post<OnboardingState>("/onboarding", answers)
      // Esta línea sirve para marcar el onboarding como completado en la API.
      await api.post<OnboardingState>("/onboarding/complete")
      // Esta línea sirve para guardar en el estado con «setOnboardingCompleted» el valor «)…».
      setOnboardingCompleted()
      // Esta línea sirve para llamar a «navigate» con «"/dashboard", { replace: true }».
      navigate("/dashboard", { replace: true })
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el estado con «setError» el valor «err instanceof ApiError ? err.body.message : …».
      setError(err instanceof ApiError ? err.body.message : "Faltan respuestas por completar.")
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setIsSubmitting» el valor «false)…».
      setIsSubmitting(false)
    }
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «flex min-h-svh flex-col items-center bg-».
    <main className="flex min-h-svh flex-col items-center bg-background px-6 py-10 text-foreground">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «w-full max-w-sm». */}
      <div className="w-full max-w-sm">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «mb-6 h-1.5 w-full overflow-hidden rounde». */}
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
          <div
            // Esta línea sirve para aplicar las clases de estilo «h-full rounded-full bg-primary transition-all».
            className="h-full rounded-full bg-primary transition-all"
            // Esta línea sirve para pasar la propiedad «style» con el valor «{ width: `${((stepIndex + 1) / STEP_ORDER.len».
            style={{ width: `${((stepIndex + 1) / STEP_ORDER.length) * 100}%` }}
          />
        </div>

        {/* Esta línea sirve para mostrar el bloque solo si «step === "age"». */}
        {step === "age" && (
          // Esta línea sirve para abrir el componente «Question».
          <Question title="¿Cuál es tu edad?" subtitle={`Entre ${ONBOARDING_MIN_AGE} y ${ONBOARDING_MAX_AGE} años`}>
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «type» con el valor «number».
              type="number"
              // Esta línea sirve para definir el atributo «inputMode» con el valor «numeric».
              inputMode="numeric"
              // Esta línea sirve para pasar la propiedad «min» con el valor «ONBOARDING_MIN_AGE}».
              min={ONBOARDING_MIN_AGE}
              // Esta línea sirve para pasar la propiedad «max» con el valor «ONBOARDING_MAX_AGE}».
              max={ONBOARDING_MAX_AGE}
              // Esta línea sirve para definir el atributo «aria-label» con el valor «Edad».
              aria-label="Edad"
              // Esta línea sirve para pasar la propiedad «aria-invalid» con el valor «!ageValidation.valid && ageTouched}».
              aria-invalid={!ageValidation.valid && ageTouched}
              // Esta línea sirve para definir el atributo «aria-describedby» con el valor «age-error».
              aria-describedby="age-error"
              // Esta línea sirve para pasar la propiedad «title» con el valor «ONBOARDING_AGE_MESSAGES.outOfRange}».
              title={ONBOARDING_AGE_MESSAGES.outOfRange}
              // Esta línea sirve para aplicar las clases de estilo calculadas: «inputClass}».
              className={inputClass}
              // Esta línea sirve para pasar la propiedad «value» con el valor «ageInput}».
              value={ageInput}
              // Esta línea sirve para asignar el manejador del evento «onBlur».
              onBlur={() => setAgeTouched(true)}
              // Esta línea sirve para asignar el manejador del evento «onKeyDown».
              onKeyDown={(e) => {
                // Esta línea sirve para avanzar al pulsar Enter.
                if (e.key === "Enter") void goNext()
              }}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => {
                // Esta línea sirve para guardar en el estado con «setAgeInput» el valor «e.target.value)…».
                setAgeInput(e.target.value)
                // Esta línea sirve para extraer «esul» de «validateOnboardingAge(e.target.value)».
                const result = validateOnboardingAge(e.target.value)
                // Esta línea sirve para guardar en el estado con «setAnswer» el valor «"age", result.valid ? result.age : undefined)…».
                setAnswer("age", result.valid ? result.age : undefined)
              }}
            />
            {/* Esta línea sirve para mostrar el error de edad una vez que el usuario escribió algo. */}
            {!ageValidation.valid && (ageTouched || ageInput.trim().length >= 2) && (
              // Esta línea sirve para abrir el elemento «p».
              <p id="age-error" role="alert" className="text-sm text-destructive">
                {/* Esta línea sirve para mostrar el valor «ageValidation.error». */}
                {ageValidation.error}
              </p>
            )}
          </Question>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «step === "sex"». */}
        {step === "sex" && (
          // Esta línea sirve para abrir el componente «Question».
          <Question title="¿Cuál es tu sexo?">
            {/* Esta línea sirve para recorrer «(["male", "female"] as const)» y mostrar un bloque por elemento. */}
            {(["male", "female"] as const).map((value) => (
              // Esta línea sirve para abrir el elemento «OptionButton» con sus atributos en varias líneas.
              <OptionButton
                // Esta línea sirve para identificar el elemento de la lista con «value}».
                key={value}
                // Esta línea sirve para pasar la propiedad «label» con el valor «value === "male" ? "Hombre" : "Mujer"}».
                label={value === "male" ? "Hombre" : "Mujer"}
                // Esta línea sirve para pasar la propiedad «selected» con el valor «answers.sex === value}».
                selected={answers.sex === value}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => setAnswer("sex", value)}
              />
            ))}
          </Question>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «step === "height"». */}
        {step === "height" && (
          // Esta línea sirve para abrir el componente «Question».
          <Question title="¿Cuál es tu altura?" subtitle="En centímetros">
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «type» con el valor «number».
              type="number"
              // Esta línea sirve para definir el atributo «inputMode» con el valor «decimal».
              inputMode="decimal"
              // Esta línea sirve para aplicar las clases de estilo calculadas: «inputClass}».
              className={inputClass}
              // Esta línea sirve para pasar la propiedad «value» con el valor «heightInput}».
              value={heightInput}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => {
                // Esta línea sirve para guardar en el estado con «setHeightInput» el valor «e.target.value)…».
                setHeightInput(e.target.value)
                // Esta línea sirve para guardar en el estado con «setAnswer» el valor «"height_cm", Number(e.target.value) || undefi…».
                setAnswer("height_cm", Number(e.target.value) || undefined)
              }}
            />
          </Question>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «step === "weight"». */}
        {step === "weight" && (
          // Esta línea sirve para abrir el componente «Question».
          <Question title="¿Cuál es tu peso?" subtitle="En kilogramos">
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «type» con el valor «number».
              type="number"
              // Esta línea sirve para definir el atributo «inputMode» con el valor «decimal».
              inputMode="decimal"
              // Esta línea sirve para aplicar las clases de estilo calculadas: «inputClass}».
              className={inputClass}
              // Esta línea sirve para pasar la propiedad «value» con el valor «weightInput}».
              value={weightInput}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => {
                // Esta línea sirve para guardar en el estado con «setWeightInput» el valor «e.target.value)…».
                setWeightInput(e.target.value)
                // Esta línea sirve para guardar en el estado con «setAnswer» el valor «"weight_kg", Number(e.target.value) || undefi…».
                setAnswer("weight_kg", Number(e.target.value) || undefined)
              }}
            />
          </Question>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «step === "level"». */}
        {step === "level" && (
          // Esta línea sirve para abrir el elemento «Question» con sus atributos en varias líneas.
          <Question
            // Esta línea sirve para definir el atributo «title» con el valor «¿Cuál es tu nivel de entrenamiento?».
            title="¿Cuál es tu nivel de entrenamiento?"
            // Esta línea sirve para definir el atributo «subtitle».
            subtitle="Según tu experiencia entrenando fuerza o en el gimnasio"
          >
            {/* Esta línea sirve para recorrer «questions.levels» y mostrar un bloque por elemento. */}
            {questions.levels.map((value) => (
              // Esta línea sirve para abrir el elemento «OptionButton» con sus atributos en varias líneas.
              <OptionButton
                // Esta línea sirve para identificar el elemento de la lista con «value}».
                key={value}
                // Esta línea sirve para pasar la propiedad «label» con el valor «LEVEL_LABELS[value]}».
                label={LEVEL_LABELS[value]}
                // Esta línea sirve para pasar la propiedad «selected» con el valor «answers.level === value}».
                selected={answers.level === value}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => setAnswer("level", value)}
              />
            ))}
          </Question>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «step === "goals"». */}
        {step === "goals" && (
          // Esta línea sirve para abrir el componente «Question».
          <Question title="¿Cuál es tu objetivo?" subtitle="Puedes elegir más de uno">
            {/* Esta línea sirve para recorrer «questions.goals» y mostrar un bloque por elemento. */}
            {questions.goals.map((value) => (
              // Esta línea sirve para abrir el elemento «OptionButton» con sus atributos en varias líneas.
              <OptionButton
                // Esta línea sirve para identificar el elemento de la lista con «value}».
                key={value}
                // Esta línea sirve para pasar la propiedad «label» con el valor «GOAL_LABELS[value]}».
                label={GOAL_LABELS[value]}
                // Esta línea sirve para pasar la propiedad «selected» con el valor «(answers.goals ?? []).includes(value)}».
                selected={(answers.goals ?? []).includes(value)}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => toggleGoal(value)}
              />
            ))}
          </Question>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «step === "frequency"». */}
        {step === "frequency" && (
          // Esta línea sirve para abrir el componente «Question».
          <Question title="¿Cuántos días a la semana entrenarás?">
            {/* Esta línea sirve para recorrer «questions.frequency_days» y mostrar un bloque por elemento. */}
            {questions.frequency_days.map((value) => (
              // Esta línea sirve para abrir el elemento «OptionButton» con sus atributos en varias líneas.
              <OptionButton
                // Esta línea sirve para identificar el elemento de la lista con «value}».
                key={value}
                // Esta línea sirve para pasar la propiedad «label» con el valor «`${value} días`}».
                label={`${value} días`}
                // Esta línea sirve para pasar la propiedad «selected» con el valor «answers.frequency_days === value}».
                selected={answers.frequency_days === value}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => setAnswer("frequency_days", value as FrequencyDays)}
              />
            ))}
          </Question>
        )}

        {/* Esta línea sirve para mostrar el elemento solo si «error». */}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

        {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-6 flex flex-col gap-2». */}
        <div className="mt-6 flex flex-col gap-2">
          {/* Esta línea sirve para abrir el componente «Button». */}
          <Button onClick={goNext} disabled={!canContinue() || isSubmitting} className="w-full">
            {/* Esta línea sirve para mostrar el texto del botón según el estado y el paso. */}
            {isSubmitting ? "Generando…" : stepIndex === STEP_ORDER.length - 1 ? "Generar mi plan" : "Continuar"}
          </Button>
          {/* Esta línea sirve para mostrar el bloque solo si «stepIndex > 0». */}
          {stepIndex > 0 && (
            // Esta línea sirve para abrir el componente «Button».
            <Button variant="ghost" onClick={goBack} className="w-full" disabled={isSubmitting}>
              {/* Esta línea sirve para mostrar el texto «Atrás». */}
              Atrás
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}

// Esta línea sirve para declarar la función «Question».
function Question({
  // Esta línea sirve para incluir el valor «title» en la lista.
  title,
  // Esta línea sirve para incluir el valor «subtitle» en la lista.
  subtitle,
  // Esta línea sirve para incluir el valor «children» en la lista.
  children,
// Esta línea sirve para cerrar la desestructuración y abrir los tipos.
}: {
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «string».
  title: string
  // Esta línea sirve para declarar la propiedad «subtitle» con el valor o tipo «string».
  subtitle?: string
  // Esta línea sirve para declarar la propiedad «children» con el valor o tipo «React.ReactNode».
  children: React.ReactNode
// Esta línea sirve para cerrar los parámetros y abrir el cuerpo.
}) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «mb-6».
    <div className="mb-6">
      {/* Esta línea sirve para mostrar el valor «title» dentro de un «h2». */}
      <h2 className="text-lg font-medium">{title}</h2>
      {/* Esta línea sirve para mostrar el elemento solo si «subtitle». */}
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      {/* Esta línea sirve para mostrar el valor «children» dentro de un «div». */}
      <div className="mt-4 flex flex-col gap-2">{children}</div>
    </div>
  )
}

// Esta línea sirve para declarar la función «OptionButton».
function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
    <button
      // Esta línea sirve para definir el atributo «type» con el valor «button».
      type="button"
      // Esta línea sirve para asignar el manejador del evento «onClick».
      onClick={onClick}
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
      className={cn(
        // Esta línea sirve para incluir el texto o las clases «w-full rounded-lg border px-4 py-2.5 text-lef…».
        "w-full rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-colors",
        // Esta línea sirve para activar la opción «selected».
        selected
          // Esta línea sirve para pintar la opción elegida con el color primario.
          ? "border-primary bg-primary text-primary-foreground"
          // Esta línea sirve para pintar las demás opciones con el color neutro.
          : "border-input bg-background hover:bg-muted",
      )}
    >
      {/* Esta línea sirve para mostrar el valor «label». */}
      {label}
    </button>
  )
}

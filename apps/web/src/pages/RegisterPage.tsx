// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useForm» desde «react-hook-form».
import { useForm } from "react-hook-form"
// Esta línea sirve para importar «zodResolver» desde «@hookform/resolvers/zod».
import { zodResolver } from "@hookform/resolvers/zod"
// Esta línea sirve para importar «z» desde «zod».
import { z } from "zod"
// Esta línea sirve para importar «Form, Alert» desde «react-bootstrap».
import { Form, Alert } from "react-bootstrap"
// Esta línea sirve para importar «Link, useNavigate» desde «react-router-dom».
import { Link, useNavigate } from "react-router-dom"
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «ApiError» en la lista.
  ApiError,
  // Esta línea sirve para incluir el valor «buildConsentFields» en la lista.
  buildConsentFields,
  // Esta línea sirve para incluir el valor «LEGAL_STRINGS» en la lista.
  LEGAL_STRINGS,
  // Esta línea sirve para incluir el valor «REQUIRED_CONSENTS» en la lista.
  REQUIRED_CONSENTS,
  // Esta línea sirve para importar el tipo «AuthPayload».
  type AuthPayload,
  // Esta línea sirve para importar el tipo «ConsentType».
  type ConsentType,
  // Esta línea sirve para importar el tipo «RegisterPayload».
  type RegisterPayload,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «GoogleIcon» desde «@/components/ui/GoogleIcon».
import { GoogleIcon } from "@/components/ui/GoogleIcon"
// Esta línea sirve para importar «PasswordFormControl» desde «@/components/ui/PasswordFormControl».
import { PasswordFormControl } from "@/components/ui/PasswordFormControl"
// Esta línea sirve para importar «AuthLayout» desde «@/components/layout/AuthLayout».
import { AuthLayout } from "@/components/layout/AuthLayout"
// Esta línea sirve para importar «ConsentCheckboxes» desde «@/components/legal/ConsentCheckboxes».
import { ConsentCheckboxes } from "@/components/legal/ConsentCheckboxes"
// Esta línea sirve para importar «SocialConsentDialog» desde «@/components/legal/SocialConsentDialog».
import { SocialConsentDialog } from "@/components/legal/SocialConsentDialog"
// Esta línea sirve para importar «useGoogleAuth» desde «@/hooks/use-google-auth».
import { useGoogleAuth } from "@/hooks/use-google-auth"

// La interfaz de la app es en español — mismos textos que usa el backend
// para rechazar un registro sin estas casillas (ValidatesLegalConsents).
// Esta línea sirve para declarar «consentErrors» con el valor «LEGAL_STRINGS.es.consentRequiredErrors».
const consentErrors = LEGAL_STRINGS.es.consentRequiredErrors
// Esta línea sirve para extraer «ustAccep» de «(type: ConsentType) => z.boolean().refin».
const mustAccept = (type: ConsentType) => z.boolean().refine((value) => value === true, consentErrors[type])

// Esta línea sirve para declarar «registerSchema» con el valor «z».
const registerSchema = z
  // Esta línea sirve para abrir el esquema de validación del formulario.
  .object({
    // Esta línea sirve para validar el campo «name» con el esquema de Zod.
    name: z.string().min(1, "Ingresa tu nombre"),
    // Esta línea sirve para validar el campo «email» con el esquema de Zod.
    email: z.string().email("Ingresa un correo válido"),
    // Esta línea sirve para validar el campo «password» con el esquema de Zod.
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    // Esta línea sirve para validar el campo «password_confirmation» con el esquema de Zod.
    password_confirmation: z.string().min(1, "Confirma tu contraseña"),
    // Esta línea sirve para declarar la propiedad «accept_terms» con el valor o tipo «mustAccept("terms")».
    accept_terms: mustAccept("terms"),
    // Esta línea sirve para declarar la propiedad «accept_privacy» con el valor o tipo «mustAccept("privacy")».
    accept_privacy: mustAccept("privacy"),
    // Esta línea sirve para declarar la propiedad «accept_health_data» con el valor o tipo «mustAccept("health_data")».
    accept_health_data: mustAccept("health_data"),
  })
  // Esta línea sirve para validar que la confirmación coincida con la contraseña.
  .refine((data) => data.password === data.password_confirmation, {
    // Esta línea sirve para declarar la propiedad «message» con el valor o tipo «"Las contraseñas no coinciden"».
    message: "Las contraseñas no coinciden",
    // Esta línea sirve para declarar la propiedad «path» con el valor o tipo «["password_confirmation"]».
    path: ["password_confirmation"],
  })

// Esta línea sirve para declarar el tipo «RegisterFormValues» como «z.infer<typeof registerSchema>».
type RegisterFormValues = z.infer<typeof registerSchema>

// Esta línea sirve para declarar la función «readApiError».
function readApiError(err: ApiError): string {
  // Esta línea sirve para devolver el primer error de campo o el mensaje general de la API.
  return Object.values(err.body.errors ?? {})[0]?.[0] ?? err.body.message
}

// Esta línea sirve para declarar la función «RegisterPage».
export function RegisterPage() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «setSession» con el hook «useAuthStore».
  const setSession = useAuthStore((state) => state.setSession)
  // Esta línea sirve para crear el estado «serverError» y su función «setServerError».
  const [serverError, setServerError] = useState<string | null>(null)

  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «register» en la lista.
    register,
    // Esta línea sirve para incluir el valor «handleSubmit» en la lista.
    handleSubmit,
    // Esta línea sirve para incluir el valor «watch» en la lista.
    watch,
    // Esta línea sirve para incluir el valor «setValue» en la lista.
    setValue,
    // Esta línea sirve para declarar la propiedad «formState» con el valor o tipo «{ errors, isSubmitting, isSubmitted }».
    formState: { errors, isSubmitting, isSubmitted },
  // Esta línea sirve para cerrar la desestructuración con «useForm<RegisterFormValues>({».
  } = useForm<RegisterFormValues>({
    // Esta línea sirve para declarar la propiedad «resolver» con el valor o tipo «zodResolver(registerSchema)».
    resolver: zodResolver(registerSchema),
    // Esta línea sirve para definir los valores iniciales con los consentimientos sin marcar.
    defaultValues: { accept_terms: false, accept_privacy: false, accept_health_data: false },
  })

  // Esta línea sirve para declarar «consentValues» con el valor «{».
  const consentValues: Partial<Record<ConsentType, boolean>> = {
    // Esta línea sirve para declarar la propiedad «terms» con el valor o tipo «watch("accept_terms")».
    terms: watch("accept_terms"),
    // Esta línea sirve para declarar la propiedad «privacy» con el valor o tipo «watch("accept_privacy")».
    privacy: watch("accept_privacy"),
    // Esta línea sirve para declarar la propiedad «health_data» con el valor o tipo «watch("accept_health_data")».
    health_data: watch("accept_health_data"),
  }

  // Si ya marcó las casillas acá, "Continuar con Google" las manda directo;
  // si no, y la cuenta de Google es nueva, se abre el diálogo de consentimiento.
  // Esta línea sirve para obtener «google» con el hook «useGoogleAuth».
  const google = useGoogleAuth(consentValues)

  // Esta línea sirve para extraer «nSubmi» de «async (values: RegisterFormValues) => {».
  const onSubmit = async (values: RegisterFormValues) => {
    // Esta línea sirve para guardar en el estado con «setServerError» el valor «null)…».
    setServerError(null)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.bootstrapCsrf».
      await api.bootstrapCsrf()
      // Esta línea sirve para extraer «ayload: RegisterPayloa» de «{».
      const payload: RegisterPayload = {
        // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «values.name».
        name: values.name,
        // Esta línea sirve para declarar la propiedad «email» con el valor o tipo «values.email».
        email: values.email,
        // Esta línea sirve para declarar la propiedad «password» con el valor o tipo «values.password».
        password: values.password,
        // Esta línea sirve para declarar la propiedad «password_confirmation» con el valor o tipo «values.password_confirmation».
        password_confirmation: values.password_confirmation,
        // Esta línea sirve para copiar las propiedades de «buildConsentFields».
        ...buildConsentFields(consentValues),
      }
      // Esta línea sirve para esperar «api.post<AuthPayload>("/auth/register", payload)» y guardar el resultado en «response».
      const response = await api.post<AuthPayload>("/auth/register", payload)
      // Esta línea sirve para guardar en el estado con «setSession» el valor «response.token, response.user)…».
      setSession(response.token, response.user)
      // Esta línea sirve para navegar al panel del entrenador o al dashboard según el rol, sin dejar historial.
      navigate(response.user.role === "trainer" ? "/trainer" : "/dashboard", { replace: true })
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el estado con «setServerError» el valor «err instanceof ApiError ? readApiError(err) :…».
      setServerError(err instanceof ApiError ? readApiError(err) : "No se pudo crear la cuenta.")
    }
  }

  // Esta línea sirve para extraer «nySubmittin» de «isSubmitting || google.isSubmitting».
  const anySubmitting = isSubmitting || google.isSubmitting
  // Esta línea sirve para extraer «rro» de «serverError ?? (google.pendingConsent ? ».
  const error = serverError ?? (google.pendingConsent ? null : google.error)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «AuthLayout».
    <AuthLayout>
      {/* Esta línea sirve para abrir el componente «Form». */}
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3" noValidate>
        {/* Esta línea sirve para abrir el componente «Form.Group». */}
        <Form.Group controlId="name">
          {/* Esta línea sirve para mostrar el texto «Nombre» dentro de «Form.Label». */}
          <Form.Label className="small fw-medium">Nombre</Form.Label>
          {/* Esta línea sirve para abrir el componente «Form.Control». */}
          <Form.Control type="text" autoComplete="name" isInvalid={!!errors.name} {...register("name")} />
          {/* Esta línea sirve para mostrar el valor «errors.name?.message» dentro de «Form.Control.Feedback». */}
          <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* Esta línea sirve para abrir el componente «Form.Group». */}
        <Form.Group controlId="email">
          {/* Esta línea sirve para mostrar el texto «Correo» dentro de «Form.Label». */}
          <Form.Label className="small fw-medium">Correo</Form.Label>
          {/* Esta línea sirve para abrir el componente «Form.Control». */}
          <Form.Control type="email" autoComplete="email" isInvalid={!!errors.email} {...register("email")} />
          {/* Esta línea sirve para mostrar el valor «errors.email?.message» dentro de «Form.Control.Feedback». */}
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* Esta línea sirve para abrir el componente «Form.Group». */}
        <Form.Group controlId="password">
          {/* Esta línea sirve para mostrar el texto «Contraseña» dentro de «Form.Label». */}
          <Form.Label className="small fw-medium">Contraseña</Form.Label>
          {/* Esta línea sirve para abrir el elemento «PasswordFormControl» con sus atributos en varias líneas. */}
          <PasswordFormControl
            // Esta línea sirve para definir el atributo «autoComplete» con el valor «new-password».
            autoComplete="new-password"
            // Esta línea sirve para pasar la propiedad «isInvalid» con el valor «!!errors.password}».
            isInvalid={!!errors.password}
            // Esta línea sirve para conectar el campo «password» con el formulario.
            {...register("password")}
          />
          {/* Esta línea sirve para mostrar el valor «errors.password?.message» dentro de «Form.Control.Feedback». */}
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* Esta línea sirve para abrir el componente «Form.Group». */}
        <Form.Group controlId="password_confirmation">
          {/* Esta línea sirve para mostrar el texto «Confirmar contraseña» dentro de «Form.Label». */}
          <Form.Label className="small fw-medium">Confirmar contraseña</Form.Label>
          {/* Esta línea sirve para abrir el elemento «PasswordFormControl» con sus atributos en varias líneas. */}
          <PasswordFormControl
            // Esta línea sirve para definir el atributo «autoComplete» con el valor «new-password».
            autoComplete="new-password"
            // Esta línea sirve para pasar la propiedad «isInvalid» con el valor «!!errors.password_confirmation}».
            isInvalid={!!errors.password_confirmation}
            // Esta línea sirve para conectar el campo «password_confirmation» con el formulario.
            {...register("password_confirmation")}
          />
          {/* Esta línea sirve para mostrar el valor «errors.password_confirmation?.message» dentro de «Form.Control.Feedback». */}
          <Form.Control.Feedback type="invalid">{errors.password_confirmation?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* Esta línea sirve para abrir el elemento «ConsentCheckboxes» con sus atributos en varias líneas. */}
        <ConsentCheckboxes
          // Esta línea sirve para definir el atributo «idPrefix» con el valor «register».
          idPrefix="register"
          // Esta línea sirve para pasar la propiedad «consents» con el valor «REQUIRED_CONSENTS}».
          consents={REQUIRED_CONSENTS}
          // Esta línea sirve para pasar la propiedad «values» con el valor «consentValues}».
          values={consentValues}
          // Esta línea sirve para pasar la propiedad «disabled» con el valor «anySubmitting}».
          disabled={anySubmitting}
          // Esta línea sirve para pasar la propiedad «errors» con el valor «{».
          errors={{
            // Esta línea sirve para declarar la propiedad «terms» con el valor o tipo «errors.accept_terms?.message».
            terms: errors.accept_terms?.message,
            // Esta línea sirve para declarar la propiedad «privacy» con el valor o tipo «errors.accept_privacy?.message».
            privacy: errors.accept_privacy?.message,
            // Esta línea sirve para declarar la propiedad «health_data» con el valor o tipo «errors.accept_health_data?.message».
            health_data: errors.accept_health_data?.message,
          }}
          // Esta línea sirve para asignar el manejador del evento «onChange».
          onChange={(type, checked) =>
            // Esta línea sirve para guardar en el estado con «setValue» el valor «`accept_${type}`, checked, { shouldValidate: …».
            setValue(`accept_${type}`, checked, { shouldValidate: isSubmitted, shouldDirty: true })
          }
        />

        {/* Esta línea sirve para mostrar el bloque solo si «error». */}
        {error && (
          // Esta línea sirve para abrir el componente «Alert».
          <Alert variant="danger" className="py-2 small mb-0" role="alert">
            {/* Esta línea sirve para mostrar el valor «error». */}
            {error}
          </Alert>
        )}

        {/* Esta línea sirve para abrir el elemento «SankButton» con sus atributos en varias líneas. */}
        <SankButton
          // Esta línea sirve para definir el atributo «type» con el valor «submit».
          type="submit"
          // Esta línea sirve para pasar la propiedad «disabled» con el valor «anySubmitting}».
          disabled={anySubmitting}
          // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
          loading={isSubmitting}
          // Esta línea sirve para aplicar las clases de estilo «w-100 justify-content-center».
          className="w-100 justify-content-center"
        >
          {/* Esta línea sirve para mostrar el contenido dinámico «{isSubmitting ? "Creando cuenta…" : "Crear cuenta"}». */}
          {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
        </SankButton>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-center gap-2». */}
        <div className="d-flex align-items-center gap-2">
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div style={{ height: 1, flex: 1, background: "var(--bs-border-color)" }} />
          {/* Esta línea sirve para mostrar el texto «O» dentro de un «span». */}
          <span className="small text-body-secondary">O</span>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div style={{ height: 1, flex: 1, background: "var(--bs-border-color)" }} />
        </div>

        {/* Esta línea sirve para abrir el elemento «SankButton» con sus atributos en varias líneas. */}
        <SankButton
          // Esta línea sirve para definir el atributo «type» con el valor «button».
          type="button"
          // Esta línea sirve para definir el atributo «variant» con el valor «secondary».
          variant="secondary"
          // Esta línea sirve para pasar la propiedad «disabled» con el valor «anySubmitting}».
          disabled={anySubmitting}
          // Esta línea sirve para pasar la propiedad «loading» con el valor «google.isSubmitting}».
          loading={google.isSubmitting}
          // Esta línea sirve para pasar la propiedad «iconStart» con el valor «!google.isSubmitting ? <GoogleIcon /> : undef».
          iconStart={!google.isSubmitting ? <GoogleIcon /> : undefined}
          // Esta línea sirve para asignar el manejador del evento «onClick».
          onClick={() => {
            // Esta línea sirve para guardar en el estado con «setServerError» el valor «null)…».
            setServerError(null)
            // Esta línea sirve para ejecutar «google.start» sin esperar su resultado.
            void google.start()
          }}
          // Esta línea sirve para aplicar las clases de estilo «w-100 justify-content-center».
          className="w-100 justify-content-center"
        >
          {/* Esta línea sirve para mostrar el texto según si se está enviando con Google. */}
          {google.isSubmitting ? "Continuando con Google…" : "Continuar con Google"}
        </SankButton>

        {/* Esta línea sirve para abrir el elemento «p» con las clases «text-center small text-body-secondary mb». */}
        <p className="text-center small text-body-secondary mb-0">
          {/* Esta línea sirve para mostrar el contenido dinámico «¿Ya tenés cuenta?{" "}». */}
          ¿Ya tenés cuenta?{" "}
          {/* Esta línea sirve para abrir el componente «Link». */}
          <Link to="/login" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
            {/* Esta línea sirve para mostrar el texto «Iniciá sesión». */}
            Iniciá sesión
          </Link>
        </p>
      </Form>

      {/* Esta línea sirve para abrir el elemento «SocialConsentDialog» con sus atributos en varias líneas. */}
      <SocialConsentDialog
        // Esta línea sirve para pasar la propiedad «pending» con el valor «google.pendingConsent?.consents ?? null}».
        pending={google.pendingConsent?.consents ?? null}
        // Esta línea sirve para pasar la propiedad «isSubmitting» con el valor «google.isSubmitting}».
        isSubmitting={google.isSubmitting}
        // Esta línea sirve para pasar la propiedad «error» con el valor «google.pendingConsent ? google.error : null}».
        error={google.pendingConsent ? google.error : null}
        // Esta línea sirve para asignar el manejador del evento «onConfirm».
        onConfirm={(accepted) => void google.confirmConsent(accepted)}
        // Esta línea sirve para asignar el manejador del evento «onCancel».
        onCancel={google.cancelConsent}
      />
    </AuthLayout>
  )
}

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
// Esta línea sirve para importar el error de la API y los tipos de autenticación.
import { ApiError, isTwoFactorChallenge, type AuthPayload, type TwoFactorChallengeResponse } from "@sanken/core"
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
// Esta línea sirve para importar «SocialConsentDialog» desde «@/components/legal/SocialConsentDialog».
import { SocialConsentDialog } from "@/components/legal/SocialConsentDialog"
// Esta línea sirve para importar «useGoogleAuth» desde «@/hooks/use-google-auth».
import { useGoogleAuth } from "@/hooks/use-google-auth"

// Esta línea sirve para declarar «loginSchema» con el valor «z.object({».
const loginSchema = z.object({
  // Esta línea sirve para declarar la propiedad «email» con el valor o tipo «z.string().email("Ingresa un correo válido")».
  email: z.string().email("Ingresa un correo válido"),
  // Esta línea sirve para declarar la propiedad «password» con el valor o tipo «z.string().min(1, "Ingresa tu contraseña")».
  password: z.string().min(1, "Ingresa tu contraseña"),
})

// Esta línea sirve para declarar el tipo «LoginFormValues» como «z.infer<typeof loginSchema>».
type LoginFormValues = z.infer<typeof loginSchema>

// Esta línea sirve para declarar la función «LoginPage».
export function LoginPage() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «setSession» con el hook «useAuthStore».
  const setSession = useAuthStore((state) => state.setSession)
  // Esta línea sirve para obtener «setPendingChallenge» con el hook «useAuthStore».
  const setPendingChallenge = useAuthStore((state) => state.setPendingChallenge)
  // Esta línea sirve para crear el estado «serverError» y su función «setServerError».
  const [serverError, setServerError] = useState<string | null>(null)
  // Una cuenta de Google NUEVA no se crea sin los consentimientos: el hook
  // abre SocialConsentDialog (ver use-google-auth.ts).
  // Esta línea sirve para obtener «google» con el hook «useGoogleAuth».
  const google = useGoogleAuth()
  // Esta línea sirve para extraer «sSubmittingGoogl» de «google.isSubmitting».
  const isSubmittingGoogle = google.isSubmitting

  // Esta línea sirve para abrir la desestructuración de las herramientas del formulario.
  const {
    // Esta línea sirve para incluir el valor «register» en la lista.
    register,
    // Esta línea sirve para incluir el valor «handleSubmit» en la lista.
    handleSubmit,
    // Esta línea sirve para declarar la propiedad «formState» con el valor o tipo «{ errors, isSubmitting }».
    formState: { errors, isSubmitting },
  // Esta línea sirve para cerrar la desestructuración y crear el formulario validado.
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  // Esta línea sirve para extraer «nSubmi» de «async (values: LoginFormValues) => {».
  const onSubmit = async (values: LoginFormValues) => {
    // Esta línea sirve para llamar a «setServerError» con «null».
    setServerError(null)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.bootstrapCsrf».
      await api.bootstrapCsrf()
      // Esta línea sirve para esperar «api.post<AuthPayload | TwoFactorChallengeResponse>» y guardar el resultado en «response».
      const response = await api.post<AuthPayload | TwoFactorChallengeResponse>("/auth/login", {
        // Esta línea sirve para copiar las propiedades de «values».
        ...values,
        // Esta línea sirve para declarar la propiedad «device_name» con el valor o tipo «"sanken-web"».
        device_name: "sanken-web",
      })

      // Esta línea sirve para revisar si «isTwoFactorChallenge(response)».
      if (isTwoFactorChallenge(response)) {
        // Esta línea sirve para llamar a «setPendingChallenge» con «response.challenge_token».
        setPendingChallenge(response.challenge_token)
        // Esta línea sirve para llamar a «navigate» con «"/login/verify"».
        navigate("/login/verify")
        // Esta línea sirve para terminar la función sin devolver nada.
        return
      }

      // Esta línea sirve para llamar a «setSession» con «response.token, response.user».
      setSession(response.token, response.user)
      // Esta línea sirve para navegar al panel del entrenador o al dashboard según el rol, sin dejar historial.
      navigate(response.user.role === "trainer" ? "/trainer" : "/dashboard", { replace: true })
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para mostrar el mensaje de error de la API o uno genérico.
      setServerError(err instanceof ApiError ? err.body.message : "No se pudo iniciar sesión.")
    }
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «AuthLayout».
    <AuthLayout>
      {/* Esta línea sirve para abrir el componente «Form». */}
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3" noValidate>
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
            // Esta línea sirve para definir el atributo «autoComplete» con el valor «current-password».
            autoComplete="current-password"
            // Esta línea sirve para pasar la propiedad «isInvalid» con el valor «!!errors.password}».
            isInvalid={!!errors.password}
            // Esta línea sirve para conectar el campo de la contraseña con el formulario.
            {...register("password")}
          />
          {/* Esta línea sirve para mostrar el valor «errors.password?.message» dentro de «Form.Control.Feedback». */}
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* Esta línea sirve para abrir el elemento «Link» con sus atributos en varias líneas. */}
        <Link
          // Esta línea sirve para definir el atributo «to» con el valor «/forgot-password».
          to="/forgot-password"
          // Esta línea sirve para aplicar las clases de estilo «small align-self-center».
          className="small align-self-center"
          // Esta línea sirve para pasar la propiedad «style» con el valor «{ color: "var(--sanken-cyan-light)", marginTo».
          style={{ color: "var(--sanken-cyan-light)", marginTop: "-0.5rem" }}
        >
          {/* Esta línea sirve para mostrar el texto «¿Olvidaste tu contraseña?». */}
          ¿Olvidaste tu contraseña?
        </Link>

        {/* Esta línea sirve para mostrar el error del servidor o el de Google si no hay consentimientos pendientes. */}
        {(serverError || (!google.pendingConsent && google.error)) && (
          // Esta línea sirve para abrir el componente «Alert».
          <Alert variant="danger" className="py-2 small mb-0" role="alert">
            {/* Esta línea sirve para mostrar el contenido dinámico «{serverError ?? google.error}». */}
            {serverError ?? google.error}
          </Alert>
        )}

        {/* Esta línea sirve para abrir el elemento «SankButton» con sus atributos en varias líneas. */}
        <SankButton
          // Esta línea sirve para definir el atributo «type» con el valor «submit».
          type="submit"
          // Esta línea sirve para pasar la propiedad «disabled» con el valor «isSubmitting || isSubmittingGoogle}».
          disabled={isSubmitting || isSubmittingGoogle}
          // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmitting}».
          loading={isSubmitting}
          // Esta línea sirve para aplicar las clases de estilo «w-100 justify-content-center».
          className="w-100 justify-content-center"
        >
          {/* Esta línea sirve para mostrar el contenido dinámico «{isSubmitting ? "Ingresando…" : "Ingresar"}». */}
          {isSubmitting ? "Ingresando…" : "Ingresar"}
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
          // Esta línea sirve para pasar la propiedad «disabled» con el valor «isSubmitting || isSubmittingGoogle}».
          disabled={isSubmitting || isSubmittingGoogle}
          // Esta línea sirve para pasar la propiedad «loading» con el valor «isSubmittingGoogle}».
          loading={isSubmittingGoogle}
          // Esta línea sirve para pasar la propiedad «iconStart» con el valor «!isSubmittingGoogle ? <GoogleIcon /> : undefi».
          iconStart={!isSubmittingGoogle ? <GoogleIcon /> : undefined}
          // Esta línea sirve para asignar el manejador del evento «onClick».
          onClick={() => {
            // Esta línea sirve para llamar a «setServerError» con «null».
            setServerError(null)
            // Esta línea sirve para ejecutar «google.start» sin esperar su resultado.
            void google.start()
          }}
          // Esta línea sirve para aplicar las clases de estilo «w-100 justify-content-center».
          className="w-100 justify-content-center"
        >
          {/* Esta línea sirve para mostrar el texto según si se está enviando con Google. */}
          {isSubmittingGoogle ? "Continuando con Google…" : "Continuar con Google"}
        </SankButton>

        {/* Esta línea sirve para abrir el elemento «p» con las clases «text-center small text-body-secondary mb». */}
        <p className="text-center small text-body-secondary mb-0">
          {/* Esta línea sirve para mostrar el contenido dinámico «¿No tenés cuenta?{" "}». */}
          ¿No tenés cuenta?{" "}
          {/* Esta línea sirve para abrir el componente «Link». */}
          <Link to="/register" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
            {/* Esta línea sirve para mostrar el texto «Registrate». */}
            Registrate
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

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import {
  ApiError,
  buildConsentFields,
  LEGAL_STRINGS,
  REQUIRED_CONSENTS,
  type AuthPayload,
  type ConsentType,
  type RegisterPayload,
} from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { SankButton } from "@/components/ui/SankButton"
import { GoogleIcon } from "@/components/ui/GoogleIcon"
import { PasswordFormControl } from "@/components/ui/PasswordFormControl"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { ConsentCheckboxes } from "@/components/legal/ConsentCheckboxes"
import { SocialConsentDialog } from "@/components/legal/SocialConsentDialog"
import { useGoogleAuth } from "@/hooks/use-google-auth"

// La interfaz de la app es en español — mismos textos que usa el backend
// para rechazar un registro sin estas casillas (ValidatesLegalConsents).
const consentErrors = LEGAL_STRINGS.es.consentRequiredErrors
const mustAccept = (type: ConsentType) => z.boolean().refine((value) => value === true, consentErrors[type])

const registerSchema = z
  .object({
    name: z.string().min(1, "Ingresa tu nombre"),
    email: z.string().email("Ingresa un correo válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    password_confirmation: z.string().min(1, "Confirma tu contraseña"),
    accept_terms: mustAccept("terms"),
    accept_privacy: mustAccept("privacy"),
    accept_health_data: mustAccept("health_data"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

function readApiError(err: ApiError): string {
  return Object.values(err.body.errors ?? {})[0]?.[0] ?? err.body.message
}

export function RegisterPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { accept_terms: false, accept_privacy: false, accept_health_data: false },
  })

  const consentValues: Partial<Record<ConsentType, boolean>> = {
    terms: watch("accept_terms"),
    privacy: watch("accept_privacy"),
    health_data: watch("accept_health_data"),
  }

  // Si ya marcó las casillas acá, "Continuar con Google" las manda directo;
  // si no, y la cuenta de Google es nueva, se abre el diálogo de consentimiento.
  const google = useGoogleAuth(consentValues)

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)
    try {
      await api.bootstrapCsrf()
      const payload: RegisterPayload = {
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
        ...buildConsentFields(consentValues),
      }
      const response = await api.post<AuthPayload>("/auth/register", payload)
      setSession(response.token, response.user)
      navigate(response.user.role === "trainer" ? "/trainer" : "/dashboard", { replace: true })
    } catch (err) {
      setServerError(err instanceof ApiError ? readApiError(err) : "No se pudo crear la cuenta.")
    }
  }

  const anySubmitting = isSubmitting || google.isSubmitting
  const error = serverError ?? (google.pendingConsent ? null : google.error)

  return (
    <AuthLayout>
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3" noValidate>
        <Form.Group controlId="name">
          <Form.Label className="small fw-medium">Nombre</Form.Label>
          <Form.Control type="text" autoComplete="name" isInvalid={!!errors.name} {...register("name")} />
          <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label className="small fw-medium">Correo</Form.Label>
          <Form.Control type="email" autoComplete="email" isInvalid={!!errors.email} {...register("email")} />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label className="small fw-medium">Contraseña</Form.Label>
          <PasswordFormControl
            autoComplete="new-password"
            isInvalid={!!errors.password}
            {...register("password")}
          />
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password_confirmation">
          <Form.Label className="small fw-medium">Confirmar contraseña</Form.Label>
          <PasswordFormControl
            autoComplete="new-password"
            isInvalid={!!errors.password_confirmation}
            {...register("password_confirmation")}
          />
          <Form.Control.Feedback type="invalid">{errors.password_confirmation?.message}</Form.Control.Feedback>
        </Form.Group>

        <ConsentCheckboxes
          idPrefix="register"
          consents={REQUIRED_CONSENTS}
          values={consentValues}
          disabled={anySubmitting}
          errors={{
            terms: errors.accept_terms?.message,
            privacy: errors.accept_privacy?.message,
            health_data: errors.accept_health_data?.message,
          }}
          onChange={(type, checked) =>
            setValue(`accept_${type}`, checked, { shouldValidate: isSubmitted, shouldDirty: true })
          }
        />

        {error && (
          <Alert variant="danger" className="py-2 small mb-0" role="alert">
            {error}
          </Alert>
        )}

        <SankButton
          type="submit"
          disabled={anySubmitting}
          loading={isSubmitting}
          className="w-100 justify-content-center"
        >
          {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
        </SankButton>

        <div className="d-flex align-items-center gap-2">
          <div style={{ height: 1, flex: 1, background: "var(--bs-border-color)" }} />
          <span className="small text-body-secondary">O</span>
          <div style={{ height: 1, flex: 1, background: "var(--bs-border-color)" }} />
        </div>

        <SankButton
          type="button"
          variant="secondary"
          disabled={anySubmitting}
          loading={google.isSubmitting}
          iconStart={!google.isSubmitting ? <GoogleIcon /> : undefined}
          onClick={() => {
            setServerError(null)
            void google.start()
          }}
          className="w-100 justify-content-center"
        >
          {google.isSubmitting ? "Continuando con Google…" : "Continuar con Google"}
        </SankButton>

        <p className="text-center small text-body-secondary mb-0">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
            Iniciá sesión
          </Link>
        </p>
      </Form>

      <SocialConsentDialog
        pending={google.pendingConsent?.consents ?? null}
        isSubmitting={google.isSubmitting}
        error={google.pendingConsent ? google.error : null}
        onConfirm={(accepted) => void google.confirmConsent(accepted)}
        onCancel={google.cancelConsent}
      />
    </AuthLayout>
  )
}

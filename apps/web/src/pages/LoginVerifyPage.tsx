// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from "react"
// Esta línea sirve para importar «useForm» desde «react-hook-form».
import { useForm } from "react-hook-form"
// Esta línea sirve para importar «zodResolver» desde «@hookform/resolvers/zod».
import { zodResolver } from "@hookform/resolvers/zod"
// Esta línea sirve para importar «z» desde «zod».
import { z } from "zod"
// Esta línea sirve para importar «Form, Alert» desde «react-bootstrap».
import { Form, Alert } from "react-bootstrap"
// Esta línea sirve para importar «useNavigate» desde «react-router-dom».
import { useNavigate } from "react-router-dom"
// Esta línea sirve para importar «ApiError, type AuthPayload» desde «@sanken/core».
import { ApiError, type AuthPayload } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «AuthLayout» desde «@/components/layout/AuthLayout».
import { AuthLayout } from "@/components/layout/AuthLayout"

// Esta línea sirve para declarar «verifySchema» con el valor «z.object({».
const verifySchema = z.object({
  // Esta línea sirve para declarar la propiedad «code» con el valor o tipo «z.string().min(1, "Ingresa el código")».
  code: z.string().min(1, "Ingresa el código"),
})

// Esta línea sirve para declarar el tipo «VerifyFormValues» como «z.infer<typeof verifySchema>».
type VerifyFormValues = z.infer<typeof verifySchema>

// Esta línea sirve para declarar la función «LoginVerifyPage».
export function LoginVerifyPage() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «pendingChallenge» con el hook «useAuthStore».
  const pendingChallenge = useAuthStore((state) => state.pendingChallenge)
  // Esta línea sirve para obtener «setSession» con el hook «useAuthStore».
  const setSession = useAuthStore((state) => state.setSession)
  // Esta línea sirve para obtener «clearPendingChallenge» con el hook «useAuthStore».
  const clearPendingChallenge = useAuthStore((state) => state.clearPendingChallenge)
  // Esta línea sirve para crear el estado «serverError» y su función «setServerError».
  const [serverError, setServerError] = useState<string | null>(null)

  // Esta línea sirve para abrir la desestructuración de las herramientas del formulario.
  const {
    // Esta línea sirve para incluir el valor «register» en la lista.
    register,
    // Esta línea sirve para incluir el valor «handleSubmit» en la lista.
    handleSubmit,
    // Esta línea sirve para declarar la propiedad «formState» con el valor o tipo «{ errors, isSubmitting }».
    formState: { errors, isSubmitting },
  // Esta línea sirve para cerrar la desestructuración y crear el formulario validado.
  } = useForm<VerifyFormValues>({ resolver: zodResolver(verifySchema) })

  // Solo verificamos una vez al montar: si el usuario navega/recarga esta
  // página directamente sin haber pasado por /login, no hay challenge
  // pendiente y lo mandamos de vuelta. No debe re-evaluarse reactivamente,
  // porque un envío exitoso también limpia `pendingChallenge` y esto
  // compite con la navegación al dashboard en onSubmit.
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para revisar si «!useAuthStore.getState().pendingChallenge».
    if (!useAuthStore.getState().pendingChallenge) {
      // Esta línea sirve para llamar a «navigate» con «"/login", { replace: true }».
      navigate("/login", { replace: true })
    }
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «navigate».
  }, [navigate])

  // Esta línea sirve para extraer «nSubmi» de «async (values: VerifyFormValues) => {».
  const onSubmit = async (values: VerifyFormValues) => {
    // Esta línea sirve para salir de la función si «!pendingChallenge».
    if (!pendingChallenge) return
    // Esta línea sirve para llamar a «setServerError» con «null».
    setServerError(null)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<AuthPayload>("/auth/2fa/challen» y obtener «user, token».
      const { user, token } = await api.post<AuthPayload>("/auth/2fa/challenge", {
        // Esta línea sirve para declarar la propiedad «challenge_token» con el valor o tipo «pendingChallenge.challengeToken».
        challenge_token: pendingChallenge.challengeToken,
        // Esta línea sirve para declarar la propiedad «code» con el valor o tipo «values.code».
        code: values.code,
        // Esta línea sirve para declarar la propiedad «device_name» con el valor o tipo «"sanken-web"».
        device_name: "sanken-web",
      })
      // Esta línea sirve para llamar a «setSession» con «token, user».
      setSession(token, user)
      // Esta línea sirve para llamar a «clearPendingChallenge».
      clearPendingChallenge()
      // Esta línea sirve para navegar al panel del entrenador o al dashboard según el rol, sin dejar historial.
      navigate(user.role === "trainer" ? "/trainer" : "/dashboard", { replace: true })
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para mostrar el mensaje de error de la API o uno genérico.
      setServerError(err instanceof ApiError ? err.body.message : "No se pudo verificar el código.")
    }
  }

  // Esta línea sirve para devolver null si «!pendingChallenge».
  if (!pendingChallenge) return null

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «AuthLayout».
    <AuthLayout>
      {/* Esta línea sirve para abrir el componente «Form». */}
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3" noValidate>
        {/* Esta línea sirve para abrir el componente «Form.Group». */}
        <Form.Group controlId="code">
          {/* Esta línea sirve para mostrar el texto «Código de verificación» dentro de «Form.Label». */}
          <Form.Label className="small fw-medium">Código de verificación</Form.Label>
          {/* Esta línea sirve para abrir el componente «Form.Text». */}
          <Form.Text className="d-block mb-2 text-body-secondary">
            {/* Esta línea sirve para mostrar la instrucción de ingresar el código. */}
            Ingresa el código de tu app autenticadora, o un código de recuperación.
          </Form.Text>
          {/* Esta línea sirve para abrir el campo del código. */}
          <Form.Control
            // Esta línea sirve para definir el atributo «type» con el valor «text».
            type="text"
            // Esta línea sirve para definir el atributo «autoComplete» con el valor «one-time-code».
            autoComplete="one-time-code"
            // Esta línea sirve para activar la opción «autoFocus».
            autoFocus
            // Esta línea sirve para pasar la propiedad «isInvalid» con el valor «!!errors.code}».
            isInvalid={!!errors.code}
            // Esta línea sirve para conectar el campo del código con el formulario.
            {...register("code")}
          />
          {/* Esta línea sirve para mostrar el valor «errors.code?.message» dentro de «Form.Control.Feedback». */}
          <Form.Control.Feedback type="invalid">{errors.code?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* Esta línea sirve para mostrar el bloque solo si «serverError». */}
        {serverError && (
          // Esta línea sirve para abrir el componente «Alert».
          <Alert variant="danger" className="py-2 small mb-0">
            {/* Esta línea sirve para mostrar el valor «serverError». */}
            {serverError}
          </Alert>
        )}

        {/* Esta línea sirve para abrir el componente «SankButton». */}
        <SankButton type="submit" disabled={isSubmitting} loading={isSubmitting} className="w-100 justify-content-center">
          {/* Esta línea sirve para mostrar el contenido dinámico «{isSubmitting ? "Verificando…" : "Verificar"}». */}
          {isSubmitting ? "Verificando…" : "Verificar"}
        </SankButton>
      </Form>
    </AuthLayout>
  )
}

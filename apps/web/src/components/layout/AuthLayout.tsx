// Esta línea sirve para importar los tipos «ReactNode» desde «react».
import type { ReactNode } from "react"
// Esta línea sirve para importar «Card» desde «react-bootstrap».
import { Card } from "react-bootstrap"
// Esta línea sirve para importar «LegalLinks» desde «@/components/legal/LegalLinks».
import { LegalLinks } from "@/components/legal/LegalLinks"

/** Shell compartido por login / registro / verificación 2FA — logo + card centrada sobre fondo con glow cyan sutil. */
// Esta línea sirve para declarar el diseño de las pantallas de autenticación.
export function AuthLayout({ children }: { children: ReactNode }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con sus atributos en varias líneas.
    <main
      // Esta línea sirve para aplicar las clases de estilo «d-flex flex-column align-items-center justify».
      className="d-flex flex-column align-items-center justify-content-center gap-4 px-3 py-5"
      // Esta línea sirve para pasar la propiedad «style» con el valor «{».
      style={{
        // Esta línea sirve para declarar la propiedad «minHeight» con el valor o tipo «"100svh"».
        minHeight: "100svh",
        // Esta línea sirve para definir el fondo del contenedor.
        background:
          // Esta línea sirve para usar un degradado radial sobre el color base.
          "radial-gradient(60% 50% at 50% 0%, rgba(0, 184, 217, 0.12), transparent 70%), var(--sanken-black)",
      }}
    >
      {/* Esta línea sirve para abrir el elemento «img». */}
      <img src="/logo-full.png" alt="SANKEN" style={{ width: 220, height: "auto" }} />
      {/* Esta línea sirve para abrir el componente «Card». */}
      <Card className="sank-surface border-0 w-100" style={{ maxWidth: 380 }}>
        {/* Esta línea sirve para mostrar el contenido dentro de la tarjeta. */}
        <Card.Body className="p-4">{children}</Card.Body>
      </Card>
      {/* Esta línea sirve para abrir el componente «LegalLinks». */}
      <LegalLinks className="w-100" />
    </main>
  )
}

import type { ReactNode } from "react"
import { Card } from "react-bootstrap"

/** Shell compartido por login / registro / verificación 2FA — logo + card centrada sobre fondo con glow cyan sutil. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main
      className="d-flex flex-column align-items-center justify-content-center gap-4 px-3 py-5"
      style={{
        minHeight: "100svh",
        background:
          "radial-gradient(60% 50% at 50% 0%, rgba(0, 184, 217, 0.12), transparent 70%), var(--sanken-black)",
      }}
    >
      <img src="/logo-full.png" alt="SANKEN" style={{ width: 220, height: "auto" }} />
      <Card className="sank-surface border-0 w-100" style={{ maxWidth: 380 }}>
        <Card.Body className="p-4">{children}</Card.Body>
      </Card>
    </main>
  )
}

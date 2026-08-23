# SanKen — Resumen Ejecutivo

## Visión
SanKen es una plataforma fitness inteligente que combina un motor de entrenamiento automático basado en evidencia científica con un ecosistema profesional para entrenadores. Un mismo producto, dos experiencias completamente diferenciadas, unidas por la misma identidad de marca: negro, blanco y dorado — premium, exclusiva, minimalista.

## Pilares del producto
1. **Motor de rutinas inteligente** — no aleatorio, basado en principios de periodización, volumen, intensidad y prioridad muscular.
2. **Sobrecarga progresiva automática** — el sistema decide el siguiente peso/repeticiones según el desempeño real registrado.
3. **Doble módulo independiente** — Usuario (automático) y Entrenador (gestión manual de clientes), compartiendo infraestructura pero no UI.
4. **Capa social y de gamificación** — rankings, logros, XP, retos — para retención y comunidad.
5. **Preparado para escalar** — Clean Architecture + Repository Pattern + Service Layer sobre Laravel 12, pensado para cientos de miles de usuarios concurrentes.

## Fases del producto
| Fase | Contenido | Objetivo |
|---|---|---|
| **Fase 1 — MVP** | Auth, onboarding, motor de rutinas, registro de entrenamiento, sobrecarga progresiva, historial, dashboard básico, módulo entrenador básico | Validar el core: "la app entrena por ti" |
| **Fase 2 — Social + Nutrición** | Rankings, logros, gamificación, calendario, nutrición, marketplace de entrenadores, suscripciones | Retención y monetización |
| **Fase 3 — IA** | Asistente IA, escáner de técnica, predicción de estancamientos, analítica avanzada | Diferenciación competitiva |

## Documentos de este roadmap
- [01-arquitectura.md](01-arquitectura.md) — Arquitectura de software, stack, diagrama de módulos, Clean Architecture
- [02-modelo-datos-bd.md](02-modelo-datos-bd.md) — Modelo de datos, ERD, esquema MySQL, índices
- [03-api.md](03-api.md) — API REST completa, versionado, autenticación, endpoints
- [04-ux-ui-wireframes.md](04-ux-ui-wireframes.md) — Design system, wireframes, flujos UX
- [05-casos-uso-historias-usuario.md](05-casos-uso-historias-usuario.md) — Casos de uso e historias de usuario
- [06-roadmap-sprints.md](06-roadmap-sprints.md) — Roadmap por fases y sprint planning

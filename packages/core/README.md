# @sanken/core

Código compartido entre `apps/web` (Vite) y `apps/mobile` (Expo): tipos que reflejan los contratos de [`docs/03-api.md`](../../docs/03-api.md) y un `ApiClient` mínimo sobre `fetch`.

No tiene build step: se consume directamente como TypeScript fuente.

- `apps/web` lo resuelve vía npm workspaces (`"@sanken/core": "*"`, símlink de la raíz).
- `apps/mobile` **no** es parte del workspace raíz (rompe el tooling de Expo — ver README raíz) y lo consume vía `"@sanken/core": "file:../../packages/core"`, symlink creado por su propio `npm install`.

- `src/api/client.ts` — `ApiClient`, `ApiError`, envelope de éxito/error de la API.
- `src/types/*` — tipos de dominio (`User`, `Routine`, `WorkoutSession`, `OnboardingAnswers`, ...).

A medida que avancen los sprints (ver [`docs/06-roadmap-sprints.md`](../../docs/06-roadmap-sprints.md)), este paquete debe crecer con los hooks reutilizables (`useAuth`, `useActiveRoutine`, ...) que hoy viven solo como código de ejemplo en cada app.

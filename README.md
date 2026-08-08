# SanKen

Plataforma fitness inteligente — motor de rutinas automático + módulo profesional para entrenadores. Ver [`docs/00-resumen-ejecutivo.md`](docs/00-resumen-ejecutivo.md) para la arquitectura completa.

## Estructura

```
apps/api      Laravel 12 API (PHP 8.4) — Clean Architecture (Domain/Application/Infrastructure/Http)
apps/web      React + Vite + TailwindCSS + Shadcn UI
apps/mobile   React Native + Expo (Expo Router)
packages/core Tipos y ApiClient compartidos entre web y mobile
docs/         Arquitectura, modelo de datos, API, UX/UI, roadmap
```

Este proyecto se desarrolla dentro de **WSL2 (Ubuntu)**, no en el filesystem nativo de Windows — evita los problemas de permisos/atributos que introduce OneDrive sobre `vendor/` y `node_modules/`.

**`apps/mobile` NO es parte del workspace raíz de npm** (a diferencia de `apps/web`). El tooling de Expo (`@expo/cli`, `expo-router`) asume una instalación de node_modules autocontenida; si se hoistea junto al resto del monorepo, `expo export`/`expo start` rompen resolviendo módulos internos. `apps/mobile` se instala de forma independiente y consume `@sanken/core` vía dependencia `file:../../packages/core` (symlink, sin build step).

## Requisitos

- WSL2 con Ubuntu 24.04
- PHP 8.4 + Composer (instalados vía `ondrej/php` PPA)
- Node.js 22 (vía NodeSource)
- Docker Desktop con integración WSL2 activada (MySQL 8 + Redis 7 en `docker-compose.yml`)

## Instalar dependencias

```bash
npm install                # raíz del monorepo: apps/web + packages/core
cd apps/mobile && npm install   # apps/mobile es un proyecto aislado
cd apps/api && composer install
```

## Arrancar el entorno

```bash
# 1. Infraestructura (MySQL + Redis)
docker compose up -d

# 2. Backend
cd apps/api
cp .env.example .env   # si no existe ya
php artisan migrate
php artisan db:seed              # países/ciudades/ejercicios base
php artisan serve                 # http://localhost:8000
php artisan queue:work            # OBLIGATORIO: sin esto, completar el onboarding
                                   # nunca genera la rutina (queda encolada en Redis
                                   # y nadie la procesa — ver docs/01-arquitectura.md §6)
php artisan reverb:start          # tiempo real (cuando se necesite)

# 3. Frontend web
cd apps/web
npm run dev                       # http://localhost:5173

# 4. Mobile
cd apps/mobile
npm run start                     # Expo Dev Tools / Metro
```

Desde la raíz del monorepo: `npm run dev:web` y `npm run dev:mobile` (este último solo invoca `npm --prefix apps/mobile run start`, no depende del workspace).

## Estado actual

- **Fase 0** — fundación técnica: Clean Architecture en Laravel, Sanctum + Reverb, MySQL/Redis en Docker, web y mobile hablando con la API vía `@sanken/core`.
- **Sprint 1** — Auth completo (Sanctum), roles con policy base, onboarding de 14 pasos en mobile.
- **Sprint 2** — Biblioteca de ~60 ejercicios + motor de rutinas (`Domain/Routine`, Strategy/Factory por objetivo), generación automática al completar el onboarding.
- **Sprint 3** — Home real, registro de entrenamiento (series, timer de descanso) en mobile.
- **Sprint 4** — `ProgressiveOverloadCalculator`, feedback de sesión ("¿pudiste completar?"), récords personales.

El ciclo completo "onboarding → rutina automática → entrenar → progresar semana a semana" funciona de punta a punta. Ver [`docs/06-roadmap-sprints.md`](docs/06-roadmap-sprints.md) para lo que sigue (Sprint 5: historial y dashboard).

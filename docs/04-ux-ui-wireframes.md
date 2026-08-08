# SanKen — Diseño UX/UI y Wireframes

## 1. Identidad visual

Inspiración: Apple (claridad, tipografía, aire), Nike Training Club (energía, cards de entrenamiento), Whoop (dashboards de datos elegantes, dark mode), Tesla (minimalismo funcional), Gymshark (actitud premium).

### Paleta de color

| Token | Hex | Uso |
|---|---|---|
| `--sanken-black` | `#0A0A0A` | Fondo principal (dark mode, default) |
| `--sanken-black-elevated` | `#151515` | Cards, superficies elevadas |
| `--sanken-white` | `#FAFAFA` | Texto principal sobre fondo oscuro, fondo en light mode |
| `--sanken-gold` | `#C9A227` | Acento primario (CTA, highlights, logros) |
| `--sanken-gold-light` | `#E4C874` | Hover/gradientes dorados |
| `--sanken-gray-900` a `--sanken-gray-100` | escala neutra | Texto secundario, bordes, estados disabled |
| `--sanken-success` | `#2E7D32` (uso mínimo) | Confirmaciones (RP logrado, entrenamiento completo) |
| `--sanken-danger` | `#B3261E` (uso mínimo) | Errores, fallo de entrenamiento |

Regla: **el dorado se usa con moderación** — solo para CTAs primarios, iconografía de logros/rankings y acentos de marca. Nunca como color de fondo extenso.

### Tipografía
- Display/Headlines: **Neue Haas Grotesk / Inter Tight** (geométrica, premium, similar a SF Pro).
- Cuerpo: **Inter**.
- Numérica (stats, pesos, contadores): variante tabular (`font-variant-numeric: tabular-nums`) para que las cifras no "bailen" en tiempo real.

### Principios de UI
- Dark mode por defecto; light mode disponible, ambos con el mismo lenguaje (negro/blanco/dorado invertido).
- Mucho espacio en blanco/negro — nunca más de 2 acentos dorados visibles por pantalla.
- Cards con bordes sutiles (`1px solid rgba(255,255,255,0.08)`), esquinas redondeadas medianas (12-16px), sombras suaves, nunca "planas" tipo Material.
- Animaciones: transiciones de 150-250ms, `ease-out`, micro-interacciones en botones y al completar una serie (haptic feedback en móvil).
- Iconografía: line icons minimalistas (estilo Lucide/SF Symbols), grosor constante.
- Gráficas: estilo Whoop — líneas finas, gradientes sutiles dorado→transparente, sin grillas pesadas.

## 2. Sistema de componentes (Shadcn UI como base)

Componentes core a construir sobre Shadcn: `Button` (primary dorado / secondary outline / ghost), `Card` (stat card, workout card, achievement card), `Progress` (circular para XP/anillos estilo Apple Watch), `Sheet`/`Drawer` (registro rápido de serie), `Tabs`, `Chart` (wrapper sobre Recharts con tema SanKen), `Badge` (logros, nivel), `Avatar`, `Toast` (feedback de PR logrado).

## 3. Flujo de navegación — Módulo Usuario (móvil, tab bar inferior)

```
[Inicio] [Entrenar] [Progreso] [Ranking] [Perfil]
```

### Wireframe — Onboarding (paso a paso, 1 pregunta por pantalla, barra de progreso superior)

```
┌─────────────────────────────┐
│ ●●●○○○○○○○○  (progreso)     │
│                              │
│   ¿Cuál es tu objetivo?      │
│                              │
│  ┌────────────────────────┐ │
│  │ 🏋  Ganar músculo       │ │
│  ├────────────────────────┤ │
│  │ 🔥  Perder grasa        │ │
│  ├────────────────────────┤ │
│  │ ⚖️  Recomposición       │ │
│  ├────────────────────────┤ │
│  │ 💪  Fuerza               │ │
│  └────────────────────────┘ │
│                              │
│         [ Continuar ]  ← dorado, ancho completo │
└─────────────────────────────┘
```

### Wireframe — Home (Inicio)

```
┌─────────────────────────────┐
│  Hola, Santiago       🔔     │
│  Racha: 12 días 🔥           │
│                              │
│  ┌──────────────────────┐   │
│  │ ENTRENAMIENTO DE HOY  │   │
│  │ Push · 6 ejercicios    │   │
│  │ ~55 min                │   │
│  │      [ Comenzar ]      │  ← CTA dorado grande
│  └──────────────────────┘   │
│                              │
│  Esta semana                │
│  ┌────┐┌────┐┌────┐┌────┐   │
│  │ ✔ ││ ✔ ││ ○ ││ ○ │ ...  │  anillo tipo Apple Watch
│  └────┘└────┘└────┘└────┘   │
│                              │
│  Resumen rápido              │
│  12.4t movidas · 48 series   │
│                              │
│  Cómo te sientes hoy?       │
│  Sueño ●●●○○  Energía ●●●●○ │
└─────────────────────────────┘
```

### Wireframe — Registro de serie (durante entrenamiento)

```
┌─────────────────────────────┐
│ ← Press Banca         2/6    │
│ Objetivo: 4×8-10 · RIR 2      │
│                              │
│  Serie 1  ✅ 100kg × 10       │
│  Serie 2  ✅  95kg × 10       │
│  Serie 3  ▶︎  Sugerido: 90kg × 10 │
│                              │
│   [ -2.5 ]  90.0 kg  [ +2.5 ]│
│   [  -1  ]    10     [  +1  ]│
│                              │
│        [ ✔ Completar serie ] │ ← dorado
│         [ Saltar descanso ]  │
│                              │
│  ⏱ Descanso: 01:32           │  timer grande, discreto
└─────────────────────────────┘
```

### Wireframe — Fin de entrenamiento / feedback

```
┌─────────────────────────────┐
│      🏆 ¡Entrenamiento       │
│         completado!          │
│                              │
│   +180 XP     Nivel 12 → 13  │
│   Nuevo PR: Press banca 100kg│
│                              │
│  ¿Pudiste completar          │
│  el entrenamiento tal        │
│  como estaba planeado?       │
│                              │
│     [ Sí ]        [ No ]     │
└─────────────────────────────┘
```

### Wireframe — Progreso (dashboard estilo Whoop)

```
┌─────────────────────────────┐
│  Progreso                    │
│  ┌──────────────────────┐   │
│  │   ⭕ 68%  Volumen      │   │  anillo dorado
│  │   semanal vs objetivo │   │
│  └──────────────────────┘   │
│  Peso corporal   ╱‾‾╲___╱‾  │  gráfica de línea fina
│  Fuerza (1RM)    Press · Sentadilla · Peso muerto (tabs)
│  Volumen por músculo (barras horizontales, gradiente dorado)
│  Récords personales (lista con medallas)
└─────────────────────────────┘
```

### Wireframe — Ranking

```
┌─────────────────────────────┐
│ Ranking   [Ciudad ▾][Press▾]│
│                              │
│  1  🥇 Carlos M.    140kg    │
│  2  🥈 Ana R.        135kg    │
│  3  🥉 Tú            132kg    │  ← fila resaltada dorado
│  4     Luis P.       128kg    │
│  ...                          │
└─────────────────────────────┘
```

## 4. Flujo Módulo Entrenador (web-first, también móvil)

Navegación lateral (desktop) / tabs (móvil): `Dashboard | Clientes | Rutinas | Biblioteca | Chat | Estadísticas`.

```
┌───────────────────────────────────────────────────┐
│ SanKen Coach          🔍 Buscar cliente     🔔  👤 │
├───────────┬─────────────────────────────────────────┤
│ Dashboard │  Mis clientes (24)                       │
│ Clientes  │  ┌───────────────────────────────────┐  │
│ Rutinas   │  │ 👤 María G.  · Racha 8d · ⚠ 2 días  │  │
│ Biblioteca│  │    sin entrenar                      │  │
│ Chat      │  ├───────────────────────────────────┤  │
│ Stats     │  │ 👤 Pedro L.  · Racha 21d · PR nuevo  │  │
│           │  └───────────────────────────────────┘  │
│           │            [ + Nuevo cliente ]           │
└───────────┴─────────────────────────────────────────┘
```

Editor de rutina: constructor drag-and-drop de días → ejercicios, con panel lateral de biblioteca filtrable, cada ejercicio editable inline (series/reps/descanso/RIR), botón "Duplicar como plantilla".

## 5. Responsive

- **Mobile-first** (React Native + Expo es la experiencia primaria de entrenamiento).
- **Web**: dashboard-first para ambos roles, con layout de 3 columnas en desktop (nav lateral / contenido / panel contextual), colapsando a tabs en tablet y bottom nav en mobile web.
- Breakpoints Tailwind estándar (`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`), componentes Shadcn ya responsive por defecto; se define un contenedor máximo de `1280px` para dashboards.

## 6. Accesibilidad
Contraste AA mínimo incluso sobre negro puro (texto secundario nunca por debajo de `#8A8A8A` sobre `#0A0A0A`), targets táctiles ≥44px, soporte de Dynamic Type/font scaling en móvil, labels ARIA en web.

/**
 * Colección local de "Consejo del día" (Home). Contenido estático: no
 * necesita backend y funciona sin conexión.
 *
 * Todas las categorías tienen la MISMA cantidad de consejos a propósito —
 * selection.ts los intercala por categoría, y con conteos iguales nunca
 * quedan dos días seguidos de la misma categoría.
 *
 * Para agregar consejos: sumar uno a CADA categoría (o el mismo número a
 * todas) y usar un id nuevo; nunca reutilizar ni renumerar ids existentes.
 */

// Esta línea sirve para declarar la lista de categorías de consejos del día.
export const DAILY_TIP_CATEGORIES = [
  // Esta línea sirve para listar la categoría de consejos «Entrenamiento».
  'Entrenamiento',
  // Esta línea sirve para listar la categoría de consejos «Técnica».
  'Técnica',
  // Esta línea sirve para listar la categoría de consejos «Recuperación».
  'Recuperación',
  // Esta línea sirve para listar la categoría de consejos «Descanso».
  'Descanso',
  // Esta línea sirve para listar la categoría de consejos «Sueño».
  'Sueño',
  // Esta línea sirve para listar la categoría de consejos «Hidratación».
  'Hidratación',
  // Esta línea sirve para listar la categoría de consejos «Alimentación».
  'Alimentación',
  // Esta línea sirve para listar la categoría de consejos «Movilidad».
  'Movilidad',
  // Esta línea sirve para listar la categoría de consejos «Cardio».
  'Cardio',
  // Esta línea sirve para listar la categoría de consejos «Progresión».
  'Progresión',
  // Esta línea sirve para listar la categoría de consejos «Motivación».
  'Motivación',
  // Esta línea sirve para listar la categoría de consejos «Hábitos».
  'Hábitos',
  // Esta línea sirve para listar la categoría de consejos «Prevención de lesiones».
  'Prevención de lesiones',
// Esta línea sirve para cerrar la lista de categorías como constante de solo lectura.
] as const;

// Esta línea sirve para declarar el tipo con las categorías posibles.
export type DailyTipCategory = (typeof DAILY_TIP_CATEGORIES)[number];

/**
 * Funcionalidades existentes de SanKen a las que un consejo puede enlazar.
 * Cada app (móvil/web) decide a qué ruta mapea cada una.
 */
// Esta línea sirve para declarar las secciones de la app a las que un consejo puede enlazar.
export type DailyTipLink = 'nutrition' | 'measurements' | 'history' | 'calendar' | 'prs' | 'progress';

// Esta línea sirve para declarar la forma de un consejo del día.
export interface DailyTip {
  // Esta línea sirve para guardar el id único del consejo.
  id: string;
  // Esta línea sirve para guardar la categoría del consejo.
  category: DailyTipCategory;
  // Esta línea sirve para guardar el título del consejo.
  title: string;
  // Esta línea sirve para guardar el texto del consejo.
  text: string;
  /** Solo en consejos donde una pantalla existente ayuda a aplicarlo. */
  // Esta línea sirve para guardar el enlace opcional a una pantalla de la app.
  link?: DailyTipLink;
}

// Esta línea sirve para declarar la lista de todos los consejos del día.
export const DAILY_TIPS: readonly DailyTip[] = [
  // ── Entrenamiento ───────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «training-001».
    id: 'training-001',
    // Esta línea sirve para asignar el consejo a la categoría «Entrenamiento».
    category: 'Entrenamiento',
    // Esta línea sirve para definir el título del consejo: «Series de aproximación».
    title: 'Series de aproximación',
    // Esta línea sirve para definir el texto del consejo: «Antes de tu primera serie pesada, haz 2–3 series l…».
    text: 'Antes de tu primera serie pesada, haz 2–3 series ligeras del mismo ejercicio subiendo el peso. Preparan el patrón de movimiento mejor que un calentamiento genérico.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «training-002».
    id: 'training-002',
    // Esta línea sirve para asignar el consejo a la categoría «Entrenamiento».
    category: 'Entrenamiento',
    // Esta línea sirve para definir el título del consejo: «Lo más exigente, primero».
    title: 'Lo más exigente, primero',
    // Esta línea sirve para definir el texto del consejo: «Coloca los ejercicios compuestos (sentadilla, pres…».
    text: 'Coloca los ejercicios compuestos (sentadilla, press, remo) al inicio de la sesión, cuando estás más fresco y concentrado.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «training-003».
    id: 'training-003',
    // Esta línea sirve para asignar el consejo a la categoría «Entrenamiento».
    category: 'Entrenamiento',
    // Esta línea sirve para definir el título del consejo: «Descansa según el ejercicio».
    title: 'Descansa según el ejercicio',
    // Esta línea sirve para definir el texto del consejo: «En básicos pesados, 2–3 minutos entre series rinde…».
    text: 'En básicos pesados, 2–3 minutos entre series rinden más que apurarte. En accesorios, 60–90 segundos suelen bastar.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «training-004».
    id: 'training-004',
    // Esta línea sirve para asignar el consejo a la categoría «Entrenamiento».
    category: 'Entrenamiento',
    // Esta línea sirve para definir el título del consejo: «Repeticiones en reserva».
    title: 'Repeticiones en reserva',
    // Esta línea sirve para definir el texto del consejo: «No hace falta llegar al fallo en cada serie. Termi…».
    text: 'No hace falta llegar al fallo en cada serie. Terminar dejando 1–3 repeticiones en el tanque da estímulo de sobra con menos fatiga.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «training-005».
    id: 'training-005',
    // Esta línea sirve para asignar el consejo a la categoría «Entrenamiento».
    category: 'Entrenamiento',
    // Esta línea sirve para definir el título del consejo: «Sabe qué tienes que superar».
    title: 'Sabe qué tienes que superar',
    // Esta línea sirve para definir el texto del consejo: «Antes de empezar, revisa qué peso y repeticiones h…».
    text: 'Antes de empezar, revisa qué peso y repeticiones hiciste la última vez en ese día de rutina. Entrenar con una cifra concreta en mente cambia la sesión.',
    // Esta línea sirve para enlazar el consejo con la sección «history» de la app.
    link: 'history',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «training-006».
    id: 'training-006',
    // Esta línea sirve para asignar el consejo a la categoría «Entrenamiento».
    category: 'Entrenamiento',
    // Esta línea sirve para definir el título del consejo: «Dale tiempo a tu rutina».
    title: 'Dale tiempo a tu rutina',
    // Esta línea sirve para definir el texto del consejo: «Cambiar de programa cada dos semanas impide ver qu…».
    text: 'Cambiar de programa cada dos semanas impide ver qué funciona. Sigue el mismo plan al menos 6–8 semanas antes de juzgarlo.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «training-007».
    id: 'training-007',
    // Esta línea sirve para asignar el consejo a la categoría «Entrenamiento».
    category: 'Entrenamiento',
    // Esta línea sirve para definir el título del consejo: «Empuja y tira por igual».
    title: 'Empuja y tira por igual',
    // Esta línea sirve para definir el texto del consejo: «Por cada ejercicio de empuje (press, fondos) inclu…».
    text: 'Por cada ejercicio de empuje (press, fondos) incluye uno de tracción (remo, jalón). Ese equilibrio protege tus hombros y tu postura.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «training-008».
    id: 'training-008',
    // Esta línea sirve para asignar el consejo a la categoría «Entrenamiento».
    category: 'Entrenamiento',
    // Esta línea sirve para definir el título del consejo: «Corta las series basura».
    title: 'Corta las series basura',
    // Esta línea sirve para definir el texto del consejo: «Si en las últimas series la técnica se desarma y e…».
    text: 'Si en las últimas series la técnica se desarma y el peso ya no se mueve bien, termina el ejercicio. Una serie mala suma fatiga, no progreso.',
  },

  // ── Técnica ─────────────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «technique-001».
    id: 'technique-001',
    // Esta línea sirve para asignar el consejo a la categoría «Técnica».
    category: 'Técnica',
    // Esta línea sirve para definir el título del consejo: «Controla la bajada».
    title: 'Controla la bajada',
    // Esta línea sirve para definir el texto del consejo: «Baja el peso en 2–3 segundos en vez de dejarlo cae…».
    text: 'Baja el peso en 2–3 segundos en vez de dejarlo caer. La fase excéntrica controlada genera mucho estímulo y reduce el riesgo de rebotes.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «technique-002».
    id: 'technique-002',
    // Esta línea sirve para asignar el consejo a la categoría «Técnica».
    category: 'Técnica',
    // Esta línea sirve para definir el título del consejo: «Usa el recorrido completo».
    title: 'Usa el recorrido completo',
    // Esta línea sirve para definir el texto del consejo: «Trabaja en el rango más amplio que puedas controla…».
    text: 'Trabaja en el rango más amplio que puedas controlar. Las repeticiones a medias permiten más peso, pero desarrollan menos músculo.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «technique-003».
    id: 'technique-003',
    // Esta línea sirve para asignar el consejo a la categoría «Técnica».
    category: 'Técnica',
    // Esta línea sirve para definir el título del consejo: «Aprieta el abdomen».
    title: 'Aprieta el abdomen',
    // Esta línea sirve para definir el texto del consejo: «Antes de cada repetición pesada, toma aire hacia e…».
    text: 'Antes de cada repetición pesada, toma aire hacia el abdomen y tensa el tronco como si fueran a empujarte. Mantén esa tensión hasta completar la repetición.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «technique-004».
    id: 'technique-004',
    // Esta línea sirve para asignar el consejo a la categoría «Técnica».
    category: 'Técnica',
    // Esta línea sirve para definir el título del consejo: «Tres apoyos en el pie».
    title: 'Tres apoyos en el pie',
    // Esta línea sirve para definir el texto del consejo: «En sentadilla y peso muerto reparte el peso entre …».
    text: 'En sentadilla y peso muerto reparte el peso entre talón, base del dedo gordo y base del meñique. Un pie estable da una base estable.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «technique-005».
    id: 'technique-005',
    // Esta línea sirve para asignar el consejo a la categoría «Técnica».
    category: 'Técnica',
    // Esta línea sirve para definir el título del consejo: «Barra pegada al cuerpo».
    title: 'Barra pegada al cuerpo',
    // Esta línea sirve para definir el texto del consejo: «En el peso muerto la barra debe subir rozando las …».
    text: 'En el peso muerto la barra debe subir rozando las piernas. Cada centímetro que se aleja carga más la zona lumbar.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «technique-006».
    id: 'technique-006',
    // Esta línea sirve para asignar el consejo a la categoría «Técnica».
    category: 'Técnica',
    // Esta línea sirve para definir el título del consejo: «Escápulas firmes en banca».
    title: 'Escápulas firmes en banca',
    // Esta línea sirve para definir el texto del consejo: «Junta y baja las escápulas antes de descolgar la b…».
    text: 'Junta y baja las escápulas antes de descolgar la barra y mantenlas así toda la serie. Hombros más estables y un press más fuerte.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «technique-007».
    id: 'technique-007',
    // Esta línea sirve para asignar el consejo a la categoría «Técnica».
    category: 'Técnica',
    // Esta línea sirve para definir el título del consejo: «Grábate de perfil».
    title: 'Grábate de perfil',
    // Esta línea sirve para definir el texto del consejo: «Un video lateral de tu serie muestra fallas que no…».
    text: 'Un video lateral de tu serie muestra fallas que no sientes al moverte. Y si es un récord, ya tienes la evidencia para registrarlo.',
    // Esta línea sirve para enlazar el consejo con la sección «prs» de la app.
    link: 'prs',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «technique-008».
    id: 'technique-008',
    // Esta línea sirve para asignar el consejo a la categoría «Técnica».
    category: 'Técnica',
    // Esta línea sirve para definir el título del consejo: «Rodillas hacia los pies».
    title: 'Rodillas hacia los pies',
    // Esta línea sirve para definir el texto del consejo: «En la sentadilla, las rodillas deben seguir la dir…».
    text: 'En la sentadilla, las rodillas deben seguir la dirección de la punta de los pies. Si se meten hacia adentro, baja el peso y empuja el suelo hacia afuera.',
  },

  // ── Recuperación ────────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «recovery-001».
    id: 'recovery-001',
    // Esta línea sirve para asignar el consejo a la categoría «Recuperación».
    category: 'Recuperación',
    // Esta línea sirve para definir el título del consejo: «48 horas por músculo».
    title: '48 horas por músculo',
    // Esta línea sirve para definir el texto del consejo: «Deja alrededor de dos días antes de volver a entre…».
    text: 'Deja alrededor de dos días antes de volver a entrenar duro el mismo grupo muscular. Así llegas a la siguiente sesión con capacidad de rendir.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «recovery-002».
    id: 'recovery-002',
    // Esta línea sirve para asignar el consejo a la categoría «Recuperación».
    category: 'Recuperación',
    // Esta línea sirve para definir el título del consejo: «Programa una descarga».
    title: 'Programa una descarga',
    // Esta línea sirve para definir el texto del consejo: «Cada 4–8 semanas, haz una semana con menos series …».
    text: 'Cada 4–8 semanas, haz una semana con menos series o menos peso. Disipa la fatiga acumulada y sueles volver más fuerte.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «recovery-003».
    id: 'recovery-003',
    // Esta línea sirve para asignar el consejo a la categoría «Recuperación».
    category: 'Recuperación',
    // Esta línea sirve para definir el título del consejo: «Recuperación activa».
    title: 'Recuperación activa',
    // Esta línea sirve para definir el texto del consejo: «En tu día libre, una caminata o bici suave de 20–3…».
    text: 'En tu día libre, una caminata o bici suave de 20–30 minutos ayuda a aliviar la rigidez más que quedarte totalmente quieto.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «recovery-004».
    id: 'recovery-004',
    // Esta línea sirve para asignar el consejo a la categoría «Recuperación».
    category: 'Recuperación',
    // Esta línea sirve para definir el título del consejo: «Las agujetas no son un medidor».
    title: 'Las agujetas no son un medidor',
    // Esta línea sirve para definir el texto del consejo: «No tener dolor muscular al día siguiente no signif…».
    text: 'No tener dolor muscular al día siguiente no significa que entrenaste mal. Juzga la sesión por tu progreso, no por cuánto te duele.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «recovery-005».
    id: 'recovery-005',
    // Esta línea sirve para asignar el consejo a la categoría «Recuperación».
    category: 'Recuperación',
    // Esta línea sirve para definir el título del consejo: «Señales de fatiga acumulada».
    title: 'Señales de fatiga acumulada',
    // Esta línea sirve para definir el texto del consejo: «Rendimiento estancado varias sesiones, irritabilid…».
    text: 'Rendimiento estancado varias sesiones, irritabilidad y peor sueño juntos suelen indicar que necesitas bajar la carga unos días.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «recovery-006».
    id: 'recovery-006',
    // Esta línea sirve para asignar el consejo a la categoría «Recuperación».
    category: 'Recuperación',
    // Esta línea sirve para definir el título del consejo: «Proteína tras entrenar».
    title: 'Proteína tras entrenar',
    // Esta línea sirve para definir el texto del consejo: «Incluye una comida con proteína en las horas sigui…».
    text: 'Incluye una comida con proteína en las horas siguientes a la sesión. No hay prisa de minutos: lo que más pesa es el total del día.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «recovery-007».
    id: 'recovery-007',
    // Esta línea sirve para asignar el consejo a la categoría «Recuperación».
    category: 'Recuperación',
    // Esta línea sirve para definir el título del consejo: «El estrés también cansa».
    title: 'El estrés también cansa',
    // Esta línea sirve para definir el texto del consejo: «Una semana pesada de trabajo o estudio reduce tu c…».
    text: 'Una semana pesada de trabajo o estudio reduce tu capacidad de recuperarte. En esos días, mantener la sesión con menos volumen es una buena decisión.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «recovery-008».
    id: 'recovery-008',
    // Esta línea sirve para asignar el consejo a la categoría «Recuperación».
    category: 'Recuperación',
    // Esta línea sirve para definir el título del consejo: «Frío, mejor más tarde».
    title: 'Frío, mejor más tarde',
    // Esta línea sirve para definir el texto del consejo: «Los baños de hielo justo después de entrenar puede…».
    text: 'Los baños de hielo justo después de entrenar pueden frenar las ganancias de músculo. Si tu objetivo es hipertrofia, sepáralos varias horas de la sesión.',
  },

  // ── Descanso ────────────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «rest-001».
    id: 'rest-001',
    // Esta línea sirve para asignar el consejo a la categoría «Descanso».
    category: 'Descanso',
    // Esta línea sirve para definir el título del consejo: «Planifica tus días libres».
    title: 'Planifica tus días libres',
    // Esta línea sirve para definir el texto del consejo: «Decide de antemano qué días no entrenas, igual que…».
    text: 'Decide de antemano qué días no entrenas, igual que decides cuáles sí. Uno o dos días libres por semana son parte del plan.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «rest-002».
    id: 'rest-002',
    // Esta línea sirve para asignar el consejo a la categoría «Descanso».
    category: 'Descanso',
    // Esta línea sirve para definir el título del consejo: «Creces mientras descansas».
    title: 'Creces mientras descansas',
    // Esta línea sirve para definir el texto del consejo: «El entrenamiento es el estímulo; la adaptación ocu…».
    text: 'El entrenamiento es el estímulo; la adaptación ocurre después, cuando el cuerpo se repara. Saltarte el descanso es saltarte esa parte.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «rest-003».
    id: 'rest-003',
    // Esta línea sirve para asignar el consejo a la categoría «Descanso».
    category: 'Descanso',
    // Esta línea sirve para definir el título del consejo: «Alterna intensidades».
    title: 'Alterna intensidades',
    // Esta línea sirve para definir el texto del consejo: «No todas las sesiones tienen que ser al máximo. Co…».
    text: 'No todas las sesiones tienen que ser al máximo. Combinar días exigentes con días más ligeros sostiene el rendimiento a largo plazo.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «rest-004».
    id: 'rest-004',
    // Esta línea sirve para asignar el consejo a la categoría «Descanso».
    category: 'Descanso',
    // Esta línea sirve para definir el título del consejo: «Levántate de la silla».
    title: 'Levántate de la silla',
    // Esta línea sirve para definir el texto del consejo: «Si pasas muchas horas sentado, ponte de pie y muév…».
    text: 'Si pasas muchas horas sentado, ponte de pie y muévete un par de minutos cada 45–60 minutos. Tu espalda y tus caderas lo notan.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «rest-005».
    id: 'rest-005',
    // Esta línea sirve para asignar el consejo a la categoría «Descanso».
    category: 'Descanso',
    // Esta línea sirve para definir el título del consejo: «Desconecta de verdad».
    title: 'Desconecta de verdad',
    // Esta línea sirve para definir el texto del consejo: «Un día sin pensar en series, macros ni récords tam…».
    text: 'Un día sin pensar en series, macros ni récords también descansa la cabeza. La constancia a largo plazo necesita esos respiros.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «rest-006».
    id: 'rest-006',
    // Esta línea sirve para asignar el consejo a la categoría «Descanso».
    category: 'Descanso',
    // Esta línea sirve para definir el título del consejo: «Vuelve gradual tras enfermar».
    title: 'Vuelve gradual tras enfermar',
    // Esta línea sirve para definir el texto del consejo: «Después de un resfriado o una gripe, retoma con me…».
    text: 'Después de un resfriado o una gripe, retoma con menos peso y menos series la primera semana. Forzar el regreso suele alargar la recaída.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «rest-007».
    id: 'rest-007',
    // Esta línea sirve para asignar el consejo a la categoría «Descanso».
    category: 'Descanso',
    // Esta línea sirve para definir el título del consejo: «Vacaciones sin culpa».
    title: 'Vacaciones sin culpa',
    // Esta línea sirve para definir el texto del consejo: «Una o dos semanas sin entrenar no borran tu progre…».
    text: 'Una o dos semanas sin entrenar no borran tu progreso. La fuerza y el músculo se recuperan rápido cuando vuelves a la rutina.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «rest-008».
    id: 'rest-008',
    // Esta línea sirve para asignar el consejo a la categoría «Descanso».
    category: 'Descanso',
    // Esta línea sirve para definir el título del consejo: «Respira entre series».
    title: 'Respira entre series',
    // Esta línea sirve para definir el texto del consejo: «Al terminar una serie dura, haz respiraciones lent…».
    text: 'Al terminar una serie dura, haz respiraciones lentas por la nariz. Bajar las pulsaciones más rápido te deja listo antes para la siguiente.',
  },

  // ── Sueño ───────────────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «sleep-001».
    id: 'sleep-001',
    // Esta línea sirve para asignar el consejo a la categoría «Sueño».
    category: 'Sueño',
    // Esta línea sirve para definir el título del consejo: «Apunta a 7–9 horas».
    title: 'Apunta a 7–9 horas',
    // Esta línea sirve para definir el texto del consejo: «Dormir poco reduce la fuerza, el apetito controlad…».
    text: 'Dormir poco reduce la fuerza, el apetito controlado y la recuperación muscular. Para la mayoría de adultos, 7–9 horas es el rango a buscar.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «sleep-002».
    id: 'sleep-002',
    // Esta línea sirve para asignar el consejo a la categoría «Sueño».
    category: 'Sueño',
    // Esta línea sirve para definir el título del consejo: «Mismo horario todos los días».
    title: 'Mismo horario todos los días',
    // Esta línea sirve para definir el texto del consejo: «Acostarte y levantarte a horas parecidas, incluso …».
    text: 'Acostarte y levantarte a horas parecidas, incluso el fin de semana, mejora la calidad del sueño más que dormir mucho un solo día.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «sleep-003».
    id: 'sleep-003',
    // Esta línea sirve para asignar el consejo a la categoría «Sueño».
    category: 'Sueño',
    // Esta línea sirve para definir el título del consejo: «Pantallas fuera antes de dormir».
    title: 'Pantallas fuera antes de dormir',
    // Esta línea sirve para definir el texto del consejo: «Deja el móvil 30–60 minutos antes de acostarte, o …».
    text: 'Deja el móvil 30–60 minutos antes de acostarte, o al menos baja el brillo al mínimo. La luz intensa retrasa la sensación de sueño.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «sleep-004».
    id: 'sleep-004',
    // Esta línea sirve para asignar el consejo a la categoría «Sueño».
    category: 'Sueño',
    // Esta línea sirve para definir el título del consejo: «Hora límite para la cafeína».
    title: 'Hora límite para la cafeína',
    // Esta línea sirve para definir el texto del consejo: «La cafeína sigue activa muchas horas después de to…».
    text: 'La cafeína sigue activa muchas horas después de tomarla. Evita café, mate o pre-entrenos en las 6–8 horas previas a dormir.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «sleep-005».
    id: 'sleep-005',
    // Esta línea sirve para asignar el consejo a la categoría «Sueño».
    category: 'Sueño',
    // Esta línea sirve para definir el título del consejo: «Cuarto fresco y oscuro».
    title: 'Cuarto fresco y oscuro',
    // Esta línea sirve para definir el texto del consejo: «Una habitación entre 18 y 20 °C, a oscuras y sin r…».
    text: 'Una habitación entre 18 y 20 °C, a oscuras y sin ruido facilita dormirte y no despertarte a mitad de la noche.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «sleep-006».
    id: 'sleep-006',
    // Esta línea sirve para asignar el consejo a la categoría «Sueño».
    category: 'Sueño',
    // Esta línea sirve para definir el título del consejo: «Siesta corta, no larga».
    title: 'Siesta corta, no larga',
    // Esta línea sirve para definir el texto del consejo: «Si duermes siesta, que sea de unos 20 minutos y an…».
    text: 'Si duermes siesta, que sea de unos 20 minutos y antes de media tarde. Más larga o más tarde puede quitarte sueño por la noche.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «sleep-007».
    id: 'sleep-007',
    // Esta línea sirve para asignar el consejo a la categoría «Sueño».
    category: 'Sueño',
    // Esta línea sirve para definir el título del consejo: «Cena con margen».
    title: 'Cena con margen',
    // Esta línea sirve para definir el texto del consejo: «Una comida muy abundante justo antes de acostarte …».
    text: 'Una comida muy abundante justo antes de acostarte dificulta el descanso. Intenta dejar 2–3 horas entre la cena y la cama.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «sleep-008».
    id: 'sleep-008',
    // Esta línea sirve para asignar el consejo a la categoría «Sueño».
    category: 'Sueño',
    // Esta línea sirve para definir el título del consejo: «El alcohol fragmenta el sueño».
    title: 'El alcohol fragmenta el sueño',
    // Esta línea sirve para definir el texto del consejo: «Puede ayudarte a dormirte, pero empeora la calidad…».
    text: 'Puede ayudarte a dormirte, pero empeora la calidad del descanso durante la noche y, con ella, tu recuperación del entrenamiento.',
  },

  // ── Hidratación ─────────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «hydration-001».
    id: 'hydration-001',
    // Esta línea sirve para asignar el consejo a la categoría «Hidratación».
    category: 'Hidratación',
    // Esta línea sirve para definir el título del consejo: «Llega hidratado».
    title: 'Llega hidratado',
    // Esta línea sirve para definir el texto del consejo: «Bebe agua de forma repartida en las horas previas …».
    text: 'Bebe agua de forma repartida en las horas previas al entrenamiento, en lugar de tomar medio litro de golpe justo antes de empezar.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «hydration-002».
    id: 'hydration-002',
    // Esta línea sirve para asignar el consejo a la categoría «Hidratación».
    category: 'Hidratación',
    // Esta línea sirve para definir el título del consejo: «Mira el color».
    title: 'Mira el color',
    // Esta línea sirve para definir el texto del consejo: «Una orina amarillo pálido suele indicar buena hidr…».
    text: 'Una orina amarillo pálido suele indicar buena hidratación. Si es oscura durante el día, probablemente te falta agua.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «hydration-003».
    id: 'hydration-003',
    // Esta línea sirve para asignar el consejo a la categoría «Hidratación».
    category: 'Hidratación',
    // Esta línea sirve para definir el título del consejo: «Botella a la vista».
    title: 'Botella a la vista',
    // Esta línea sirve para definir el texto del consejo: «Tener una botella en el escritorio o en la mochila…».
    text: 'Tener una botella en el escritorio o en la mochila hace que bebas casi sin pensarlo. Lo que no ves, lo olvidas.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «hydration-004».
    id: 'hydration-004',
    // Esta línea sirve para asignar el consejo a la categoría «Hidratación».
    category: 'Hidratación',
    // Esta línea sirve para definir el título del consejo: «Electrolitos en sesiones largas».
    title: 'Electrolitos en sesiones largas',
    // Esta línea sirve para definir el texto del consejo: «Si entrenas más de 60–90 minutos o con mucho calor…».
    text: 'Si entrenas más de 60–90 minutos o con mucho calor y sudor, suma sodio y electrolitos además del agua.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «hydration-005».
    id: 'hydration-005',
    // Esta línea sirve para asignar el consejo a la categoría «Hidratación».
    category: 'Hidratación',
    // Esta línea sirve para definir el título del consejo: «Pésate antes y después».
    title: 'Pésate antes y después',
    // Esta línea sirve para definir el texto del consejo: «Si pierdes peso durante una sesión, es sobre todo …».
    text: 'Si pierdes peso durante una sesión, es sobre todo agua. Repón aproximadamente 1,25–1,5 litros por cada kilo perdido.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «hydration-006».
    id: 'hydration-006',
    // Esta línea sirve para asignar el consejo a la categoría «Hidratación».
    category: 'Hidratación',
    // Esta línea sirve para definir el título del consejo: «No esperes a tener sed».
    title: 'No esperes a tener sed',
    // Esta línea sirve para definir el texto del consejo: «Durante el esfuerzo, la sed aparece cuando ya vas …».
    text: 'Durante el esfuerzo, la sed aparece cuando ya vas algo atrasado. Toma sorbos entre series en lugar de grandes tragos al final.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «hydration-007».
    id: 'hydration-007',
    // Esta línea sirve para asignar el consejo a la categoría «Hidratación».
    category: 'Hidratación',
    // Esta línea sirve para definir el título del consejo: «También se come el agua».
    title: 'También se come el agua',
    // Esta línea sirve para definir el texto del consejo: «Frutas, verduras y sopas aportan una parte importa…».
    text: 'Frutas, verduras y sopas aportan una parte importante de tu hidratación diaria. Un plato con vegetales también suma líquidos.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «hydration-008».
    id: 'hydration-008',
    // Esta línea sirve para asignar el consejo a la categoría «Hidratación».
    category: 'Hidratación',
    // Esta línea sirve para definir el título del consejo: «Más no siempre es mejor».
    title: 'Más no siempre es mejor',
    // Esta línea sirve para definir el texto del consejo: «En esfuerzos muy largos, beber grandes cantidades …».
    text: 'En esfuerzos muy largos, beber grandes cantidades de agua sin sodio puede ser peligroso. Ajusta lo que bebes a lo que sudas.',
  },

  // ── Alimentación ────────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «nutrition-001».
    id: 'nutrition-001',
    // Esta línea sirve para asignar el consejo a la categoría «Alimentación».
    category: 'Alimentación',
    // Esta línea sirve para definir el título del consejo: «Proteína en cada comida».
    title: 'Proteína en cada comida',
    // Esta línea sirve para definir el texto del consejo: «Repartir la proteína en 3–5 comidas funciona mejor…».
    text: 'Repartir la proteína en 3–5 comidas funciona mejor que concentrarla en una sola. Una referencia común es alrededor de 1,6 g por kilo al día.',
    // Esta línea sirve para enlazar el consejo con la sección «nutrition» de la app.
    link: 'nutrition',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «nutrition-002».
    id: 'nutrition-002',
    // Esta línea sirve para asignar el consejo a la categoría «Alimentación».
    category: 'Alimentación',
    // Esta línea sirve para definir el título del consejo: «Carbohidratos antes de entrenar».
    title: 'Carbohidratos antes de entrenar',
    // Esta línea sirve para definir el texto del consejo: «Una comida con carbohidratos 1–3 horas antes te da…».
    text: 'Una comida con carbohidratos 1–3 horas antes te da energía para rendir. Avena, arroz, pan o fruta son opciones simples.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «nutrition-003».
    id: 'nutrition-003',
    // Esta línea sirve para asignar el consejo a la categoría «Alimentación».
    category: 'Alimentación',
    // Esta línea sirve para definir el título del consejo: «Medio plato de verduras».
    title: 'Medio plato de verduras',
    // Esta línea sirve para definir el texto del consejo: «Llenar la mitad del plato con verduras suma fibra,…».
    text: 'Llenar la mitad del plato con verduras suma fibra, vitaminas y volumen con pocas calorías. Es una regla fácil para cualquier comida.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «nutrition-004».
    id: 'nutrition-004',
    // Esta línea sirve para asignar el consejo a la categoría «Alimentación».
    category: 'Alimentación',
    // Esta línea sirve para definir el título del consejo: «Las calorías deciden el peso».
    title: 'Las calorías deciden el peso',
    // Esta línea sirve para definir el texto del consejo: «Subir o bajar de peso depende de comer por encima …».
    text: 'Subir o bajar de peso depende de comer por encima o por debajo de lo que gastas. Conocer tus calorías objetivo evita ir a ciegas.',
    // Esta línea sirve para enlazar el consejo con la sección «nutrition» de la app.
    link: 'nutrition',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «nutrition-005».
    id: 'nutrition-005',
    // Esta línea sirve para asignar el consejo a la categoría «Alimentación».
    category: 'Alimentación',
    // Esta línea sirve para definir el título del consejo: «Déficit moderado».
    title: 'Déficit moderado',
    // Esta línea sirve para definir el texto del consejo: «Para perder grasa sin perder músculo, apunta a baj…».
    text: 'Para perder grasa sin perder músculo, apunta a bajar alrededor del 0,5–1 % de tu peso por semana. Más rápido suele costar fuerza.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «nutrition-006».
    id: 'nutrition-006',
    // Esta línea sirve para asignar el consejo a la categoría «Alimentación».
    category: 'Alimentación',
    // Esta línea sirve para definir el título del consejo: «Ojo con lo que bebes».
    title: 'Ojo con lo que bebes',
    // Esta línea sirve para definir el texto del consejo: «Refrescos, jugos y alcohol suman muchas calorías s…».
    text: 'Refrescos, jugos y alcohol suman muchas calorías sin saciarte. Cambiarlos por agua es de los ajustes más fáciles de sostener.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «nutrition-007».
    id: 'nutrition-007',
    // Esta línea sirve para asignar el consejo a la categoría «Alimentación».
    category: 'Alimentación',
    // Esta línea sirve para definir el título del consejo: «Escanea antes de comprar».
    title: 'Escanea antes de comprar',
    // Esta línea sirve para definir el texto del consejo: «Escanear el código de barras de un producto te mue…».
    text: 'Escanear el código de barras de un producto te muestra sus calorías y macros al momento. Ayuda a elegir sin tener que adivinar.',
    // Esta línea sirve para enlazar el consejo con la sección «nutrition» de la app.
    link: 'nutrition',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «nutrition-008».
    id: 'nutrition-008',
    // Esta línea sirve para asignar el consejo a la categoría «Alimentación».
    category: 'Alimentación',
    // Esta línea sirve para definir el título del consejo: «Fibra para la saciedad».
    title: 'Fibra para la saciedad',
    // Esta línea sirve para definir el texto del consejo: «Legumbres, avena, frutas y verduras te mantienen l…».
    text: 'Legumbres, avena, frutas y verduras te mantienen lleno más tiempo. Facilitan comer menos sin estar pensando en comida todo el día.',
  },

  // ── Movilidad ───────────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «mobility-001».
    id: 'mobility-001',
    // Esta línea sirve para asignar el consejo a la categoría «Movilidad».
    category: 'Movilidad',
    // Esta línea sirve para definir el título del consejo: «Dinámico antes, estático después».
    title: 'Dinámico antes, estático después',
    // Esta línea sirve para definir el texto del consejo: «Antes de entrenar, usa movimientos dinámicos como …».
    text: 'Antes de entrenar, usa movimientos dinámicos como balanceos y círculos. Guarda los estiramientos sostenidos para el final o para otro momento.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «mobility-002».
    id: 'mobility-002',
    // Esta línea sirve para asignar el consejo a la categoría «Movilidad».
    category: 'Movilidad',
    // Esta línea sirve para definir el título del consejo: «Revisa tus tobillos».
    title: 'Revisa tus tobillos',
    // Esta línea sirve para definir el texto del consejo: «Si los talones se despegan en la sentadilla, puede…».
    text: 'Si los talones se despegan en la sentadilla, puede faltarte movilidad de tobillo. Lleva la rodilla hacia delante, sobre el pie, con el talón apoyado.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «mobility-003».
    id: 'mobility-003',
    // Esta línea sirve para asignar el consejo a la categoría «Movilidad».
    category: 'Movilidad',
    // Esta línea sirve para definir el título del consejo: «Despierta la espalda alta».
    title: 'Despierta la espalda alta',
    // Esta línea sirve para definir el texto del consejo: «Acostado de lado, abre el brazo de arriba como un …».
    text: 'Acostado de lado, abre el brazo de arriba como un libro mientras giras el torso. Unas repeticiones mejoran la postura en press y sentadilla.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «mobility-004».
    id: 'mobility-004',
    // Esta línea sirve para asignar el consejo a la categoría «Movilidad».
    category: 'Movilidad',
    // Esta línea sirve para definir el título del consejo: «Caderas tras estar sentado».
    title: 'Caderas tras estar sentado',
    // Esta línea sirve para definir el texto del consejo: «Pasar horas sentado acorta los flexores de cadera.…».
    text: 'Pasar horas sentado acorta los flexores de cadera. Una zancada con la rodilla de atrás en el suelo, empujando la cadera adelante, los libera.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «mobility-005».
    id: 'mobility-005',
    // Esta línea sirve para asignar el consejo a la categoría «Movilidad».
    category: 'Movilidad',
    // Esta línea sirve para definir el título del consejo: «Carga el rango que ganas».
    title: 'Carga el rango que ganas',
    // Esta línea sirve para definir el texto del consejo: «La movilidad se consolida cuando la usas con peso.…».
    text: 'La movilidad se consolida cuando la usas con peso. Entrenar con recorrido completo es también trabajo de flexibilidad.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «mobility-006».
    id: 'mobility-006',
    // Esta línea sirve para asignar el consejo a la categoría «Movilidad».
    category: 'Movilidad',
    // Esta línea sirve para definir el título del consejo: «Poco y a diario».
    title: 'Poco y a diario',
    // Esta línea sirve para definir el texto del consejo: «Cinco minutos de movilidad cada día dan más result…».
    text: 'Cinco minutos de movilidad cada día dan más resultado que una hora una vez por semana. Hazlo mientras ves algo o al levantarte.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «mobility-007».
    id: 'mobility-007',
    // Esta línea sirve para asignar el consejo a la categoría «Movilidad».
    category: 'Movilidad',
    // Esta línea sirve para definir el título del consejo: «Hombros con una banda».
    title: 'Hombros con una banda',
    // Esta línea sirve para definir el texto del consejo: «Con una banda o un palo y agarre ancho, pasa los b…».
    text: 'Con una banda o un palo y agarre ancho, pasa los brazos rectos de adelante hacia atrás por encima de la cabeza. Abre el pecho y los hombros.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «mobility-008».
    id: 'mobility-008',
    // Esta línea sirve para asignar el consejo a la categoría «Movilidad».
    category: 'Movilidad',
    // Esta línea sirve para definir el título del consejo: «Estira sin rebotes».
    title: 'Estira sin rebotes',
    // Esta línea sirve para definir el texto del consejo: «Al estirar, llega a una tensión cómoda y sostenla …».
    text: 'Al estirar, llega a una tensión cómoda y sostenla respirando. Los rebotes activan el reflejo de tensión del músculo y avanzan menos.',
  },

  // ── Cardio ──────────────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «cardio-001».
    id: 'cardio-001',
    // Esta línea sirve para asignar el consejo a la categoría «Cardio».
    category: 'Cardio',
    // Esta línea sirve para definir el título del consejo: «Ritmo de conversación».
    title: 'Ritmo de conversación',
    // Esta línea sirve para definir el texto del consejo: «Gran parte de tu cardio puede ser a un ritmo en el…».
    text: 'Gran parte de tu cardio puede ser a un ritmo en el que todavía podrías hablar. Construye base aeróbica sin agotarte para las pesas.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «cardio-002».
    id: 'cardio-002',
    // Esta línea sirve para asignar el consejo a la categoría «Cardio».
    category: 'Cardio',
    // Esta línea sirve para definir el título del consejo: «El cardio no te quita músculo».
    title: 'El cardio no te quita músculo',
    // Esta línea sirve para definir el texto del consejo: «Una cantidad moderada de cardio es compatible con …».
    text: 'Una cantidad moderada de cardio es compatible con ganar fuerza y masa. El problema aparece solo con volúmenes muy altos sin comer suficiente.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «cardio-003».
    id: 'cardio-003',
    // Esta línea sirve para asignar el consejo a la categoría «Cardio».
    category: 'Cardio',
    // Esta línea sirve para definir el título del consejo: «Orden en el mismo día».
    title: 'Orden en el mismo día',
    // Esta línea sirve para definir el texto del consejo: «Si haces pesas y cardio intenso el mismo día, empi…».
    text: 'Si haces pesas y cardio intenso el mismo día, empieza por las pesas o sepáralos varias horas, sobre todo en día de pierna.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «cardio-004».
    id: 'cardio-004',
    // Esta línea sirve para asignar el consejo a la categoría «Cardio».
    category: 'Cardio',
    // Esta línea sirve para definir el título del consejo: «HIIT con moderación».
    title: 'HIIT con moderación',
    // Esta línea sirve para definir el texto del consejo: «Los intervalos de alta intensidad son efectivos pe…».
    text: 'Los intervalos de alta intensidad son efectivos pero muy demandantes. Una o dos sesiones por semana suelen ser suficientes.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «cardio-005».
    id: 'cardio-005',
    // Esta línea sirve para asignar el consejo a la categoría «Cardio».
    category: 'Cardio',
    // Esta línea sirve para definir el título del consejo: «Cuenta tus pasos».
    title: 'Cuenta tus pasos',
    // Esta línea sirve para definir el texto del consejo: «Caminar más durante el día puede quemar más calorí…».
    text: 'Caminar más durante el día puede quemar más calorías que una sesión de cardio. Un objetivo de 7.000–10.000 pasos es un buen punto de partida.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «cardio-006».
    id: 'cardio-006',
    // Esta línea sirve para asignar el consejo a la categoría «Cardio».
    category: 'Cardio',
    // Esta línea sirve para definir el título del consejo: «Escaleras en lugar de ascensor».
    title: 'Escaleras en lugar de ascensor',
    // Esta línea sirve para definir el texto del consejo: «Subir escaleras a diario es cardio corto que se su…».
    text: 'Subir escaleras a diario es cardio corto que se suma sin buscar tiempo extra. También fortalece piernas y glúteos.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «cardio-007».
    id: 'cardio-007',
    // Esta línea sirve para asignar el consejo a la categoría «Cardio».
    category: 'Cardio',
    // Esta línea sirve para definir el título del consejo: «Sube el cardio de a poco».
    title: 'Sube el cardio de a poco',
    // Esta línea sirve para definir el texto del consejo: «Aumenta la duración o la distancia alrededor de un…».
    text: 'Aumenta la duración o la distancia alrededor de un 10 % por semana. Saltos más grandes son una causa frecuente de molestias en rodillas y tendones.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «cardio-008».
    id: 'cardio-008',
    // Esta línea sirve para asignar el consejo a la categoría «Cardio».
    category: 'Cardio',
    // Esta línea sirve para definir el título del consejo: «Mejor fondo, mejores series».
    title: 'Mejor fondo, mejores series',
    // Esta línea sirve para definir el texto del consejo: «Una buena capacidad aeróbica te ayuda a recuperart…».
    text: 'Una buena capacidad aeróbica te ayuda a recuperarte entre series. Tus sesiones de pesas también salen ganando.',
  },

  // ── Progresión ──────────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «progression-001».
    id: 'progression-001',
    // Esta línea sirve para asignar el consejo a la categoría «Progresión».
    category: 'Progresión',
    // Esta línea sirve para definir el título del consejo: «Sobrecarga progresiva».
    title: 'Sobrecarga progresiva',
    // Esta línea sirve para definir el texto del consejo: «Para seguir avanzando, el estímulo tiene que crece…».
    text: 'Para seguir avanzando, el estímulo tiene que crecer con el tiempo: un poco más de peso, una repetición más o una serie extra.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «progression-002».
    id: 'progression-002',
    // Esta línea sirve para asignar el consejo a la categoría «Progresión».
    category: 'Progresión',
    // Esta línea sirve para definir el título del consejo: «Doble progresión».
    title: 'Doble progresión',
    // Esta línea sirve para definir el texto del consejo: «Trabaja en un rango, por ejemplo de 8 a 12 repetic…».
    text: 'Trabaja en un rango, por ejemplo de 8 a 12 repeticiones. Cuando completes 12 en todas las series, sube el peso y vuelve a empezar desde 8.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «progression-003».
    id: 'progression-003',
    // Esta línea sirve para asignar el consejo a la categoría «Progresión».
    category: 'Progresión',
    // Esta línea sirve para definir el título del consejo: «Saltos pequeños».
    title: 'Saltos pequeños',
    // Esta línea sirve para definir el texto del consejo: «En ejercicios de tren superior, subir de 1 a 2,5 k…».
    text: 'En ejercicios de tren superior, subir de 1 a 2,5 kg es suficiente. Los saltos grandes suelen terminar en estancamiento o mala técnica.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «progression-004».
    id: 'progression-004',
    // Esta línea sirve para asignar el consejo a la categoría «Progresión».
    category: 'Progresión',
    // Esta línea sirve para definir el título del consejo: «Estancado: cambia una sola cosa».
    title: 'Estancado: cambia una sola cosa',
    // Esta línea sirve para definir el texto del consejo: «Si llevas semanas sin avanzar en un ejercicio, aju…».
    text: 'Si llevas semanas sin avanzar en un ejercicio, ajusta una variable: rango de repeticiones, variante o descanso. Cambiar todo a la vez confunde.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «progression-005».
    id: 'progression-005',
    // Esta línea sirve para asignar el consejo a la categoría «Progresión».
    category: 'Progresión',
    // Esta línea sirve para definir el título del consejo: «Más allá de la báscula».
    title: 'Más allá de la báscula',
    // Esta línea sirve para definir el texto del consejo: «El peso puede quedarse igual mientras pierdes gras…».
    text: 'El peso puede quedarse igual mientras pierdes grasa y ganas músculo. La cintura, los brazos y las piernas cuentan otra historia.',
    // Esta línea sirve para enlazar el consejo con la sección «measurements» de la app.
    link: 'measurements',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «progression-006».
    id: 'progression-006',
    // Esta línea sirve para asignar el consejo a la categoría «Progresión».
    category: 'Progresión',
    // Esta línea sirve para definir el título del consejo: «Fotos en las mismas condiciones».
    title: 'Fotos en las mismas condiciones',
    // Esta línea sirve para definir el texto del consejo: «Para comparar tu físico, sácate las fotos con la m…».
    text: 'Para comparar tu físico, sácate las fotos con la misma luz, ángulo y hora del día. Si no, los cambios reales se pierden.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «progression-007».
    id: 'progression-007',
    // Esta línea sirve para asignar el consejo a la categoría «Progresión».
    category: 'Progresión',
    // Esta línea sirve para definir el título del consejo: «Compárate en meses, no en días».
    title: 'Compárate en meses, no en días',
    // Esta línea sirve para definir el texto del consejo: «Tu progreso se ve mejor mirando varios meses atrás…».
    text: 'Tu progreso se ve mejor mirando varios meses atrás que comparando una sesión con la anterior. Los días malos se diluyen en la tendencia.',
    // Esta línea sirve para enlazar el consejo con la sección «progress» de la app.
    link: 'progress',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «progression-008».
    id: 'progression-008',
    // Esta línea sirve para asignar el consejo a la categoría «Progresión».
    category: 'Progresión',
    // Esta línea sirve para definir el título del consejo: «Las repeticiones también son récord».
    title: 'Las repeticiones también son récord',
    // Esta línea sirve para definir el texto del consejo: «Hacer 5 repeticiones con un peso con el que antes …».
    text: 'Hacer 5 repeticiones con un peso con el que antes hacías 3 es un récord personal, aunque la barra pese lo mismo.',
    // Esta línea sirve para enlazar el consejo con la sección «prs» de la app.
    link: 'prs',
  },

  // ── Motivación ──────────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «motivation-001».
    id: 'motivation-001',
    // Esta línea sirve para asignar el consejo a la categoría «Motivación».
    category: 'Motivación',
    // Esta línea sirve para definir el título del consejo: «Un objetivo con fecha».
    title: 'Un objetivo con fecha',
    // Esta línea sirve para definir el texto del consejo: «…».
    text: '"Ponerme fuerte" es difuso; "hacer 10 dominadas antes de diciembre" es un objetivo. Lo concreto y con plazo se persigue mejor.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «motivation-002».
    id: 'motivation-002',
    // Esta línea sirve para asignar el consejo a la categoría «Motivación».
    category: 'Motivación',
    // Esta línea sirve para definir el título del consejo: «La regla de los 5 minutos».
    title: 'La regla de los 5 minutos',
    // Esta línea sirve para definir el texto del consejo: «En un día sin ganas, comprométete solo a 5 minutos…».
    text: 'En un día sin ganas, comprométete solo a 5 minutos de entrenamiento. Empezar es lo más difícil; casi siempre terminas la sesión.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «motivation-003».
    id: 'motivation-003',
    // Esta línea sirve para asignar el consejo a la categoría «Motivación».
    category: 'Motivación',
    // Esta línea sirve para definir el título del consejo: «Repasa la sesión de antemano».
    title: 'Repasa la sesión de antemano',
    // Esta línea sirve para definir el texto del consejo: «Antes de llegar, repasa mentalmente los ejercicios…».
    text: 'Antes de llegar, repasa mentalmente los ejercicios y los pesos que te tocan. Llegas con un plan y pierdes menos tiempo dudando.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «motivation-004».
    id: 'motivation-004',
    // Esta línea sirve para asignar el consejo a la categoría «Motivación».
    category: 'Motivación',
    // Esta línea sirve para definir el título del consejo: «Entrena acompañado».
    title: 'Entrena acompañado',
    // Esta línea sirve para definir el texto del consejo: «Quedar con alguien para entrenar hace más difícil …».
    text: 'Quedar con alguien para entrenar hace más difícil faltar. Un compañero también te anima en las series difíciles.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «motivation-005».
    id: 'motivation-005',
    // Esta línea sirve para asignar el consejo a la categoría «Motivación».
    category: 'Motivación',
    // Esta línea sirve para definir el título del consejo: «Nunca faltes dos veces».
    title: 'Nunca faltes dos veces',
    // Esta línea sirve para definir el texto del consejo: «Saltarte un entrenamiento no rompe nada. Saltarte …».
    text: 'Saltarte un entrenamiento no rompe nada. Saltarte dos seguidos empieza a romper el hábito. Si fallaste ayer, hoy es el día de volver.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «motivation-006».
    id: 'motivation-006',
    // Esta línea sirve para asignar el consejo a la categoría «Motivación».
    category: 'Motivación',
    // Esta línea sirve para definir el título del consejo: «Mira cuánto llevas».
    title: 'Mira cuánto llevas',
    // Esta línea sirve para definir el texto del consejo: «En un día de pocas ganas, revisa todas las sesione…».
    text: 'En un día de pocas ganas, revisa todas las sesiones que ya completaste. Ver el camino recorrido ayuda a no tirarlo por la borda.',
    // Esta línea sirve para enlazar el consejo con la sección «history» de la app.
    link: 'history',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «motivation-007».
    id: 'motivation-007',
    // Esta línea sirve para asignar el consejo a la categoría «Motivación».
    category: 'Motivación',
    // Esta línea sirve para definir el título del consejo: «Una playlist para lo pesado».
    title: 'Una playlist para lo pesado',
    // Esta línea sirve para definir el texto del consejo: «Reserva tus canciones más enérgicas para las serie…».
    text: 'Reserva tus canciones más enérgicas para las series exigentes. Asociar esa música al esfuerzo te ayuda a activarte cuando hace falta.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «motivation-008».
    id: 'motivation-008',
    // Esta línea sirve para asignar el consejo a la categoría «Motivación».
    category: 'Motivación',
    // Esta línea sirve para definir el título del consejo: «Las ganas van y vienen».
    title: 'Las ganas van y vienen',
    // Esta línea sirve para definir el texto del consejo: «No esperes a sentirte motivado para entrenar. Deci…».
    text: 'No esperes a sentirte motivado para entrenar. Decide los días y la hora de antemano y cúmplelos aunque las ganas no aparezcan.',
  },

  // ── Hábitos ─────────────────────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «habits-001».
    id: 'habits-001',
    // Esta línea sirve para asignar el consejo a la categoría «Hábitos».
    category: 'Hábitos',
    // Esta línea sirve para definir el título del consejo: «Agenda tus entrenamientos».
    title: 'Agenda tus entrenamientos',
    // Esta línea sirve para definir el texto del consejo: «Anota tus sesiones en el calendario como cualquier…».
    text: 'Anota tus sesiones en el calendario como cualquier otra cita. Lo que tiene día y hora tiene muchas más probabilidades de pasar.',
    // Esta línea sirve para enlazar el consejo con la sección «calendar» de la app.
    link: 'calendar',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «habits-002».
    id: 'habits-002',
    // Esta línea sirve para asignar el consejo a la categoría «Hábitos».
    category: 'Hábitos',
    // Esta línea sirve para definir el título del consejo: «Engánchalo a otro hábito».
    title: 'Engánchalo a otro hábito',
    // Esta línea sirve para definir el texto del consejo: «Asocia el entrenamiento a algo que ya haces siempr…».
    text: 'Asocia el entrenamiento a algo que ya haces siempre, como "al salir del trabajo voy directo al gimnasio". La rutina existente hace de recordatorio.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «habits-003».
    id: 'habits-003',
    // Esta línea sirve para asignar el consejo a la categoría «Hábitos».
    category: 'Hábitos',
    // Esta línea sirve para definir el título del consejo: «Cocina por adelantado».
    title: 'Cocina por adelantado',
    // Esta línea sirve para definir el texto del consejo: «Preparar comidas para 2–3 días te protege de pedir…».
    text: 'Preparar comidas para 2–3 días te protege de pedir cualquier cosa cuando llegas cansado. Una tarde de cocina ahorra muchas decisiones.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «habits-004».
    id: 'habits-004',
    // Esta línea sirve para asignar el consejo a la categoría «Hábitos».
    category: 'Hábitos',
    // Esta línea sirve para definir el título del consejo: «Deja la mochila lista».
    title: 'Deja la mochila lista',
    // Esta línea sirve para definir el texto del consejo: «Prepara la ropa y la mochila del gimnasio la noche…».
    text: 'Prepara la ropa y la mochila del gimnasio la noche anterior. Quitar pequeñas excusas por la mañana hace que salgas sin pensarlo.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «habits-005».
    id: 'habits-005',
    // Esta línea sirve para asignar el consejo a la categoría «Hábitos».
    category: 'Hábitos',
    // Esta línea sirve para definir el título del consejo: «Evalúa la semana, no el día».
    title: 'Evalúa la semana, no el día',
    // Esta línea sirve para definir el texto del consejo: «Un día fuera del plan no define nada. Pregúntate s…».
    text: 'Un día fuera del plan no define nada. Pregúntate si la semana completa fue mayormente buena; eso es lo que da resultados.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «habits-006».
    id: 'habits-006',
    // Esta línea sirve para asignar el consejo a la categoría «Hábitos».
    category: 'Hábitos',
    // Esta línea sirve para definir el título del consejo: «Compra con lista».
    title: 'Compra con lista',
    // Esta línea sirve para definir el texto del consejo: «Ir al supermercado con una lista planificada reduc…».
    text: 'Ir al supermercado con una lista planificada reduce las compras impulsivas. Lo que no está en tu casa, no te lo comes.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «habits-007».
    id: 'habits-007',
    // Esta línea sirve para asignar el consejo a la categoría «Hábitos».
    category: 'Hábitos',
    // Esta línea sirve para definir el título del consejo: «Proteína fácil a mano».
    title: 'Proteína fácil a mano',
    // Esta línea sirve para definir el texto del consejo: «Ten en casa opciones listas como huevos, yogur, at…».
    text: 'Ten en casa opciones listas como huevos, yogur, atún o queso fresco. Llegar a tu proteína diaria es más simple sin tener que cocinar siempre.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «habits-008».
    id: 'habits-008',
    // Esta línea sirve para asignar el consejo a la categoría «Hábitos».
    category: 'Hábitos',
    // Esta línea sirve para definir el título del consejo: «Pésate siempre igual».
    title: 'Pésate siempre igual',
    // Esta línea sirve para definir el texto del consejo: «Si te pesas, hazlo al levantarte, después de ir al…».
    text: 'Si te pesas, hazlo al levantarte, después de ir al baño y antes de comer. Fíjate en el promedio semanal, no en el número de un día.',
  },

  // ── Prevención de lesiones ──────────────────────────────────────────────
  {
    // Esta línea sirve para identificar el consejo con el id «injury-001».
    id: 'injury-001',
    // Esta línea sirve para asignar el consejo a la categoría «Prevención de lesiones».
    category: 'Prevención de lesiones',
    // Esta línea sirve para definir el título del consejo: «Sin saltos bruscos de volumen».
    title: 'Sin saltos bruscos de volumen',
    // Esta línea sirve para definir el texto del consejo: «Duplicar de golpe las series o los días de entrena…».
    text: 'Duplicar de golpe las series o los días de entrenamiento es una causa común de lesiones. Aumenta la carga semanal de forma gradual.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «injury-002».
    id: 'injury-002',
    // Esta línea sirve para asignar el consejo a la categoría «Prevención de lesiones».
    category: 'Prevención de lesiones',
    // Esta línea sirve para definir el título del consejo: «Dolor punzante: detente».
    title: 'Dolor punzante: detente',
    // Esta línea sirve para definir el texto del consejo: «El ardor muscular es normal; un dolor agudo o punz…».
    text: 'El ardor muscular es normal; un dolor agudo o punzante en una articulación no lo es. Si aparece, para el ejercicio en lugar de seguir.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «injury-003».
    id: 'injury-003',
    // Esta línea sirve para asignar el consejo a la categoría «Prevención de lesiones».
    category: 'Prevención de lesiones',
    // Esta línea sirve para definir el título del consejo: «Cuida el manguito rotador».
    title: 'Cuida el manguito rotador',
    // Esta línea sirve para definir el texto del consejo: «Las rotaciones externas con banda elástica fortale…».
    text: 'Las rotaciones externas con banda elástica fortalecen los músculos que estabilizan el hombro. Unas series ligeras a la semana bastan.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «injury-004».
    id: 'injury-004',
    // Esta línea sirve para asignar el consejo a la categoría «Prevención de lesiones».
    category: 'Prevención de lesiones',
    // Esta línea sirve para definir el título del consejo: «Calzado para levantar».
    title: 'Calzado para levantar',
    // Esta línea sirve para definir el texto del consejo: «Para sentadilla y peso muerto, una suela plana y f…».
    text: 'Para sentadilla y peso muerto, una suela plana y firme es más estable que zapatillas de running muy acolchadas.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «injury-005».
    id: 'injury-005',
    // Esta línea sirve para asignar el consejo a la categoría «Prevención de lesiones».
    category: 'Prevención de lesiones',
    // Esta línea sirve para definir el título del consejo: «Pon los seguros a la barra».
    title: 'Pon los seguros a la barra',
    // Esta línea sirve para definir el texto del consejo: «Usa siempre los topes o seguros en los discos. Una…».
    text: 'Usa siempre los topes o seguros en los discos. Una barra que se desequilibra a mitad de serie puede lesionarte en un segundo.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «injury-006».
    id: 'injury-006',
    // Esta línea sirve para asignar el consejo a la categoría «Prevención de lesiones».
    category: 'Prevención de lesiones',
    // Esta línea sirve para definir el título del consejo: «Barras de seguridad o compañero».
    title: 'Barras de seguridad o compañero',
    // Esta línea sirve para definir el texto del consejo: «En press banca y sentadilla pesados, entrena con b…».
    text: 'En press banca y sentadilla pesados, entrena con barras de seguridad bien ajustadas o con alguien que te asista.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «injury-007».
    id: 'injury-007',
    // Esta línea sirve para asignar el consejo a la categoría «Prevención de lesiones».
    category: 'Prevención de lesiones',
    // Esta línea sirve para definir el título del consejo: «Deja el ego en la puerta».
    title: 'Deja el ego en la puerta',
    // Esta línea sirve para definir el texto del consejo: «Elige el peso por la técnica que puedes mantener, …».
    text: 'Elige el peso por la técnica que puedes mantener, no por lo que levanta el de al lado. La barra no sabe quién está mirando.',
  },
  {
    // Esta línea sirve para identificar el consejo con el id «injury-008».
    id: 'injury-008',
    // Esta línea sirve para asignar el consejo a la categoría «Prevención de lesiones».
    category: 'Prevención de lesiones',
    // Esta línea sirve para definir el título del consejo: «Trabaja cada lado por separado».
    title: 'Trabaja cada lado por separado',
    // Esta línea sirve para definir el texto del consejo: «Ejercicios a una pierna o un brazo, como zancadas …».
    text: 'Ejercicios a una pierna o un brazo, como zancadas o remo con mancuerna, revelan y corrigen desequilibrios entre lados.',
  },
];

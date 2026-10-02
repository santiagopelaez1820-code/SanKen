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

export const DAILY_TIP_CATEGORIES = [
  'Entrenamiento',
  'Técnica',
  'Recuperación',
  'Descanso',
  'Sueño',
  'Hidratación',
  'Alimentación',
  'Movilidad',
  'Cardio',
  'Progresión',
  'Motivación',
  'Hábitos',
  'Prevención de lesiones',
] as const;

export type DailyTipCategory = (typeof DAILY_TIP_CATEGORIES)[number];

/**
 * Funcionalidades existentes de SanKen a las que un consejo puede enlazar.
 * Cada app (móvil/web) decide a qué ruta mapea cada una.
 */
export type DailyTipLink = 'nutrition' | 'measurements' | 'history' | 'calendar' | 'prs' | 'progress';

export interface DailyTip {
  id: string;
  category: DailyTipCategory;
  title: string;
  text: string;
  /** Solo en consejos donde una pantalla existente ayuda a aplicarlo. */
  link?: DailyTipLink;
}

export const DAILY_TIPS: readonly DailyTip[] = [
  // ── Entrenamiento ───────────────────────────────────────────────────────
  {
    id: 'training-001',
    category: 'Entrenamiento',
    title: 'Series de aproximación',
    text: 'Antes de tu primera serie pesada, haz 2–3 series ligeras del mismo ejercicio subiendo el peso. Preparan el patrón de movimiento mejor que un calentamiento genérico.',
  },
  {
    id: 'training-002',
    category: 'Entrenamiento',
    title: 'Lo más exigente, primero',
    text: 'Coloca los ejercicios compuestos (sentadilla, press, remo) al inicio de la sesión, cuando estás más fresco y concentrado.',
  },
  {
    id: 'training-003',
    category: 'Entrenamiento',
    title: 'Descansa según el ejercicio',
    text: 'En básicos pesados, 2–3 minutos entre series rinden más que apurarte. En accesorios, 60–90 segundos suelen bastar.',
  },
  {
    id: 'training-004',
    category: 'Entrenamiento',
    title: 'Repeticiones en reserva',
    text: 'No hace falta llegar al fallo en cada serie. Terminar dejando 1–3 repeticiones en el tanque da estímulo de sobra con menos fatiga.',
  },
  {
    id: 'training-005',
    category: 'Entrenamiento',
    title: 'Sabe qué tienes que superar',
    text: 'Antes de empezar, revisa qué peso y repeticiones hiciste la última vez en ese día de rutina. Entrenar con una cifra concreta en mente cambia la sesión.',
    link: 'history',
  },
  {
    id: 'training-006',
    category: 'Entrenamiento',
    title: 'Dale tiempo a tu rutina',
    text: 'Cambiar de programa cada dos semanas impide ver qué funciona. Sigue el mismo plan al menos 6–8 semanas antes de juzgarlo.',
  },
  {
    id: 'training-007',
    category: 'Entrenamiento',
    title: 'Empuja y tira por igual',
    text: 'Por cada ejercicio de empuje (press, fondos) incluye uno de tracción (remo, jalón). Ese equilibrio protege tus hombros y tu postura.',
  },
  {
    id: 'training-008',
    category: 'Entrenamiento',
    title: 'Corta las series basura',
    text: 'Si en las últimas series la técnica se desarma y el peso ya no se mueve bien, termina el ejercicio. Una serie mala suma fatiga, no progreso.',
  },

  // ── Técnica ─────────────────────────────────────────────────────────────
  {
    id: 'technique-001',
    category: 'Técnica',
    title: 'Controla la bajada',
    text: 'Baja el peso en 2–3 segundos en vez de dejarlo caer. La fase excéntrica controlada genera mucho estímulo y reduce el riesgo de rebotes.',
  },
  {
    id: 'technique-002',
    category: 'Técnica',
    title: 'Usa el recorrido completo',
    text: 'Trabaja en el rango más amplio que puedas controlar. Las repeticiones a medias permiten más peso, pero desarrollan menos músculo.',
  },
  {
    id: 'technique-003',
    category: 'Técnica',
    title: 'Aprieta el abdomen',
    text: 'Antes de cada repetición pesada, toma aire hacia el abdomen y tensa el tronco como si fueran a empujarte. Mantén esa tensión hasta completar la repetición.',
  },
  {
    id: 'technique-004',
    category: 'Técnica',
    title: 'Tres apoyos en el pie',
    text: 'En sentadilla y peso muerto reparte el peso entre talón, base del dedo gordo y base del meñique. Un pie estable da una base estable.',
  },
  {
    id: 'technique-005',
    category: 'Técnica',
    title: 'Barra pegada al cuerpo',
    text: 'En el peso muerto la barra debe subir rozando las piernas. Cada centímetro que se aleja carga más la zona lumbar.',
  },
  {
    id: 'technique-006',
    category: 'Técnica',
    title: 'Escápulas firmes en banca',
    text: 'Junta y baja las escápulas antes de descolgar la barra y mantenlas así toda la serie. Hombros más estables y un press más fuerte.',
  },
  {
    id: 'technique-007',
    category: 'Técnica',
    title: 'Grábate de perfil',
    text: 'Un video lateral de tu serie muestra fallas que no sientes al moverte. Y si es un récord, ya tienes la evidencia para registrarlo.',
    link: 'prs',
  },
  {
    id: 'technique-008',
    category: 'Técnica',
    title: 'Rodillas hacia los pies',
    text: 'En la sentadilla, las rodillas deben seguir la dirección de la punta de los pies. Si se meten hacia adentro, baja el peso y empuja el suelo hacia afuera.',
  },

  // ── Recuperación ────────────────────────────────────────────────────────
  {
    id: 'recovery-001',
    category: 'Recuperación',
    title: '48 horas por músculo',
    text: 'Deja alrededor de dos días antes de volver a entrenar duro el mismo grupo muscular. Así llegas a la siguiente sesión con capacidad de rendir.',
  },
  {
    id: 'recovery-002',
    category: 'Recuperación',
    title: 'Programa una descarga',
    text: 'Cada 4–8 semanas, haz una semana con menos series o menos peso. Disipa la fatiga acumulada y sueles volver más fuerte.',
  },
  {
    id: 'recovery-003',
    category: 'Recuperación',
    title: 'Recuperación activa',
    text: 'En tu día libre, una caminata o bici suave de 20–30 minutos ayuda a aliviar la rigidez más que quedarte totalmente quieto.',
  },
  {
    id: 'recovery-004',
    category: 'Recuperación',
    title: 'Las agujetas no son un medidor',
    text: 'No tener dolor muscular al día siguiente no significa que entrenaste mal. Juzga la sesión por tu progreso, no por cuánto te duele.',
  },
  {
    id: 'recovery-005',
    category: 'Recuperación',
    title: 'Señales de fatiga acumulada',
    text: 'Rendimiento estancado varias sesiones, irritabilidad y peor sueño juntos suelen indicar que necesitas bajar la carga unos días.',
  },
  {
    id: 'recovery-006',
    category: 'Recuperación',
    title: 'Proteína tras entrenar',
    text: 'Incluye una comida con proteína en las horas siguientes a la sesión. No hay prisa de minutos: lo que más pesa es el total del día.',
  },
  {
    id: 'recovery-007',
    category: 'Recuperación',
    title: 'El estrés también cansa',
    text: 'Una semana pesada de trabajo o estudio reduce tu capacidad de recuperarte. En esos días, mantener la sesión con menos volumen es una buena decisión.',
  },
  {
    id: 'recovery-008',
    category: 'Recuperación',
    title: 'Frío, mejor más tarde',
    text: 'Los baños de hielo justo después de entrenar pueden frenar las ganancias de músculo. Si tu objetivo es hipertrofia, sepáralos varias horas de la sesión.',
  },

  // ── Descanso ────────────────────────────────────────────────────────────
  {
    id: 'rest-001',
    category: 'Descanso',
    title: 'Planifica tus días libres',
    text: 'Decide de antemano qué días no entrenas, igual que decides cuáles sí. Uno o dos días libres por semana son parte del plan.',
  },
  {
    id: 'rest-002',
    category: 'Descanso',
    title: 'Creces mientras descansas',
    text: 'El entrenamiento es el estímulo; la adaptación ocurre después, cuando el cuerpo se repara. Saltarte el descanso es saltarte esa parte.',
  },
  {
    id: 'rest-003',
    category: 'Descanso',
    title: 'Alterna intensidades',
    text: 'No todas las sesiones tienen que ser al máximo. Combinar días exigentes con días más ligeros sostiene el rendimiento a largo plazo.',
  },
  {
    id: 'rest-004',
    category: 'Descanso',
    title: 'Levántate de la silla',
    text: 'Si pasas muchas horas sentado, ponte de pie y muévete un par de minutos cada 45–60 minutos. Tu espalda y tus caderas lo notan.',
  },
  {
    id: 'rest-005',
    category: 'Descanso',
    title: 'Desconecta de verdad',
    text: 'Un día sin pensar en series, macros ni récords también descansa la cabeza. La constancia a largo plazo necesita esos respiros.',
  },
  {
    id: 'rest-006',
    category: 'Descanso',
    title: 'Vuelve gradual tras enfermar',
    text: 'Después de un resfriado o una gripe, retoma con menos peso y menos series la primera semana. Forzar el regreso suele alargar la recaída.',
  },
  {
    id: 'rest-007',
    category: 'Descanso',
    title: 'Vacaciones sin culpa',
    text: 'Una o dos semanas sin entrenar no borran tu progreso. La fuerza y el músculo se recuperan rápido cuando vuelves a la rutina.',
  },
  {
    id: 'rest-008',
    category: 'Descanso',
    title: 'Respira entre series',
    text: 'Al terminar una serie dura, haz respiraciones lentas por la nariz. Bajar las pulsaciones más rápido te deja listo antes para la siguiente.',
  },

  // ── Sueño ───────────────────────────────────────────────────────────────
  {
    id: 'sleep-001',
    category: 'Sueño',
    title: 'Apunta a 7–9 horas',
    text: 'Dormir poco reduce la fuerza, el apetito controlado y la recuperación muscular. Para la mayoría de adultos, 7–9 horas es el rango a buscar.',
  },
  {
    id: 'sleep-002',
    category: 'Sueño',
    title: 'Mismo horario todos los días',
    text: 'Acostarte y levantarte a horas parecidas, incluso el fin de semana, mejora la calidad del sueño más que dormir mucho un solo día.',
  },
  {
    id: 'sleep-003',
    category: 'Sueño',
    title: 'Pantallas fuera antes de dormir',
    text: 'Deja el móvil 30–60 minutos antes de acostarte, o al menos baja el brillo al mínimo. La luz intensa retrasa la sensación de sueño.',
  },
  {
    id: 'sleep-004',
    category: 'Sueño',
    title: 'Hora límite para la cafeína',
    text: 'La cafeína sigue activa muchas horas después de tomarla. Evita café, mate o pre-entrenos en las 6–8 horas previas a dormir.',
  },
  {
    id: 'sleep-005',
    category: 'Sueño',
    title: 'Cuarto fresco y oscuro',
    text: 'Una habitación entre 18 y 20 °C, a oscuras y sin ruido facilita dormirte y no despertarte a mitad de la noche.',
  },
  {
    id: 'sleep-006',
    category: 'Sueño',
    title: 'Siesta corta, no larga',
    text: 'Si duermes siesta, que sea de unos 20 minutos y antes de media tarde. Más larga o más tarde puede quitarte sueño por la noche.',
  },
  {
    id: 'sleep-007',
    category: 'Sueño',
    title: 'Cena con margen',
    text: 'Una comida muy abundante justo antes de acostarte dificulta el descanso. Intenta dejar 2–3 horas entre la cena y la cama.',
  },
  {
    id: 'sleep-008',
    category: 'Sueño',
    title: 'El alcohol fragmenta el sueño',
    text: 'Puede ayudarte a dormirte, pero empeora la calidad del descanso durante la noche y, con ella, tu recuperación del entrenamiento.',
  },

  // ── Hidratación ─────────────────────────────────────────────────────────
  {
    id: 'hydration-001',
    category: 'Hidratación',
    title: 'Llega hidratado',
    text: 'Bebe agua de forma repartida en las horas previas al entrenamiento, en lugar de tomar medio litro de golpe justo antes de empezar.',
  },
  {
    id: 'hydration-002',
    category: 'Hidratación',
    title: 'Mira el color',
    text: 'Una orina amarillo pálido suele indicar buena hidratación. Si es oscura durante el día, probablemente te falta agua.',
  },
  {
    id: 'hydration-003',
    category: 'Hidratación',
    title: 'Botella a la vista',
    text: 'Tener una botella en el escritorio o en la mochila hace que bebas casi sin pensarlo. Lo que no ves, lo olvidas.',
  },
  {
    id: 'hydration-004',
    category: 'Hidratación',
    title: 'Electrolitos en sesiones largas',
    text: 'Si entrenas más de 60–90 minutos o con mucho calor y sudor, suma sodio y electrolitos además del agua.',
  },
  {
    id: 'hydration-005',
    category: 'Hidratación',
    title: 'Pésate antes y después',
    text: 'Si pierdes peso durante una sesión, es sobre todo agua. Repón aproximadamente 1,25–1,5 litros por cada kilo perdido.',
  },
  {
    id: 'hydration-006',
    category: 'Hidratación',
    title: 'No esperes a tener sed',
    text: 'Durante el esfuerzo, la sed aparece cuando ya vas algo atrasado. Toma sorbos entre series en lugar de grandes tragos al final.',
  },
  {
    id: 'hydration-007',
    category: 'Hidratación',
    title: 'También se come el agua',
    text: 'Frutas, verduras y sopas aportan una parte importante de tu hidratación diaria. Un plato con vegetales también suma líquidos.',
  },
  {
    id: 'hydration-008',
    category: 'Hidratación',
    title: 'Más no siempre es mejor',
    text: 'En esfuerzos muy largos, beber grandes cantidades de agua sin sodio puede ser peligroso. Ajusta lo que bebes a lo que sudas.',
  },

  // ── Alimentación ────────────────────────────────────────────────────────
  {
    id: 'nutrition-001',
    category: 'Alimentación',
    title: 'Proteína en cada comida',
    text: 'Repartir la proteína en 3–5 comidas funciona mejor que concentrarla en una sola. Una referencia común es alrededor de 1,6 g por kilo al día.',
    link: 'nutrition',
  },
  {
    id: 'nutrition-002',
    category: 'Alimentación',
    title: 'Carbohidratos antes de entrenar',
    text: 'Una comida con carbohidratos 1–3 horas antes te da energía para rendir. Avena, arroz, pan o fruta son opciones simples.',
  },
  {
    id: 'nutrition-003',
    category: 'Alimentación',
    title: 'Medio plato de verduras',
    text: 'Llenar la mitad del plato con verduras suma fibra, vitaminas y volumen con pocas calorías. Es una regla fácil para cualquier comida.',
  },
  {
    id: 'nutrition-004',
    category: 'Alimentación',
    title: 'Las calorías deciden el peso',
    text: 'Subir o bajar de peso depende de comer por encima o por debajo de lo que gastas. Conocer tus calorías objetivo evita ir a ciegas.',
    link: 'nutrition',
  },
  {
    id: 'nutrition-005',
    category: 'Alimentación',
    title: 'Déficit moderado',
    text: 'Para perder grasa sin perder músculo, apunta a bajar alrededor del 0,5–1 % de tu peso por semana. Más rápido suele costar fuerza.',
  },
  {
    id: 'nutrition-006',
    category: 'Alimentación',
    title: 'Ojo con lo que bebes',
    text: 'Refrescos, jugos y alcohol suman muchas calorías sin saciarte. Cambiarlos por agua es de los ajustes más fáciles de sostener.',
  },
  {
    id: 'nutrition-007',
    category: 'Alimentación',
    title: 'Escanea antes de comprar',
    text: 'Escanear el código de barras de un producto te muestra sus calorías y macros al momento. Ayuda a elegir sin tener que adivinar.',
    link: 'nutrition',
  },
  {
    id: 'nutrition-008',
    category: 'Alimentación',
    title: 'Fibra para la saciedad',
    text: 'Legumbres, avena, frutas y verduras te mantienen lleno más tiempo. Facilitan comer menos sin estar pensando en comida todo el día.',
  },

  // ── Movilidad ───────────────────────────────────────────────────────────
  {
    id: 'mobility-001',
    category: 'Movilidad',
    title: 'Dinámico antes, estático después',
    text: 'Antes de entrenar, usa movimientos dinámicos como balanceos y círculos. Guarda los estiramientos sostenidos para el final o para otro momento.',
  },
  {
    id: 'mobility-002',
    category: 'Movilidad',
    title: 'Revisa tus tobillos',
    text: 'Si los talones se despegan en la sentadilla, puede faltarte movilidad de tobillo. Lleva la rodilla hacia delante, sobre el pie, con el talón apoyado.',
  },
  {
    id: 'mobility-003',
    category: 'Movilidad',
    title: 'Despierta la espalda alta',
    text: 'Acostado de lado, abre el brazo de arriba como un libro mientras giras el torso. Unas repeticiones mejoran la postura en press y sentadilla.',
  },
  {
    id: 'mobility-004',
    category: 'Movilidad',
    title: 'Caderas tras estar sentado',
    text: 'Pasar horas sentado acorta los flexores de cadera. Una zancada con la rodilla de atrás en el suelo, empujando la cadera adelante, los libera.',
  },
  {
    id: 'mobility-005',
    category: 'Movilidad',
    title: 'Carga el rango que ganas',
    text: 'La movilidad se consolida cuando la usas con peso. Entrenar con recorrido completo es también trabajo de flexibilidad.',
  },
  {
    id: 'mobility-006',
    category: 'Movilidad',
    title: 'Poco y a diario',
    text: 'Cinco minutos de movilidad cada día dan más resultado que una hora una vez por semana. Hazlo mientras ves algo o al levantarte.',
  },
  {
    id: 'mobility-007',
    category: 'Movilidad',
    title: 'Hombros con una banda',
    text: 'Con una banda o un palo y agarre ancho, pasa los brazos rectos de adelante hacia atrás por encima de la cabeza. Abre el pecho y los hombros.',
  },
  {
    id: 'mobility-008',
    category: 'Movilidad',
    title: 'Estira sin rebotes',
    text: 'Al estirar, llega a una tensión cómoda y sostenla respirando. Los rebotes activan el reflejo de tensión del músculo y avanzan menos.',
  },

  // ── Cardio ──────────────────────────────────────────────────────────────
  {
    id: 'cardio-001',
    category: 'Cardio',
    title: 'Ritmo de conversación',
    text: 'Gran parte de tu cardio puede ser a un ritmo en el que todavía podrías hablar. Construye base aeróbica sin agotarte para las pesas.',
  },
  {
    id: 'cardio-002',
    category: 'Cardio',
    title: 'El cardio no te quita músculo',
    text: 'Una cantidad moderada de cardio es compatible con ganar fuerza y masa. El problema aparece solo con volúmenes muy altos sin comer suficiente.',
  },
  {
    id: 'cardio-003',
    category: 'Cardio',
    title: 'Orden en el mismo día',
    text: 'Si haces pesas y cardio intenso el mismo día, empieza por las pesas o sepáralos varias horas, sobre todo en día de pierna.',
  },
  {
    id: 'cardio-004',
    category: 'Cardio',
    title: 'HIIT con moderación',
    text: 'Los intervalos de alta intensidad son efectivos pero muy demandantes. Una o dos sesiones por semana suelen ser suficientes.',
  },
  {
    id: 'cardio-005',
    category: 'Cardio',
    title: 'Cuenta tus pasos',
    text: 'Caminar más durante el día puede quemar más calorías que una sesión de cardio. Un objetivo de 7.000–10.000 pasos es un buen punto de partida.',
  },
  {
    id: 'cardio-006',
    category: 'Cardio',
    title: 'Escaleras en lugar de ascensor',
    text: 'Subir escaleras a diario es cardio corto que se suma sin buscar tiempo extra. También fortalece piernas y glúteos.',
  },
  {
    id: 'cardio-007',
    category: 'Cardio',
    title: 'Sube el cardio de a poco',
    text: 'Aumenta la duración o la distancia alrededor de un 10 % por semana. Saltos más grandes son una causa frecuente de molestias en rodillas y tendones.',
  },
  {
    id: 'cardio-008',
    category: 'Cardio',
    title: 'Mejor fondo, mejores series',
    text: 'Una buena capacidad aeróbica te ayuda a recuperarte entre series. Tus sesiones de pesas también salen ganando.',
  },

  // ── Progresión ──────────────────────────────────────────────────────────
  {
    id: 'progression-001',
    category: 'Progresión',
    title: 'Sobrecarga progresiva',
    text: 'Para seguir avanzando, el estímulo tiene que crecer con el tiempo: un poco más de peso, una repetición más o una serie extra.',
  },
  {
    id: 'progression-002',
    category: 'Progresión',
    title: 'Doble progresión',
    text: 'Trabaja en un rango, por ejemplo de 8 a 12 repeticiones. Cuando completes 12 en todas las series, sube el peso y vuelve a empezar desde 8.',
  },
  {
    id: 'progression-003',
    category: 'Progresión',
    title: 'Saltos pequeños',
    text: 'En ejercicios de tren superior, subir de 1 a 2,5 kg es suficiente. Los saltos grandes suelen terminar en estancamiento o mala técnica.',
  },
  {
    id: 'progression-004',
    category: 'Progresión',
    title: 'Estancado: cambia una sola cosa',
    text: 'Si llevas semanas sin avanzar en un ejercicio, ajusta una variable: rango de repeticiones, variante o descanso. Cambiar todo a la vez confunde.',
  },
  {
    id: 'progression-005',
    category: 'Progresión',
    title: 'Más allá de la báscula',
    text: 'El peso puede quedarse igual mientras pierdes grasa y ganas músculo. La cintura, los brazos y las piernas cuentan otra historia.',
    link: 'measurements',
  },
  {
    id: 'progression-006',
    category: 'Progresión',
    title: 'Fotos en las mismas condiciones',
    text: 'Para comparar tu físico, sácate las fotos con la misma luz, ángulo y hora del día. Si no, los cambios reales se pierden.',
  },
  {
    id: 'progression-007',
    category: 'Progresión',
    title: 'Compárate en meses, no en días',
    text: 'Tu progreso se ve mejor mirando varios meses atrás que comparando una sesión con la anterior. Los días malos se diluyen en la tendencia.',
    link: 'progress',
  },
  {
    id: 'progression-008',
    category: 'Progresión',
    title: 'Las repeticiones también son récord',
    text: 'Hacer 5 repeticiones con un peso con el que antes hacías 3 es un récord personal, aunque la barra pese lo mismo.',
    link: 'prs',
  },

  // ── Motivación ──────────────────────────────────────────────────────────
  {
    id: 'motivation-001',
    category: 'Motivación',
    title: 'Un objetivo con fecha',
    text: '"Ponerme fuerte" es difuso; "hacer 10 dominadas antes de diciembre" es un objetivo. Lo concreto y con plazo se persigue mejor.',
  },
  {
    id: 'motivation-002',
    category: 'Motivación',
    title: 'La regla de los 5 minutos',
    text: 'En un día sin ganas, comprométete solo a 5 minutos de entrenamiento. Empezar es lo más difícil; casi siempre terminas la sesión.',
  },
  {
    id: 'motivation-003',
    category: 'Motivación',
    title: 'Repasa la sesión de antemano',
    text: 'Antes de llegar, repasa mentalmente los ejercicios y los pesos que te tocan. Llegas con un plan y pierdes menos tiempo dudando.',
  },
  {
    id: 'motivation-004',
    category: 'Motivación',
    title: 'Entrena acompañado',
    text: 'Quedar con alguien para entrenar hace más difícil faltar. Un compañero también te anima en las series difíciles.',
  },
  {
    id: 'motivation-005',
    category: 'Motivación',
    title: 'Nunca faltes dos veces',
    text: 'Saltarte un entrenamiento no rompe nada. Saltarte dos seguidos empieza a romper el hábito. Si fallaste ayer, hoy es el día de volver.',
  },
  {
    id: 'motivation-006',
    category: 'Motivación',
    title: 'Mira cuánto llevas',
    text: 'En un día de pocas ganas, revisa todas las sesiones que ya completaste. Ver el camino recorrido ayuda a no tirarlo por la borda.',
    link: 'history',
  },
  {
    id: 'motivation-007',
    category: 'Motivación',
    title: 'Una playlist para lo pesado',
    text: 'Reserva tus canciones más enérgicas para las series exigentes. Asociar esa música al esfuerzo te ayuda a activarte cuando hace falta.',
  },
  {
    id: 'motivation-008',
    category: 'Motivación',
    title: 'Las ganas van y vienen',
    text: 'No esperes a sentirte motivado para entrenar. Decide los días y la hora de antemano y cúmplelos aunque las ganas no aparezcan.',
  },

  // ── Hábitos ─────────────────────────────────────────────────────────────
  {
    id: 'habits-001',
    category: 'Hábitos',
    title: 'Agenda tus entrenamientos',
    text: 'Anota tus sesiones en el calendario como cualquier otra cita. Lo que tiene día y hora tiene muchas más probabilidades de pasar.',
    link: 'calendar',
  },
  {
    id: 'habits-002',
    category: 'Hábitos',
    title: 'Engánchalo a otro hábito',
    text: 'Asocia el entrenamiento a algo que ya haces siempre, como "al salir del trabajo voy directo al gimnasio". La rutina existente hace de recordatorio.',
  },
  {
    id: 'habits-003',
    category: 'Hábitos',
    title: 'Cocina por adelantado',
    text: 'Preparar comidas para 2–3 días te protege de pedir cualquier cosa cuando llegas cansado. Una tarde de cocina ahorra muchas decisiones.',
  },
  {
    id: 'habits-004',
    category: 'Hábitos',
    title: 'Deja la mochila lista',
    text: 'Prepara la ropa y la mochila del gimnasio la noche anterior. Quitar pequeñas excusas por la mañana hace que salgas sin pensarlo.',
  },
  {
    id: 'habits-005',
    category: 'Hábitos',
    title: 'Evalúa la semana, no el día',
    text: 'Un día fuera del plan no define nada. Pregúntate si la semana completa fue mayormente buena; eso es lo que da resultados.',
  },
  {
    id: 'habits-006',
    category: 'Hábitos',
    title: 'Compra con lista',
    text: 'Ir al supermercado con una lista planificada reduce las compras impulsivas. Lo que no está en tu casa, no te lo comes.',
  },
  {
    id: 'habits-007',
    category: 'Hábitos',
    title: 'Proteína fácil a mano',
    text: 'Ten en casa opciones listas como huevos, yogur, atún o queso fresco. Llegar a tu proteína diaria es más simple sin tener que cocinar siempre.',
  },
  {
    id: 'habits-008',
    category: 'Hábitos',
    title: 'Pésate siempre igual',
    text: 'Si te pesas, hazlo al levantarte, después de ir al baño y antes de comer. Fíjate en el promedio semanal, no en el número de un día.',
  },

  // ── Prevención de lesiones ──────────────────────────────────────────────
  {
    id: 'injury-001',
    category: 'Prevención de lesiones',
    title: 'Sin saltos bruscos de volumen',
    text: 'Duplicar de golpe las series o los días de entrenamiento es una causa común de lesiones. Aumenta la carga semanal de forma gradual.',
  },
  {
    id: 'injury-002',
    category: 'Prevención de lesiones',
    title: 'Dolor punzante: detente',
    text: 'El ardor muscular es normal; un dolor agudo o punzante en una articulación no lo es. Si aparece, para el ejercicio en lugar de seguir.',
  },
  {
    id: 'injury-003',
    category: 'Prevención de lesiones',
    title: 'Cuida el manguito rotador',
    text: 'Las rotaciones externas con banda elástica fortalecen los músculos que estabilizan el hombro. Unas series ligeras a la semana bastan.',
  },
  {
    id: 'injury-004',
    category: 'Prevención de lesiones',
    title: 'Calzado para levantar',
    text: 'Para sentadilla y peso muerto, una suela plana y firme es más estable que zapatillas de running muy acolchadas.',
  },
  {
    id: 'injury-005',
    category: 'Prevención de lesiones',
    title: 'Pon los seguros a la barra',
    text: 'Usa siempre los topes o seguros en los discos. Una barra que se desequilibra a mitad de serie puede lesionarte en un segundo.',
  },
  {
    id: 'injury-006',
    category: 'Prevención de lesiones',
    title: 'Barras de seguridad o compañero',
    text: 'En press banca y sentadilla pesados, entrena con barras de seguridad bien ajustadas o con alguien que te asista.',
  },
  {
    id: 'injury-007',
    category: 'Prevención de lesiones',
    title: 'Deja el ego en la puerta',
    text: 'Elige el peso por la técnica que puedes mantener, no por lo que levanta el de al lado. La barra no sabe quién está mirando.',
  },
  {
    id: 'injury-008',
    category: 'Prevención de lesiones',
    title: 'Trabaja cada lado por separado',
    text: 'Ejercicios a una pierna o un brazo, como zancadas o remo con mancuerna, revelan y corrigen desequilibrios entre lados.',
  },
];

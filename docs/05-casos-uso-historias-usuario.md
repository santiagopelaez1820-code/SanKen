# SanKen — Casos de Uso e Historias de Usuario

Formato: `Como [rol], quiero [acción], para [beneficio]`. Criterios de aceptación en formato Given/When/Then donde aporta claridad.

## Épica 1 — Identidad y Onboarding

**HU-01** Como usuario nuevo, quiero registrarme con email y contraseña, para crear mi cuenta en SanKen.
- Given datos válidos, When me registro, Then recibo un token de sesión y un email de verificación.

**HU-02** Como usuario nuevo, quiero completar un onboarding guiado (datos, nivel, objetivo, frecuencia, tiempo, lugar, equipo, lesiones), para que la app entienda mi contexto antes de generarme un plan.
- Given que no he completado el onboarding, When intento acceder al Home, Then soy redirigido al flujo de onboarding de forma obligatoria.

**HU-03** Como usuario, quiero activar 2FA, para proteger mi cuenta.

**Caso de uso: Registro + Onboarding**
1. Usuario se registra → 2. Sistema crea `User` + `UserProfile` vacío → 3. App fuerza flujo de onboarding → 4. Usuario responde todas las preguntas → 5. Sistema guarda `OnboardingResponses` (`completed=true`) → 6. Sistema encola `GenerateRoutineAction` → 7. Usuario ve pantalla de "Generando tu plan..." → 8. Notificación in-app cuando el plan está listo.

## Épica 2 — Motor de rutinas

**HU-04** Como usuario, quiero recibir automáticamente un plan de entrenamiento personalizado basado en mis respuestas, para no tener que diseñarlo yo mismo.

**HU-05** Como usuario, quiero que cada ejercicio de mi rutina tenga series, repeticiones, descanso, RIR/RPE y peso recomendado, para saber exactamente qué hacer.

**HU-06** Como usuario, quiero poder sustituir un ejercicio por una alternativa equivalente si la máquina está ocupada, para no interrumpir mi plan.

**Caso de uso: Generación de rutina**
Precondición: onboarding completo. Flujo: `RoutineGeneratorFactory` selecciona estrategia según objetivo → determina split y frecuencia → asigna volumen por músculo (MEV/MAV/MRV según nivel) → selecciona ejercicios filtrando por equipo/lesiones → asigna series/reps/descanso/RIR → persiste `Routine` + `RoutineDays` + `RoutineExercises` → marca como `is_active=true` (desactivando cualquier rutina previa del usuario).

## Épica 3 — Registro de entrenamiento y sobrecarga progresiva

**HU-07** Como usuario, quiero registrar manualmente peso y repeticiones la primera vez que hago un ejercicio, para que el sistema tenga una base de referencia.

**HU-08** Como usuario, quiero que la app me sugiera automáticamente el peso a usar en la siguiente sesión, basado en mi desempeño anterior, para progresar sin adivinar.
- Given que completé todas las series/reps objetivo la semana anterior con el RIR planeado, When genero la siguiente sesión, Then el peso sugerido aumenta según la regla de progresión (ej. +2.5kg o +1 rep).
- Given que NO completé el objetivo, When cierro el entrenamiento, Then la app pregunta "¿Pudiste completar el entrenamiento?" y si respondo "No", pide peso/reps/series reales y **nunca** aumenta el peso en la siguiente sesión.

**HU-09** Como usuario, quiero ver un temporizador de descanso entre series, para respetar los tiempos de recuperación planeados.

**Caso de uso: Cierre de sesión con fallo**
1. Usuario marca `completed=false` en algún set objetivo → 2. Sistema pregunta feedback → 3. Usuario responde "No" → 4. Sistema solicita datos reales de la sesión → 5. `ProgressiveOverloadCalculator` recalcula la siguiente sesión de ese ejercicio manteniendo o reduciendo carga → 6. Se notifica al usuario el ajuste.

## Épica 4 — Historial y estadísticas

**HU-10** Como usuario, quiero ver mi historial completo de entrenamientos, peso corporal y medidas, para analizar mi evolución.

**HU-11** Como usuario, quiero un dashboard con horas entrenadas, series realizadas, toneladas movidas, récords personales y racha de días consecutivos, para entender mi progreso de un vistazo.

**HU-12** Como usuario, quiero ver gráficas de volumen semanal por grupo muscular, para saber si estoy entrenando balanceado.

## Épica 5 — Social, Rankings y Gamificación

**HU-13** Como usuario, quiero optar por aparecer en rankings públicos (ciudad, país, gimnasio, edad, sexo), para compararme con otros de forma motivadora.
- Given que no he activado "participar en rankings", When otro usuario consulta el ranking, Then mi nombre no aparece.

**HU-14** Como usuario, quiero ganar XP y subir de nivel por cada entrenamiento completado, para sentir progreso constante.

**HU-15** Como usuario, quiero desbloquear logros (primer entrenamiento, 100 entrenamientos, 365 días seguidos, etc.), para tener metas adicionales de motivación.

**HU-16** Como usuario, quiero unirme a retos semanales/mensuales con otros usuarios, para aumentar mi compromiso.

## Épica 6 — Calendario

**HU-17** Como usuario, quiero ver un calendario con mis entrenamientos realizados, pendientes y recordatorios, para planificar mi semana.

## Épica 7 — Módulo Entrenador

**HU-18** Como entrenador, quiero crear y gestionar una lista de clientes, para organizar mi trabajo.

**HU-19** Como entrenador, quiero asignar y editar rutinas manualmente a cada cliente (ejercicios, series, reps, descanso), para personalizar el entrenamiento según mi criterio profesional.
- Given que asigno una rutina manual a un cliente, When el motor automático evalúa a ese usuario, Then no debe generar ni sobrescribir ninguna rutina mientras la relación entrenador-cliente esté activa.

**HU-20** Como entrenador, quiero ver el progreso y estadísticas de cada cliente, para ajustar su plan con datos reales.

**HU-21** Como entrenador, quiero chatear en tiempo real con mis clientes, para resolver dudas y dar seguimiento.

**HU-22** Como entrenador, quiero crear plantillas de rutina reutilizables y duplicarlas hacia nuevos clientes, para ahorrar tiempo.

**HU-23** Como entrenador, quiero subir videos explicativos a un ejercicio o mensaje, para reforzar la instrucción técnica.

**HU-24** Como entrenador, quiero enviar notificaciones/recordatorios a uno o varios clientes, para mantenerlos comprometidos.

## Épica 8 — Biblioteca de ejercicios

**HU-25** Como usuario o entrenador, quiero consultar cada ejercicio con nombre, músculo, equipo, video, instrucciones, errores comunes, consejos y alternativas, para ejecutar correctamente la técnica.

## Épica 9 — Nutrición (Fase 2)

**HU-26** Como usuario, quiero que la app calcule mis calorías y macros objetivo según mi perfil y meta, para alinear mi alimentación con mi entrenamiento.

**HU-27** Como usuario, quiero registrar comidas escaneando un código de barras, para llevar el registro sin fricción.

## Épica 10 — IA (Fase 3)

**HU-28** Como usuario, quiero preguntarle a un asistente IA sobre mi rutina o progreso, para recibir consejos personalizados sin esperar a mi entrenador.

**HU-29** Como usuario, quiero que la IA detecte estancamientos en mi progreso y sugiera ajustes, para seguir avanzando.

**HU-30** Como usuario, quiero grabar una serie y que la IA analice mi técnica (profundidad, rango de movimiento), para corregir errores de ejecución.

## Épica 11 — Administración

**HU-31** Como administrador, quiero gestionar usuarios, entrenadores y ejercicios desde un panel, para mantener la calidad de la plataforma.

**HU-32** Como administrador, quiero revisar y resolver reportes de usuarios, para moderar contenido y comportamiento abusivo.

**HU-33** Como administrador, quiero publicar noticias y promociones, para comunicar novedades a toda la base de usuarios.

## Épica 12 — Wearables y Marketplace (Fase 2)

**HU-34** Como usuario, quiero conectar mi Apple Health/Google Fit/Garmin/Fitbit, para importar pasos, frecuencia cardíaca y calorías automáticamente.

**HU-35** Como usuario, quiero explorar y comprar programas de entrenadores verificados en un marketplace, para acceder a planes premium sin buscar fuera de la app.

**HU-36** Como entrenador, quiero publicar y vender mis programas en el marketplace, para captar clientes dentro de la plataforma.

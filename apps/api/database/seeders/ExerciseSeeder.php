<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar el modelo Exercise (ejercicio).
use App\Models\Exercise;
// Esta línea sirve para importar el modelo MuscleGroup (grupo muscular).
use App\Models\MuscleGroup;
// Esta línea sirve para importar la clase base de los seeders.
use Illuminate\Database\Seeder;

// Esta línea sirve para declarar el seeder que carga el catálogo de ejercicios.
class ExerciseSeeder extends Seeder
{
    /**
     * Biblioteca base de ejercicios. No pretende ser exhaustiva (el objetivo
     * de producto es 150-300, ver docs/02-modelo-datos-bd.md) — este set
     * cubre cada grupo muscular y cada tipo de equipo lo suficiente para que
     * el motor de rutinas genere planes reales y variados. Ampliar el
     * catálogo es trabajo de contenido, no de arquitectura.
     */
    // Esta línea sirve para declarar el método que ejecuta el seeder.
    public function run(): void
    {
        // Esta línea sirve para obtener los ids de los grupos musculares indexados por slug.
        $muscles = MuscleGroup::query()->pluck('id', 'slug');

        // Esta línea sirve para definir la lista de ejercicios a cargar.
        $exercises = [
            // ---- Pecho ----
            // Esta línea sirve para definir el ejercicio "Press banca con barra" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press banca con barra', 'muscle' => 'chest', 'secondary' => ['triceps', 'shoulders'], 'equipment' => 'barbell', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press banca con barra".
                'instructions' => 'Baja la barra controlada hasta rozar el pecho y empuja hasta extender los brazos.',
                // Esta línea sirve para agregar los errores comunes de "Press banca con barra".
                'common_mistakes' => 'Rebotar la barra en el pecho o despegar los glúteos del banco.',
                // Esta línea sirve para agregar los consejos de "Press banca con barra".
                'tips' => 'Retrae los omóplatos y mantén los pies firmes en el suelo durante todo el movimiento.'],
            // Esta línea sirve para definir el ejercicio "Press banca con mancuernas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press banca con mancuernas', 'muscle' => 'chest', 'secondary' => ['triceps', 'shoulders'], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press banca con mancuernas".
                'instructions' => 'Empuja ambas mancuernas hacia arriba hasta casi juntarlas sobre el pecho.',
                // Esta línea sirve para agregar los errores comunes de "Press banca con mancuernas".
                'common_mistakes' => 'Dejar caer los codos demasiado bajo, forzando el hombro.',
                // Esta línea sirve para agregar los consejos de "Press banca con mancuernas".
                'tips' => 'Permite mayor rango de movimiento que la barra; controla el descenso.'],
            // Esta línea sirve para definir el ejercicio "Press inclinado con barra" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press inclinado con barra', 'muscle' => 'chest', 'secondary' => ['shoulders', 'triceps'], 'equipment' => 'barbell', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press inclinado con barra".
                'instructions' => 'Con el banco a 30-45°, baja la barra a la parte superior del pecho y empuja.',
                // Esta línea sirve para agregar los errores comunes de "Press inclinado con barra".
                'common_mistakes' => 'Inclinar demasiado el banco, convirtiéndolo en un press de hombro.',
                // Esta línea sirve para agregar los consejos de "Press inclinado con barra".
                'tips' => 'Prioriza pecho superior; útil para desarrollo completo del pectoral.'],
            // Esta línea sirve para definir el ejercicio "Press inclinado con mancuernas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press inclinado con mancuernas', 'muscle' => 'chest', 'secondary' => ['shoulders', 'triceps'], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press inclinado con mancuernas".
                'instructions' => 'Empuja las mancuernas hacia arriba y ligeramente hacia adentro.',
                // Esta línea sirve para agregar los errores comunes de "Press inclinado con mancuernas".
                'common_mistakes' => 'Arquear excesivamente la espalda baja.',
                // Esta línea sirve para agregar los consejos de "Press inclinado con mancuernas".
                'tips' => 'Buena alternativa cuando no hay barra disponible.'],
            // Esta línea sirve para definir el ejercicio "Aperturas con mancuernas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Aperturas con mancuernas', 'muscle' => 'chest', 'secondary' => [], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Aperturas con mancuernas".
                'instructions' => 'Con los codos ligeramente flexionados, abre los brazos en arco y vuelve a juntarlos sobre el pecho.',
                // Esta línea sirve para agregar los errores comunes de "Aperturas con mancuernas".
                'common_mistakes' => 'Extender completamente los codos, forzando la articulación.',
                // Esta línea sirve para agregar los consejos de "Aperturas con mancuernas".
                'tips' => 'Piensa en "abrazar un árbol" para mantener la tensión en el pecho.'],
            // Esta línea sirve para definir el ejercicio "Cruce de poleas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Cruce de poleas', 'muscle' => 'chest', 'secondary' => [], 'equipment' => 'cables', 'level' => 'intermediate', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Cruce de poleas".
                'instructions' => 'Junta las poleas frente al cuerpo en un movimiento de arco, contrayendo el pecho.',
                // Esta línea sirve para agregar los errores comunes de "Cruce de poleas".
                'common_mistakes' => 'Usar demasiado peso y perder el rango de movimiento.',
                // Esta línea sirve para agregar los consejos de "Cruce de poleas".
                'tips' => 'Excelente para el final de la sesión, mantiene tensión constante.'],
            // Esta línea sirve para definir el ejercicio "Fondos en paralelas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Fondos en paralelas', 'muscle' => 'chest', 'secondary' => ['triceps', 'shoulders'], 'equipment' => 'bodyweight_only', 'level' => 'advanced', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Fondos en paralelas".
                'instructions' => 'Baja el cuerpo flexionando los codos e inclinando el torso hacia adelante, luego empuja.',
                // Esta línea sirve para agregar los errores comunes de "Fondos en paralelas".
                'common_mistakes' => 'Bajar demasiado y sobrecargar el hombro anterior.',
                // Esta línea sirve para agregar los consejos de "Fondos en paralelas".
                'tips' => 'Inclinar el torso enfatiza más el pecho que el tríceps.'],
            // Esta línea sirve para definir el ejercicio "Press de pecho en máquina" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press de pecho en máquina', 'muscle' => 'chest', 'secondary' => ['triceps'], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press de pecho en máquina".
                'instructions' => 'Empuja las manijas hacia adelante hasta extender los brazos sin bloquear los codos.',
                // Esta línea sirve para agregar los errores comunes de "Press de pecho en máquina".
                'common_mistakes' => 'Ajustar mal la altura del asiento.',
                // Esta línea sirve para agregar los consejos de "Press de pecho en máquina".
                'tips' => 'Buena opción para principiantes por su estabilidad.'],
            // Esta línea sirve para definir el ejercicio "Flexiones de pecho" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Flexiones de pecho', 'muscle' => 'chest', 'secondary' => ['triceps', 'core'], 'equipment' => 'bodyweight_only', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Flexiones de pecho".
                'instructions' => 'Baja el cuerpo en línea recta hasta casi tocar el suelo y empuja de vuelta.',
                // Esta línea sirve para agregar los errores comunes de "Flexiones de pecho".
                'common_mistakes' => 'Dejar caer la cadera o elevar demasiado los glúteos.',
                // Esta línea sirve para agregar los consejos de "Flexiones de pecho".
                'tips' => 'Ajusta la dificultad apoyando las rodillas si es necesario.'],
            // Esta línea sirve para definir el ejercicio "Press con banda de resistencia" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press con banda de resistencia', 'muscle' => 'chest', 'secondary' => ['triceps'], 'equipment' => 'resistance_bands', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press con banda de resistencia".
                'instructions' => 'Ancla la banda detrás del cuerpo y empuja hacia adelante como en un press.',
                // Esta línea sirve para agregar los errores comunes de "Press con banda de resistencia".
                'common_mistakes' => 'Perder tensión en la banda al final del recorrido.',
                // Esta línea sirve para agregar los consejos de "Press con banda de resistencia".
                'tips' => 'Ideal para entrenar en casa sin equipo pesado.'],

            // ---- Espalda ----
            // Esta línea sirve para definir el ejercicio "Dominadas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Dominadas', 'muscle' => 'back', 'secondary' => ['biceps'], 'equipment' => 'pull_up_bar', 'level' => 'advanced', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Dominadas".
                'instructions' => 'Cuelga de la barra y tira del cuerpo hacia arriba hasta que la barbilla supere la barra.',
                // Esta línea sirve para agregar los errores comunes de "Dominadas".
                'common_mistakes' => 'Usar impulso (kipping) en lugar de fuerza controlada.',
                // Esta línea sirve para agregar los consejos de "Dominadas".
                'tips' => 'Si aún no puedes hacer una completa, usa banda de asistencia.'],
            // Esta línea sirve para definir el ejercicio "Jalón al pecho" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Jalón al pecho', 'muscle' => 'back', 'secondary' => ['biceps'], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Jalón al pecho".
                'instructions' => 'Tira de la barra hacia la parte superior del pecho, llevando los codos hacia abajo.',
                // Esta línea sirve para agregar los errores comunes de "Jalón al pecho".
                'common_mistakes' => 'Tirar con los brazos en vez de iniciar el jalón con la espalda.',
                // Esta línea sirve para agregar los consejos de "Jalón al pecho".
                'tips' => 'Buena alternativa a dominadas mientras se gana fuerza.'],
            // Esta línea sirve para definir el ejercicio "Remo con barra" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Remo con barra', 'muscle' => 'back', 'secondary' => ['biceps'], 'equipment' => 'barbell', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Remo con barra".
                'instructions' => 'Con el torso inclinado, tira de la barra hacia el abdomen apretando los omóplatos.',
                // Esta línea sirve para agregar los errores comunes de "Remo con barra".
                'common_mistakes' => 'Redondear la espalda baja bajo carga.',
                // Esta línea sirve para agregar los consejos de "Remo con barra".
                'tips' => 'Mantén el core firme durante todo el movimiento.'],
            // Esta línea sirve para definir el ejercicio "Remo con mancuerna a una mano" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Remo con mancuerna a una mano', 'muscle' => 'back', 'secondary' => ['biceps'], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Remo con mancuerna a una mano".
                'instructions' => 'Apoya una rodilla y mano en el banco, tira de la mancuerna hacia la cadera.',
                // Esta línea sirve para agregar los errores comunes de "Remo con mancuerna a una mano".
                'common_mistakes' => 'Rotar el torso para ayudar con impulso.',
                // Esta línea sirve para agregar los consejos de "Remo con mancuerna a una mano".
                'tips' => 'Permite trabajar cada lado de forma independiente.'],
            // Esta línea sirve para definir el ejercicio "Remo en polea sentado" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Remo en polea sentado', 'muscle' => 'back', 'secondary' => ['biceps'], 'equipment' => 'cables', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Remo en polea sentado".
                'instructions' => 'Tira del agarre hacia el abdomen manteniendo la espalda recta.',
                // Esta línea sirve para agregar los errores comunes de "Remo en polea sentado".
                'common_mistakes' => 'Balancear el torso hacia adelante y atrás excesivamente.',
                // Esta línea sirve para agregar los consejos de "Remo en polea sentado".
                'tips' => 'Pausa un segundo en la contracción máxima.'],
            // Esta línea sirve para definir el ejercicio "Peso muerto" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Peso muerto', 'muscle' => 'back', 'secondary' => ['hamstrings', 'glutes'], 'equipment' => 'barbell', 'level' => 'advanced', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Peso muerto".
                'instructions' => 'Con la barra cerca de las espinillas, levanta extendiendo cadera y rodillas a la vez.',
                // Esta línea sirve para agregar los errores comunes de "Peso muerto".
                'common_mistakes' => 'Redondear la espalda baja al levantar.',
                // Esta línea sirve para agregar los consejos de "Peso muerto".
                'tips' => 'Ejercicio técnico: prioriza la forma antes que el peso.'],
            // Esta línea sirve para definir el ejercicio "Peso muerto rumano con barra" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Peso muerto rumano con barra', 'muscle' => 'back', 'secondary' => ['hamstrings', 'glutes'], 'equipment' => 'barbell', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Peso muerto rumano con barra".
                'instructions' => 'Baja la barra pegada a las piernas manteniendo una ligera flexión de rodilla.',
                // Esta línea sirve para agregar los errores comunes de "Peso muerto rumano con barra".
                'common_mistakes' => 'Flexionar demasiado las rodillas, convirtiéndolo en sentadilla.',
                // Esta línea sirve para agregar los consejos de "Peso muerto rumano con barra".
                'tips' => 'Enfócate en la sensación de estiramiento en isquiotibiales.'],
            // Esta línea sirve para definir el ejercicio "Face pull" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Face pull', 'muscle' => 'back', 'secondary' => ['shoulders'], 'equipment' => 'cables', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Face pull".
                'instructions' => 'Tira de la cuerda hacia la cara separando las manos al final del recorrido.',
                // Esta línea sirve para agregar los errores comunes de "Face pull".
                'common_mistakes' => 'Usar demasiado peso y perder la forma.',
                // Esta línea sirve para agregar los consejos de "Face pull".
                'tips' => 'Excelente para la salud del hombro y la postura.'],
            // Esta línea sirve para definir el ejercicio "Remo en T" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Remo en T', 'muscle' => 'back', 'secondary' => ['biceps'], 'equipment' => 'barbell', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Remo en T".
                'instructions' => 'Con el torso inclinado, tira de la barra hacia el pecho apretando la espalda.',
                // Esta línea sirve para agregar los errores comunes de "Remo en T".
                'common_mistakes' => 'Extender completamente los brazos sin control en la bajada.',
                // Esta línea sirve para agregar los consejos de "Remo en T".
                'tips' => 'Añade grosor a la espalda media.'],
            // Esta línea sirve para definir el ejercicio "Hiperextensiones" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Hiperextensiones', 'muscle' => 'back', 'secondary' => ['hamstrings', 'glutes'], 'equipment' => 'bodyweight_only', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Hiperextensiones".
                'instructions' => 'Baja el torso controlado y sube extendiendo la espalda baja sin hiperextender.',
                // Esta línea sirve para agregar los errores comunes de "Hiperextensiones".
                'common_mistakes' => 'Subir demasiado arqueando en exceso la zona lumbar.',
                // Esta línea sirve para agregar los consejos de "Hiperextensiones".
                'tips' => 'Refuerza la cadena posterior y protege la espalda baja.'],
            // Esta línea sirve para definir el ejercicio "Remo con banda de resistencia" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Remo con banda de resistencia', 'muscle' => 'back', 'secondary' => ['biceps'], 'equipment' => 'resistance_bands', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Remo con banda de resistencia".
                'instructions' => 'Ancla la banda al frente y tira hacia el abdomen apretando la espalda.',
                // Esta línea sirve para agregar los errores comunes de "Remo con banda de resistencia".
                'common_mistakes' => 'Encorvar los hombros hacia adelante al final.',
                // Esta línea sirve para agregar los consejos de "Remo con banda de resistencia".
                'tips' => 'Alternativa práctica al remo con máquina en casa.'],

            // ---- Hombros ----
            // Esta línea sirve para definir el ejercicio "Press militar con barra" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press militar con barra', 'muscle' => 'shoulders', 'secondary' => ['triceps'], 'equipment' => 'barbell', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press militar con barra".
                'instructions' => 'Empuja la barra desde los hombros hasta la extensión completa sobre la cabeza.',
                // Esta línea sirve para agregar los errores comunes de "Press militar con barra".
                'common_mistakes' => 'Arquear excesivamente la espalda baja para compensar.',
                // Esta línea sirve para agregar los consejos de "Press militar con barra".
                'tips' => 'Aprieta glúteos y abdomen para mantener el torso estable.'],
            // Esta línea sirve para definir el ejercicio "Press de hombro con mancuernas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press de hombro con mancuernas', 'muscle' => 'shoulders', 'secondary' => ['triceps'], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press de hombro con mancuernas".
                'instructions' => 'Empuja ambas mancuernas hacia arriba hasta casi juntarlas sobre la cabeza.',
                // Esta línea sirve para agregar los errores comunes de "Press de hombro con mancuernas".
                'common_mistakes' => 'Bajar las mancuernas demasiado rápido sin control.',
                // Esta línea sirve para agregar los consejos de "Press de hombro con mancuernas".
                'tips' => 'Permite un recorrido más natural que la barra.'],
            // Esta línea sirve para definir el ejercicio "Elevaciones laterales" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Elevaciones laterales', 'muscle' => 'shoulders', 'secondary' => [], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Elevaciones laterales".
                'instructions' => 'Eleva los brazos hacia los lados hasta la altura de los hombros.',
                // Esta línea sirve para agregar los errores comunes de "Elevaciones laterales".
                'common_mistakes' => 'Usar impulso balanceando el torso.',
                // Esta línea sirve para agregar los consejos de "Elevaciones laterales".
                'tips' => 'Controla más la bajada que la subida para maximizar tensión.'],
            // Esta línea sirve para definir el ejercicio "Elevaciones frontales" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Elevaciones frontales', 'muscle' => 'shoulders', 'secondary' => [], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Elevaciones frontales".
                'instructions' => 'Eleva una o ambas mancuernas al frente hasta la altura del hombro.',
                // Esta línea sirve para agregar los errores comunes de "Elevaciones frontales".
                'common_mistakes' => 'Elevar por encima de la altura del hombro innecesariamente.',
                // Esta línea sirve para agregar los consejos de "Elevaciones frontales".
                'tips' => 'Enfatiza el deltoide anterior.'],
            // Esta línea sirve para definir el ejercicio "Pájaros (deltoide posterior)" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Pájaros (deltoide posterior)', 'muscle' => 'shoulders', 'secondary' => ['back'], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Pájaros (deltoide posterior)".
                'instructions' => 'Inclinado hacia adelante, abre los brazos hacia los lados apretando los omóplatos.',
                // Esta línea sirve para agregar los errores comunes de "Pájaros (deltoide posterior)".
                'common_mistakes' => 'Usar demasiado peso y perder el rango de movimiento.',
                // Esta línea sirve para agregar los consejos de "Pájaros (deltoide posterior)".
                'tips' => 'Clave para el desarrollo equilibrado del hombro.'],
            // Esta línea sirve para definir el ejercicio "Press Arnold" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press Arnold', 'muscle' => 'shoulders', 'secondary' => ['triceps'], 'equipment' => 'dumbbells', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press Arnold".
                'instructions' => 'Comienza con las palmas hacia ti y rota mientras empujas hacia arriba.',
                // Esta línea sirve para agregar los errores comunes de "Press Arnold".
                'common_mistakes' => 'Perder la rotación y convertirlo en un press normal.',
                // Esta línea sirve para agregar los consejos de "Press Arnold".
                'tips' => 'Trabaja las tres cabezas del deltoide en un solo movimiento.'],
            // Esta línea sirve para definir el ejercicio "Elevaciones laterales en polea" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Elevaciones laterales en polea', 'muscle' => 'shoulders', 'secondary' => [], 'equipment' => 'cables', 'level' => 'intermediate', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Elevaciones laterales en polea".
                'instructions' => 'Con la polea baja, eleva el brazo hacia el lateral manteniendo tensión constante.',
                // Esta línea sirve para agregar los errores comunes de "Elevaciones laterales en polea".
                'common_mistakes' => 'Girar el torso para ayudar con impulso.',
                // Esta línea sirve para agregar los consejos de "Elevaciones laterales en polea".
                'tips' => 'La polea mantiene tensión incluso al inicio del movimiento, a diferencia de la mancuerna.'],
            // Esta línea sirve para definir el ejercicio "Press de hombro en máquina" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press de hombro en máquina', 'muscle' => 'shoulders', 'secondary' => ['triceps'], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press de hombro en máquina".
                'instructions' => 'Empuja las manijas hacia arriba hasta casi extender los brazos.',
                // Esta línea sirve para agregar los errores comunes de "Press de hombro en máquina".
                'common_mistakes' => 'Ajustar mal la altura del asiento.',
                // Esta línea sirve para agregar los consejos de "Press de hombro en máquina".
                'tips' => 'Opción estable para principiantes o para llegar al fallo con seguridad.'],

            // ---- Bíceps ----
            // Esta línea sirve para definir el ejercicio "Curl de bíceps con barra" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Curl de bíceps con barra', 'muscle' => 'biceps', 'secondary' => [], 'equipment' => 'barbell', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Curl de bíceps con barra".
                'instructions' => 'Flexiona los codos llevando la barra hacia los hombros sin mover el torso.',
                // Esta línea sirve para agregar los errores comunes de "Curl de bíceps con barra".
                'common_mistakes' => 'Balancear el cuerpo para generar impulso.',
                // Esta línea sirve para agregar los consejos de "Curl de bíceps con barra".
                'tips' => 'Mantén los codos pegados al torso durante todo el recorrido.'],
            // Esta línea sirve para definir el ejercicio "Curl de bíceps con mancuernas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Curl de bíceps con mancuernas', 'muscle' => 'biceps', 'secondary' => [], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Curl de bíceps con mancuernas".
                'instructions' => 'Flexiona alternando o ambos brazos a la vez, girando la muñeca al subir.',
                // Esta línea sirve para agregar los errores comunes de "Curl de bíceps con mancuernas".
                'common_mistakes' => 'Subir demasiado rápido perdiendo tensión.',
                // Esta línea sirve para agregar los consejos de "Curl de bíceps con mancuernas".
                'tips' => 'La supinación (girar la palma) enfatiza más el bíceps.'],
            // Esta línea sirve para definir el ejercicio "Curl martillo" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Curl martillo', 'muscle' => 'biceps', 'secondary' => [], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Curl martillo".
                'instructions' => 'Flexiona con agarre neutro (palmas enfrentadas) hacia los hombros.',
                // Esta línea sirve para agregar los errores comunes de "Curl martillo".
                'common_mistakes' => 'Rotar la muñeca durante el movimiento.',
                // Esta línea sirve para agregar los consejos de "Curl martillo".
                'tips' => 'También trabaja el antebrazo y el braquial.'],
            // Esta línea sirve para definir el ejercicio "Curl en banco Scott" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Curl en banco Scott', 'muscle' => 'biceps', 'secondary' => [], 'equipment' => 'barbell', 'level' => 'intermediate', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Curl en banco Scott".
                'instructions' => 'Con el brazo apoyado en el banco, flexiona sin despegar el tríceps del soporte.',
                // Esta línea sirve para agregar los errores comunes de "Curl en banco Scott".
                'common_mistakes' => 'Extender completamente el codo bajo carga, forzando la articulación.',
                // Esta línea sirve para agregar los consejos de "Curl en banco Scott".
                'tips' => 'Aísla muy bien el bíceps al eliminar el impulso del cuerpo.'],
            // Esta línea sirve para definir el ejercicio "Curl en polea" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Curl en polea', 'muscle' => 'biceps', 'secondary' => [], 'equipment' => 'cables', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Curl en polea".
                'instructions' => 'Flexiona los codos tirando de la barra o cuerda hacia los hombros.',
                // Esta línea sirve para agregar los errores comunes de "Curl en polea".
                'common_mistakes' => 'Dejar que los codos se muevan hacia adelante.',
                // Esta línea sirve para agregar los consejos de "Curl en polea".
                'tips' => 'Mantiene tensión constante en todo el rango.'],
            // Esta línea sirve para definir el ejercicio "Curl con banda de resistencia" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Curl con banda de resistencia', 'muscle' => 'biceps', 'secondary' => [], 'equipment' => 'resistance_bands', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Curl con banda de resistencia".
                'instructions' => 'Pisa la banda y flexiona los codos hacia los hombros.',
                // Esta línea sirve para agregar los errores comunes de "Curl con banda de resistencia".
                'common_mistakes' => 'Perder tensión en la banda al inicio del movimiento.',
                // Esta línea sirve para agregar los consejos de "Curl con banda de resistencia".
                'tips' => 'Buena opción de bíceps sin necesidad de pesas.'],

            // ---- Tríceps ----
            // Esta línea sirve para definir el ejercicio "Press francés" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press francés', 'muscle' => 'triceps', 'secondary' => [], 'equipment' => 'barbell', 'level' => 'intermediate', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Press francés".
                'instructions' => 'Acostado, baja la barra hacia la frente flexionando solo los codos.',
                // Esta línea sirve para agregar los errores comunes de "Press francés".
                'common_mistakes' => 'Mover los codos hacia afuera durante el descenso.',
                // Esta línea sirve para agregar los consejos de "Press francés".
                'tips' => 'Controla bien el peso; es una posición vulnerable si se pierde el control.'],
            // Esta línea sirve para definir el ejercicio "Extensión de tríceps en polea" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Extensión de tríceps en polea', 'muscle' => 'triceps', 'secondary' => [], 'equipment' => 'cables', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Extensión de tríceps en polea".
                'instructions' => 'Con los codos fijos al torso, extiende los brazos empujando la barra hacia abajo.',
                // Esta línea sirve para agregar los errores comunes de "Extensión de tríceps en polea".
                'common_mistakes' => 'Separar los codos del cuerpo durante el movimiento.',
                // Esta línea sirve para agregar los consejos de "Extensión de tríceps en polea".
                'tips' => 'Uno de los ejercicios de aislamiento más eficientes para tríceps.'],
            // Esta línea sirve para definir el ejercicio "Fondos de tríceps en banco" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Fondos de tríceps en banco', 'muscle' => 'triceps', 'secondary' => ['chest'], 'equipment' => 'bodyweight_only', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Fondos de tríceps en banco".
                'instructions' => 'Con manos en el banco detrás de ti, flexiona y extiende los codos.',
                // Esta línea sirve para agregar los errores comunes de "Fondos de tríceps en banco".
                'common_mistakes' => 'Bajar demasiado forzando el hombro.',
                // Esta línea sirve para agregar los consejos de "Fondos de tríceps en banco".
                'tips' => 'Ajusta la dificultad flexionando más o menos las rodillas.'],
            // Esta línea sirve para definir el ejercicio "Press cerrado" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press cerrado', 'muscle' => 'triceps', 'secondary' => ['chest'], 'equipment' => 'barbell', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press cerrado".
                'instructions' => 'Press de banca con agarre estrecho, codos cerca del torso.',
                // Esta línea sirve para agregar los errores comunes de "Press cerrado".
                'common_mistakes' => 'Agarre demasiado estrecho que fuerza la muñeca.',
                // Esta línea sirve para agregar los consejos de "Press cerrado".
                'tips' => 'Buen ejercicio compuesto para tríceps con carga pesada.'],
            // Esta línea sirve para definir el ejercicio "Extensión de tríceps con mancuerna" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Extensión de tríceps con mancuerna', 'muscle' => 'triceps', 'secondary' => [], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Extensión de tríceps con mancuerna".
                'instructions' => 'Sobre la cabeza, baja la mancuerna detrás de la nuca y extiende.',
                // Esta línea sirve para agregar los errores comunes de "Extensión de tríceps con mancuerna".
                'common_mistakes' => 'Abrir demasiado los codos hacia los lados.',
                // Esta línea sirve para agregar los consejos de "Extensión de tríceps con mancuerna".
                'tips' => 'Se puede hacer a una o dos manos.'],
            // Esta línea sirve para definir el ejercicio "Patada de tríceps" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Patada de tríceps', 'muscle' => 'triceps', 'secondary' => [], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Patada de tríceps".
                'instructions' => 'Con el torso inclinado, extiende el codo hacia atrás manteniéndolo fijo.',
                // Esta línea sirve para agregar los errores comunes de "Patada de tríceps".
                'common_mistakes' => 'Mover el hombro en vez de solo el codo.',
                // Esta línea sirve para agregar los consejos de "Patada de tríceps".
                'tips' => 'Enfócate en la contracción máxima al final del movimiento.'],

            // ---- Cuádriceps ----
            // Esta línea sirve para definir el ejercicio "Sentadilla con barra" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Sentadilla con barra', 'muscle' => 'quads', 'secondary' => ['glutes', 'hamstrings'], 'equipment' => 'squat_rack', 'level' => 'advanced', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Sentadilla con barra".
                'instructions' => 'Baja la cadera hacia atrás y abajo hasta al menos 90°, luego empuja el suelo para subir.',
                // Esta línea sirve para agregar los errores comunes de "Sentadilla con barra".
                'common_mistakes' => 'Dejar que las rodillas colapsen hacia adentro.',
                // Esta línea sirve para agregar los consejos de "Sentadilla con barra".
                'tips' => 'El ejercicio más completo para tren inferior; prioriza técnica sobre carga.'],
            // Esta línea sirve para definir el ejercicio "Sentadilla goblet" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Sentadilla goblet', 'muscle' => 'quads', 'secondary' => ['glutes'], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Sentadilla goblet".
                'instructions' => 'Sostén una mancuerna contra el pecho y realiza una sentadilla completa.',
                // Esta línea sirve para agregar los errores comunes de "Sentadilla goblet".
                'common_mistakes' => 'Inclinar demasiado el torso hacia adelante.',
                // Esta línea sirve para agregar los consejos de "Sentadilla goblet".
                'tips' => 'Excelente para aprender el patrón de sentadilla.'],
            // Esta línea sirve para definir el ejercicio "Prensa de piernas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Prensa de piernas', 'muscle' => 'quads', 'secondary' => ['glutes'], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Prensa de piernas".
                'instructions' => 'Empuja la plataforma extendiendo las piernas sin bloquear las rodillas.',
                // Esta línea sirve para agregar los errores comunes de "Prensa de piernas".
                'common_mistakes' => 'Bajar demasiado despegando la zona lumbar del respaldo.',
                // Esta línea sirve para agregar los consejos de "Prensa de piernas".
                'tips' => 'Permite cargar volumen alto con menor demanda técnica.'],
            // Esta línea sirve para definir el ejercicio "Extensión de cuádriceps" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Extensión de cuádriceps', 'muscle' => 'quads', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Extensión de cuádriceps".
                'instructions' => 'Extiende las piernas contra la almohadilla hasta casi bloquear la rodilla.',
                // Esta línea sirve para agregar los errores comunes de "Extensión de cuádriceps".
                'common_mistakes' => 'Usar impulso en lugar de control.',
                // Esta línea sirve para agregar los consejos de "Extensión de cuádriceps".
                'tips' => 'Ideal para aislar el cuádriceps al final de la sesión de piernas.'],
            // Esta línea sirve para definir el ejercicio "Zancadas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Zancadas', 'muscle' => 'quads', 'secondary' => ['glutes'], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Zancadas".
                'instructions' => 'Da un paso adelante y baja hasta que ambas rodillas formen 90°.',
                // Esta línea sirve para agregar los errores comunes de "Zancadas".
                'common_mistakes' => 'Dar un paso demasiado corto, forzando la rodilla delantera.',
                // Esta línea sirve para agregar los consejos de "Zancadas".
                'tips' => 'Alterna piernas o completa una serie por lado.'],
            // Esta línea sirve para definir el ejercicio "Sentadilla búlgara" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Sentadilla búlgara', 'muscle' => 'quads', 'secondary' => ['glutes'], 'equipment' => 'dumbbells', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Sentadilla búlgara".
                'instructions' => 'Con el pie trasero elevado en un banco, baja la cadera en la pierna delantera.',
                // Esta línea sirve para agregar los errores comunes de "Sentadilla búlgara".
                'common_mistakes' => 'Apoyar demasiado peso en el pie trasero.',
                // Esta línea sirve para agregar los consejos de "Sentadilla búlgara".
                'tips' => 'Muy efectiva para fuerza unilateral y estabilidad.'],
            // Esta línea sirve para definir el ejercicio "Sentadilla frontal" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Sentadilla frontal', 'muscle' => 'quads', 'secondary' => ['core'], 'equipment' => 'barbell', 'level' => 'advanced', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Sentadilla frontal".
                'instructions' => 'Con la barra al frente sobre los hombros, baja manteniendo el torso erguido.',
                // Esta línea sirve para agregar los errores comunes de "Sentadilla frontal".
                'common_mistakes' => 'Dejar caer los codos, perdiendo la posición de la barra.',
                // Esta línea sirve para agregar los consejos de "Sentadilla frontal".
                'tips' => 'Exige más movilidad de tobillo y muñeca que la sentadilla trasera.'],
            // Esta línea sirve para definir el ejercicio "Sentadilla con kettlebell" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Sentadilla con kettlebell', 'muscle' => 'quads', 'secondary' => ['glutes'], 'equipment' => 'kettlebells', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Sentadilla con kettlebell".
                'instructions' => 'Sostén la kettlebell contra el pecho y realiza una sentadilla completa.',
                // Esta línea sirve para agregar los errores comunes de "Sentadilla con kettlebell".
                'common_mistakes' => 'Levantar los talones del suelo.',
                // Esta línea sirve para agregar los consejos de "Sentadilla con kettlebell".
                'tips' => 'Alternativa a la sentadilla goblet cuando solo hay kettlebells.'],

            // ---- Isquiotibiales ----
            // Esta línea sirve para definir el ejercicio "Peso muerto rumano con mancuernas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Peso muerto rumano con mancuernas', 'muscle' => 'hamstrings', 'secondary' => ['glutes', 'back'], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Peso muerto rumano con mancuernas".
                'instructions' => 'Baja las mancuernas pegadas a las piernas con una ligera flexión de rodilla.',
                // Esta línea sirve para agregar los errores comunes de "Peso muerto rumano con mancuernas".
                'common_mistakes' => 'Redondear la espalda al bajar.',
                // Esta línea sirve para agregar los consejos de "Peso muerto rumano con mancuernas".
                'tips' => 'Siente el estiramiento en isquiotibiales antes de subir.'],
            // Esta línea sirve para definir el ejercicio "Curl femoral" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Curl femoral', 'muscle' => 'hamstrings', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Curl femoral".
                'instructions' => 'Flexiona las rodillas llevando el talón hacia los glúteos.',
                // Esta línea sirve para agregar los errores comunes de "Curl femoral".
                'common_mistakes' => 'Levantar la cadera del respaldo.',
                // Esta línea sirve para agregar los consejos de "Curl femoral".
                'tips' => 'Aislamiento directo y seguro para isquiotibiales.'],
            // Esta línea sirve para definir el ejercicio "Buenos días" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Buenos días', 'muscle' => 'hamstrings', 'secondary' => ['back', 'glutes'], 'equipment' => 'barbell', 'level' => 'advanced', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Buenos días".
                'instructions' => 'Con la barra en la espalda, inclina el torso hacia adelante manteniendo la espalda recta.',
                // Esta línea sirve para agregar los errores comunes de "Buenos días".
                'common_mistakes' => 'Usar demasiado peso antes de dominar la técnica.',
                // Esta línea sirve para agregar los consejos de "Buenos días".
                'tips' => 'Empieza con cargas ligeras; exige buena técnica.'],
            // Esta línea sirve para definir el ejercicio "Peso muerto a una pierna" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Peso muerto a una pierna', 'muscle' => 'hamstrings', 'secondary' => ['glutes', 'core'], 'equipment' => 'dumbbells', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Peso muerto a una pierna".
                'instructions' => 'En apoyo sobre una pierna, baja la mancuerna mientras la pierna libre se eleva atrás.',
                // Esta línea sirve para agregar los errores comunes de "Peso muerto a una pierna".
                'common_mistakes' => 'Rotar la cadera en lugar de mantenerla cuadrada.',
                // Esta línea sirve para agregar los consejos de "Peso muerto a una pierna".
                'tips' => 'Excelente para equilibrio, estabilidad y fuerza unilateral.'],

            // ---- Glúteos ----
            // Esta línea sirve para definir el ejercicio "Hip thrust" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Hip thrust', 'muscle' => 'glutes', 'secondary' => ['hamstrings'], 'equipment' => 'barbell', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Hip thrust".
                'instructions' => 'Con la espalda apoyada en el banco, empuja la cadera hacia arriba con la barra sobre las caderas.',
                // Esta línea sirve para agregar los errores comunes de "Hip thrust".
                'common_mistakes' => 'Hiperextender la espalda baja en lugar de usar los glúteos.',
                // Esta línea sirve para agregar los consejos de "Hip thrust".
                'tips' => 'Uno de los ejercicios más efectivos para glúteo mayor.'],
            // Esta línea sirve para definir el ejercicio "Puente de glúteos" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Puente de glúteos', 'muscle' => 'glutes', 'secondary' => ['hamstrings'], 'equipment' => 'bodyweight_only', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Puente de glúteos".
                'instructions' => 'Acostado boca arriba, empuja la cadera hacia arriba apretando los glúteos.',
                // Esta línea sirve para agregar los errores comunes de "Puente de glúteos".
                'common_mistakes' => 'No llegar a la extensión completa de cadera.',
                // Esta línea sirve para agregar los consejos de "Puente de glúteos".
                'tips' => 'Buen punto de partida antes de progresar al hip thrust con carga.'],
            // Esta línea sirve para definir el ejercicio "Patada de glúteo en polea" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Patada de glúteo en polea', 'muscle' => 'glutes', 'secondary' => [], 'equipment' => 'cables', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Patada de glúteo en polea".
                'instructions' => 'Con el tobillo en la polea baja, extiende la pierna hacia atrás.',
                // Esta línea sirve para agregar los errores comunes de "Patada de glúteo en polea".
                'common_mistakes' => 'Usar impulso en la espalda baja.',
                // Esta línea sirve para agregar los consejos de "Patada de glúteo en polea".
                'tips' => 'Aísla bien el glúteo con tensión constante.'],
            // Esta línea sirve para definir el ejercicio "Abducción de cadera en máquina" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Abducción de cadera en máquina', 'muscle' => 'glutes', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Abducción de cadera en máquina".
                'instructions' => 'Empuja las piernas hacia afuera contra la resistencia de la máquina.',
                // Esta línea sirve para agregar los errores comunes de "Abducción de cadera en máquina".
                'common_mistakes' => 'Inclinar el torso para ayudar con impulso.',
                // Esta línea sirve para agregar los consejos de "Abducción de cadera en máquina".
                'tips' => 'Trabaja el glúteo medio, importante para estabilidad de cadera.'],
            // Esta línea sirve para definir el ejercicio "Swing con kettlebell" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Swing con kettlebell', 'muscle' => 'glutes', 'secondary' => ['hamstrings', 'core'], 'equipment' => 'kettlebells', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Swing con kettlebell".
                'instructions' => 'Con un movimiento de bisagra de cadera, impulsa la kettlebell hacia adelante hasta la altura del pecho.',
                // Esta línea sirve para agregar los errores comunes de "Swing con kettlebell".
                'common_mistakes' => 'Usar los brazos para levantar en lugar de la cadera.',
                // Esta línea sirve para agregar los consejos de "Swing con kettlebell".
                'tips' => 'Ejercicio explosivo excelente para glúteos y acondicionamiento.'],

            // ---- Core ----
            // Esta línea sirve para definir el ejercicio "Plancha" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Plancha', 'muscle' => 'core', 'secondary' => [], 'equipment' => 'bodyweight_only', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Plancha".
                'instructions' => 'Mantén el cuerpo en línea recta apoyado en antebrazos y pies.',
                // Esta línea sirve para agregar los errores comunes de "Plancha".
                'common_mistakes' => 'Dejar caer la cadera o elevar demasiado los glúteos.',
                // Esta línea sirve para agregar los consejos de "Plancha".
                'tips' => 'Aprieta el abdomen como si fueras a recibir un golpe.'],
            // Esta línea sirve para definir el ejercicio "Crunch abdominal" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Crunch abdominal', 'muscle' => 'core', 'secondary' => [], 'equipment' => 'bodyweight_only', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Crunch abdominal".
                'instructions' => 'Flexiona el torso llevando las costillas hacia la pelvis.',
                // Esta línea sirve para agregar los errores comunes de "Crunch abdominal".
                'common_mistakes' => 'Tirar del cuello con las manos.',
                // Esta línea sirve para agregar los consejos de "Crunch abdominal".
                'tips' => 'Movimiento corto y controlado, no es necesario sentarse completo.'],
            // Esta línea sirve para definir el ejercicio "Elevación de piernas colgado" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Elevación de piernas colgado', 'muscle' => 'core', 'secondary' => [], 'equipment' => 'pull_up_bar', 'level' => 'advanced', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Elevación de piernas colgado".
                'instructions' => 'Colgado de la barra, eleva las piernas hacia el pecho sin balancearte.',
                // Esta línea sirve para agregar los errores comunes de "Elevación de piernas colgado".
                'common_mistakes' => 'Usar impulso balanceando el cuerpo.',
                // Esta línea sirve para agregar los consejos de "Elevación de piernas colgado".
                'tips' => 'Progresión avanzada; empieza con rodillas flexionadas si es necesario.'],
            // Esta línea sirve para definir el ejercicio "Rueda abdominal" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Rueda abdominal', 'muscle' => 'core', 'secondary' => ['shoulders'], 'equipment' => 'bodyweight_only', 'level' => 'advanced', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Rueda abdominal".
                'instructions' => 'Desde rodillas, rueda hacia adelante manteniendo el core apretado y vuelve al inicio.',
                // Esta línea sirve para agregar los errores comunes de "Rueda abdominal".
                'common_mistakes' => 'Arquear la espalda baja al extenderse.',
                // Esta línea sirve para agregar los consejos de "Rueda abdominal".
                'tips' => 'Exige core muy fuerte; progresa gradualmente el rango.'],
            // Esta línea sirve para definir el ejercicio "Russian twist" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Russian twist', 'muscle' => 'core', 'secondary' => [], 'equipment' => 'bodyweight_only', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Russian twist".
                'instructions' => 'Sentado con el torso inclinado, rota de lado a lado tocando el suelo.',
                // Esta línea sirve para agregar los errores comunes de "Russian twist".
                'common_mistakes' => 'Mover solo los brazos en lugar de rotar el torso.',
                // Esta línea sirve para agregar los consejos de "Russian twist".
                'tips' => 'Añade peso (mancuerna o balón) para progresar.'],
            // Esta línea sirve para definir el ejercicio "Crunch en polea" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Crunch en polea', 'muscle' => 'core', 'secondary' => [], 'equipment' => 'cables', 'level' => 'intermediate', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Crunch en polea".
                'instructions' => 'De rodillas frente a la polea alta, flexiona el torso hacia abajo contrayendo el abdomen.',
                // Esta línea sirve para agregar los errores comunes de "Crunch en polea".
                'common_mistakes' => 'Tirar con los brazos en lugar de flexionar con el abdomen.',
                // Esta línea sirve para agregar los consejos de "Crunch en polea".
                'tips' => 'Permite sobrecargar el abdomen progresivamente con peso externo.'],
            // Esta línea sirve para definir el ejercicio "Plancha lateral" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Plancha lateral', 'muscle' => 'core', 'secondary' => [], 'equipment' => 'bodyweight_only', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Plancha lateral".
                'instructions' => 'Apoyado en un antebrazo, mantén el cuerpo en línea recta de lado.',
                // Esta línea sirve para agregar los errores comunes de "Plancha lateral".
                'common_mistakes' => 'Dejar caer la cadera hacia el suelo.',
                // Esta línea sirve para agregar los consejos de "Plancha lateral".
                'tips' => 'Trabaja los oblicuos, importantes para estabilidad del tronco.'],

            // ---- Pantorrillas ----
            // Esta línea sirve para definir el ejercicio "Elevación de talones de pie" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Elevación de talones de pie', 'muscle' => 'calves', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Elevación de talones de pie".
                'instructions' => 'Eleva los talones lo más alto posible y baja controlado hasta estirar.',
                // Esta línea sirve para agregar los errores comunes de "Elevación de talones de pie".
                'common_mistakes' => 'Hacer el movimiento demasiado rápido, perdiendo rango.',
                // Esta línea sirve para agregar los consejos de "Elevación de talones de pie".
                'tips' => 'Pausa arriba un segundo para maximizar la contracción.'],
            // Esta línea sirve para definir el ejercicio "Elevación de talones sentado" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Elevación de talones sentado', 'muscle' => 'calves', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Elevación de talones sentado".
                'instructions' => 'Con las rodillas flexionadas, eleva los talones contra la resistencia.',
                // Esta línea sirve para agregar los errores comunes de "Elevación de talones sentado".
                'common_mistakes' => 'Rango de movimiento incompleto.',
                // Esta línea sirve para agregar los consejos de "Elevación de talones sentado".
                'tips' => 'Con la rodilla flexionada se enfatiza más el sóleo.'],
            // Esta línea sirve para definir el ejercicio "Elevación de talones con mancuernas" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Elevación de talones con mancuernas', 'muscle' => 'calves', 'secondary' => [], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Elevación de talones con mancuernas".
                'instructions' => 'De pie sobre un escalón, eleva los talones sosteniendo mancuernas.',
                // Esta línea sirve para agregar los errores comunes de "Elevación de talones con mancuernas".
                'common_mistakes' => 'No bajar lo suficiente para estirar la pantorrilla.',
                // Esta línea sirve para agregar los consejos de "Elevación de talones con mancuernas".
                'tips' => 'Usa un escalón para aumentar el rango de movimiento.'],

            // ---- Plantillas de rutina (sexo x frecuencia) — ejercicios que
            // faltaban en el catálogo base para cubrir las listas curadas de
            // RoutineTemplateSeeder. El resto de esos ejercicios ya existían
            // arriba y se reutilizan por nombre.
            // Esta línea sirve para definir el ejercicio "Press inclinado en máquina" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Press inclinado en máquina', 'muscle' => 'chest', 'secondary' => ['shoulders', 'triceps'], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Press inclinado en máquina".
                'instructions' => 'Empuja las manijas hacia arriba y adelante en trayectoria inclinada.',
                // Esta línea sirve para agregar los errores comunes de "Press inclinado en máquina".
                'common_mistakes' => 'Ajustar mal la altura del asiento respecto al agarre.',
                // Esta línea sirve para agregar los consejos de "Press inclinado en máquina".
                'tips' => 'Buena alternativa estable al press inclinado con mancuernas.'],
            // Esta línea sirve para definir el ejercicio "Aperturas en máquina" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Aperturas en máquina', 'muscle' => 'chest', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Aperturas en máquina".
                'instructions' => 'Junta las manijas al frente del pecho en un arco controlado (Pec Deck).',
                // Esta línea sirve para agregar los errores comunes de "Aperturas en máquina".
                'common_mistakes' => 'Usar demasiado peso y perder el rango final.',
                // Esta línea sirve para agregar los consejos de "Aperturas en máquina".
                'tips' => 'Mantén una ligera flexión de codo constante durante todo el recorrido.'],
            // Esta línea sirve para definir el ejercicio "Vuelos posteriores en polea" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Vuelos posteriores en polea', 'muscle' => 'shoulders', 'secondary' => ['back'], 'equipment' => 'cables', 'level' => 'intermediate', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Vuelos posteriores en polea".
                'instructions' => 'Con las poleas cruzadas a la altura del pecho, abre los brazos hacia atrás.',
                // Esta línea sirve para agregar los errores comunes de "Vuelos posteriores en polea".
                'common_mistakes' => 'Usar los brazos en vez de los deltoides posteriores para tirar.',
                // Esta línea sirve para agregar los consejos de "Vuelos posteriores en polea".
                'tips' => 'Tensión constante en todo el recorrido, a diferencia de la mancuerna.'],
            // Esta línea sirve para definir el ejercicio "Tríceps en máquina" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Tríceps en máquina', 'muscle' => 'triceps', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Tríceps en máquina".
                'instructions' => 'Empuja las manijas hacia abajo/adelante extendiendo los codos.',
                // Esta línea sirve para agregar los errores comunes de "Tríceps en máquina".
                'common_mistakes' => 'Separar los codos del cuerpo.',
                // Esta línea sirve para agregar los consejos de "Tríceps en máquina".
                'tips' => 'Buena opción para llegar al fallo con seguridad.'],
            // Esta línea sirve para definir el ejercicio "Katana en polea" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Katana en polea', 'muscle' => 'triceps', 'secondary' => [], 'equipment' => 'cables', 'level' => 'intermediate', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Katana en polea".
                'instructions' => 'De espaldas a la polea alta, extiende un brazo por encima de la cabeza hacia adelante.',
                // Esta línea sirve para agregar los errores comunes de "Katana en polea".
                'common_mistakes' => 'Mover el hombro en vez de aislar el codo.',
                // Esta línea sirve para agregar los consejos de "Katana en polea".
                'tips' => 'Enfatiza la cabeza larga del tríceps por el ángulo sobre la cabeza.'],
            // Esta línea sirve para definir el ejercicio "Rompecráneos a dos manos con mancuerna" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Rompecráneos a dos manos con mancuerna', 'muscle' => 'triceps', 'secondary' => [], 'equipment' => 'dumbbells', 'level' => 'intermediate', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Rompecráneos a dos manos con mancuerna".
                'instructions' => 'Acostado, baja una mancuerna con ambas manos hacia la frente flexionando los codos.',
                // Esta línea sirve para agregar los errores comunes de "Rompecráneos a dos manos con mancuerna".
                'common_mistakes' => 'Abrir los codos hacia afuera durante el descenso.',
                // Esta línea sirve para agregar los consejos de "Rompecráneos a dos manos con mancuerna".
                'tips' => 'Controla bien el peso cerca de la cabeza.'],
            // Esta línea sirve para definir el ejercicio "Jalón en polea alta" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Jalón en polea alta', 'muscle' => 'back', 'secondary' => ['biceps'], 'equipment' => 'cables', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Jalón en polea alta".
                'instructions' => 'Tira de la barra ancha hacia la parte superior del pecho.',
                // Esta línea sirve para agregar los errores comunes de "Jalón en polea alta".
                'common_mistakes' => 'Tirar con los brazos en vez de iniciar con la espalda.',
                // Esta línea sirve para agregar los consejos de "Jalón en polea alta".
                'tips' => 'Buena progresión antes de dominadas completas.'],
            // Esta línea sirve para definir el ejercicio "Pull over en polea" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Pull over en polea', 'muscle' => 'back', 'secondary' => ['chest'], 'equipment' => 'cables', 'level' => 'intermediate', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Pull over en polea".
                'instructions' => 'Con los brazos casi extendidos, lleva la barra desde arriba hacia los muslos.',
                // Esta línea sirve para agregar los errores comunes de "Pull over en polea".
                'common_mistakes' => 'Flexionar demasiado los codos, convirtiéndolo en un jalón.',
                // Esta línea sirve para agregar los consejos de "Pull over en polea".
                'tips' => 'Trabaja dorsal ancho con tensión constante.'],
            // Esta línea sirve para definir el ejercicio "Jalón en polea con agarre cerrado" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Jalón en polea con agarre cerrado', 'muscle' => 'back', 'secondary' => ['biceps'], 'equipment' => 'cables', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Jalón en polea con agarre cerrado".
                'instructions' => 'Con agarre estrecho neutro, tira de la barra hacia el pecho.',
                // Esta línea sirve para agregar los errores comunes de "Jalón en polea con agarre cerrado".
                'common_mistakes' => 'Balancear el torso hacia atrás para ayudar con impulso.',
                // Esta línea sirve para agregar los consejos de "Jalón en polea con agarre cerrado".
                'tips' => 'El agarre cerrado enfatiza más la porción baja del dorsal.'],
            // Esta línea sirve para definir el ejercicio "Peso muerto rumano en Smith" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Peso muerto rumano en Smith', 'muscle' => 'back', 'secondary' => ['hamstrings', 'glutes'], 'equipment' => 'machines', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Peso muerto rumano en Smith".
                'instructions' => 'Con la barra guiada del Smith, baja pegada a las piernas con ligera flexión de rodilla.',
                // Esta línea sirve para agregar los errores comunes de "Peso muerto rumano en Smith".
                'common_mistakes' => 'Redondear la espalda baja al bajar.',
                // Esta línea sirve para agregar los consejos de "Peso muerto rumano en Smith".
                'tips' => 'El riel del Smith facilita mantener la trayectoria recta.'],
            // Esta línea sirve para definir el ejercicio "Curl bayesiano en polea" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Curl bayesiano en polea', 'muscle' => 'biceps', 'secondary' => [], 'equipment' => 'cables', 'level' => 'intermediate', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Curl bayesiano en polea".
                'instructions' => 'De espaldas a la polea baja, flexiona el codo con el brazo detrás del torso.',
                // Esta línea sirve para agregar los errores comunes de "Curl bayesiano en polea".
                'common_mistakes' => 'Adelantar el codo durante el movimiento.',
                // Esta línea sirve para agregar los consejos de "Curl bayesiano en polea".
                'tips' => 'La posición detrás del cuerpo maximiza el estiramiento del bíceps.'],
            // Esta línea sirve para definir el ejercicio "Curl bayesiano con mancuerna en banco" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Curl bayesiano con mancuerna en banco', 'muscle' => 'biceps', 'secondary' => [], 'equipment' => 'dumbbells', 'level' => 'intermediate', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Curl bayesiano con mancuerna en banco".
                'instructions' => 'Con el brazo detrás del torso apoyado en un banco inclinado, flexiona el codo.',
                // Esta línea sirve para agregar los errores comunes de "Curl bayesiano con mancuerna en banco".
                'common_mistakes' => 'Perder la posición del codo detrás del cuerpo.',
                // Esta línea sirve para agregar los consejos de "Curl bayesiano con mancuerna en banco".
                'tips' => 'Alternativa sin polea al curl bayesiano.'],
            // Esta línea sirve para definir el ejercicio "Curl predicador en máquina" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Curl predicador en máquina', 'muscle' => 'biceps', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Curl predicador en máquina".
                'instructions' => 'Con los brazos apoyados en el soporte, flexiona los codos hacia los hombros.',
                // Esta línea sirve para agregar los errores comunes de "Curl predicador en máquina".
                'common_mistakes' => 'Extender completamente el codo bajo carga.',
                // Esta línea sirve para agregar los consejos de "Curl predicador en máquina".
                'tips' => 'Estable y fácil de dosificar el peso.'],
            // Esta línea sirve para definir el ejercicio "Curl predicador con mancuerna en banco" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Curl predicador con mancuerna en banco', 'muscle' => 'biceps', 'secondary' => [], 'equipment' => 'dumbbells', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Curl predicador con mancuerna en banco".
                'instructions' => 'Con el tríceps apoyado en un banco Scott, flexiona el codo con una mancuerna.',
                // Esta línea sirve para agregar los errores comunes de "Curl predicador con mancuerna en banco".
                'common_mistakes' => 'Despegar el brazo del soporte.',
                // Esta línea sirve para agregar los consejos de "Curl predicador con mancuerna en banco".
                'tips' => 'Permite trabajar cada brazo de forma independiente.'],
            // Esta línea sirve para definir el ejercicio "Sentadilla en Smith" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Sentadilla en Smith', 'muscle' => 'quads', 'secondary' => ['glutes'], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Sentadilla en Smith".
                'instructions' => 'Con la barra guiada del Smith sobre los hombros, baja controlado en sentadilla.',
                // Esta línea sirve para agregar los errores comunes de "Sentadilla en Smith".
                'common_mistakes' => 'Colocar los pies demasiado cerca de la trayectoria de la barra.',
                // Esta línea sirve para agregar los consejos de "Sentadilla en Smith".
                'tips' => 'El riel guiado facilita enfocarse en la profundidad y el control.'],
            // Esta línea sirve para definir el ejercicio "Sentadilla Hack" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Sentadilla Hack', 'muscle' => 'quads', 'secondary' => ['glutes'], 'equipment' => 'machines', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Sentadilla Hack".
                'instructions' => 'En la máquina hack, baja la cadera manteniendo la espalda apoyada.',
                // Esta línea sirve para agregar los errores comunes de "Sentadilla Hack".
                'common_mistakes' => 'Bajar más allá del rango cómodo de la máquina.',
                // Esta línea sirve para agregar los consejos de "Sentadilla Hack".
                'tips' => 'Gran énfasis en cuádriceps con baja demanda de estabilización.'],
            // Esta línea sirve para definir el ejercicio "Sentadilla Sissy" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Sentadilla Sissy', 'muscle' => 'quads', 'secondary' => [], 'equipment' => 'bodyweight_only', 'level' => 'advanced', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Sentadilla Sissy".
                'instructions' => 'Sosteniéndote de un soporte, inclina las rodillas hacia adelante bajando el torso recto.',
                // Esta línea sirve para agregar los errores comunes de "Sentadilla Sissy".
                'common_mistakes' => 'Perder el equilibrio por falta de sujeción.',
                // Esta línea sirve para agregar los consejos de "Sentadilla Sissy".
                'tips' => 'Aislamiento intenso de cuádriceps; progresa gradualmente.'],
            // Esta línea sirve para definir el ejercicio "Prensa horizontal" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Prensa horizontal', 'muscle' => 'quads', 'secondary' => ['glutes'], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Prensa horizontal".
                'instructions' => 'Empuja la plataforma horizontal extendiendo las piernas sin bloquear rodillas.',
                // Esta línea sirve para agregar los errores comunes de "Prensa horizontal".
                'common_mistakes' => 'Rango de movimiento incompleto.',
                // Esta línea sirve para agregar los consejos de "Prensa horizontal".
                'tips' => 'Variante de la prensa con otro ángulo de carga sobre el cuádriceps.'],
            // Esta línea sirve para definir el ejercicio "Zancada en Smith" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Zancada en Smith', 'muscle' => 'quads', 'secondary' => ['glutes'], 'equipment' => 'machines', 'level' => 'intermediate', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Zancada en Smith".
                'instructions' => 'Con la barra guiada del Smith, da un paso atrás/adelante bajando en zancada.',
                // Esta línea sirve para agregar los errores comunes de "Zancada en Smith".
                'common_mistakes' => 'Perder el equilibrio lateral durante el movimiento.',
                // Esta línea sirve para agregar los consejos de "Zancada en Smith".
                'tips' => 'El riel guiado da más estabilidad que la zancada libre.'],
            // Esta línea sirve para definir el ejercicio "Femoral sentado en máquina" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Femoral sentado en máquina', 'muscle' => 'hamstrings', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Femoral sentado en máquina".
                'instructions' => 'Sentado, flexiona las rodillas llevando los talones hacia abajo/atrás.',
                // Esta línea sirve para agregar los errores comunes de "Femoral sentado en máquina".
                'common_mistakes' => 'Levantar los muslos del asiento.',
                // Esta línea sirve para agregar los consejos de "Femoral sentado en máquina".
                'tips' => 'Complementa al femoral acostado con otro ángulo de tensión.'],
            // Esta línea sirve para definir el ejercicio "Hip Thrust en máquina" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Hip Thrust en máquina', 'muscle' => 'glutes', 'secondary' => ['hamstrings'], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'compound',
                // Esta línea sirve para agregar las instrucciones de "Hip Thrust en máquina".
                'instructions' => 'Con la espalda apoyada, empuja la cadera hacia arriba contra la resistencia de la máquina.',
                // Esta línea sirve para agregar los errores comunes de "Hip Thrust en máquina".
                'common_mistakes' => 'Hiperextender la espalda baja en vez de usar los glúteos.',
                // Esta línea sirve para agregar los consejos de "Hip Thrust en máquina".
                'tips' => 'Más fácil de dosificar el peso que la barra libre.'],
            // Esta línea sirve para definir el ejercicio "Patada de glúteo en máquina" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Patada de glúteo en máquina', 'muscle' => 'glutes', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Patada de glúteo en máquina".
                'instructions' => 'Empuja la plataforma hacia atrás extendiendo la cadera, una pierna a la vez.',
                // Esta línea sirve para agregar los errores comunes de "Patada de glúteo en máquina".
                'common_mistakes' => 'Usar impulso en la espalda baja.',
                // Esta línea sirve para agregar los consejos de "Patada de glúteo en máquina".
                'tips' => 'Alternativa estable a la patada en polea.'],
            // Esta línea sirve para definir el ejercicio "Abducción en polea" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Abducción en polea', 'muscle' => 'glutes', 'secondary' => [], 'equipment' => 'cables', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Abducción en polea".
                'instructions' => 'Con el tobillo en la polea baja, aleja la pierna del cuerpo lateralmente.',
                // Esta línea sirve para agregar los errores comunes de "Abducción en polea".
                'common_mistakes' => 'Inclinar el torso para ayudar con impulso.',
                // Esta línea sirve para agregar los consejos de "Abducción en polea".
                'tips' => 'Tensión constante en todo el recorrido del glúteo medio.'],
            // Esta línea sirve para definir el ejercicio "Aductores en máquina" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Aductores en máquina', 'muscle' => 'glutes', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Aductores en máquina".
                'instructions' => 'Junta las piernas contra la resistencia de la máquina.',
                // Esta línea sirve para agregar los errores comunes de "Aductores en máquina".
                'common_mistakes' => 'Rango de movimiento incompleto.',
                // Esta línea sirve para agregar los consejos de "Aductores en máquina".
                'tips' => 'Complementa el trabajo de abductores para equilibrio de cadera.'],
            // Esta línea sirve para definir el ejercicio "Pantorrilla sentado en prensa" con su músculo, músculos secundarios, equipamiento, nivel y tipo.
            ['name' => 'Pantorrilla sentado en prensa', 'muscle' => 'calves', 'secondary' => [], 'equipment' => 'machines', 'level' => 'beginner', 'type' => 'isolation',
                // Esta línea sirve para agregar las instrucciones de "Pantorrilla sentado en prensa".
                'instructions' => 'En la prensa de piernas, empuja la plataforma solo con la punta de los pies.',
                // Esta línea sirve para agregar los errores comunes de "Pantorrilla sentado en prensa".
                'common_mistakes' => 'Rango de movimiento incompleto.',
                // Esta línea sirve para agregar los consejos de "Pantorrilla sentado en prensa".
                'tips' => 'Aprovecha el equipo de piernas sin necesitar máquina dedicada.'],
        ];

        // Esta línea sirve para recorrer cada ejercicio de la lista.
        foreach ($exercises as $data) {
            // Esta línea sirve para guardar sus músculos secundarios.
            $secondary = $data['secondary'];

            // Esta línea sirve para crear el ejercicio, o actualizarlo si ya existía.
            $exercise = Exercise::query()->updateOrCreate(
                // Esta línea sirve para buscarlo por su nombre.
                ['name' => $data['name']],
                [
                    // Esta línea sirve para guardar el id del músculo principal.
                    'primary_muscle_id' => $muscles[$data['muscle']],
                    // Esta línea sirve para guardar el equipamiento.
                    'equipment' => $data['equipment'],
                    // Esta línea sirve para guardar el nivel.
                    'level' => $data['level'],
                    // Esta línea sirve para guardar el tipo.
                    'type' => $data['type'],
                    // Esta línea sirve para guardar las instrucciones.
                    'instructions' => $data['instructions'],
                    // Esta línea sirve para guardar los errores comunes.
                    'common_mistakes' => $data['common_mistakes'],
                    // Esta línea sirve para guardar los consejos.
                    'tips' => $data['tips'],
                    // Esta línea sirve para marcarlo como activo.
                    'is_active' => true,
                ],
            );

            // Esta línea sirve para revisar si tiene músculos secundarios.
            if ($secondary !== []) {
                // Esta línea sirve para sincronizar sus músculos secundarios.
                $exercise->secondaryMuscles()->sync(
                    // Esta línea sirve para convertir cada slug en el id de su grupo muscular.
                    collect($secondary)->map(fn (string $slug) => $muscles[$slug])->all()
                );
            }
        }
    }
}

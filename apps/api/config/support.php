<?php

/**
 * Soporte (solicitudes usuario <-> equipo de SanKen) y check-in semanal.
 * Los textos visibles viven en @sanken/core (support/strings.ts); acá solo
 * los catálogos que valida el backend y las reglas del check-in.
 */
// Esta línea sirve para devolver el arreglo de configuración de soporte.
return [
    // Esta línea sirve para definir los tipos de solicitud.
    'ticket_types' => ['question', 'complaint', 'observation', 'suggestion', 'technical_issue', 'other'],

    // open -> in_review -> answered -> resolved/closed. Un mensaje del usuario
    // sobre una solicitud answered/resolved la vuelve a 'open'.
    // Esta línea sirve para definir los estados de una solicitud.
    'ticket_statuses' => ['open', 'in_review', 'answered', 'resolved', 'closed'],

    // Esta línea sirve para definir las prioridades.
    'ticket_priorities' => ['low', 'normal', 'high', 'urgent'],

    // Esta línea sirve para configurar el check-in semanal.
    'checkin' => [
        // Esta línea sirve para definir los estados de ánimo posibles.
        'moods' => ['great', 'good', 'neutral', 'not_good', 'bad'],

        // 'none' = "No, todo está bien" (no crea solicitud).
        // Esta línea sirve para definir los temas posibles.
        'topics' => ['question', 'complaint', 'observation', 'problem', 'suggestion', 'none'],

        /*
         * La app no guarda zona horaria por usuario y config('app.timezone')
         * es UTC. Los usuarios son de Colombia (precios en COP, departamentos),
         * así que la semana del check-in se calcula en esta zona: si no, un
         * usuario vería el check-in de "la semana siguiente" el domingo a las
         * 7 p. m. hora local (00:00 UTC del lunes).
         */
        // Esta línea sirve para definir la zona horaria del check-in (Bogotá por defecto).
        'timezone' => env('CHECKIN_TIMEZONE', 'America/Bogota'),

        // Se ofrece desde el viernes (ISO: 1=lunes ... 7=domingo) hasta el
        // domingo: preguntar "¿cómo te fue esta semana?" un lunes no tiene
        // sentido.
        // Esta línea sirve para ofrecer el check-in desde el viernes.
        'available_from_iso_day' => 5,

        // Una cuenta con menos días que esto no recibe el check-in todavía
        // (no tiene una semana de entrenamiento que contar).
        // Esta línea sirve para exigir al menos 3 días de antigüedad de la cuenta.
        'min_account_age_days' => 3,

        // "Ahora no": se vuelve a ofrecer pasadas estas horas, como mucho
        // max_postpones veces por semana. Después no se insiste esa semana.
        // Esta línea sirve para volver a ofrecerlo 24 horas después de posponerlo.
        'postpone_hours' => 24,
        // Esta línea sirve para permitir posponerlo como mucho 2 veces por semana.
        'max_postpones' => 2,
    ],
];

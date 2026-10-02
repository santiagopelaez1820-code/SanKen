<?php

/**
 * Soporte (solicitudes usuario <-> equipo de SanKen) y check-in semanal.
 * Los textos visibles viven en @sanken/core (support/strings.ts); acá solo
 * los catálogos que valida el backend y las reglas del check-in.
 */
return [
    'ticket_types' => ['question', 'complaint', 'observation', 'suggestion', 'technical_issue', 'other'],

    // open -> in_review -> answered -> resolved/closed. Un mensaje del usuario
    // sobre una solicitud answered/resolved la vuelve a 'open'.
    'ticket_statuses' => ['open', 'in_review', 'answered', 'resolved', 'closed'],

    'ticket_priorities' => ['low', 'normal', 'high', 'urgent'],

    'checkin' => [
        'moods' => ['great', 'good', 'neutral', 'not_good', 'bad'],

        // 'none' = "No, todo está bien" (no crea solicitud).
        'topics' => ['question', 'complaint', 'observation', 'problem', 'suggestion', 'none'],

        /*
         * La app no guarda zona horaria por usuario y config('app.timezone')
         * es UTC. Los usuarios son de Colombia (precios en COP, departamentos),
         * así que la semana del check-in se calcula en esta zona: si no, un
         * usuario vería el check-in de "la semana siguiente" el domingo a las
         * 7 p. m. hora local (00:00 UTC del lunes).
         */
        'timezone' => env('CHECKIN_TIMEZONE', 'America/Bogota'),

        // Se ofrece desde el viernes (ISO: 1=lunes ... 7=domingo) hasta el
        // domingo: preguntar "¿cómo te fue esta semana?" un lunes no tiene
        // sentido.
        'available_from_iso_day' => 5,

        // Una cuenta con menos días que esto no recibe el check-in todavía
        // (no tiene una semana de entrenamiento que contar).
        'min_account_age_days' => 3,

        // "Ahora no": se vuelve a ofrecer pasadas estas horas, como mucho
        // max_postpones veces por semana. Después no se insiste esa semana.
        'postpone_hours' => 24,
        'max_postpones' => 2,
    ],
];

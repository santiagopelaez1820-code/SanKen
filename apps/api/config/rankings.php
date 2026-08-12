<?php

/**
 * Catálogo estático de brackets de edad y tiers de fuerza para el ranking
 * "categorías de fuerza" (Sprint 9). Mismo criterio que config/onboarding.php:
 * vive en config porque todavía no cambia con frecuencia.
 */
return [
    'age_brackets' => [
        ['min' => 18, 'max' => 24, 'label' => '18-24'],
        ['min' => 25, 'max' => 34, 'label' => '25-34'],
        ['min' => 35, 'max' => 44, 'label' => '35-44'],
        ['min' => 45, 'max' => 54, 'label' => '45-54'],
        ['min' => 55, 'max' => 64, 'label' => '55-64'],
        ['min' => 65, 'max' => null, 'label' => '65+'],
    ],

    // Tier según ratio mejor-1RM / peso corporal. `max_ratio` es exclusivo
    // (el ratio cae en la primera banda donde ratio < max_ratio); la última
    // banda (max_ratio null) es el resto.
    'strength_tiers' => [
        ['max_ratio' => 0.5, 'label' => 'principiante'],
        ['max_ratio' => 1.0, 'label' => 'intermedio'],
        ['max_ratio' => 1.75, 'label' => 'avanzado'],
        ['max_ratio' => null, 'label' => 'elite'],
    ],
];

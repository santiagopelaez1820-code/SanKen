<?php

// Esta línea sirve para devolver el arreglo de configuración de Web Push.
return [
    // Esta línea sirve para definir la clave pública VAPID.
    'public_key' => env('VAPID_PUBLIC_KEY'),
    // Esta línea sirve para definir la clave privada VAPID.
    'private_key' => env('VAPID_PRIVATE_KEY'),
    // Esta línea sirve para definir el contacto del remitente.
    'subject' => env('VAPID_SUBJECT', 'mailto:dev@sanken.app'),
];

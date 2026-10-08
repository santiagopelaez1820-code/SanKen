<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los listeners.

namespace App\Listeners;

// Esta línea sirve para importar la acción que genera la rutina.
use App\Application\Routine\Actions\GenerateRoutineAction;
// Esta línea sirve para importar el evento de onboarding completado.
use App\Events\OnboardingCompleted;

// Esta línea sirve para declarar el listener que genera la rutina al completar el onboarding.
class GenerateRoutineOnOnboardingCompleted
{
    /**
     * Sincrono a proposito: con el motor de plantillas (TemplateRoutineGenerator)
     * generar una rutina es una sola query, no un pipeline algoritmico — ya no
     * hace falta encolarlo. Antes corria en cola (dispatch) y el dashboard
     * pedia /routines/active sin reintentar, así que si el worker tardaba
     * aunque sea 1-2s el usuario veia "generando tu plan" sin salir de ahi
     * hasta refrescar a mano. Sincrono elimina esa carrera de raiz.
     */
    // Esta línea sirve para declarar el método que atiende el evento.
    public function handle(OnboardingCompleted $event): void
    {
        // Esta línea sirve para generar la rutina en el momento (sin pasar por la cola).
        GenerateRoutineAction::dispatchSync($event->user);
    }
}

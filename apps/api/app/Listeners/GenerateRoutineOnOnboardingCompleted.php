<?php

namespace App\Listeners;

use App\Application\Routine\Actions\GenerateRoutineAction;
use App\Events\OnboardingCompleted;

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
    public function handle(OnboardingCompleted $event): void
    {
        GenerateRoutineAction::dispatchSync($event->user);
    }
}

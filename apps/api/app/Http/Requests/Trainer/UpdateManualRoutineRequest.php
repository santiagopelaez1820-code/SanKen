<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del entrenador.

namespace App\Http\Requests\Trainer;

// Esta línea sirve para declarar la validación de la edición de una rutina manual con las mismas reglas que al crear.
class UpdateManualRoutineRequest extends StoreManualRoutineRequest
{
    // El editor del entrenador siempre envía el plan completo (mismas reglas que al crear).
}

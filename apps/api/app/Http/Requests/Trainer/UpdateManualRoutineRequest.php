<?php

namespace App\Http\Requests\Trainer;

class UpdateManualRoutineRequest extends StoreManualRoutineRequest
{
    // El editor del entrenador siempre envía el plan completo (mismas reglas que al crear).
}

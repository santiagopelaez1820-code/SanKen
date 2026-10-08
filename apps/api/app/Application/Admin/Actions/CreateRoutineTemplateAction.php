<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de administración.

namespace App\Application\Admin\Actions;

// Esta línea sirve para importar el trait que crea los días y ejercicios de una plantilla.
use App\Application\Admin\Actions\Concerns\SyncsRoutineTemplateDays;
// Esta línea sirve para importar el modelo RoutineTemplate (plantilla de rutina).
use App\Models\RoutineTemplate;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;

/**
 * Nace SIEMPRE inactiva (is_active=false), sin importar lo que traiga el
 * payload — igual que DuplicateRoutineTemplateAction. Activarla es un paso
 * aparte y deliberado (AdminRoutineTemplateController::activate), que es el
 * único lugar que garantiza "una sola plantilla activa por sexo+frecuencia"
 * dentro de una transacción. Crear ya-activa permitiría dos plantillas
 * activas para el mismo par sexo+frecuencia sin que nada lo evite.
 */
// Esta línea sirve para declarar la acción que crea una plantilla de rutina nueva.
class CreateRoutineTemplateAction
{
    // Esta línea sirve para incluir el trait que crea los días de la plantilla.
    use SyncsRoutineTemplateDays;

    /**
     * @param  array<string, mixed>  $data
     */
    // Esta línea sirve para declarar el método que recibe los datos y devuelve la plantilla creada.
    public function execute(array $data): RoutineTemplate
    {
        // Esta línea sirve para ejecutar la creación dentro de una transacción y devolver su resultado.
        return DB::transaction(function () use ($data) {
            // Esta línea sirve para crear la plantilla en la base de datos.
            $template = RoutineTemplate::query()->create([
                // Esta línea sirve para guardar el nombre de la plantilla, o null si no se envió.
                'name' => $data['name'] ?? null,
                // Esta línea sirve para guardar el sexo al que va dirigida la plantilla.
                'sex' => $data['sex'],
                // Esta línea sirve para guardar cuántos días por semana tiene.
                'frequency_days' => $data['frequency_days'],
                // Esta línea sirve para guardar el nivel (principiante, intermedio, avanzado).
                'level' => $data['level'],
                // Esta línea sirve para guardar el tipo de división de la rutina.
                'split_type' => $data['split_type'],
                // Esta línea sirve para crearla siempre inactiva (activarla es un paso aparte).
                'is_active' => false,
            ]);

            // Esta línea sirve para crear los días y ejercicios de la plantilla (o ninguno si no vienen).
            $this->syncRoutineTemplateDays($template, $data['days'] ?? []);

            // Esta línea sirve para devolver la plantilla con sus días y ejercicios cargados.
            return $template->load('days.exercises.exercise.primaryMuscle');
        });
    }
}

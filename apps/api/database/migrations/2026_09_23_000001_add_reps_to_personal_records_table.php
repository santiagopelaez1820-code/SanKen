<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada DB para consultar y actualizar datos.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la fachada Schema para modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Hasta acá `value` guardaba el 1RM estimado (Epley) y era lo único que
 * veía el usuario: 100 kg × 5 se mostraba como "116.67 kg" (parecía que
 * la app "sumaba" valores) y después 110 kg × 1 no contaba como récord
 * porque 110 < 116.67 ("no guarda los nuevos"). Reporte del tester.
 *
 * Desde ahora `value` es el peso real levantado y `reps` las repeticiones
 * de esa serie (ver PersonalRecord::isBeatenBy). Los récords que salieron
 * de una serie de entrenamiento se reconstruyen desde workout_sets; los
 * manuales viejos no guardaban el peso original, así que conservan su
 * valor y quedan con reps null.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla personal_records.
        Schema::table('personal_records', function (Blueprint $table) {
            // Esta línea sirve para agregar las repeticiones (opcional) después del valor.
            $table->unsignedSmallInteger('reps')->nullable()->after('value');
        });

        // Esta línea sirve para consultar los récords.
        DB::table('personal_records')
            // Esta línea sirve para filtrar los que salieron de una serie de entrenamiento.
            ->whereNotNull('workout_set_id')
            // Esta línea sirve para ordenar por id.
            ->orderBy('id')
            // Esta línea sirve para recorrerlos de a uno.
            ->each(function (object $record) {
                // Esta línea sirve para buscar el peso y las repeticiones de esa serie.
                $set = DB::table('workout_sets')->where('id', $record->workout_set_id)->first(['weight_kg', 'reps']);
                // Esta línea sirve para revisar si la serie existe.
                if ($set) {
                    // Esta línea sirve para actualizar el récord.
                    DB::table('personal_records')->where('id', $record->id)->update([
                        // Esta línea sirve para guardar como valor el peso real levantado.
                        'value' => $set->weight_kg,
                        // Esta línea sirve para guardar las repeticiones de la serie.
                        'reps' => $set->reps,
                    ]);
                }
            });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla personal_records.
        Schema::table('personal_records', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna reps.
            $table->dropColumn('reps');
        });
    }
};

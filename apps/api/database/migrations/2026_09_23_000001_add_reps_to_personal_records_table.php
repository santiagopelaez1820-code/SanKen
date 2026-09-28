<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('personal_records', function (Blueprint $table) {
            $table->unsignedSmallInteger('reps')->nullable()->after('value');
        });

        DB::table('personal_records')
            ->whereNotNull('workout_set_id')
            ->orderBy('id')
            ->each(function (object $record) {
                $set = DB::table('workout_sets')->where('id', $record->workout_set_id)->first(['weight_kg', 'reps']);
                if ($set) {
                    DB::table('personal_records')->where('id', $record->id)->update([
                        'value' => $set->weight_kg,
                        'reps' => $set->reps,
                    ]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('personal_records', function (Blueprint $table) {
            $table->dropColumn('reps');
        });
    }
};

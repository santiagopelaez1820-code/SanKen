<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Estado explícito para "el usuario salió de un entrenamiento sin
 * terminarlo" — antes no existía ninguna forma de distinguir esto de una
 * sesión simplemente abandonada en el limbo (completed=false para
 * siempre, sin ninguna marca). Ver CancelWorkoutSessionAction: nunca pone
 * completed=true, así que nunca dispara feedback/sobrecarga progresiva ni
 * cuenta como entrenada en el calendario (que ya filtra por completed).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workout_sessions', function (Blueprint $table) {
            $table->timestamp('cancelled_at')->nullable()->after('skipped_at');
        });
    }

    public function down(): void
    {
        Schema::table('workout_sessions', function (Blueprint $table) {
            $table->dropColumn('cancelled_at');
        });
    }
};

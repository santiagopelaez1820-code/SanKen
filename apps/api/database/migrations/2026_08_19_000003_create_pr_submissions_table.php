<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Postulación de un PR para Rankings públicos, CON video de evidencia y
 * revisión de Super Admin — deliberadamente una tabla separada de
 * `personal_records` (que solo guarda el mejor valor actual por
 * usuario+ejercicio+tipo, sin ningún concepto de historial ni estado:
 * un "pendiente" no puede convivir ahí con el "mejor actual" ya
 * aprobado). `personal_records` sigue siendo la detección automática
 * en el entrenamiento, privada, sin cambios — ver
 * DetectPersonalRecordAction. Esta tabla es la única fuente para
 * Rankings (ver Bloque 5): solo status='approved' cuenta.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pr_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_id')->constrained()->restrictOnDelete();
            $table->decimal('weight_kg', 6, 2);
            $table->unsignedTinyInteger('reps');
            $table->decimal('estimated_1rm', 6, 2);
            $table->string('video_url')->nullable();
            $table->string('status')->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index(['exercise_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pr_submissions');
    }
};

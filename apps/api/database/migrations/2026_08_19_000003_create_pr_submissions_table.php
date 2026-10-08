<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
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
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla pr_submissions.
        Schema::create('pr_submissions', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el ejercicio (impide borrar un ejercicio con postulaciones).
            $table->foreignId('exercise_id')->constrained()->restrictOnDelete();
            // Esta línea sirve para agregar el peso.
            $table->decimal('weight_kg', 6, 2);
            // Esta línea sirve para agregar las repeticiones.
            $table->unsignedTinyInteger('reps');
            // Esta línea sirve para agregar el 1RM estimado.
            $table->decimal('estimated_1rm', 6, 2);
            // Esta línea sirve para agregar la URL del video (opcional).
            $table->string('video_url')->nullable();
            // Esta línea sirve para agregar el estado (pendiente por defecto).
            $table->string('status')->default('pending');
            // Esta línea sirve para agregar quién la revisó (opcional).
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            // Esta línea sirve para agregar cuándo se revisó (opcional).
            $table->timestamp('reviewed_at')->nullable();
            // Esta línea sirve para agregar el motivo del rechazo (opcional).
            $table->text('rejection_reason')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por estado.
            $table->index('status');
            // Esta línea sirve para agregar un índice por ejercicio y estado.
            $table->index(['exercise_id', 'status']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('pr_submissions');
    }
};

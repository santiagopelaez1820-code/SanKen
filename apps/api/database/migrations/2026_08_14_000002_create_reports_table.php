<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla reports.
        Schema::create('reports', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar quién reporta (se borra junto con el usuario).
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();
            // Esta línea sirve para agregar el tipo y el id del contenido reportado.
            $table->morphs('reportable');
            // Esta línea sirve para agregar el motivo.
            $table->string('reason');
            // Esta línea sirve para agregar los detalles (opcional).
            $table->text('details')->nullable();
            // Esta línea sirve para agregar el estado (pendiente por defecto).
            $table->string('status')->default('pending');
            // Esta línea sirve para agregar quién lo resolvió (opcional).
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            // Esta línea sirve para agregar cuándo se resolvió (opcional).
            $table->timestamp('resolved_at')->nullable();
            // Esta línea sirve para agregar las notas de la resolución (opcional).
            $table->text('resolution_notes')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por estado.
            $table->index('status');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('reports');
    }
};

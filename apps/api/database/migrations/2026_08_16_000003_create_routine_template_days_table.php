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
        // Esta línea sirve para crear la tabla routine_template_days.
        Schema::create('routine_template_days', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar la plantilla (se borra junto con la plantilla).
            $table->foreignId('routine_template_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el orden del día.
            $table->unsignedTinyInteger('day_order');
            // Esta línea sirve para agregar el nombre del día.
            $table->string('label');
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por plantilla y orden.
            $table->index(['routine_template_id', 'day_order']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('routine_template_days');
    }
};

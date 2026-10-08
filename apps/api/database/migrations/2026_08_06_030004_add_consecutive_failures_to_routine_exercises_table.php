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
        // Esta línea sirve para modificar la tabla routine_exercises.
        Schema::table('routine_exercises', function (Blueprint $table) {
            // Esta línea sirve para agregar las fallas consecutivas (0 por defecto).
            $table->unsignedTinyInteger('consecutive_failures')->default(0)->after('suggested_weight_kg');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla routine_exercises.
        Schema::table('routine_exercises', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna de fallas consecutivas.
            $table->dropColumn('consecutive_failures');
        });
    }
};

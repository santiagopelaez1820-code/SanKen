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
        // Esta línea sirve para modificar la tabla workout_sessions.
        Schema::table('workout_sessions', function (Blueprint $table) {
            // Esta línea sirve para agregar si se hizo como estaba planeado (opcional).
            $table->boolean('completed_as_planned')->nullable()->after('completed');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla workout_sessions.
        Schema::table('workout_sessions', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna completed_as_planned.
            $table->dropColumn('completed_as_planned');
        });
    }
};

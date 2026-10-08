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
        // Esta línea sirve para modificar la tabla personal_records.
        Schema::table('personal_records', function (Blueprint $table) {
            // Esta línea sirve para agregar un índice por usuario y fecha del récord.
            $table->index(['user_id', 'achieved_at']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla personal_records.
        Schema::table('personal_records', function (Blueprint $table) {
            // Esta línea sirve para borrar ese índice.
            $table->dropIndex(['user_id', 'achieved_at']);
        });
    }
};

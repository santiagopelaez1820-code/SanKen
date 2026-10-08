<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Aditiva: guarda la ruta relativa del archivo (mismo criterio que
 * exercises.video_url), no la URL absoluta — cada cliente la resuelve
 * contra su propio API baseUrl vía ApiClient::mediaUrl().
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla users.
        Schema::table('users', function (Blueprint $table) {
            // Esta línea sirve para agregar la URL de la foto de perfil (opcional).
            $table->string('avatar_url')->nullable()->after('name');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla users.
        Schema::table('users', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna avatar_url.
            $table->dropColumn('avatar_url');
        });
    }
};

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
    /**
     * Run the migrations.
     */
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla de tokens de acceso de Sanctum.
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el tipo y el id del dueño del token.
            $table->morphs('tokenable');
            // Esta línea sirve para agregar el nombre del token.
            $table->text('name');
            // Esta línea sirve para agregar el token hasheado (único).
            $table->string('token', 64)->unique();
            // Esta línea sirve para agregar los permisos del token (opcional).
            $table->text('abilities')->nullable();
            // Esta línea sirve para agregar el último uso (opcional).
            $table->timestamp('last_used_at')->nullable();
            // Esta línea sirve para agregar el vencimiento (opcional e indexado).
            $table->timestamp('expires_at')->nullable()->index();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('personal_access_tokens');
    }
};

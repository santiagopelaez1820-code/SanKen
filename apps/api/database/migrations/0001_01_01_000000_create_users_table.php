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
        // Esta línea sirve para crear la tabla users.
        Schema::create('users', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el nombre.
            $table->string('name');
            // Esta línea sirve para agregar el correo único.
            $table->string('email')->unique();
            // Esta línea sirve para agregar la fecha de verificación del correo (opcional).
            $table->timestamp('email_verified_at')->nullable();
            // Esta línea sirve para agregar la contraseña.
            $table->string('password');
            // Esta línea sirve para agregar el token de "recordarme".
            $table->rememberToken();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });

        // Esta línea sirve para crear la tabla de tokens para restablecer contraseñas.
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            // Esta línea sirve para agregar el correo como clave primaria.
            $table->string('email')->primary();
            // Esta línea sirve para agregar el token.
            $table->string('token');
            // Esta línea sirve para agregar la fecha de creación (opcional).
            $table->timestamp('created_at')->nullable();
        });

        // Esta línea sirve para crear la tabla de sesiones.
        Schema::create('sessions', function (Blueprint $table) {
            // Esta línea sirve para agregar el id de la sesión como clave primaria.
            $table->string('id')->primary();
            // Esta línea sirve para agregar el id del usuario (opcional e indexado).
            $table->foreignId('user_id')->nullable()->index();
            // Esta línea sirve para agregar la IP (opcional).
            $table->string('ip_address', 45)->nullable();
            // Esta línea sirve para agregar el navegador del usuario (opcional).
            $table->text('user_agent')->nullable();
            // Esta línea sirve para agregar los datos de la sesión.
            $table->longText('payload');
            // Esta línea sirve para agregar la última actividad (indexada).
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla users si existe.
        Schema::dropIfExists('users');
        // Esta línea sirve para borrar la tabla de tokens si existe.
        Schema::dropIfExists('password_reset_tokens');
        // Esta línea sirve para borrar la tabla de sesiones si existe.
        Schema::dropIfExists('sessions');
    }
};

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
        // Esta línea sirve para crear la tabla user_profiles.
        Schema::create('user_profiles', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (único; se borra junto con el usuario).
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar la edad (opcional).
            $table->unsignedTinyInteger('age')->nullable();
            // Esta línea sirve para agregar el sexo (opcional).
            $table->enum('sex', ['male', 'female'])->nullable();
            // Esta línea sirve para agregar la altura en cm (opcional).
            $table->decimal('height_cm', 5, 1)->nullable();
            // Esta línea sirve para agregar el peso en kg (opcional).
            $table->decimal('weight_kg', 5, 1)->nullable();
            // Esta línea sirve para agregar la ciudad (opcional).
            $table->foreignId('city_id')->nullable()->constrained()->nullOnDelete();
            // Esta línea sirve para agregar el gimnasio (opcional).
            $table->foreignId('gym_id')->nullable()->constrained()->nullOnDelete();
            // Esta línea sirve para agregar la URL de la foto (opcional).
            $table->string('avatar_url')->nullable();
            // Esta línea sirve para agregar la biografía (opcional).
            $table->text('bio')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('user_profiles');
    }
};

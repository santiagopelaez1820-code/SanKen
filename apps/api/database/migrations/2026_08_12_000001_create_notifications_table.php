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
        // Esta línea sirve para crear la tabla notifications.
        Schema::create('notifications', function (Blueprint $table) {
            // Esta línea sirve para agregar el id como uuid y clave primaria.
            $table->uuid('id')->primary();
            // Esta línea sirve para agregar el tipo de notificación.
            $table->string('type');
            // Esta línea sirve para agregar el tipo y el id del destinatario.
            $table->morphs('notifiable');
            // Esta línea sirve para agregar los datos de la notificación.
            $table->text('data');
            // Esta línea sirve para agregar cuándo se leyó (opcional).
            $table->timestamp('read_at')->nullable();
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
        Schema::dropIfExists('notifications');
    }
};

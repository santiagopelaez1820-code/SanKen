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
        // Esta línea sirve para crear la tabla de trabajos en cola.
        Schema::create('jobs', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el nombre de la cola (indexado).
            $table->string('queue')->index();
            // Esta línea sirve para agregar los datos del trabajo.
            $table->longText('payload');
            // Esta línea sirve para agregar la cantidad de intentos.
            $table->unsignedTinyInteger('attempts');
            // Esta línea sirve para agregar cuándo se reservó (opcional).
            $table->unsignedInteger('reserved_at')->nullable();
            // Esta línea sirve para agregar desde cuándo está disponible.
            $table->unsignedInteger('available_at');
            // Esta línea sirve para agregar cuándo se creó.
            $table->unsignedInteger('created_at');
        });

        // Esta línea sirve para crear la tabla de lotes de trabajos.
        Schema::create('job_batches', function (Blueprint $table) {
            // Esta línea sirve para agregar el id como clave primaria.
            $table->string('id')->primary();
            // Esta línea sirve para agregar el nombre.
            $table->string('name');
            // Esta línea sirve para agregar el total de trabajos.
            $table->integer('total_jobs');
            // Esta línea sirve para agregar los trabajos pendientes.
            $table->integer('pending_jobs');
            // Esta línea sirve para agregar los trabajos fallidos.
            $table->integer('failed_jobs');
            // Esta línea sirve para agregar los ids de los trabajos fallidos.
            $table->longText('failed_job_ids');
            // Esta línea sirve para agregar las opciones (opcional).
            $table->mediumText('options')->nullable();
            // Esta línea sirve para agregar cuándo se canceló (opcional).
            $table->integer('cancelled_at')->nullable();
            // Esta línea sirve para agregar cuándo se creó.
            $table->integer('created_at');
            // Esta línea sirve para agregar cuándo terminó (opcional).
            $table->integer('finished_at')->nullable();
        });

        // Esta línea sirve para crear la tabla de trabajos fallidos.
        Schema::create('failed_jobs', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el uuid único.
            $table->string('uuid')->unique();
            // Esta línea sirve para agregar la conexión.
            $table->text('connection');
            // Esta línea sirve para agregar la cola.
            $table->text('queue');
            // Esta línea sirve para agregar los datos del trabajo.
            $table->longText('payload');
            // Esta línea sirve para agregar la excepción.
            $table->longText('exception');
            // Esta línea sirve para agregar cuándo falló (ahora por defecto).
            $table->timestamp('failed_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla de trabajos si existe.
        Schema::dropIfExists('jobs');
        // Esta línea sirve para borrar la tabla de lotes si existe.
        Schema::dropIfExists('job_batches');
        // Esta línea sirve para borrar la tabla de trabajos fallidos si existe.
        Schema::dropIfExists('failed_jobs');
    }
};

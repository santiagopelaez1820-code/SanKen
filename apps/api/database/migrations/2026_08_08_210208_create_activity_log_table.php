<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

// Esta línea sirve para declarar la migración que crea la tabla de auditoría de Spatie.
class CreateActivityLogTable extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up()
    {
        // Esta línea sirve para crear la tabla de auditoría en la conexión y con el nombre configurados.
        Schema::connection(config('activitylog.database_connection'))->create(config('activitylog.table_name'), function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->bigIncrements('id');
            // Esta línea sirve para agregar el nombre del log (opcional).
            $table->string('log_name')->nullable();
            // Esta línea sirve para agregar la descripción.
            $table->text('description');
            // Esta línea sirve para agregar el tipo y el id del registro afectado (opcionales).
            $table->nullableMorphs('subject', 'subject');
            // Esta línea sirve para agregar el tipo y el id de quien hizo el cambio (opcionales).
            $table->nullableMorphs('causer', 'causer');
            // Esta línea sirve para agregar las propiedades en JSON (opcional).
            $table->json('properties')->nullable();
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
            // Esta línea sirve para agregar un índice por nombre del log.
            $table->index('log_name');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down()
    {
        // Esta línea sirve para borrar la tabla de auditoría si existe.
        Schema::connection(config('activitylog.database_connection'))->dropIfExists(config('activitylog.table_name'));
    }
}

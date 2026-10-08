<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

// Esta línea sirve para declarar la migración que agrega la columna event a la auditoría.
class AddEventColumnToActivityLogTable extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up()
    {
        // Esta línea sirve para modificar la tabla de auditoría.
        Schema::connection(config('activitylog.database_connection'))->table(config('activitylog.table_name'), function (Blueprint $table) {
            // Esta línea sirve para agregar el evento (opcional).
            $table->string('event')->nullable()->after('subject_type');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down()
    {
        // Esta línea sirve para modificar la tabla de auditoría.
        Schema::connection(config('activitylog.database_connection'))->table(config('activitylog.table_name'), function (Blueprint $table) {
            // Esta línea sirve para borrar la columna event.
            $table->dropColumn('event');
        });
    }
}

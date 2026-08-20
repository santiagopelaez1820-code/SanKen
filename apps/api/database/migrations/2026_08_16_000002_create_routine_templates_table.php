<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Plantillas curadas de rutina (sexo + días/semana -> estructura de días y
 * ejercicios), reemplazan la seleccion algoritmica (ExerciseSelector) como
 * camino principal de generacion. Ver TemplateRoutineGenerator.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routine_templates', function (Blueprint $table) {
            $table->id();
            $table->enum('sex', ['male', 'female']);
            $table->unsignedTinyInteger('frequency_days');
            $table->string('split_type', 30);
            $table->timestamps();

            $table->unique(['sex', 'frequency_days']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routine_templates');
    }
};

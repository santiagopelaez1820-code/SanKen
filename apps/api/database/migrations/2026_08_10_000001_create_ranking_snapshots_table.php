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
        // Esta línea sirve para crear la tabla ranking_snapshots.
        Schema::create('ranking_snapshots', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el tipo de alcance.
            $table->string('scope_type', 20);
            // Esta línea sirve para agregar el valor del alcance (opcional).
            $table->string('scope_value')->nullable();
            // Esta línea sirve para agregar el valor de la métrica.
            $table->decimal('metric_value', 12, 2);
            // Esta línea sirve para agregar la posición.
            $table->unsignedInteger('rank_position');
            // Esta línea sirve para agregar la fecha de la foto del ranking.
            $table->date('snapshot_date');
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para impedir más de una fila por usuario y alcance.
            $table->unique(['user_id', 'scope_type', 'scope_value'], 'uniq_ranking_user_scope');
            // Esta línea sirve para agregar un índice para buscar por alcance y posición.
            $table->index(['scope_type', 'scope_value', 'rank_position'], 'idx_ranking_scope_lookup');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('ranking_snapshots');
    }
};

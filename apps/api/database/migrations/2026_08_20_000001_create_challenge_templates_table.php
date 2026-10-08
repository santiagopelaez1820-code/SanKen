<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Reemplaza el catálogo fijo de ChallengeCatalog::templates() (Sprint 10)
 * por plantillas editables desde admin: GenerateChallengesAction ahora lee
 * de acá en vez de un array hardcodeado en PHP, así que un Super Admin
 * puede crear un reto nuevo (mismo título/objetivo/cadencia, cualquiera de
 * las métricas ya soportadas) sin deploy. Agregar una MÉTRICA nueva sigue
 * necesitando código (ver ChallengeProgressCalculator) — eso es a
 * propósito, no hay forma razonable de hacerlo data-driven sin un motor de
 * reglas nuevo.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla challenge_templates.
        Schema::create('challenge_templates', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Identifica la plantilla para que GenerateChallengesAction
            // pueda seguir siendo idempotente (code+starts_at) sin crear
            // instancias duplicadas si el comando corre dos veces la misma
            // semana/mes.
            // Esta línea sirve para agregar el código único.
            $table->string('code')->unique();
            // Esta línea sirve para agregar el título.
            $table->string('title');
            // Esta línea sirve para agregar la descripción.
            $table->text('description');
            // Esta línea sirve para agregar el tipo.
            $table->string('type', 20);
            // Esta línea sirve para agregar la métrica.
            $table->string('metric');
            // Esta línea sirve para agregar la meta.
            $table->decimal('target', 12, 2);
            // Esta línea sirve para agregar si está activa (sí por defecto).
            $table->boolean('is_active')->default(true);
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('challenge_templates');
    }
};

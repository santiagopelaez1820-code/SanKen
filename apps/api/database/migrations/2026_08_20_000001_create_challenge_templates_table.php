<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenge_templates', function (Blueprint $table) {
            $table->id();
            // Identifica la plantilla para que GenerateChallengesAction
            // pueda seguir siendo idempotente (code+starts_at) sin crear
            // instancias duplicadas si el comando corre dos veces la misma
            // semana/mes.
            $table->string('code')->unique();
            $table->string('title');
            $table->text('description');
            $table->string('type', 20);
            $table->string('metric');
            $table->decimal('target', 12, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_templates');
    }
};

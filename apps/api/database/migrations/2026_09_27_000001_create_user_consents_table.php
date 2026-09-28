<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Registro append-only de consentimientos legales (ver config/legal.php).
 * Cada aceptación es una fila nueva — nunca se edita una existente, así el
 * historial de qué versión aceptó cada usuario y cuándo queda intacto. La
 * versión vigente para un usuario es su fila más reciente por tipo.
 *
 * No se guarda IP ni user agent a propósito: no hacen falta para saber qué
 * aceptó el usuario y cuándo (minimización de datos).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_consents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('consent_type', 40);
            $table->string('document_version', 20);
            $table->string('status', 20)->default('accepted');
            $table->string('source', 30);
            $table->timestamp('recorded_at');

            $table->unique(['user_id', 'consent_type', 'document_version', 'status'], 'user_consents_unique_version');
            $table->index(['user_id', 'consent_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_consents');
    }
};

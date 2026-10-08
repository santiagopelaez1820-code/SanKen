<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
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
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla user_consents.
        Schema::create('user_consents', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar el tipo de consentimiento.
            $table->string('consent_type', 40);
            // Esta línea sirve para agregar la versión del documento.
            $table->string('document_version', 20);
            // Esta línea sirve para agregar el estado ("accepted" por defecto).
            $table->string('status', 20)->default('accepted');
            // Esta línea sirve para agregar el origen del registro.
            $table->string('source', 30);
            // Esta línea sirve para agregar cuándo se registró.
            $table->timestamp('recorded_at');

            // Esta línea sirve para impedir registrar dos veces la misma versión y estado de un consentimiento.
            $table->unique(['user_id', 'consent_type', 'document_version', 'status'], 'user_consents_unique_version');
            // Esta línea sirve para agregar un índice por usuario y tipo de consentimiento.
            $table->index(['user_id', 'consent_type']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('user_consents');
    }
};

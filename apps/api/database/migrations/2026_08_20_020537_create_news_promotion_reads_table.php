<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Estado de lectura por usuario para NewsPromotion -- a diferencia de las
 * notificaciones nativas de Laravel (`notifications.read_at`), News no
 * tenía ningún concepto de leído/no leído (feed unificado, ver
 * GetUnifiedFeedAction). Una fila = leída; no existir = no leída todavía,
 * no hace falta guardar el estado "no leído" explícitamente.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla news_promotion_reads.
        Schema::create('news_promotion_reads', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar la noticia (se borra junto con la noticia).
            $table->foreignId('news_promotion_id')->constrained()->cascadeOnDelete();
            // Esta línea sirve para agregar cuándo se leyó.
            $table->timestamp('read_at');
            // Esta línea sirve para impedir registrar dos veces la misma lectura.
            $table->unique(['user_id', 'news_promotion_id']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('news_promotion_reads');
    }
};

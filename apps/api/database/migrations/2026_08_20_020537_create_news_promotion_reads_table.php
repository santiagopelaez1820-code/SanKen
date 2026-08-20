<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Estado de lectura por usuario para NewsPromotion -- a diferencia de las
 * notificaciones nativas de Laravel (`notifications.read_at`), News no
 * tenía ningún concepto de leído/no leído (feed unificado, ver
 * GetUnifiedFeedAction). Una fila = leída; no existir = no leída todavía,
 * no hace falta guardar el estado "no leído" explícitamente.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news_promotion_reads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('news_promotion_id')->constrained()->cascadeOnDelete();
            $table->timestamp('read_at');
            $table->unique(['user_id', 'news_promotion_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_promotion_reads');
    }
};

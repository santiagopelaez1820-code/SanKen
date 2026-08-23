<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            // `code` no está en el ERD original (docs/02): identifica de qué
            // plantilla de ChallengeCatalog viene un reto, para que
            // GenerateChallengesAction pueda hacer firstOrCreate(code, starts_at)
            // y así ser idempotente sin necesitar un admin panel que cree retos.
            $table->string('code');
            $table->string('title');
            $table->text('description');
            $table->string('type', 20);
            $table->json('criteria');
            $table->date('starts_at');
            $table->date('ends_at');
            $table->timestamps();

            $table->unique(['code', 'starts_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenges');
    }
};

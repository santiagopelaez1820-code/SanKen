<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routine_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('routine_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('day_order');
            $table->string('label');
            $table->json('target_muscle_groups')->nullable();
            $table->timestamps();

            $table->unique(['routine_id', 'day_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routine_days');
    }
};

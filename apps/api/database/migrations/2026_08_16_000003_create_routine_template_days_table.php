<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routine_template_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('routine_template_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('day_order');
            $table->string('label');
            $table->timestamps();

            $table->index(['routine_template_id', 'day_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routine_template_days');
    }
};

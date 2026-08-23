<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hace también de "barcode_cache" (mencionado como tabla aparte en el
        // boceto original de docs/02) — un lookup por barcode o texto primero
        // busca acá, y solo pega contra Open Food Facts en un miss, cacheando
        // el resultado. Una sola tabla, no dos.
        Schema::create('food_items', function (Blueprint $table) {
            $table->id();
            $table->string('barcode')->nullable()->unique();
            $table->string('name');
            $table->string('brand')->nullable();
            $table->decimal('calories_per_100g', 8, 2);
            $table->decimal('protein_per_100g', 8, 2);
            $table->decimal('carbs_per_100g', 8, 2);
            $table->decimal('fat_per_100g', 8, 2);
            $table->string('source', 20)->default('open_food_facts');
            $table->string('source_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('food_items');
    }
};

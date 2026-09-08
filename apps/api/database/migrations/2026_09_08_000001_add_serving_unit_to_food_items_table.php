<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * El front de nutrición mostraba únicamente gramos ("150g"), que no dice
 * nada intuitivo sobre la porción real. Estas columnas dejan que el
 * catálogo curado (food_items.source='manual') declare su unidad natural
 * (p.ej. "huevo" a 50g) para que el front pueda mostrar "2 huevos" además
 * del gramaje. Nullable porque solo se completa para el catálogo curado —
 * los productos de Open Food Facts (barcode/búsqueda) no tienen una unidad
 * natural conocida y siguen mostrándose solo en gramos.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('food_items', function (Blueprint $table) {
            $table->decimal('serving_size_grams', 6, 2)->nullable()->after('fat_per_100g');
            $table->string('serving_unit_singular', 40)->nullable()->after('serving_size_grams');
            $table->string('serving_unit_plural', 40)->nullable()->after('serving_unit_singular');
        });
    }

    public function down(): void
    {
        Schema::table('food_items', function (Blueprint $table) {
            $table->dropColumn(['serving_size_grams', 'serving_unit_singular', 'serving_unit_plural']);
        });
    }
};

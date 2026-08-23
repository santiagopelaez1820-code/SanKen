<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('routine_exercises', function (Blueprint $table) {
            $table->unsignedTinyInteger('consecutive_failures')->default(0)->after('suggested_weight_kg');
        });
    }

    public function down(): void
    {
        Schema::table('routine_exercises', function (Blueprint $table) {
            $table->dropColumn('consecutive_failures');
        });
    }
};

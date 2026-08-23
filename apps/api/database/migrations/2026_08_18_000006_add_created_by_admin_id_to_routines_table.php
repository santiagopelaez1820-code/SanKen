<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Aditiva: paralela a created_by_trainer_id, no la reemplaza. Nullable —
 * solo se completa cuando source='admin' (ver AssignPersonalRoutineAction).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('routines', function (Blueprint $table) {
            $table->foreignId('created_by_admin_id')->nullable()->after('created_by_trainer_id')
                ->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('routines', function (Blueprint $table) {
            $table->dropConstrainedForeignId('created_by_admin_id');
        });
    }
};

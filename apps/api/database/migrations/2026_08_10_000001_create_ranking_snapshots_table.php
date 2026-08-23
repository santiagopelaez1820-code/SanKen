<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ranking_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('scope_type', 20);
            $table->string('scope_value')->nullable();
            $table->decimal('metric_value', 12, 2);
            $table->unsignedInteger('rank_position');
            $table->date('snapshot_date');
            $table->timestamps();

            $table->unique(['user_id', 'scope_type', 'scope_value'], 'uniq_ranking_user_scope');
            $table->index(['scope_type', 'scope_value', 'rank_position'], 'idx_ranking_scope_lookup');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ranking_snapshots');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('short_description');
            $table->string('image')->nullable();
            $table->enum('category', ['protein', 'creatine', 'pre_workout', 'amino_acids', 'vitamins', 'other'])->default('other');
            $table->decimal('price', 10, 2);
            $table->boolean('active')->default(true);
            $table->string('dropi_reference')->nullable();
            $table->timestamps();

            $table->index(['category', 'active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->enum('role', ['user', 'trainer', 'admin'])->default('user')->after('password');
            $table->boolean('two_factor_enabled')->default(false)->after('role');
            $table->text('two_factor_secret')->nullable()->after('two_factor_enabled');
            $table->boolean('is_public_profile')->default(false)->after('two_factor_secret');
            $table->boolean('is_banned')->default(false)->after('is_public_profile');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'role',
                'two_factor_enabled',
                'two_factor_secret',
                'is_public_profile',
                'is_banned',
            ]);
        });
    }
};

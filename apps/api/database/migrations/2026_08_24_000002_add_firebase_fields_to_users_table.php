<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Aditiva: `firebase_uid` vincula una cuenta SanKen a un usuario de Firebase
 * (Google/Facebook) — nullable porque la mayoría de las cuentas siguen
 * siendo email+password puro. `auth_provider` es solo informativo (qué
 * proveedor se usó la última vez); nunca se usa para decidir permisos.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('firebase_uid')->nullable()->unique()->after('phone');
            $table->string('auth_provider')->nullable()->after('firebase_uid');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['firebase_uid', 'auth_provider']);
        });
    }
};

<?php

use App\Domain\Order\OrderStatusCatalog;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 'confirmed' deja de ser un estado válido — se renombra a
        // 'confirming' ANTES de estrechar el enum, para no perder el
        // estado de los pedidos que ya lo tuvieran.
        DB::table('orders')->where('status', 'confirmed')->update(['status' => OrderStatusCatalog::CONFIRMING]);

        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_whatsapp')->nullable()->after('customer_phone');
            $table->string('tracking_number')->nullable()->after('total');
            $table->string('carrier')->nullable()->after('tracking_number');
            $table->text('customer_message')->nullable()->after('carrier');
            $table->text('admin_notes')->nullable()->after('customer_message');
        });

        // Pedidos existentes sin WhatsApp propio: mejor heredar el celular
        // ya cargado que dejarlo vacío (la columna pasa a ser NOT NULL).
        DB::table('orders')->whereNull('customer_whatsapp')->update([
            'customer_whatsapp' => DB::raw('customer_phone'),
        ]);

        // ->change() reconstruye la columna de forma nativa en MySQL y
        // SQLite (Laravel 11+, sin depender de doctrine/dbal), así que el
        // mismo código sirve tanto para la BD real como para los tests.
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_whatsapp')->nullable(false)->change();
            $table->enum('status', OrderStatusCatalog::STATUSES)->default(OrderStatusCatalog::PENDING)->change();
        });
    }

    public function down(): void
    {
        DB::table('orders')->where('status', 'confirming')->update(['status' => 'confirmed']);
        DB::table('orders')->where('status', 'problem')->update(['status' => 'cancelled']);

        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
                ->default('pending')
                ->change();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['customer_whatsapp', 'tracking_number', 'carrier', 'customer_message', 'admin_notes']);
        });
    }
};

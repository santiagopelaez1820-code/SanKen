<?php

// Esta línea sirve para importar el catálogo de estados de pedido.
use App\Domain\Order\OrderStatusCatalog;
// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada DB para actualizar datos.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la fachada Schema para modificar tablas.
use Illuminate\Support\Facades\Schema;

// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // 'confirmed' deja de ser un estado válido — se renombra a
        // 'confirming' ANTES de estrechar el enum, para no perder el
        // estado de los pedidos que ya lo tuvieran.
        // Esta línea sirve para renombrar el estado "confirmed" a "confirming" en los pedidos existentes.
        DB::table('orders')->where('status', 'confirmed')->update(['status' => OrderStatusCatalog::CONFIRMING]);

        // Esta línea sirve para modificar la tabla orders.
        Schema::table('orders', function (Blueprint $table) {
            // Esta línea sirve para agregar el WhatsApp del cliente (opcional por ahora).
            $table->string('customer_whatsapp')->nullable()->after('customer_phone');
            // Esta línea sirve para agregar el número de guía (opcional).
            $table->string('tracking_number')->nullable()->after('total');
            // Esta línea sirve para agregar la transportadora (opcional).
            $table->string('carrier')->nullable()->after('tracking_number');
            // Esta línea sirve para agregar el mensaje para el cliente (opcional).
            $table->text('customer_message')->nullable()->after('carrier');
            // Esta línea sirve para agregar las notas internas del admin (opcional).
            $table->text('admin_notes')->nullable()->after('customer_message');
        });

        // Pedidos existentes sin WhatsApp propio: mejor heredar el celular
        // ya cargado que dejarlo vacío (la columna pasa a ser NOT NULL).
        // Esta línea sirve para completar el WhatsApp vacío de los pedidos existentes.
        DB::table('orders')->whereNull('customer_whatsapp')->update([
            // Esta línea sirve para copiar el celular del cliente como WhatsApp.
            'customer_whatsapp' => DB::raw('customer_phone'),
        ]);

        // ->change() reconstruye la columna de forma nativa en MySQL y
        // SQLite (Laravel 11+, sin depender de doctrine/dbal), así que el
        // mismo código sirve tanto para la BD real como para los tests.
        // Esta línea sirve para modificar la tabla orders.
        Schema::table('orders', function (Blueprint $table) {
            // Esta línea sirve para hacer obligatorio el WhatsApp.
            $table->string('customer_whatsapp')->nullable(false)->change();
            // Esta línea sirve para cambiar los estados permitidos por los del catálogo.
            $table->enum('status', OrderStatusCatalog::STATUSES)->default(OrderStatusCatalog::PENDING)->change();
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para volver a cambiar "confirming" por "confirmed".
        DB::table('orders')->where('status', 'confirming')->update(['status' => 'confirmed']);
        // Esta línea sirve para cambiar "problem" por "cancelled".
        DB::table('orders')->where('status', 'problem')->update(['status' => 'cancelled']);

        // Esta línea sirve para modificar la tabla orders.
        Schema::table('orders', function (Blueprint $table) {
            // Esta línea sirve para volver a los estados permitidos originales.
            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
                // Esta línea sirve para dejar "pending" como valor por defecto.
                ->default('pending')
                // Esta línea sirve para aplicar el cambio a la columna.
                ->change();
        });

        // Esta línea sirve para modificar la tabla orders.
        Schema::table('orders', function (Blueprint $table) {
            // Esta línea sirve para borrar las columnas agregadas.
            $table->dropColumn(['customer_whatsapp', 'tracking_number', 'carrier', 'customer_message', 'admin_notes']);
        });
    }
};

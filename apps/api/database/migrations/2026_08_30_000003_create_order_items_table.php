<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para crear la tabla order_items.
        Schema::create('order_items', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el pedido (se borra junto con el pedido).
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            // Esta línea sirve para agregar el producto (opcional; queda en null si se borra el producto).
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            // Esta línea sirve para agregar el nombre del producto al momento de la compra.
            $table->string('product_name');
            // Esta línea sirve para agregar la cantidad.
            $table->unsignedInteger('quantity');
            // Esta línea sirve para agregar el precio unitario.
            $table->decimal('unit_price', 10, 2);
            // Esta línea sirve para agregar el subtotal.
            $table->decimal('subtotal', 10, 2);
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('order_items');
    }
};

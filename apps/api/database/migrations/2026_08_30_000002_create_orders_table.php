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
        // Esta línea sirve para crear la tabla orders.
        Schema::create('orders', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // Esta línea sirve para agregar el usuario (se borra junto con el usuario).
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            // Esta línea sirve para agregar el estado (pendiente por defecto).
            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
            // Esta línea sirve para agregar el nombre del cliente.
            $table->string('customer_name');
            // Esta línea sirve para agregar el correo del cliente.
            $table->string('customer_email');
            // Esta línea sirve para agregar el celular del cliente.
            $table->string('customer_phone');
            // Esta línea sirve para agregar el departamento.
            $table->string('department');
            // Esta línea sirve para agregar la ciudad.
            $table->string('city');
            // Esta línea sirve para agregar la dirección.
            $table->string('address');
            // Esta línea sirve para agregar la información adicional (opcional).
            $table->text('additional_info')->nullable();
            // Esta línea sirve para agregar el subtotal.
            $table->decimal('subtotal', 10, 2);
            // Esta línea sirve para agregar el costo de envío (opcional).
            $table->decimal('shipping_cost', 10, 2)->nullable();
            // Esta línea sirve para agregar el total.
            $table->decimal('total', 10, 2);
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para agregar un índice por usuario y estado.
            $table->index(['user_id', 'status']);
            // Esta línea sirve para agregar un índice por estado.
            $table->index('status');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('orders');
    }
};

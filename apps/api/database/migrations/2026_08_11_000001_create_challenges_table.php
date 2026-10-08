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
        // Esta línea sirve para crear la tabla challenges.
        Schema::create('challenges', function (Blueprint $table) {
            // Esta línea sirve para agregar el id autoincremental.
            $table->id();
            // `code` no está en el ERD original (docs/02): identifica de qué
            // plantilla de ChallengeCatalog viene un reto, para que
            // GenerateChallengesAction pueda hacer firstOrCreate(code, starts_at)
            // y así ser idempotente sin necesitar un admin panel que cree retos.
            // Esta línea sirve para agregar el código de la plantilla.
            $table->string('code');
            // Esta línea sirve para agregar el título.
            $table->string('title');
            // Esta línea sirve para agregar la descripción.
            $table->text('description');
            // Esta línea sirve para agregar el tipo.
            $table->string('type', 20);
            // Esta línea sirve para agregar los criterios en JSON.
            $table->json('criteria');
            // Esta línea sirve para agregar la fecha de inicio.
            $table->date('starts_at');
            // Esta línea sirve para agregar la fecha de fin.
            $table->date('ends_at');
            // Esta línea sirve para agregar las fechas de creación y actualización.
            $table->timestamps();

            // Esta línea sirve para impedir dos retos con el mismo código y fecha de inicio.
            $table->unique(['code', 'starts_at']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para borrar la tabla si existe.
        Schema::dropIfExists('challenges');
    }
};

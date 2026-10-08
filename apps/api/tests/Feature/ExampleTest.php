<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature.

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests ExampleTest.
class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    // Esta línea sirve para declarar el test de ejemplo que comprueba que la aplicación responde.
    public function test_the_application_returns_a_successful_response(): void
    {
        // Esta línea sirve para hacer GET a la página principal.
        $response = $this->get('/');

        // Esta línea sirve para exigir que la respuesta sea 200.
        $response->assertStatus(200);
    }
}

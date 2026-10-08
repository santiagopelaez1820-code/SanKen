<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit.

namespace Tests\Unit;

// Esta línea sirve para importar la clase TestCase.
use PHPUnit\Framework\TestCase;

// Esta línea sirve para declarar la clase de tests ExampleTest.
class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    // Esta línea sirve para declarar el test de ejemplo que comprueba que verdadero es verdadero.
    public function test_that_true_is_true(): void
    {
        // Esta línea sirve para exigir que true sea true.
        $this->assertTrue(true);
    }
}

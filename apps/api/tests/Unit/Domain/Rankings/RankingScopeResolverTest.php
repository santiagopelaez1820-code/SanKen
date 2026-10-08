<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Domain\Rankings.

namespace Tests\Unit\Domain\Rankings;

// Esta línea sirve para importar la clase RankingScopeResolver.
use App\Domain\Rankings\Services\RankingScopeResolver;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

/**
 * Solo cubre el caso sin perfil acá: resolve() con un perfil real (city_id
 * seteado) toca la relación city->country, que necesita las tablas
 * migradas — esa cobertura ya vive en ExerciseRankingApiTest (con
 * RefreshDatabase y ciudades/países reales de factory), no acá.
 */
// Esta línea sirve para declarar la clase de tests RankingScopeResolverTest.
class RankingScopeResolverTest extends TestCase
{
    // Esta línea sirve para declarar el test que comprueba que un perfil nulo solo resuelve el alcance global.
    public function test_null_profile_resolves_only_global(): void
    {
        // Esta línea sirve para crear el resolvedor de alcances.
        $resolver = new RankingScopeResolver;

        // Esta línea sirve para resolver los alcances sin perfil.
        $scopes = $resolver->resolve(null);

        // Esta línea sirve para exigir que el alcance global sea null.
        $this->assertNull($scopes['global']);
        // Esta línea sirve para exigir que el de ciudad sea null.
        $this->assertNull($scopes['city']);
        // Esta línea sirve para exigir que el de país sea null.
        $this->assertNull($scopes['country']);
    }
}

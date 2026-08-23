<?php

namespace Tests\Unit\Domain\Rankings;

use App\Domain\Rankings\Services\RankingScopeResolver;
use Tests\TestCase;

/**
 * Solo cubre el caso sin perfil acá: resolve() con un perfil real (city_id
 * seteado) toca la relación city->country, que necesita las tablas
 * migradas — esa cobertura ya vive en ExerciseRankingApiTest (con
 * RefreshDatabase y ciudades/países reales de factory), no acá.
 */
class RankingScopeResolverTest extends TestCase
{
    public function test_null_profile_resolves_only_global(): void
    {
        $resolver = new RankingScopeResolver;

        $scopes = $resolver->resolve(null);

        $this->assertNull($scopes['global']);
        $this->assertNull($scopes['city']);
        $this->assertNull($scopes['country']);
    }
}

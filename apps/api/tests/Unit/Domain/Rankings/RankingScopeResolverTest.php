<?php

namespace Tests\Unit\Domain\Rankings;

use App\Domain\Rankings\Services\RankingScopeResolver;
use App\Models\UserProfile;
use Tests\TestCase;

/**
 * A diferencia de StreakCalculatorTest (PHPUnit\Framework\TestCase puro),
 * este resolver lee config('rankings.*'), así que necesita la app de
 * Laravel arrancada — sin RefreshDatabase, no toca la base de datos.
 */
class RankingScopeResolverTest extends TestCase
{
    public function test_null_profile_resolves_only_global(): void
    {
        $resolver = new RankingScopeResolver;

        $scopes = $resolver->resolve(null, null);

        $this->assertNull($scopes['global']);
        $this->assertNull($scopes['city']);
        $this->assertNull($scopes['country']);
        $this->assertNull($scopes['gym']);
        $this->assertNull($scopes['age_bracket']);
        $this->assertNull($scopes['sex']);
        $this->assertNull($scopes['strength_category']);
    }

    /**
     * @dataProvider ageBracketProvider
     */
    public function test_age_bracket_boundaries(?int $age, ?string $expected): void
    {
        $resolver = new RankingScopeResolver;
        $profile = new UserProfile(['age' => $age]);

        $this->assertSame($expected, $resolver->resolve($profile, null)['age_bracket']);
    }

    public static function ageBracketProvider(): array
    {
        return [
            'null age' => [null, null],
            'under 18' => [17, null],
            'exactly 18' => [18, '18-24'],
            'top of first bracket' => [24, '18-24'],
            'start of second bracket' => [25, '25-34'],
            '44' => [44, '35-44'],
            '45' => [45, '45-54'],
            '64' => [64, '55-64'],
            '65' => [65, '65+'],
            '100' => [100, '65+'],
        ];
    }

    /**
     * @dataProvider strengthCategoryProvider
     */
    public function test_strength_category_boundaries(?float $weightKg, ?float $best1Rm, ?string $expected): void
    {
        $resolver = new RankingScopeResolver;
        $profile = new UserProfile(['weight_kg' => $weightKg]);

        $this->assertSame($expected, $resolver->resolve($profile, $best1Rm)['strength_category']);
    }

    public static function strengthCategoryProvider(): array
    {
        return [
            'no weight' => [null, 100, null],
            'no 1rm' => [80, null, null],
            'zero 1rm' => [80, 0, null],
            'ratio just under 0.5' => [100, 49, 'principiante'],
            'ratio exactly 0.5' => [100, 50, 'intermedio'],
            'ratio just under 1.0' => [100, 99, 'intermedio'],
            'ratio exactly 1.0' => [100, 100, 'avanzado'],
            'ratio just under 1.75' => [100, 174, 'avanzado'],
            'ratio exactly 1.75' => [100, 175, 'elite'],
            'ratio well above 1.75' => [80, 200, 'elite'],
        ];
    }

    public function test_sex_only_accepts_known_values(): void
    {
        $resolver = new RankingScopeResolver;

        $this->assertSame('male', $resolver->resolve(new UserProfile(['sex' => 'male']), null)['sex']);
        $this->assertSame('female', $resolver->resolve(new UserProfile(['sex' => 'female']), null)['sex']);
        $this->assertNull($resolver->resolve(new UserProfile(['sex' => 'other']), null)['sex']);
        $this->assertNull($resolver->resolve(new UserProfile(['sex' => null]), null)['sex']);
    }
}

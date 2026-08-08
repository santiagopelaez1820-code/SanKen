<?php

namespace App\Support;

final class CacheKeys
{
    public static function activeRoutine(int $userId): string
    {
        return "routines:active:{$userId}";
    }

    public static function statsDashboard(int $userId): string
    {
        return "stats:dashboard:{$userId}";
    }
}

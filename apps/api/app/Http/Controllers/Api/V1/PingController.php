<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class PingController extends Controller
{
    public function __invoke(UserRepositoryInterface $users): JsonResponse
    {
        return response()->json([
            'data' => [
                'status' => 'ok',
                'app' => config('app.name'),
                'users_registered' => $users->count(),
            ],
        ]);
    }
}

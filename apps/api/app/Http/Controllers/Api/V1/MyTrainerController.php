<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MyTrainerResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyTrainerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $relationships = $request->user()->clientRelationships()
            ->where('status', 'active')
            ->with('trainer')
            ->get();

        return response()->json(['data' => MyTrainerResource::collection($relationships)]);
    }
}

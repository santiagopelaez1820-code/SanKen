<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

abstract class Controller
{
    /**
     * Meta de paginación en el shape que usan todos los endpoints paginados
     * de la API — antes cada controller lo reconstruía a mano desde el
     * paginator con las mismas tres claves.
     *
     * @return array{current_page: int, last_page: int, total: int}
     */
    protected function paginationMeta(LengthAwarePaginator $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'total' => $paginator->total(),
        ];
    }
}

<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers.

namespace App\Http\Controllers;

// Esta línea sirve para importar el contrato del paginador que conoce el total de páginas.
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

// Esta línea sirve para declarar el controller base del que heredan todos los demás.
abstract class Controller
{
    /**
     * Meta de paginación en el shape que usan todos los endpoints paginados
     * de la API — antes cada controller lo reconstruía a mano desde el
     * paginator con las mismas tres claves.
     *
     * @return array{current_page: int, last_page: int, total: int}
     */
    // Esta línea sirve para declarar el método que arma los datos de paginación.
    protected function paginationMeta(LengthAwarePaginator $paginator): array
    {
        // Esta línea sirve para devolver los datos de paginación.
        return [
            // Esta línea sirve para incluir la página actual.
            'current_page' => $paginator->currentPage(),
            // Esta línea sirve para incluir la última página.
            'last_page' => $paginator->lastPage(),
            // Esta línea sirve para incluir el total de registros.
            'total' => $paginator->total(),
        ];
    }
}

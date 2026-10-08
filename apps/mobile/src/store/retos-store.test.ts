// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «Challenge, ChallengeLeaderboardResponse» desde «@sanken/core».
import type { Challenge, ChallengeLeaderboardResponse } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «getEcho» desde «@/lib/echo».
import { getEcho } from '@/lib/echo';
// Esta línea sirve para importar «findNearestChallenge, useRetosStore» desde «./retos-store».
import { findNearestChallenge, useRetosStore } from './retos-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para declarar la propiedad «api» con el valor o tipo «{ get: jest.fn(), post: jest.fn() }».
  api: { get: jest.fn(), post: jest.fn() },
}));

// Esta línea sirve para simular el módulo «@/lib/echo» en la prueba.
jest.mock('@/lib/echo', () => ({
  // Esta línea sirve para declarar la propiedad «getEcho» con el valor o tipo «jest.fn()».
  getEcho: jest.fn(),
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;
// Esta línea sirve para declarar «mockedGetEcho» con el valor «getEcho as jest.Mock».
const mockedGetEcho = getEcho as jest.Mock;

// Esta línea sirve para declarar el dato de ejemplo «challenge» de tipo «Challenge».
const challenge: Challenge = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «'Racha semanal'».
  title: 'Racha semanal',
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «'Completa 5 entrenamientos esta semana.'».
  description: 'Completa 5 entrenamientos esta semana.',
  // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «'weekly'».
  type: 'weekly',
  // Esta línea sirve para declarar la propiedad «criteria» con el valor o tipo «{ metric: 'workouts_count', target: 5 }».
  criteria: { metric: 'workouts_count', target: 5 },
  // Esta línea sirve para declarar la propiedad «starts_at» con el valor o tipo «'2026-08-10'».
  starts_at: '2026-08-10',
  // Esta línea sirve para declarar la propiedad «ends_at» con el valor o tipo «'2026-08-16'».
  ends_at: '2026-08-16',
  // Esta línea sirve para declarar la propiedad «joined» con el valor o tipo «false».
  joined: false,
  // Esta línea sirve para declarar la propiedad «progress_value» con el valor o tipo «null».
  progress_value: null,
  // Esta línea sirve para declarar la propiedad «completed» con el valor o tipo «false».
  completed: false,
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useRetosStore.setState({
    // Esta línea sirve para declarar la propiedad «challenges» con el valor o tipo «[]».
    challenges: [],
    // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
    isLoading: false,
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
    error: null,
    // Esta línea sirve para declarar la propiedad «activeChallengeId» con el valor o tipo «null».
    activeChallengeId: null,
    // Esta línea sirve para declarar la propiedad «leaderboard» con el valor o tipo «null».
    leaderboard: null,
    // Esta línea sirve para declarar la propiedad «justCompleted» con el valor o tipo «null».
    justCompleted: null,
  });
});

// Esta línea sirve para agrupar las pruebas de «load».
describe('load', () => {
  // Esta línea sirve para declarar la prueba que verifica que «stores the fetched challenges».
  it('stores the fetched challenges', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([challenge]);

    // Esta línea sirve para esperar el resultado de «useRetosStore.getState».
    await useRetosStore.getState().load();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/challenges');
    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «challenges».
    expect(useRetosStore.getState().challenges).toEqual([challenge]);
    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «isLoading».
    expect(useRetosStore.getState().isLoading).toBe(false);
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets an error on failure».
  it('sets an error on failure', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new Error('network down'));

    // Esta línea sirve para esperar el resultado de «useRetosStore.getState».
    await useRetosStore.getState().load();

    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «error».
    expect(useRetosStore.getState().error).toBe('network down');
  });
});

// Esta línea sirve para agrupar las pruebas de «load — celebración de reto completado».
describe('load — celebración de reto completado', () => {
  // Esta línea sirve para declarar la prueba que verifica que «no marca justCompleted en el primer load, aunque el reto ya venga comp».
  it('no marca justCompleted en el primer load, aunque el reto ya venga completado', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([{ ...challenge, joined: true, completed: true, progress_value: 5 }]);

    // Esta línea sirve para esperar el resultado de «useRetosStore.getState».
    await useRetosStore.getState().load();

    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «justCompleted».
    expect(useRetosStore.getState().justCompleted).toBeNull();
  });

  // Esta línea sirve para declarar la prueba que verifica que «marca justCompleted cuando un reto pasa de no completado a completado ».
  it('marca justCompleted cuando un reto pasa de no completado a completado entre dos loads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([{ ...challenge, joined: true, completed: false, progress_value: 4 }]);
    // Esta línea sirve para esperar el resultado de «useRetosStore.getState».
    await useRetosStore.getState().load();

    // Esta línea sirve para extraer «omplete» de «{ ...challenge, joined: true, completed:».
    const completed = { ...challenge, joined: true, completed: true, progress_value: 5 };
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([completed]);
    // Esta línea sirve para esperar el resultado de «useRetosStore.getState».
    await useRetosStore.getState().load();

    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «justCompleted».
    expect(useRetosStore.getState().justCompleted).toEqual(completed);
  });

  // Esta línea sirve para declarar la prueba que verifica que «no marca justCompleted si ningún reto cambió de estado».
  it('no marca justCompleted si ningún reto cambió de estado', async () => {
    // Esta línea sirve para extraer «nProgres» de «{ ...challenge, joined: true, completed:».
    const inProgress = { ...challenge, joined: true, completed: false, progress_value: 3 };
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([inProgress]);
    // Esta línea sirve para esperar el resultado de «useRetosStore.getState».
    await useRetosStore.getState().load();

    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([{ ...inProgress, progress_value: 4 }]);
    // Esta línea sirve para esperar el resultado de «useRetosStore.getState».
    await useRetosStore.getState().load();

    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «justCompleted».
    expect(useRetosStore.getState().justCompleted).toBeNull();
  });

  // Esta línea sirve para declarar la prueba que verifica que «dismissCelebration limpia justCompleted».
  it('dismissCelebration limpia justCompleted', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useRetosStore.setState({ justCompleted: { ...challenge, completed: true } });

    // Esta línea sirve para invocar la acción «dismissCelebration» del store de «Retos».
    useRetosStore.getState().dismissCelebration();

    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «justCompleted».
    expect(useRetosStore.getState().justCompleted).toBeNull();
  });
});

// Esta línea sirve para agrupar las pruebas de «findNearestChallenge».
describe('findNearestChallenge', () => {
  // Esta línea sirve para declarar la prueba que verifica que «devuelve el reto unido, no completado, al que le falta exactamente 1 u».
  it('devuelve el reto unido, no completado, al que le falta exactamente 1 unidad', () => {
    // Esta línea sirve para extraer «ea» de «{ ...challenge, joined: true, completed:».
    const near = { ...challenge, joined: true, completed: false, progress_value: 4, criteria: { metric: 'workouts_count' as const, target: 5 } };
    // Esta línea sirve para extraer «a» de «{ ...challenge, id: 2, joined: true, com».
    const far = { ...challenge, id: 2, joined: true, completed: false, progress_value: 1, criteria: { metric: 'workouts_count' as const, target: 5 } };

    // Esta línea sirve para verificar que «findNearestChallenge([far, near])» cumple «toEqual».
    expect(findNearestChallenge([far, near])).toEqual(near);
  });

  // Esta línea sirve para declarar la prueba que verifica que «devuelve null si ninguno está a 1 unidad de completarse».
  it('devuelve null si ninguno está a 1 unidad de completarse', () => {
    // Esta línea sirve para extraer «a» de «{ ...challenge, joined: true, completed:».
    const far = { ...challenge, joined: true, completed: false, progress_value: 1 };

    // Esta línea sirve para verificar que «findNearestChallenge([far])» cumple «toBeNull».
    expect(findNearestChallenge([far])).toBeNull();
  });

  // Esta línea sirve para declarar la prueba que verifica que «ignora retos no unidos o ya completados».
  it('ignora retos no unidos o ya completados', () => {
    // Esta línea sirve para extraer «otJoine» de «{ ...challenge, joined: false, completed».
    const notJoined = { ...challenge, joined: false, completed: false, progress_value: 4 };
    // Esta línea sirve para extraer «lreadyDon» de «{ ...challenge, id: 2, joined: true, com».
    const alreadyDone = { ...challenge, id: 2, joined: true, completed: true, progress_value: 5 };

    // Esta línea sirve para verificar que «findNearestChallenge([notJoined, alreadyDone])» cumple «toBeNull».
    expect(findNearestChallenge([notJoined, alreadyDone])).toBeNull();
  });
});

// Esta línea sirve para agrupar las pruebas de «join».
describe('join', () => {
  // Esta línea sirve para declarar la prueba que verifica que «posts to the join endpoint and reloads the list».
  it('posts to the join endpoint and reloads the list', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([{ ...challenge, joined: true }]);

    // Esta línea sirve para esperar el resultado de «useRetosStore.getState».
    await useRetosStore.getState().join(1);

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/challenges/1/join');
    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «challenges».
    expect(useRetosStore.getState().challenges[0].joined).toBe(true);
  });
});

// Esta línea sirve para agrupar las pruebas de «openLeaderboard / closeLeaderboard».
describe('openLeaderboard / closeLeaderboard', () => {
  // Esta línea sirve para declarar el dato de ejemplo «leaderboardResponse» de tipo «ChallengeLeaderboardResponse».
  const leaderboardResponse: ChallengeLeaderboardResponse = {
    // Esta línea sirve para declarar la propiedad «challenge_id» con el valor o tipo «1».
    challenge_id: 1,
    // Esta línea sirve para definir «entries» con «[{ rank: 1, user_id: 9, user_name: 'Ana'…».
    entries: [{ rank: 1, user_id: 9, user_name: 'Ana', progress_value: 3, completed: false, is_viewer: true }],
  };

  // Esta línea sirve para declarar la prueba que verifica que «fetches the initial leaderboard and subscribes to the private channel».
  it('fetches the initial leaderboard and subscribes to the private channel', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(leaderboardResponse);
    // Esta línea sirve para crear «listen» llamando a «jest.fn».
    const listen = jest.fn();
    // Esta línea sirve para extraer «ch» de «{ private: jest.fn(() => ({ listen })), ».
    const echo = { private: jest.fn(() => ({ listen })), leave: jest.fn() };
    // Esta línea sirve para definir lo que devuelve el espía «mockedGetEcho».
    mockedGetEcho.mockReturnValue(echo);

    // Esta línea sirve para esperar el resultado de «useRetosStore.getState».
    await useRetosStore.getState().openLeaderboard(1);

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/challenges/1/leaderboard');
    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «leaderboard».
    expect(useRetosStore.getState().leaderboard).toEqual(leaderboardResponse.entries);
    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «activeChallengeId».
    expect(useRetosStore.getState().activeChallengeId).toBe(1);
    // Esta línea sirve para verificar que «echo.private» cumple «toHaveBeenCalledWith».
    expect(echo.private).toHaveBeenCalledWith('challenges.1');
    // Esta línea sirve para verificar que «listen» cumple «toHaveBeenCalledWith».
    expect(listen).toHaveBeenCalledWith('.progress.updated', expect.any(Function));
  });

  // Esta línea sirve para declarar la prueba que verifica que «updates the leaderboard when the broadcast callback fires».
  it('updates the leaderboard when the broadcast callback fires', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(leaderboardResponse);
    // Esta línea sirve para declarar la función que simula el aviso de progreso en vivo.
    let broadcastCallback: ((payload: { leaderboard: typeof leaderboardResponse.entries }) => void) | undefined;
    // Esta línea sirve para declarar el objeto de ejemplo «echo».
    const echo = {
      // Esta línea sirve para declarar la propiedad «private» con el valor o tipo «jest.fn(() => ({».
      private: jest.fn(() => ({
        // Esta línea sirve para definir «listen» con «jest.fn((_event: string, cb: typeof broa…».
        listen: jest.fn((_event: string, cb: typeof broadcastCallback) => {
          // Esta línea sirve para asignar «cb» a «broadcastCallback».
          broadcastCallback = cb;
        }),
      })),
      // Esta línea sirve para declarar la propiedad «leave» con el valor o tipo «jest.fn()».
      leave: jest.fn(),
    };
    // Esta línea sirve para definir lo que devuelve el espía «mockedGetEcho».
    mockedGetEcho.mockReturnValue(echo);

    // Esta línea sirve para esperar el resultado de «useRetosStore.getState».
    await useRetosStore.getState().openLeaderboard(1);

    // Esta línea sirve para extraer «pdate» de «[{ rank: 1, user_id: 9, user_name: 'Ana'».
    const updated = [{ rank: 1, user_id: 9, user_name: 'Ana', progress_value: 4, completed: false, is_viewer: true }];
    // Esta línea sirve para llamar a «broadcastCallback» si está definida.
    broadcastCallback?.({ leaderboard: updated });

    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «leaderboard».
    expect(useRetosStore.getState().leaderboard).toEqual(updated);
  });

  // Esta línea sirve para declarar la prueba que verifica que «leaves the channel and clears state on close».
  it('leaves the channel and clears state on close', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(leaderboardResponse);
    // Esta línea sirve para extraer «ch» de «{ private: jest.fn(() => ({ listen: jest».
    const echo = { private: jest.fn(() => ({ listen: jest.fn() })), leave: jest.fn() };
    // Esta línea sirve para definir lo que devuelve el espía «mockedGetEcho».
    mockedGetEcho.mockReturnValue(echo);

    // Esta línea sirve para esperar el resultado de «useRetosStore.getState».
    await useRetosStore.getState().openLeaderboard(1);
    // Esta línea sirve para invocar la acción «closeLeaderboard» del store de «Retos».
    useRetosStore.getState().closeLeaderboard();

    // Esta línea sirve para verificar que «echo.leave» cumple «toHaveBeenCalledWith».
    expect(echo.leave).toHaveBeenCalledWith('challenges.1');
    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «activeChallengeId».
    expect(useRetosStore.getState().activeChallengeId).toBeNull();
    // Esta línea sirve para verificar que «useRetosStore.getState(» cumple «leaderboard».
    expect(useRetosStore.getState().leaderboard).toBeNull();
  });
});

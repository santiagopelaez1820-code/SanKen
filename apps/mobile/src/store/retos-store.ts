// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «Challenge, ChallengeLeaderboardEntry, ChallengeLeaderboardResponse, ChallengeProgressBroadcast» desde «@sanken/core».
import type { Challenge, ChallengeLeaderboardEntry, ChallengeLeaderboardResponse, ChallengeProgressBroadcast } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «getEcho» desde «@/lib/echo».
import { getEcho } from '@/lib/echo';

// Esta línea sirve para declarar la interfaz «RetosStoreState».
interface RetosStoreState {
  // Esta línea sirve para declarar la propiedad «challenges» con el valor o tipo «Challenge[]».
  challenges: Challenge[];
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;
  // Esta línea sirve para declarar la propiedad «activeChallengeId» con el valor o tipo «number | null».
  activeChallengeId: number | null;
  // Esta línea sirve para declarar la propiedad «leaderboard» con el valor o tipo «ChallengeLeaderboardEntry[] | null».
  leaderboard: ChallengeLeaderboardEntry[] | null;
  /** Reto que acaba de pasar a `completed=true` en el `load()` más reciente — dispara la celebración una sola vez. */
  // Esta línea sirve para declarar la propiedad «justCompleted» con el valor o tipo «Challenge | null».
  justCompleted: Challenge | null;

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «join» con el valor o tipo «(challengeId: number) => Promise<void>».
  join: (challengeId: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «openLeaderboard» con el valor o tipo «(challengeId: number) => Promise<void>».
  openLeaderboard: (challengeId: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «closeLeaderboard» con el valor o tipo «() => void».
  closeLeaderboard: () => void;
  // Esta línea sirve para declarar la propiedad «dismissCelebration» con el valor o tipo «() => void».
  dismissCelebration: () => void;
}

/** Reto activo (unido, no completado) al que le falta exactamente 1 unidad de la métrica — el "empujón final" que pide la Home. */
// Esta línea sirve para declarar la función «findNearestChallenge».
export function findNearestChallenge(challenges: Challenge[]): Challenge | null {
  // Esta línea sirve para devolver «(».
  return (
    // Esta línea sirve para llamar a «challenges.find» con los argumentos de las líneas siguientes.
    challenges.find(
      // Esta línea sirve para buscar un reto al que le falta exactamente un entrenamiento.
      (c) => c.joined && !c.completed && c.criteria.target - (c.progress_value ?? 0) === 1,
    // Esta línea sirve para usar null si no hay ninguno.
    ) ?? null
  );
}

// Fuera del store: no es estado de UI, es el handle de limpieza del canal de
// Reverb — vive mientras haya un leaderboard abierto, sin importar qué
// componente lo pidió.
// Esta línea sirve para declarar la variable «leaveChannel» de tipo «(() => void) | null = null» sin valor inicial.
let leaveChannel: (() => void) | null = null;

// Esta línea sirve para declarar «useRetosStore» con el valor «create<RetosStoreState>((set, get) => ({».
export const useRetosStore = create<RetosStoreState>((set, get) => ({
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

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para extraer «reviou» de «get().challenges».
    const previous = get().challenges;
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<Challenge[]>('/challenges')» y guardar el resultado en «challenges».
      const challenges = await api.get<Challenge[]>('/challenges');
      // Solo cuenta como "recién completado" si ya teníamos una lista previa
      // en este store (evita disparar la celebración en el primerísimo load
      // de la sesión, cuando un reto ya viene completado de antes).
      // Esta línea sirve para extraer «ewlyComplete» de «previous.length === 0».
      const newlyCompleted = previous.length === 0
        // Esta línea sirve para usar null si no había retos antes.
        ? null
        // Esta línea sirve para buscar un reto que se completó desde la última carga.
        : challenges.find((c) => c.completed && !previous.find((p) => p.id === c.id)?.completed) ?? null;

      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para incluir el valor «challenges» en la lista.
        challenges,
        // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
        isLoading: false,
        // Esta línea sirve para declarar la propiedad «justCompleted» con el valor o tipo «newlyCompleted ?? get().justCompleted».
        justCompleted: newlyCompleted ?? get().justCompleted,
      });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar los retos.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «dismissCelebration» con el valor o tipo «() => set({ justCompleted: null })».
  dismissCelebration: () => set({ justCompleted: null }),

  // Esta línea sirve para declarar la propiedad «join» con el valor o tipo «async (challengeId) => {».
  join: async (challengeId) => {
    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post(`/challenges/${challengeId}/join`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().load();
  },

  // Esta línea sirve para declarar la propiedad «openLeaderboard» con el valor o tipo «async (challengeId) => {».
  openLeaderboard: async (challengeId) => {
    // Esta línea sirve para llamar a «get» con «).closeLeaderboard(».
    get().closeLeaderboard();
    // Esta línea sirve para guardar en el store: «activeChallengeId: challengeId, leaderboard: null })…».
    set({ activeChallengeId: challengeId, leaderboard: null });

    // Esta línea sirve para esperar «api.get<ChallengeLeaderboardResponse>(`/challenges» y guardar el resultado en «res».
    const res = await api.get<ChallengeLeaderboardResponse>(`/challenges/${challengeId}/leaderboard`);
    // Esta línea sirve para salir si el leaderboard se cerró mientras cargaba.
    if (get().activeChallengeId !== challengeId) return; // se cerró mientras cargaba
    // Esta línea sirve para guardar en el store: «leaderboard: res.entries })…».
    set({ leaderboard: res.entries });

    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para extraer «ch» de «getEcho()».
      const echo = getEcho();
      // Esta línea sirve para extraer «hanne» de «echo.private(`challenges.${challengeId}`».
      const channel = echo.private(`challenges.${challengeId}`);
      // Esta línea sirve para escuchar las actualizaciones de progreso del reto.
      channel.listen('.progress.updated', (payload: ChallengeProgressBroadcast) => {
        // Esta línea sirve para guardar en el store: «leaderboard: payload.leaderboard })…».
        set({ leaderboard: payload.leaderboard });
      });
      // Esta línea sirve para asignar «() => echo.leave(`challenges.${challengeId}`)» a «leaveChannel».
      leaveChannel = () => echo.leave(`challenges.${challengeId}`);
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Ver el comentario en notifications-store.ts: si el websocket no
      // conecta, el leaderboard se queda usable sin actualizaciones en
      // vivo en vez de romper toda la pantalla.
      // Esta línea sirve para avisar que no se pudo suscribir al leaderboard en vivo.
      console.warn('No se pudo suscribir al leaderboard en vivo:', err);
    }
  },

  // Esta línea sirve para declarar la propiedad «closeLeaderboard» con el valor o tipo «() => {».
  closeLeaderboard: () => {
    // Esta línea sirve para llamar a «leaveChannel» si está definida.
    leaveChannel?.();
    // Esta línea sirve para asignar «null» a «leaveChannel».
    leaveChannel = null;
    // Esta línea sirve para guardar en el store: «activeChallengeId: null, leaderboard: null })…».
    set({ activeChallengeId: null, leaderboard: null });
  },
}));

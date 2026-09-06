import { create } from 'zustand';
import type { Challenge, ChallengeLeaderboardEntry, ChallengeLeaderboardResponse, ChallengeProgressBroadcast } from '@sanken/core';

import { api } from '@/lib/api';
import { getEcho } from '@/lib/echo';

interface RetosStoreState {
  challenges: Challenge[];
  isLoading: boolean;
  error: string | null;
  activeChallengeId: number | null;
  leaderboard: ChallengeLeaderboardEntry[] | null;
  /** Reto que acaba de pasar a `completed=true` en el `load()` más reciente — dispara la celebración una sola vez. */
  justCompleted: Challenge | null;

  load: () => Promise<void>;
  join: (challengeId: number) => Promise<void>;
  openLeaderboard: (challengeId: number) => Promise<void>;
  closeLeaderboard: () => void;
  dismissCelebration: () => void;
}

/** Reto activo (unido, no completado) al que le falta exactamente 1 unidad de la métrica — el "empujón final" que pide la Home. */
export function findNearestChallenge(challenges: Challenge[]): Challenge | null {
  return (
    challenges.find(
      (c) => c.joined && !c.completed && c.criteria.target - (c.progress_value ?? 0) === 1,
    ) ?? null
  );
}

// Fuera del store: no es estado de UI, es el handle de limpieza del canal de
// Reverb — vive mientras haya un leaderboard abierto, sin importar qué
// componente lo pidió.
let leaveChannel: (() => void) | null = null;

export const useRetosStore = create<RetosStoreState>((set, get) => ({
  challenges: [],
  isLoading: false,
  error: null,
  activeChallengeId: null,
  leaderboard: null,
  justCompleted: null,

  load: async () => {
    const previous = get().challenges;
    set({ isLoading: true, error: null });
    try {
      const challenges = await api.get<Challenge[]>('/challenges');
      // Solo cuenta como "recién completado" si ya teníamos una lista previa
      // en este store (evita disparar la celebración en el primerísimo load
      // de la sesión, cuando un reto ya viene completado de antes).
      const newlyCompleted = previous.length === 0
        ? null
        : challenges.find((c) => c.completed && !previous.find((p) => p.id === c.id)?.completed) ?? null;

      set({
        challenges,
        isLoading: false,
        justCompleted: newlyCompleted ?? get().justCompleted,
      });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar los retos.' });
    }
  },

  dismissCelebration: () => set({ justCompleted: null }),

  join: async (challengeId) => {
    await api.post(`/challenges/${challengeId}/join`);
    await get().load();
  },

  openLeaderboard: async (challengeId) => {
    get().closeLeaderboard();
    set({ activeChallengeId: challengeId, leaderboard: null });

    const res = await api.get<ChallengeLeaderboardResponse>(`/challenges/${challengeId}/leaderboard`);
    if (get().activeChallengeId !== challengeId) return; // se cerró mientras cargaba
    set({ leaderboard: res.entries });

    try {
      const echo = getEcho();
      const channel = echo.private(`challenges.${challengeId}`);
      channel.listen('.progress.updated', (payload: ChallengeProgressBroadcast) => {
        set({ leaderboard: payload.leaderboard });
      });
      leaveChannel = () => echo.leave(`challenges.${challengeId}`);
    } catch (err) {
      // Ver el comentario en notifications-store.ts: si el websocket no
      // conecta, el leaderboard se queda usable sin actualizaciones en
      // vivo en vez de romper toda la pantalla.
      console.warn('No se pudo suscribir al leaderboard en vivo:', err);
    }
  },

  closeLeaderboard: () => {
    leaveChannel?.();
    leaveChannel = null;
    set({ activeChallengeId: null, leaderboard: null });
  },
}));

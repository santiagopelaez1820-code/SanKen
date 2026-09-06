import { create } from 'zustand';

export type ToastVariant = 'default' | 'success';

interface ToastState {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastStoreState {
  toast: ToastState | null;
  show: (message: string, variant?: ToastVariant) => void;
  hide: () => void;
}

let nextId = 0;
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Toast genérico de una sola posición — no hay componente de feedback
 * transitorio reutilizable en toda la app (el resto usa modales o texto
 * inline), así que agregar/quitar del carrito, etc. no tenían forma de
 * confirmar sin navegar. Cola de un solo elemento: un toast nuevo reemplaza
 * al anterior en vez de apilarse.
 */
export const useToastStore = create<ToastStoreState>((set) => ({
  toast: null,

  show: (message, variant = 'default') => {
    if (hideTimeout) clearTimeout(hideTimeout);
    const id = ++nextId;
    set({ toast: { id, message, variant } });
    hideTimeout = setTimeout(() => {
      set((state) => (state.toast?.id === id ? { toast: null } : state));
    }, 2600);
  },

  hide: () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = null;
    set({ toast: null });
  },
}));

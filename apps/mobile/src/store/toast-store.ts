// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';

// Esta línea sirve para declarar el tipo «ToastVariant» como «'default' | 'success'».
export type ToastVariant = 'default' | 'success';

// Esta línea sirve para declarar la interfaz «ToastState».
interface ToastState {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «number».
  id: number;
  // Esta línea sirve para declarar la propiedad «message» con el valor o tipo «string».
  message: string;
  // Esta línea sirve para declarar la propiedad «variant» con el valor o tipo «ToastVariant».
  variant: ToastVariant;
}

// Esta línea sirve para declarar la interfaz «ToastStoreState».
interface ToastStoreState {
  // Esta línea sirve para declarar la propiedad «toast» con el valor o tipo «ToastState | null».
  toast: ToastState | null;
  // Esta línea sirve para definir «show» con «(message: string, variant?: ToastVariant…».
  show: (message: string, variant?: ToastVariant) => void;
  // Esta línea sirve para declarar la propiedad «hide» con el valor o tipo «() => void».
  hide: () => void;
}

// Esta línea sirve para extraer «extI» de «0».
let nextId = 0;
// Esta línea sirve para declarar la variable «hideTimeout» de tipo «ReturnType<typeof setTimeout> | null = null» sin valor inicial.
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Toast genérico de una sola posición — no hay componente de feedback
 * transitorio reutilizable en toda la app (el resto usa modales o texto
 * inline), así que agregar/quitar del carrito, etc. no tenían forma de
 * confirmar sin navegar. Cola de un solo elemento: un toast nuevo reemplaza
 * al anterior en vez de apilarse.
 */
// Esta línea sirve para declarar «useToastStore» con el valor «create<ToastStoreState>((set) => ({».
export const useToastStore = create<ToastStoreState>((set) => ({
  // Esta línea sirve para declarar la propiedad «toast» con el valor o tipo «null».
  toast: null,

  // Esta línea sirve para declarar la propiedad «show» con el valor o tipo «(message, variant = 'default') => {».
  show: (message, variant = 'default') => {
    // Esta línea sirve para llamar a «clearTimeout» si «hideTimeout».
    if (hideTimeout) clearTimeout(hideTimeout);
    // Esta línea sirve para extraer «» de «++nextId».
    const id = ++nextId;
    // Esta línea sirve para guardar en el store: «toast: { id, message, variant } })…».
    set({ toast: { id, message, variant } });
    // Esta línea sirve para asignar «setTimeout(() => {» a «hideTimeout».
    hideTimeout = setTimeout(() => {
      // Esta línea sirve para ocultar el aviso solo si sigue siendo el mismo.
      set((state) => (state.toast?.id === id ? { toast: null } : state));
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «60».
    }, 2600);
  },

  // Esta línea sirve para declarar la propiedad «hide» con el valor o tipo «() => {».
  hide: () => {
    // Esta línea sirve para llamar a «clearTimeout» si «hideTimeout».
    if (hideTimeout) clearTimeout(hideTimeout);
    // Esta línea sirve para asignar «null» a «hideTimeout».
    hideTimeout = null;
    // Esta línea sirve para guardar en el store: «toast: null })…».
    set({ toast: null });
  },
}));

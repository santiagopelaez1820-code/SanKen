// Esta línea sirve para importar «clsx, type ClassValue» desde «clsx».
import { clsx, type ClassValue } from "clsx"
// Esta línea sirve para importar «twMerge» desde «tailwind-merge».
import { twMerge } from "tailwind-merge"

// Esta línea sirve para declarar la función «cn».
export function cn(...inputs: ClassValue[]) {
  // Esta línea sirve para devolver «twMerge(clsx(inputs))».
  return twMerge(clsx(inputs))
}

// Esta línea sirve para declarar la función «readCookie».
export function readCookie(name: string): string | null {
  // Esta línea sirve para buscar la cookie por nombre con una expresión regular.
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  // Esta línea sirve para devolver «match ? decodeURIComponent(match[1]) : null».
  return match ? decodeURIComponent(match[1]) : null
}

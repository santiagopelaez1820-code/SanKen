// Esta línea sirve para importar «resolveLegalText, type LegalLocale» desde «@sanken/core».
import { resolveLegalText, type LegalLocale } from "@sanken/core"

/**
 * Renderiza un texto legal resolviendo los marcadores {{campo}}. Un dato del
 * responsable sin completar se muestra resaltado como "[Pendiente: …]" — a
 * propósito bien visible, para que nunca pase por texto definitivo.
 */
// Esta línea sirve para declarar el componente que muestra un texto legal con datos del responsable.
export function LegalText({ text, locale }: { text: string; locale: LegalLocale }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
    <>
      {/* Esta línea sirve para recorrer los fragmentos del texto resuelto. */}
      {resolveLegalText(text, locale).map((segment, i) =>
        // Esta línea sirve para revisar si el fragmento es un dato pendiente.
        segment.pending ? (
          // Esta línea sirve para abrir el elemento «mark».
          <mark key={i} className="rounded bg-amber-400/20 px-1 font-medium text-amber-700 dark:text-amber-300">
            {/* Esta línea sirve para mostrar el valor «segment.text». */}
            {segment.text}
          </mark>
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para mostrar el fragmento normal.
          <span key={i}>{segment.text}</span>
        )
      )}
    </>
  )
}

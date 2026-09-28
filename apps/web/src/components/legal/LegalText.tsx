import { resolveLegalText, type LegalLocale } from "@sanken/core"

/**
 * Renderiza un texto legal resolviendo los marcadores {{campo}}. Un dato del
 * responsable sin completar se muestra resaltado como "[Pendiente: …]" — a
 * propósito bien visible, para que nunca pase por texto definitivo.
 */
export function LegalText({ text, locale }: { text: string; locale: LegalLocale }) {
  return (
    <>
      {resolveLegalText(text, locale).map((segment, i) =>
        segment.pending ? (
          <mark key={i} className="rounded bg-amber-400/20 px-1 font-medium text-amber-700 dark:text-amber-300">
            {segment.text}
          </mark>
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </>
  )
}

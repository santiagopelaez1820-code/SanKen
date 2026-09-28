const MAX_AVATAR_DIMENSION = 512

/**
 * Reencodea la foto elegida a un JPEG de hasta 512px antes de subirla — mismo
 * criterio que AvatarEditSheet en mobile. Una foto de celular suele pesar
 * más de los 5 MB que acepta UpdateAvatarRequest, y formatos como HEIC no
 * los reconoce el backend: sin esto "cambiar la foto" fallaba con esas
 * imágenes. Si el navegador no puede decodificarla, se sube el original y
 * el backend responde con el error de validación correspondiente.
 */
export async function prepareAvatarFile(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_AVATAR_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85))
    if (!blob) return file
    return new File([blob], `avatar-${Date.now()}.jpg`, { type: "image/jpeg" })
  } catch {
    return file
  }
}

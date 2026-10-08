// Esta línea sirve para declarar «MAX_AVATAR_DIMENSION» con el valor «512».
const MAX_AVATAR_DIMENSION = 512

/**
 * Reencodea la foto elegida a un JPEG de hasta 512px antes de subirla — mismo
 * criterio que AvatarEditSheet en mobile. Una foto de celular suele pesar
 * más de los 5 MB que acepta UpdateAvatarRequest, y formatos como HEIC no
 * los reconoce el backend: sin esto "cambiar la foto" fallaba con esas
 * imágenes. Si el navegador no puede decodificarla, se sube el original y
 * el backend responde con el error de validación correspondiente.
 */
// Esta línea sirve para declarar la función que reduce y comprime la foto de perfil.
export async function prepareAvatarFile(file: File): Promise<File> {
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para esperar «createImageBitmap(file)» y guardar el resultado en «bitmap».
    const bitmap = await createImageBitmap(file)
    // Esta línea sirve para calcular la escala para no pasar del tamaño máximo.
    const scale = Math.min(1, MAX_AVATAR_DIMENSION / Math.max(bitmap.width, bitmap.height))
    // Esta línea sirve para declarar «width» con el valor «Math.round(bitmap.width * scale)».
    const width = Math.round(bitmap.width * scale)
    // Esta línea sirve para declarar «height» con el valor «Math.round(bitmap.height * scale)».
    const height = Math.round(bitmap.height * scale)

    // Esta línea sirve para declarar «canvas» con el valor «document.createElement("canvas")».
    const canvas = document.createElement("canvas")
    // Esta línea sirve para asignar «width» a «canvas.width».
    canvas.width = width
    // Esta línea sirve para asignar «height» a «canvas.height».
    canvas.height = height
    // Esta línea sirve para declarar «ctx» con el valor «canvas.getContext("2d")».
    const ctx = canvas.getContext("2d")
    // Esta línea sirve para devolver «file» si «!ctx».
    if (!ctx) return file
    // Esta línea sirve para llamar a «ctx.drawImage» con «bitmap, 0, 0, width, height».
    ctx.drawImage(bitmap, 0, 0, width, height)
    // Esta línea sirve para llamar a «bitmap.close».
    bitmap.close()

    // Esta línea sirve para esperar «new Promise<Blob | null>((resolve) => canvas.toBlo» y guardar el resultado en «blob».
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85))
    // Esta línea sirve para devolver «file» si «!blob».
    if (!blob) return file
    // Esta línea sirve para devolver el archivo JPEG comprimido.
    return new File([blob], `avatar-${Date.now()}.jpg`, { type: "image/jpeg" })
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // Esta línea sirve para devolver «file».
    return file
  }
}

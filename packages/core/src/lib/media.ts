/**
 * Variantes de entrega para el multimedia servido desde Cloudinary.
 *
 * Las columnas guardan el secure_url "crudo" que devuelve la subida (ver
 * apps/api CloudinaryMediaStorage). Cada pantalla pide la variante que
 * necesita y Cloudinary la genera y cachea en su CDN la primera vez — no se
 * guardan copias por tamaño. Una URL que no es de Cloudinary (ruta
 * "/storage/..." en dev, link externo pegado por un admin) se devuelve
 * intacta, así que el modo local sigue funcionando igual.
 *
 * Anchos en píxeles reales, pensados para pantallas @3x:
 * - avatarSmall: filas, header, menú (≤ 48 pt)
 * - avatarLarge: perfil y configuración (≈ 66–96 pt)
 * - productThumb: fila del carrito (≈ 56–64 pt)
 * - productCard: grilla de la Tienda (≈ media pantalla)
 * - productDetail: detalle del producto (ancho completo)
 * - video: demos de ejercicios y videos de PR — clips cortos, así que MP4
 *   H.264 optimizado (reproduce en Android, iOS y web) en vez de HLS/DASH.
 */
// Esta línea sirve para declarar las transformaciones de Cloudinary para cada tamaño de imagen o video.
export const MEDIA_VARIANTS = {
  // Esta línea sirve para definir el avatar pequeño recortado a la cara.
  avatarSmall: 'c_fill,g_face,w_144,h_144,f_auto,q_auto',
  // Esta línea sirve para definir el avatar grande recortado a la cara.
  avatarLarge: 'c_fill,g_face,w_320,h_320,f_auto,q_auto',
  // Esta línea sirve para definir la miniatura de producto.
  productThumb: 'c_limit,w_240,f_auto,q_auto',
  // Esta línea sirve para definir la tarjeta de producto.
  productCard: 'c_limit,w_600,f_auto,q_auto',
  // Esta línea sirve para definir el detalle de producto.
  productDetail: 'c_limit,w_1200,f_auto,q_auto',
  // Esta línea sirve para definir el video en 720 píxeles con códec h264.
  video: 'c_limit,w_720,q_auto,vc_h264',
// Esta línea sirve para marcar el objeto como inmutable.
} as const;

// Esta línea sirve para declarar el tipo con los nombres de las variantes.
export type MediaVariant = keyof typeof MEDIA_VARIANTS;

// Esta línea sirve para definir la expresión que reconoce URLs de subida de Cloudinary.
const CLOUDINARY_UPLOAD_URL = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/)(.+)$/;

/**
 * Inserta la transformación de la variante en una URL de Cloudinary. Si la
 * URL ya trae transformaciones (alguien pegó una URL armada a mano) se deja
 * como está para no duplicarlas.
 */
// Esta línea sirve para declarar la función que aplica una variante a una URL de Cloudinary.
export function applyMediaVariant(url: string, variant: MediaVariant): string {
  // Esta línea sirve para comprobar si la URL es de Cloudinary.
  const match = CLOUDINARY_UPLOAD_URL.exec(url);
  // Esta línea sirve para devolver la URL sin cambios si no lo es.
  if (!match) return url;

  // Esta línea sirve para separar el prefijo, el tipo de recurso y el resto de la ruta.
  const [, prefix, resourceType, rest] = match;
  // Lo que sigue a /upload/ en un secure_url sin tocar: "v123/carpeta/id.ext"
  // o directamente "carpeta/id.ext". Un primer segmento con "_" y "," es una
  // transformación (w_100,c_fill…).
  // Esta línea sirve para obtener el primer segmento de la ruta.
  const firstSegment = rest.split('/')[0];
  // Esta línea sirve para devolver la URL sin cambios si ya tiene transformaciones aplicadas.
  if (/^[a-z]{1,3}_[^/]*$/.test(firstSegment) && !/^v\d+$/.test(firstSegment)) return url;

  // Esta línea sirve para partir de la ruta original.
  let path = rest;
  // Esta línea sirve para revisar si es un video con variante de video.
  if (resourceType === 'video' && variant === 'video') {
    // Fuerza contenedor MP4 (un .mov de iPhone no reproduce en todos lados).
    // Esta línea sirve para cambiar la extensión por .mp4 para forzar el formato compatible.
    path = path.replace(/\.[A-Za-z0-9]+$/, '') + '.mp4';
  }

  // Esta línea sirve para devolver la URL con la transformación insertada.
  return `${prefix}${MEDIA_VARIANTS[variant]}/${path}`;
}

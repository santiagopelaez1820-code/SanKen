// Esta línea sirve para importar «describe, expect, it» desde «@jest/globals».
import { describe, expect, it } from '@jest/globals';
// Esta línea sirve para importar «ApiClient, MEDIA_VARIANTS, applyMediaVariant» desde «@sanken/core».
import { ApiClient, MEDIA_VARIANTS, applyMediaVariant } from '@sanken/core';

// Esta línea sirve para extraer «MAG» de «'https://res.cloudinary.com/demo/image/u».
const IMAGE = 'https://res.cloudinary.com/demo/image/upload/v1712/sanken/users/avatars/user_12.jpg';
// Esta línea sirve para extraer «IDE» de «'https://res.cloudinary.com/demo/video/u».
const VIDEO = 'https://res.cloudinary.com/demo/video/upload/v1712/sanken/exercises/videos/exercise_3.mov';

// Esta línea sirve para agrupar las pruebas de «applyMediaVariant».
describe('applyMediaVariant', () => {
  // Esta línea sirve para declarar la prueba que verifica que «inserta la transformación justo después de /upload/».
  it('inserta la transformación justo después de /upload/', () => {
    // Esta línea sirve para verificar que «applyMediaVariant(IMAGE, 'avatarSmall')» cumple «toBe».
    expect(applyMediaVariant(IMAGE, 'avatarSmall')).toBe(
      // Esta línea sirve para incluir el texto o las clases «https://res.cloudinary.com/demo/image/upload/…».
      `https://res.cloudinary.com/demo/image/upload/${MEDIA_VARIANTS.avatarSmall}/v1712/sanken/users/avatars/user_12.jpg`,
    );
  });

  // Esta línea sirve para declarar la prueba que verifica que «pide imágenes con formato y calidad automáticos».
  it('pide imágenes con formato y calidad automáticos', () => {
    // Esta línea sirve para recorrer todas las variantes de imagen.
    for (const variant of ['avatarSmall', 'avatarLarge', 'productThumb', 'productCard', 'productDetail'] as const) {
      // Esta línea sirve para verificar que «MEDIA_VARIANTS[variant]» cumple «toContain».
      expect(MEDIA_VARIANTS[variant]).toContain('f_auto');
      // Esta línea sirve para verificar que «MEDIA_VARIANTS[variant]» cumple «toContain».
      expect(MEDIA_VARIANTS[variant]).toContain('q_auto');
    }
  });

  // Esta línea sirve para declarar la prueba que verifica que «entrega los videos como MP4 aunque el original sea .mov».
  it('entrega los videos como MP4 aunque el original sea .mov', () => {
    // Esta línea sirve para verificar que «applyMediaVariant(VIDEO, 'video')» cumple «toBe».
    expect(applyMediaVariant(VIDEO, 'video')).toBe(
      // Esta línea sirve para incluir el texto o las clases «https://res.cloudinary.com/demo/video/upload/…».
      `https://res.cloudinary.com/demo/video/upload/${MEDIA_VARIANTS.video}/v1712/sanken/exercises/videos/exercise_3.mp4`,
    );
  });

  // Esta línea sirve para declarar la prueba que verifica que «no toca URLs que no son de Cloudinary».
  it('no toca URLs que no son de Cloudinary', () => {
    // Esta línea sirve para verificar que una URL ajena no se modifica.
    expect(applyMediaVariant('https://example.com/foto.jpg', 'productCard')).toBe('https://example.com/foto.jpg');
    // Esta línea sirve para verificar que un enlace de YouTube no se modifica.
    expect(applyMediaVariant('https://www.youtube.com/watch?v=abc', 'video')).toBe('https://www.youtube.com/watch?v=abc');
  });

  // Esta línea sirve para declarar la prueba que verifica que «no duplica transformaciones si la URL ya trae una».
  it('no duplica transformaciones si la URL ya trae una', () => {
    // Esta línea sirve para extraer «ransforme» de «'https://res.cloudinary.com/demo/image/u».
    const transformed = 'https://res.cloudinary.com/demo/image/upload/w_100,c_fill/v1/sanken/a.jpg';
    // Esta línea sirve para verificar que «applyMediaVariant(transformed, 'productCard')» cumple «toBe».
    expect(applyMediaVariant(transformed, 'productCard')).toBe(transformed);
  });

  // Esta línea sirve para declarar la prueba que verifica que «es determinista (misma entrada, misma URL: no rompe la caché de imágen».
  it('es determinista (misma entrada, misma URL: no rompe la caché de imágenes)', () => {
    // Esta línea sirve para verificar que «applyMediaVariant(IMAGE, 'productCard')» cumple «toBe».
    expect(applyMediaVariant(IMAGE, 'productCard')).toBe(applyMediaVariant(IMAGE, 'productCard'));
  });
});

// Esta línea sirve para agrupar las pruebas de «ApiClient.mediaUrl con variantes».
describe('ApiClient.mediaUrl con variantes', () => {
  // Esta línea sirve para crear «api» llamando a «ApiClient».
  const api = new ApiClient({ baseUrl: 'https://api.sanken.test' });

  // Esta línea sirve para declarar la prueba que verifica que «resuelve rutas locales igual que antes, con o sin variante».
  it('resuelve rutas locales igual que antes, con o sin variante', () => {
    // Esta línea sirve para verificar que «api.mediaUrl('/storage/avatars/a.jpg')» cumple «toBe».
    expect(api.mediaUrl('/storage/avatars/a.jpg')).toBe('https://api.sanken.test/storage/avatars/a.jpg');
    // Esta línea sirve para verificar que una ruta de almacenamiento se convierte en URL completa.
    expect(api.mediaUrl('/storage/avatars/a.jpg', 'avatarSmall')).toBe('https://api.sanken.test/storage/avatars/a.jpg');
  });

  // Esta línea sirve para declarar la prueba que verifica que «aplica la variante a las URLs de Cloudinary».
  it('aplica la variante a las URLs de Cloudinary', () => {
    // Esta línea sirve para verificar que «api.mediaUrl(IMAGE, 'avatarLarge')» cumple «toContain».
    expect(api.mediaUrl(IMAGE, 'avatarLarge')).toContain(`/upload/${MEDIA_VARIANTS.avatarLarge}/`);
    // Esta línea sirve para verificar que «api.mediaUrl(IMAGE)» cumple «toBe».
    expect(api.mediaUrl(IMAGE)).toBe(IMAGE);
  });

  // Esta línea sirve para declarar la prueba que verifica que «devuelve null sin URL».
  it('devuelve null sin URL', () => {
    // Esta línea sirve para verificar que «api.mediaUrl(null, 'productCard')» cumple «toBeNull».
    expect(api.mediaUrl(null, 'productCard')).toBeNull();
  });
});

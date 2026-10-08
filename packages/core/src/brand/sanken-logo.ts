/**
 * Contorno del isotipo SK de SanKen, extraído píxel a píxel de
 * `apps/mobile/assets/images/splash-icon.png` (el PNG del splash nativo): se
 * supermuestreó ×4, se trazó el borde de cada forma y se simplificó a
 * polilíneas. NO es un rediseño — las coordenadas están en el espacio de
 * 256×256 de ese PNG, así que el trazo animado calza exactamente encima del
 * logo real cuando este aparece al final de la intro.
 *
 * Son polilíneas (solo M/L) a propósito: su longitud y cualquier punto
 * intermedio se calculan exacto en JS, sin depender de getPointAtLength
 * nativo, para que la "punta" del trazo recorra el contorno real.
 */

/** Recorte del canvas de 256×256 que ocupa el isotipo (con 3px de aire). */
// Esta línea sirve para definir el recorte del canvas que ocupa el logo.
export const LOGO_VIEWBOX = { x: 40, y: 80, width: 178, height: 97 } as const;

/** Tamaño del canvas original de splash-icon.png. */
// Esta línea sirve para definir el tamaño del canvas original (256).
export const LOGO_CANVAS = 256;

// Esta línea sirve para declarar el trazo de la letra S.
const S_PATH =
  // Esta línea sirve para guardar los puntos del contorno de la S.
  'M88.63 91.38L151.13 91.63L151.13 92.63L145.63 98.88L135.63 108.88L86.38 108.88L80.38 111.13L76.88 115.63L76.63 118.63L77.13 120.13L78.88 121.88L81.63 123.13L118.63 123.13L124.38 124.38L130.88 128.38L133.88 132.38L135.88 137.13L135.88 140.88L102.38 173.63L42.88 173.38L42.88 172.38L48.38 166.38L57.88 157.13L102.88 157.13L106.88 156.13L110.63 154.13L114.88 149.63L116.13 146.88L116.13 142.38L115.13 140.63L112.63 138.88L82.63 138.63L70.38 137.88L67.38 136.88L63.63 134.63L61.13 132.13L59.13 128.88L57.63 122.63L58.13 115.13L60.13 109.63L63.38 104.38L67.13 100.13L72.38 96.13L81.38 92.38L88.63 91.38Z';

// Esta línea sirve para declarar el trazo de la letra K.
const K_PATH =
  // Esta línea sirve para guardar los puntos del contorno de la K.
  'M213.13 83.63L214.38 83.63L213.63 86.38L200.88 117.13L200.38 117.38L193.38 110.13L165.63 137.63L165.88 138.63L198.63 172.38L198.88 173.63L174.88 173.63L152.13 150.63L151.38 150.63L127.63 173.63L107.38 173.63L109.13 171.13L142.63 138.88L182.13 99.63L181.38 98.13L175.38 94.13L175.13 93.13L213.13 83.63Z';

// Esta línea sirve para declarar la forma de un trazo del logo.
export interface LogoStroke {
  /** Path SVG (polilínea cerrada) en coordenadas del canvas 256×256. */
  // Esta línea sirve para incluir el path SVG.
  d: string;
  /** Vértices en orden de trazado, con el primero repetido al final. */
  // Esta línea sirve para incluir los vértices en orden de trazado.
  points: readonly (readonly [number, number])[];
  /** Longitud acumulada hasta cada vértice. */
  // Esta línea sirve para incluir la longitud acumulada hasta cada vértice.
  cumulative: readonly number[];
  // Esta línea sirve para incluir la longitud total.
  length: number;
}

// Esta línea sirve para declarar la función que convierte un path en un trazo.
function toStroke(d: string): LogoStroke {
  // Esta línea sirve para separar los vértices del path.
  const points = d
    // Esta línea sirve para quitar las letras M y Z.
    .replace(/[MZ]/g, '')
    // Esta línea sirve para separar los vértices por la letra L.
    .split('L')
    // Esta línea sirve para convertir cada par de texto en números.
    .map((pair) => pair.trim().split(/\s+/).map(Number) as [number, number]);
  // Esta línea sirve para repetir el primer vértice al final para cerrar la figura.
  points.push(points[0]);

  // Esta línea sirve para empezar la longitud acumulada en 0.
  const cumulative = [0];
  // Esta línea sirve para recorrer los vértices desde el segundo.
  for (let i = 1; i < points.length; i++) {
    // Esta línea sirve para tomar el vértice anterior.
    const [x0, y0] = points[i - 1];
    // Esta línea sirve para tomar el vértice actual.
    const [x1, y1] = points[i];
    // Esta línea sirve para sumar la distancia entre ambos a la longitud acumulada.
    cumulative.push(cumulative[i - 1] + Math.hypot(x1 - x0, y1 - y0));
  }

  // Esta línea sirve para devolver el path, los vértices, las longitudes y la longitud total.
  return { d, points, cumulative, length: cumulative[cumulative.length - 1] };
}

/** La "S" (blanca en el logo) — se dibuja primero, empezando por su esquina superior izquierda. */
// Esta línea sirve para exportar el trazo de la S.
export const LOGO_S = toStroke(S_PATH);
/** La "K"/flecha ascendente (azul) — se dibuja después, empezando por la punta de la flecha. */
// Esta línea sirve para exportar el trazo de la K.
export const LOGO_K = toStroke(K_PATH);

/** Azul de la K en el logo real, muestreado de splash-icon.png. */
// Esta línea sirve para definir el azul de la K.
export const LOGO_BLUE = '#0733B4';

/** Blanco de la S en el logo real, muestreado de splash-icon.png. */
// Esta línea sirve para definir el blanco de la S.
export const LOGO_S_COLOR = '#FFFFFF';

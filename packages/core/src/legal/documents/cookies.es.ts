// Esta línea sirve para importar el tipo del contenido de un documento legal.
import type { LegalDocumentContent } from '../types';

/**
 * Política de Cookies — texto de referencia (español).
 *
 * El inventario de la sección 3 refleja lo que la web REALMENTE guarda
 * (auditado en apps/web/src/lib/*-store.ts, tutorial-storage.ts, api.ts,
 * firebase.ts y config/session.php del backend). Si se agrega una cookie o
 * clave de almacenamiento nueva, debe agregarse acá y en COOKIE_INVENTORY
 * (../cookies.ts), y subirse la versión del documento.
 *
 * Revisado y aprobado por el responsable de SanKen (v1.0).
 */
// Esta línea sirve para declarar el contenido del documento legal "cookiesEs".
export const cookiesEs: LegalDocumentContent = {
  // Esta línea sirve para definir el título del documento: «Política de Cookies».
  title: 'Política de Cookies',
  // Esta línea sirve para definir el resumen del documento: «Qué cookies y almacenamiento local usa la versión web de {{b…».
  summary: 'Qué cookies y almacenamiento local usa la versión web de {{brandName}}, para qué, y cómo cambiar tus preferencias.',
  // Esta línea sirve para abrir la lista de secciones del documento.
  sections: [
    {
      // Esta línea sirve para identificar la sección con el id "que-son".
      id: 'que-son',
      // Esta línea sirve para definir el título de la sección: «1. Qué son las cookies».
      title: '1. Qué son las cookies',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Las cookies son pequeños archivos que un sitio web guarda en tu navega…».
          text: 'Las cookies son pequeños archivos que un sitio web guarda en tu navegador. Otras tecnologías parecidas, como el almacenamiento local (localStorage) o IndexedDB, permiten guardar información en tu navegador de forma similar. En esta política llamamos "cookies" a todas ellas.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "categorias".
      id: 'categorias',
      // Esta línea sirve para definir el título de la sección: «2. Qué tipos usamos».
      title: '2. Qué tipos usamos',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Necesarias: imprescindibles para iniciar sesión, mantener tu…».
            'Necesarias: imprescindibles para iniciar sesión, mantener tu sesión segura, proteger los formularios y recordar tu carrito y tu elección sobre cookies. No se pueden desactivar porque sin ellas la web no funciona.',
            // Esta línea sirve para agregar el ítem: «Preferencias (opcionales): recuerdan elecciones que haces en…».
            'Preferencias (opcionales): recuerdan elecciones que haces en la interfaz, como el modo claro u oscuro, los tutoriales que ya viste y el idioma de los documentos legales. Si las rechazas, la web funciona igual pero olvidará esas elecciones al recargar o cerrar la página.',
          ],
        },
        {
          // Esta línea sirve para indicar que el bloque es una nota destacada.
          type: 'note',
          // Esta línea sirve para incluir el texto: «{{brandName}} no usa cookies analíticas ni cookies de publicidad o mar…».
          text: '{{brandName}} no usa cookies analíticas ni cookies de publicidad o marketing. Si en el futuro se incorporan, se actualizará esta política y se te pedirá el consentimiento antes de activarlas.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "inventario".
      id: 'inventario',
      // Esta línea sirve para definir el título de la sección: «3. Detalle de las cookies».
      title: '3. Detalle de las cookies',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una tabla.
          type: 'table',
          // Esta línea sirve para definir los encabezados de la tabla.
          headers: ['Nombre', 'Tipo', 'Categoría', 'Finalidad', 'Duración'],
          // Esta línea sirve para abrir las filas de la tabla.
          rows: [
            // Esta línea sirve para agregar la fila de «sanken-session».
            ['sanken-session', 'Cookie (servidor de SanKen)', 'Necesaria', 'Mantener tu sesión iniciada de forma segura.', 'Hasta que cierras sesión o expira por inactividad (por defecto, 120 minutos).'],
            // Esta línea sirve para agregar la fila de «XSRF-TOKEN».
            ['XSRF-TOKEN', 'Cookie (servidor de SanKen)', 'Necesaria', 'Proteger los formularios contra ataques de falsificación de solicitudes (CSRF).', 'La misma que la sesión.'],
            // Esta línea sirve para agregar la fila de «sanken-auth».
            ['sanken-auth', 'Almacenamiento local', 'Necesaria', 'Guardar tu token de acceso y los datos básicos de tu cuenta para no pedirte el inicio de sesión en cada visita.', 'Hasta que cierras sesión.'],
            // Esta línea sirve para agregar la fila de «sanken-cart».
            ['sanken-cart', 'Almacenamiento local', 'Necesaria', 'Recordar los productos de tu carrito de la tienda.', 'Hasta que vacías el carrito o haces el pedido.'],
            // Esta línea sirve para agregar la fila de «sanken-cookie-consent».
            ['sanken-cookie-consent', 'Almacenamiento local', 'Necesaria', 'Recordar tu elección sobre cookies y la versión de esta política que aceptaste.', '12 meses, o hasta que cambie esta política.'],
            // Esta línea sirve para agregar la fila de «firebaseLocalStorageDb».
            ['firebaseLocalStorageDb', 'IndexedDB (Google Firebase)', 'Necesaria', 'Completar el inicio de sesión con Google. Solo se crea si eliges "Continuar con Google".', 'Temporal: se borra al terminar el inicio de sesión.'],
            // Esta línea sirve para agregar la fila de «Service worker y suscripción push».
            ['Service worker y suscripción push', 'Almacenamiento del navegador', 'Necesaria', 'Recibir notificaciones del navegador. Solo si las activas en Configuración.', 'Hasta que las desactivas.'],
            // Esta línea sirve para agregar la fila de «sanken-theme».
            ['sanken-theme', 'Almacenamiento local', 'Preferencias', 'Recordar si prefieres modo claro, oscuro o el del sistema.', 'Hasta que la borras o retiras el consentimiento.'],
            // Esta línea sirve para agregar la fila de «sanken_tutorial_seen_*».
            ['sanken_tutorial_seen_*', 'Almacenamiento local', 'Preferencias', 'Recordar qué tutoriales ya viste para no repetirlos.', 'Hasta que la borras o retiras el consentimiento.'],
            // Esta línea sirve para agregar la fila de «sanken-legal-locale».
            ['sanken-legal-locale', 'Almacenamiento local', 'Preferencias', 'Recordar el idioma en que lees los documentos legales.', 'Hasta que la borras o retiras el consentimiento.'],
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "terceros".
      id: 'terceros',
      // Esta línea sirve para definir el título de la sección: «4. Servicios de terceros».
      title: '4. Servicios de terceros',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «Google Fonts: la web descarga su tipografía desde los servid…».
            'Google Fonts: la web descarga su tipografía desde los servidores de Google. Esto no instala cookies de Google en tu navegador desde SanKen, pero Google recibe tu dirección IP y datos técnicos del navegador.',
            // Esta línea sirve para agregar el ítem: «Inicio de sesión con Google: si lo usas, se abre una ventana…».
            'Inicio de sesión con Google: si lo usas, se abre una ventana de Google en la que Google puede usar sus propias cookies según su política de privacidad.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "gestionar".
      id: 'gestionar',
      // Esta línea sirve para definir el título de la sección: «5. Cómo gestionar tus preferencias».
      title: '5. Cómo gestionar tus preferencias',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es una lista.
          type: 'list',
          // Esta línea sirve para abrir los ítems de la lista.
          items: [
            // Esta línea sirve para agregar el ítem: «La primera vez que visitas la web te mostramos un aviso para…».
            'La primera vez que visitas la web te mostramos un aviso para aceptar o rechazar las cookies opcionales, o configurarlas.',
            // Esta línea sirve para agregar el ítem: «Puedes cambiar tu elección cuando quieras con el botón "Conf…».
            'Puedes cambiar tu elección cuando quieras con el botón "Configurar cookies" de esta página, del pie de página o de Configuración.',
            // Esta línea sirve para agregar el ítem: «Si retiras el consentimiento de preferencias, borramos las c…».
            'Si retiras el consentimiento de preferencias, borramos las claves de preferencias guardadas en tu navegador.',
            // Esta línea sirve para agregar el ítem: «También puedes borrar o bloquear cookies desde la configurac…».
            'También puedes borrar o bloquear cookies desde la configuración de tu navegador. Si bloqueas las necesarias, no podrás iniciar sesión.',
          ],
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "movil".
      id: 'movil',
      // Esta línea sirve para definir el título de la sección: «6. Aplicación móvil».
      title: '6. Aplicación móvil',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «La app móvil no usa cookies de navegador ni tecnologías de seguimiento…».
          text: 'La app móvil no usa cookies de navegador ni tecnologías de seguimiento publicitario o analítico. Guarda en el almacenamiento seguro de tu teléfono solo lo necesario para funcionar (tu sesión, tu carrito, el entrenamiento en curso) y tus preferencias (tema visual, tutoriales vistos, si activaste las notificaciones y si ocultaste la tarjeta de marca de Inicio). La sesión se borra al cerrar sesión, y todo lo demás al desinstalar la app.',
        },
      ],
    },
    {
      // Esta línea sirve para identificar la sección con el id "cambios".
      id: 'cambios',
      // Esta línea sirve para definir el título de la sección: «7. Cambios en esta política».
      title: '7. Cambios en esta política',
      // Esta línea sirve para abrir los bloques de contenido de la sección.
      blocks: [
        {
          // Esta línea sirve para indicar que el bloque es un párrafo.
          type: 'p',
          // Esta línea sirve para incluir el texto: «Si cambiamos las cookies que usamos, actualizaremos esta política y su…».
          text: 'Si cambiamos las cookies que usamos, actualizaremos esta política y su versión, y te volveremos a mostrar el aviso de cookies. Para cualquier duda escribe a {{privacyEmail}}.',
        },
      ],
    },
  ],
};
